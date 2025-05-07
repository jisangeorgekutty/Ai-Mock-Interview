"use client";
import { useEffect, useRef, useState } from "react";
import { db } from "@/utils/db";
import { EmotionFeedback, Emotions } from "@/utils/schema";
import { useAuthStore } from "@/store/useAuthStore";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { eq, and } from "drizzle-orm";
import { chatSession } from '@/utils/GeminiAI';

const EmotionReport = ({ averages, dominantEmotion, maxPercentage, trends }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = Object.entries(averages).map(([emotion, percentage]) => ({
    name: emotion,
    value: percentage * 100,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Emotion Analysis Report</h2>

      {/* Average Emotions */}
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

      {/* Dominant Emotion */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-gray-700">Dominant Emotion</h3>
        <p className="text-gray-600 text-lg mt-2">
          Your dominant emotion was{" "}
          <strong className="text-indigo-600">{dominantEmotion}</strong> with{" "}
          <strong className="text-indigo-600">{(maxPercentage * 100).toFixed(2)}%</strong>.
        </p>
      </div>

      {/* Emotion Trends */}
      {/* <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Emotion Trends</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-200 px-4 py-2">Time</th>
                <th className="border border-gray-200 px-4 py-2">Emotions</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, index) => (
                <tr key={index} className="border-b border-gray-200 text-gray-600">
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {trend.time instanceof Date ? trend.time.toLocaleString() : trend.time}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="space-y-1">
                      {Object.entries(trend.emotions).map(([emotion, percentage]) => (
                        <li key={emotion} className="text-sm">
                          <span className="font-medium text-gray-800">{emotion}:</span> {percentage}%
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

    </div>
  );
};


const EmotionAnalysisReport = ({ mockId }) => {
  const { authUser } = useAuthStore();
  const user = authUser;
  const [reportData, setReportData] = useState(null);
  const [dominantEmo, setDominantEmo] = useState("");
  const [emotionPercentage, setEmotionPersentage] = useState(null);
  const feedbackGenerated = useRef(false);

  //  Fetch emotion data from DB based on userId & mockIdRef
  const getEmotionData = async () => {
    if (!user || !user?._id || !mockId) {
      console.warn("User ID or mockId is missing. Skipping fetch.");
      return [];
    }

    try {
      const data = await db
        .select()
        .from(Emotions)
        .where(and(eq(Emotions.userId, user?._id), eq(Emotions.mockIdRef, mockId)));

      console.log("Fetched emotion data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching emotion data:", error);
      return [];
    }
  };

  //  Calculate average emotion percentages
  const calculateAverages = (emotionData) => {
    if (emotionData.length === 0) return {};

    const emotionSums = {};
    const emotionCounts = {};

    emotionData.forEach(({ emotion, percentage }) => {
      if (!emotionSums[emotion]) {
        emotionSums[emotion] = 0;
        emotionCounts[emotion] = 0;
      }

      emotionSums[emotion] += parseFloat(percentage);
      emotionCounts[emotion]++;
    });

    const averages = {};
    for (const [emotion, sum] of Object.entries(emotionSums)) {
      averages[emotion] = sum / emotionCounts[emotion];
    }

    return averages;
  };

  //  Determine the dominant emotion
  const calculateDominantEmotion = (averages) => {
    let dominantEmotion = "";
    let maxPercentage = 0;

    for (const [emotion, percentage] of Object.entries(averages)) {
      if (percentage > maxPercentage) {
        dominantEmotion = emotion;
        maxPercentage = percentage;
      }
    }
    setEmotionPersentage(maxPercentage * 100)
    setDominantEmo(dominantEmotion)
    return { dominantEmotion, maxPercentage };
  };

  const emotionFeedback = async () => {
    if (feedbackGenerated.current) return;
    feedbackGenerated.current = true;

    const existingFeedback = await db.select()
      .from(EmotionFeedback)
      .where(eq(EmotionFeedback.mockIdRef, mockId));

    if (existingFeedback.length === 0) {
      const emotionPromt = "Based on the interview performance, the user's dominant emotion was " + dominantEmo + " with a confidence level of " + emotionPercentage + ".Please analyze the user's confidence level and provide two actionable suggestions to help them improve their confidence in future interviews, give it in 1 line.it should in JSON format with two field suggection1 and suggection2 field"
      const result = await chatSession.sendMessage(emotionPromt);
      console.log(result.response.text())
      const emotionFeedback = JSON.parse(result.response.text());

      const success = await db.insert(EmotionFeedback)
        .values({
          mockIdRef: mockId,
          emotionFeedback: emotionFeedback,
        });
      // if (success) {
      //   alert("Emotion FeedBack Inserted")
      // } else {
      //   alert("Emotion feedback error")
      // }
    }
    if (existingFeedback) {
      const againEmotionPromt = "Based on the interview performance, the user's dominant emotion was " + dominantEmo + " with a confidence level of " + emotionPercentage + "Please analyze the user's confidence level and provide two new actionable suggestions to help them improve their confidence.it should in JSON format with two field suggection1 and suggection2 field"
      const updateResult = await chatSession.sendMessage(againEmotionPromt);
      const emotionFeedback = JSON.parse(updateResult.response.text());

      // Update existing record in the database
      const updateSuccess = await db.update(EmotionFeedback)
        .set({
          emotionFeedback: JSON.stringify(emotionFeedback),
        })
        .where(eq(EmotionFeedback.mockIdRef, mockId));

      // if (updateSuccess) {
      //   alert("Emotion Feedback Updated");
      // } else {
      //   alert("Error updating emotion feedback");
      // }
    }
  }

  //  Track emotion trends over time
  const calculateEmotionTrends = (emotionData) => {
    return emotionData.map(({ timestamp, emotion, percentage }, index) => ({
      time: timestamp ? new Date(timestamp).toLocaleString() : `Interval ${index + 1}`,
      emotions: { [emotion]: parseFloat(percentage) },
    }));
  };

  const handleGenerateReport = async () => {
    console.log("Generating report...");
    const emotionData = await getEmotionData();

    console.log("HEAVY DATA", emotionData)

    if (!emotionData.length) {
      console.warn("No emotion data found.");
      return;
    }

    const averages = calculateAverages(emotionData);
    const { dominantEmotion, maxPercentage } = calculateDominantEmotion(averages);
    const trends = calculateEmotionTrends(emotionData);

    setReportData({ averages, dominantEmotion, maxPercentage, trends });
    emotionFeedback();
  };

  useEffect(() => {
    if (user && mockId) {
      handleGenerateReport();
    }
  }, [user, mockId]);

  if (!reportData) {
    return <div>Loading report...</div>;
  }

  return <EmotionReport {...reportData} />;
};

export default EmotionAnalysisReport;
