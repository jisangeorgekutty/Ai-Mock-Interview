"use client";
import { db } from '@/utils/db';
import { MockInterview, EmotionFeedback } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function StartInterview({ params }) {
    const { interviewId } = React.use(params);
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeIndexQuestion, setActiveIndexQuestion] = useState(0);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const [loadingEnd, setLoadingEnd] = useState(false);  //  Track interview end status
    const router = useRouter();

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));

        if (result.length > 0) {
            const resultData = result[0]?.jsonMockResp;
            const jsonMockResp = JSON.parse(resultData);
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
        }
    };

    const handleEndInterview = async () => {
        setLoadingEnd(true);  //  Show loading state while saving data

        try {
            //  Save Emotion Feedback before navigating
            const emotionFeedbackData = {
                suggestion1: "Practice answering common questions confidently.",
                suggestion2: "Work on maintaining eye contact and clear speech."
            };

            await db.insert(EmotionFeedback)
                .values({
                    mockIdRef: interviewId,
                    emotionFeedback: JSON.stringify(emotionFeedbackData),
                });

            console.log(" Emotion Feedback Stored!");

            setInterviewEnded(true);
            setLoadingEnd(false);

            //  Navigate only after Emotion Feedback is saved
            router.push(`/dashboard/interview/${interviewId}/feedback`);
        } catch (error) {
            console.error(" Error Ending Interview:", error);
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeIndexQuestion={activeIndexQuestion}
                />
                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeIndexQuestion={activeIndexQuestion}
                    interviewData={interviewData}
                    interviewEnded={interviewEnded}
                />
            </div>
            <div className='flex justify-end gap-6'>
                {activeIndexQuestion > 0 &&
                    <Button onClick={() => setActiveIndexQuestion(activeIndexQuestion - 1)}>
                        Previous Question
                    </Button>
                }
                {activeIndexQuestion !== mockInterviewQuestion?.length - 1 &&
                    <Button onClick={() => setActiveIndexQuestion(activeIndexQuestion + 1)}>
                        Next Question
                    </Button>
                }
                {activeIndexQuestion === mockInterviewQuestion?.length - 1 &&
                    <Button onClick={handleEndInterview} disabled={loadingEnd}>
                        {loadingEnd ? "Saving & Ending..." : "End Interview"}
                    </Button>
                }
            </div>
        </div>
    );
}

export default StartInterview;
