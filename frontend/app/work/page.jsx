"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, MessageCircle, BarChart } from "lucide-react";

const HowItWorks = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        How AI Mock Master Works
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">
        Get ready for your next interview with our AI-driven mock interview system.
        Follow these four simple steps to enhance your interview skills.
      </p>

      {/* Steps Section */}
      <div className="mt-10 space-y-8">
        {/* Step 1 */}
        <div className="flex items-center gap-6 p-6 border-l-4 border-blue-500 bg-blue-50 rounded-lg shadow-sm transition-transform transform hover:scale-105">
          <CheckCircle className="h-12 w-12 text-blue-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">1. Select an Interview Type</h2>
            <p className="text-gray-600">
              Choose from various domains like Software Engineering, Data Science, and Product Management.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-6 p-6 border-l-4 border-green-500 bg-green-50 rounded-lg shadow-sm transition-transform transform hover:scale-105">
          <PlayCircle className="h-12 w-12 text-green-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">2. Answer AI-Generated Questions</h2>
            <p className="text-gray-600">
              The AI will ask you real-world interview questions. Answer them via text or voice.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-6 p-6 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg shadow-sm transition-transform transform hover:scale-105">
          <MessageCircle className="h-12 w-12 text-yellow-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">3. Get Instant AI Feedback</h2>
            <p className="text-gray-600">
              Receive detailed feedback on your answers, including improvements and suggestions.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-center gap-6 p-6 border-l-4 border-red-500 bg-red-50 rounded-lg shadow-sm transition-transform transform hover:scale-105">
          <BarChart className="h-12 w-12 text-red-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">4. Reattempt & Track Progress</h2>
            <p className="text-gray-600">
              Retake interviews and track your progress over time to boost your confidence.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-10 text-center">
        <Button onClick={() => router.push("/dashboard")} className="px-6 py-3 text-lg">
          Start Your Mock Interview
        </Button>
      </div>
    </div>
  );
};

export default HowItWorks;
