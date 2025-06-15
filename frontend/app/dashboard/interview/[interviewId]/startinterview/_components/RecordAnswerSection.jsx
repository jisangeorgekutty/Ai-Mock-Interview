"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAI';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import EmotionAnalysis from '@/components/EmotionAnalysis';
import { useUserAnswerStore } from '@/store/useUserAnswerStore';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeIndexQuestion, interviewData, interviewEnded }) {
  const [userAnswer, setUserAnswer] = useState("");
  const userAnswerRef = useRef("");
  const { authUser } = useAuthStore();
  const submitAnswer = useUserAnswerStore((state) => state.submitAnswer);
  const [loading, setLoading] = useState(false);

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    if (results.length > 0) {
      const fullTranscript = results.map(result => result.transcript).join(' ');
      setUserAnswer(fullTranscript);
      userAnswerRef.current = fullTranscript;
    }
  }, [results]);

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
    }
  };

  const StartStopRecording = async () => {
    try {
      if (isRecording) {
        await handleStopRecording();
      } else {
        await startSpeechToText();
      }
    } catch (err) {
      toast.error(`Recording error: ${err.message}`);
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    try {
      const currentQuestion = mockInterviewQuestion[activeIndexQuestion]?.question;
      const correctAnswer = mockInterviewQuestion[activeIndexQuestion]?.answer;

      const feedbackPrompt = `Question: ${currentQuestion}, User Answer: ${userAnswerRef.current}. 
        Based on the question and user response, rate the answer and provide feedback in 3-5 lines. 
        Respond in JSON format with fields: "rating" and "feedback".`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const cleaned = responseText.replace(/```json|```/g, '');
      const feedbackJSON = JSON.parse(cleaned);

      await submitAnswer({
        mockIdRef: interviewData?.mockId,
        question: currentQuestion,
        correctAns: correctAnswer,
        userAns: userAnswerRef.current,
        feedback: feedbackJSON.feedback,
        rating: feedbackJSON.rating,
        userEmail: authUser?.email,
        createdAt: moment().format('DD-MM-YYYY')
      });

      setUserAnswer('');
      setResults([]);
    } catch (error) {
      console.error("Save answer error:", error);
      toast.error("Failed to save answer");
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

      {/* <div className="text-center text-sm text-gray-500">{userAnswer}</div> */}
    </div>
  );
}

export default RecordAnswerSection;
