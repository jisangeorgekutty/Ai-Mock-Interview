"use client";
import { db } from '@/utils/db';
import { EmotionFeedback, UserAnswer } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import EmotionAnalysisReport from '@/components/EmotionAnalysisReport';

function Feedback({ params }) {
    const { interviewId } = React.use(params);
    const [feedbackList, setFeedbackList] = useState([]);
    const [emotionFeedback, setEmotionFeedback] = useState(null);
    const [totalRating, setTotalRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await getFeedback();
        await getEmotionFeedback();
        setLoading(false);
    };

    const getFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, interviewId))
            .orderBy(UserAnswer.id);

        setFeedbackList(result);

        if (result.length > 0) {
            const total = result.reduce((sum, item) => {
                const numericRating = item.rating ? parseInt(item.rating.split('/')[0], 10) : 0;
                return sum + numericRating;
            }, 0);
            setTotalRating(total / result.length);
        }
    };

    const getEmotionFeedback = async () => {
        try {
            const result = await db.select()
                .from(EmotionFeedback)
                .where(eq(EmotionFeedback.mockIdRef, interviewId));

            if (result.length > 0) {
                const feedbackData = JSON.parse(result[0].emotionFeedback);
                setEmotionFeedback(feedbackData);
            }
        } catch (error) {
            console.error("Error fetching emotion feedback:", error);
        }
    };

    const homePage = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="animate-spin text-blue-500 h-12 w-12" />
                <p className="text-gray-500 mt-2">Loading feedback & suggestions...</p>
            </div>
        );
    }

    return (
        <div className='p-10'>
            <h2 className='text-4xl font-bold text-center text-green-500'>Congratulations!!! 🎉</h2>

            <div className='mt-6'>
                <EmotionAnalysisReport mockId={interviewId} />
            </div>

            {emotionFeedback && (
                <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
                    <ul className="mt-4 space-y-3">
                        <li className="p-3 border-l-4 border-blue-500 bg-white rounded-md shadow-sm">
                            <span className="font-semibold text-blue-600">🔹 Suggestion 1:</span> {emotionFeedback.suggestion1}
                        </li>
                        <li className="p-3 border-l-4 border-green-500 bg-white rounded-md shadow-sm">
                            <span className="font-semibold text-green-600">🔹 Suggestion 2:</span> {emotionFeedback.suggestion2}
                        </li>
                    </ul>
                </div>
            )}
            <h2 className="font-bold text-2xl mt-8 text-gray-800 text-center">
                Here Is Your Interview Result
            </h2>
            <h2 className="text-lg text-gray-700 my-3 text-center">
                Your overall rating: <strong className="text-blue-600">{totalRating}</strong>
            </h2>
            <h2 className="text-sm text-gray-500 text-center">
                Below are the interview questions with correct answers, your responses, and feedback.
            </h2>

            <div className="mt-6 space-y-5">
                {feedbackList.map((item, index) => (
                    <Collapsible key={index} className="border border-gray-300 rounded-lg shadow-sm">
                        <CollapsibleTrigger className="p-4 bg-blue-100 hover:bg-blue-200 transition-all rounded-t-lg flex justify-between items-center text-lg font-semibold">
                            {item.question} <ChevronsUpDown className="h-5 w-5 text-blue-600" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-white rounded-b-lg space-y-3">
                            <h2 className="text-red-500 font-semibold">
                                <strong>Rating:</strong> {item.rating}
                            </h2>
                            <h2 className="p-3 border rounded-lg bg-red-50 text-sm text-red-900">
                                <strong>Your Answer:</strong> {item.userAns}
                            </h2>
                            <h2 className="p-3 border rounded-lg bg-green-50 text-sm text-green-900">
                                <strong>Correct Answer:</strong> {item.correctAns}
                            </h2>
                            <h2 className="p-3 border rounded-lg bg-blue-50 text-sm text-blue-900">
                                <strong>Feedback:</strong> {item.feedback}
                            </h2>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    );
}

export default Feedback;
