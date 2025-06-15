"use client"

import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useMockInterviewStore } from '@/store/useMockInterviewStore';

function InterviewList() {
    const { authUser } = useAuthStore();
    const { fetchInterviews, interviews } = useMockInterviewStore();

    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (authUser) {
            fetchInterviews(authUser.email);
        }
    }, [authUser]);

    useEffect(() => {
        setInterviewList(interviews);
    }, [interviews]);

    return (
        <div className='mt-10'>
            <h2 className='font-medium text-xl'><strong>Previous Mock Interviews</strong></h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList && interviewList.map((interview, index) => (
                    <InterviewItemCard
                        interviewItemData={interview}
                        key={interview._id || index}
                    />
                ))}
            </div>
        </div>
    )
}

export default InterviewList;
