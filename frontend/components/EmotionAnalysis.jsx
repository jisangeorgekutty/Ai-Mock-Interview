"use client";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { db } from "@/utils/db";
import { Emotions } from "@/utils/schema";
import { useAuthStore } from "@/store/useAuthStore";
import * as faceapi from "face-api.js";
import { eq, and } from "drizzle-orm";

const EmotionAnalysis = ({ interviewData = { mockId: null }, interviewEnded }) => {
  const { authUser } = useAuthStore();
  const user = authUser;
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [collectedEmotions, setCollectedEmotions] = useState([]);
  const [mockId, setMockId] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);  //  Keeps track of detection state

  //  Load Face API models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("Models loaded successfully!");

      if (interviewData?.mockId) {
        setMockId(interviewData.mockId);
        console.log("MockId Set to", interviewData.mockId);
      }
    };
    loadModels();
  }, [interviewData]);

  //  Continuous Emotion Detection Loop
  const detectEmotions = async () => {
    if (!isDetecting) return;  //  Stop detection if interview ended

    if (!faceapi.nets.tinyFaceDetector || !faceapi.nets.faceExpressionNet) {
      console.error("Face API models are not loaded yet.");
      return;
    }

    if (!user || !webcamRef.current || !webcamRef.current.video) {
      console.warn("Webcam or user data is not available.");
      return;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        console.warn("⚠️ No face detected.");
      } else {
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);

        const emotionsData = detections[0].expressions;
        setCollectedEmotions((prev) => [...prev, emotionsData]);
      }
    } catch (error) {
      console.error("Error detecting emotions:", error);
    }

    setTimeout(detectEmotions, 1000);  //  Run every second to keep detection continuous
  };

  //  Calculate average emotion percentages
  const calculateAverages = (emotionsArray) => {
    if (emotionsArray.length === 0) return {};

    const emotionSums = {};
    const emotionCounts = {};

    emotionsArray.forEach((emotions) => {
      for (const [emotion, percentage] of Object.entries(emotions)) {
        if (!emotionSums[emotion]) {
          emotionSums[emotion] = 0;
          emotionCounts[emotion] = 0;
        }
        emotionSums[emotion] += percentage;
        emotionCounts[emotion]++;
      }
    });

    const averages = {};
    for (const [emotion, sum] of Object.entries(emotionSums)) {
      averages[emotion] = sum / emotionCounts[emotion];
    }

    return averages;
  };

  //  Insert or update emotions in the database
  const insertOrUpdateAverages = async (averages) => {
    if (!user?._id || !mockId) {
      console.error("User ID or Mock ID missing.");
      return;
    }

    try {
      for (const [emotion, percentage] of Object.entries(averages)) {
        const existingRecord = await db
          .select()
          .from(Emotions)
          .where(
            and(eq(Emotions.userId, user?._id), eq(Emotions.mockIdRef, mockId), eq(Emotions.emotion, emotion))
          )
          .limit(1);

        if (existingRecord.length > 0) {
          //  Update existing record
          await db
            .update(Emotions)
            .set({ percentage: percentage.toString() })
            .where(
              and(eq(Emotions.userId, user?._id), eq(Emotions.mockIdRef, mockId), eq(Emotions.emotion, emotion))
            );
          console.log(`Updated emotion: ${emotion} with percentage: ${percentage}`);
        } else {
          //  Insert new record if it doesn't exist
          await db.insert(Emotions).values({
            userId: user?._id,
            mockIdRef: mockId,
            emotion,
            percentage: percentage.toString(),
          });
          console.log(`Inserted new emotion: ${emotion} with percentage: ${percentage}`);
        }
      }

      alert("Emotion Data Updated Successfully");
    } catch (error) {
      alert("Error Updating Emotion Data");
      console.error("Error inserting/updating averages:", error);
    }
  };

  //  Handle interview end and save emotions
  const handleInterviewEnd = async () => {
    setIsDetecting(false);  //  Stop detection when interview ends
    const averages = calculateAverages(collectedEmotions);
    await insertOrUpdateAverages(averages);
    console.log("Interview ended. Averages:", averages);
  };

  //  Start emotion detection when webcam plays
  useEffect(() => {
    if (webcamRef.current) {
      webcamRef.current.video.onplay = detectEmotions;
    }
  }, [user, mockId]);

  //  Save emotions when the interview ends
  useEffect(() => {
    if (interviewEnded) {
      handleInterviewEnd();
    }
  }, [interviewEnded]);

  if (!authUser) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Please sign in to continue.</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <Webcam ref={webcamRef} audio={false} mirrored={true} />
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
};

export default EmotionAnalysis;
