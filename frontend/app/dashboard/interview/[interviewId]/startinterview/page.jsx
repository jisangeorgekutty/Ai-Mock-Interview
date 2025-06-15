"use client";

import React, { useEffect, useState } from 'react';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useMockInterviewStore } from '@/store/useMockInterviewStore';

function StartInterview() {
    const { interviewId } = useParams;

    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeIndexQuestion, setActiveIndexQuestion] = useState(0);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const [loadingEnd, setLoadingEnd] = useState(false);

    const router = useRouter();
    const { getMockInterviewById } = useMockInterviewStore();

    useEffect(() => {
        if (interviewId) {
            getInterviewDetails();
        }
    }, [interviewId]);

    const getInterviewDetails = async () => {
        const result = await getMockInterviewById(interviewId);
        if (result) {
            setInterviewData(result);
            try {
                const parsedResp = JSON.parse(result.jsonMockResp);
                setMockInterviewQuestion(parsedResp);
            } catch (err) {
                console.error("Failed to parse mock response JSON", err);
            }
        }
    };

    const handleEndInterview = async () => {
        setLoadingEnd(true);
        try {

            setInterviewEnded(true);
            router.push(`/dashboard/interview/${interviewId}/feedback`);
        } catch (err) {
            console.error("Error saving emotion feedback", err);
        } finally {
            setLoadingEnd(false);
        }
    };

    return (
        <div className="my-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

            <div className="flex justify-end gap-6 mt-6">
                {activeIndexQuestion > 0 && (
                    <Button onClick={() => setActiveIndexQuestion(activeIndexQuestion - 1)}>
                        Previous Question
                    </Button>
                )}
                {activeIndexQuestion < mockInterviewQuestion?.length - 1 && (
                    <Button onClick={() => setActiveIndexQuestion(activeIndexQuestion + 1)}>
                        Next Question
                    </Button>
                )}
                {activeIndexQuestion === mockInterviewQuestion?.length - 1 && (
                    <Button onClick={handleEndInterview} disabled={loadingEnd}>
                        {loadingEnd ? "Saving & Ending..." : "End Interview"}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
