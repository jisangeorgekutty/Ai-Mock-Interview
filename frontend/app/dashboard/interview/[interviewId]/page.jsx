"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useMockInterviewStore } from "@/store/useMockInterviewStore";

function InterviewClient() {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const router = useRouter();
  const { interviewId } = useParams();
  const { authUser } = useAuthStore();
  const { getMockInterviewById } = useMockInterviewStore();

  useEffect(() => {
    const fetchInterview = async () => {
      if (authUser && interviewId) {
        const data = await getMockInterviewById(interviewId);
        console.log("Interview Data:", data);
        setInterviewData(data);
      }
    };

    fetchInterview();
  }, [authUser, interviewId]);

  const handleStartInterview = () => {
    router.push(`/dashboard/interview/${interviewId}/startinterview`);
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex flex-col my-7">
            {interviewData ? (
              <div className="flex flex-col gap-5 p-5 rounded-lg border">
                <h1 className="text-lg p-2">
                  <strong>Job Position:</strong> {interviewData.jobPosition}
                </h1>
                <h1 className="text-lg p-2">
                  <strong>Job Description:</strong> {interviewData.jobDesc}
                </h1>
                <h1 className="text-lg p-2">
                  <strong>Years of Experience:</strong> {interviewData.jobExperience}
                </h1>
              </div>
            ) : (
              <p><strong>Loading interview data...</strong></p>
            )}
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex items-center gap-2 text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="text-xs my-2 mt-3 text-yellow-600">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>
        <div>
          <div>
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{ height: 300, width: 300 }}
              />
            ) : (
              <>
                <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => setWebCamEnabled(true)}
                >
                  Enable Webcam and Microphone
                </Button>
              </>
            )}
            <div>
              <Button className="float-right my-2" onClick={handleStartInterview}>
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewClient;
