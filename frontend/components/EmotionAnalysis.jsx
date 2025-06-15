"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useAuthStore } from "@/store/useAuthStore";
import { useEmotionsStore } from "@/store/useEmotionStore";

const EmotionAnalysis = ({ interviewData = { mockId: null }, interviewEnded }) => {
  const { authUser } = useAuthStore();
  const { recordEmotion } = useEmotionsStore();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [collectedEmotions, setCollectedEmotions] = useState([]);
  const [mockId, setMockId] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  const user = authUser;

  // Load Face API models
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

  // Emotion detection loop
  const detectEmotions = async () => {
    if (!isDetecting) return;

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
        console.warn("No face detected.");
      } else {
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);

        const emotionsData = detections[0].expressions;
        setCollectedEmotions((prev) => [...prev, emotionsData]);
      }
    } catch (error) {
      console.error("Error detecting emotions:", error);
    }

    setTimeout(detectEmotions, 1000);
  };

  // Calculate averages
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

  const saveEmotionsToStore = async (averages) => {
    if (!user?._id || !mockId) {
      console.error("User ID or Mock ID missing.");
      return;
    }

    try {
      for (const [emotion, percentage] of Object.entries(averages)) {
        await recordEmotion({
          userId: user._id,
          mockIdRef: mockId,
          emotion,
          percentage: percentage.toFixed(3),
        });
        console.log(`Stored emotion: ${emotion} - ${percentage}`);
      }
    } catch (error) {
      console.error("Failed to store emotions via API", error);
    }
  };

  // Handle interview end
  const handleInterviewEnd = async () => {
    setIsDetecting(false);
    const averages = calculateAverages(collectedEmotions);
    await saveEmotionsToStore(averages);
    console.log("Interview ended. Averages:", averages);
  };

  useEffect(() => {
    if (webcamRef.current) {
      webcamRef.current.video.onplay = detectEmotions;
    }
  }, [user, mockId]);

  useEffect(() => {
    if (interviewEnded) {
      handleInterviewEnd();
    }
  }, [interviewEnded]);

  return (
    <div style={{ position: "relative" }}>
      <Webcam ref={webcamRef} audio={false} mirrored={true} />
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
    </div>
  );
};

export default EmotionAnalysis;
