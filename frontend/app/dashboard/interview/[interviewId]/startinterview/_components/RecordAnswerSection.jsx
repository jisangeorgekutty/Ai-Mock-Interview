"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAI';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useAuthStore } from '@/store/useAuthStore';
import moment from 'moment';
import { toast } from 'sonner';
import { eq, and } from "drizzle-orm";
import EmotionAnalysis from '@/components/EmotionAnalysis';

function RecordAnswerSection({ mockInterviewQuestion, activeIndexQuestion, interviewData, interviewEnded }) {
  const [userAnswer, setUserAnswer] = useState("");
  const userAnswerRef = useRef(""); //  Track latest answer reliably
  const { authUser } = useAuthStore();
  const user = authUser;
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  //  Ensure userAnswer updates correctly
  useEffect(() => {
    if (results.length > 0) {
      const fullTranscript = results.map(result => result.transcript).join(' ');
      setUserAnswer(fullTranscript);
      userAnswerRef.current = fullTranscript; // ✅ Keep reference updated
    }
  }, [results]);

  //  Manually stop recording & save answer
  const handleStopRecording = async () => {
    try {
      stopSpeechToText();
      if (userAnswerRef.current.length > 10) {
        await UpdateUserAnswer();
      } else {
        toast.warning("Answer is too short. Try again!");
      }
    } catch (err) {
      toast.error(`Recording error: ${err.message}`);
      console.error("Recording error:", err);
    }
  };

  //  Start or Stop Recording
  const StartStopRecording = async () => {
    try {
      if (isRecording) {
        await handleStopRecording();
      } else {
        await startSpeechToText();
      }
    } catch (err) {
      toast.error(`Recording error: ${err.message}`);
      console.error("Recording error:", err);
    }
  };

  //  Save Answer & Get AI Feedback
  const UpdateUserAnswer = async () => {
    setLoading(true);
    try {
      const currentQuestion = mockInterviewQuestion[activeIndexQuestion]?.question;
      const feedbackPrompt = `Question: ${currentQuestion}, User Answer: ${userAnswerRef.current}. 
        Based on the question and user response, rate the answer and provide feedback in 3-5 lines. 
        Respond in JSON format with fields: "rating" and "feedback".`;

      //  Ensure AI Response is Properly Handled
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const cleanedResponse = responseText.replace(/```json|```/g, ''); //  Remove unwanted JSON markers
      const jsonFeedbackResp = JSON.parse(cleanedResponse);

      //  Check if Answer Already Exists
      const existingRecord = await db.query.UserAnswer.findFirst({
        where: and(
          eq(UserAnswer.mockIdRef, interviewData?.mockId),
          eq(UserAnswer.question, currentQuestion),
          eq(UserAnswer.userEmail, user?.email)
        )
      });

      //  Use Upsert (Insert or Update)
      if (existingRecord) {
        await db.update(UserAnswer)
          .set({
            userAns: userAnswerRef.current,
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rating,
            createdAt: moment().format('DD-MM-yyyy')
          })
          .where(eq(UserAnswer.id, existingRecord.id));
      } else {
        await db.insert(UserAnswer)
          .values({
            mockIdRef: interviewData?.mockId,
            question: currentQuestion,
            correctAns: mockInterviewQuestion[activeIndexQuestion]?.answer,
            userAns: userAnswerRef.current,
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rating,
            userEmail: user?.email,
            createdAt: moment().format('DD-MM-yyyy')
          });
      }

      toast.success("Your Answer Recorded Successfully");
      setUserAnswer('');
      setResults([]);
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast.error("Failed to save answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center bg-black items-center p-5 rounded-lg'>
        <Image src={"/webcam.png"} height={200} width={200} alt='webcam' className='absolute' />
        <EmotionAnalysis interviewData={interviewData} interviewEnded={interviewEnded} />
      </div>

      <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2'>
            <Mic /> Stop Recording...
          </h2>
        ) : (
          'Record Answer'
        )}
      </Button>

      {/* <Button onClick={() => console.log(userAnswerRef.current)}>Show Answer</Button> */}
    </div>
  );
}

export default RecordAnswerSection;
