"use client";
import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { useAuthStore } from "@/store/useAuthStore";
import { chatSession } from "@/utils/GeminiAI";
import { useEmotionsStore } from "@/store/useEmotionStore";
import { useEmotionFeedbackStore } from "@/store/useEmotionFeedbackStore";

const EmotionReport = ({ averages, dominantEmotion, maxPercentage }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = Object.entries(averages).map(([emotion, percentage]) => ({
    name: emotion,
    value: percentage * 100,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Emotion Analysis Report</h2>

      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-700">Average Emotions</h3>
        <div className="w-full flex justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-gray-700">Dominant Emotion</h3>
        <p className="text-gray-600 text-lg mt-2">
          Your dominant emotion was{" "}
          <strong className="text-indigo-600">{dominantEmotion}</strong> with{" "}
          <strong className="text-indigo-600">{(maxPercentage * 100).toFixed(2)}%</strong>.
        </p>
      </div>
    </div>
  );
};

const EmotionAnalysisReport = ({ mockId }) => {
  const { authUser } = useAuthStore();
  const { fetchEmotions, emotions } = useEmotionsStore();
  const { fetchFeedbackByMockId, submitFeedback, feedbacks } = useEmotionFeedbackStore();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const feedbackGenerated = useRef(false);

  const calculateAverages = (data) => {
    const sum = {}, count = {};
    data.forEach(({ emotion, percentage }) => {
      if (!sum[emotion]) {
        sum[emotion] = 0;
        count[emotion] = 0;
      }
      sum[emotion] += parseFloat(percentage);
      count[emotion]++;
    });

    const averages = {};
    for (const emotion in sum) {
      averages[emotion] = sum[emotion] / count[emotion];
    }
    return averages;
  };

  const calculateDominantEmotion = (averages) => {
    let dominantEmotion = "", maxPercentage = 0;
    for (const [emotion, percentage] of Object.entries(averages)) {
      if (percentage > maxPercentage) {
        dominantEmotion = emotion;
        maxPercentage = percentage;
      }
    }
    return { dominantEmotion, maxPercentage };
  };

  const handleEmotionFeedback = async (dominantEmotion, maxPercentage) => {
    if (feedbackGenerated.current) return;
    feedbackGenerated.current = true;

    await fetchFeedbackByMockId(mockId);
    const existingFeedback = feedbacks.find(fb => fb.mockIdRef === mockId);
    if (existingFeedback) return;

    const prompt = `Based on the interview performance, the user's dominant emotion was ${dominantEmotion} with a confidence level of ${(maxPercentage * 100).toFixed(2)}%. Please analyze the user's confidence level and provide two actionable suggestions to help them improve their confidence. Return response in JSON format with suggestion1 and suggestion2.`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const feedbackJson = JSON.parse(await result.response.text());
      await submitFeedback({ mockIdRef: mockId, emotionFeedback: feedbackJson });
    } catch (error) {
      console.error("Failed to generate or submit emotion feedback:", error);
    }
  };

  const generateReport = async () => {
    console.log("Calling fetchEmotions with mockId:", mockId);
    await fetchEmotions(mockId);
    console.log("Fetched emotions:", emotions);

    if (!emotions.length) {
      console.warn("No emotions found for this mock interview.");
      setLoading(false);
      return;
    }

    const averages = calculateAverages(emotions);
    const { dominantEmotion, maxPercentage } = calculateDominantEmotion(averages);
    setReportData({ averages, dominantEmotion, maxPercentage });

    await handleEmotionFeedback(dominantEmotion, maxPercentage);
    setLoading(false);
  };

  useEffect(() => {
    console.log("authUser:", authUser);
    console.log("mockId:", mockId);

    if (authUser && mockId) {
      console.log("Generating report...");
      generateReport();
    } else {
      setLoading(false);
      console.warn("authUser or mockId is missing.");
    }
  }, [authUser, mockId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Generating emotion analysis report...
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-center px-4">
        No emotion data found for this mock interview.
      </div>
    );
  }

  return <EmotionReport {...reportData} />;
};

export default EmotionAnalysisReport;
