"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';
import { useAuthStore } from '@/store/useAuthStore';

function InterviewList() {
    const { authUser } = useAuthStore();
    const user = authUser;

    const [interviewList, setInterviewList] = useState([]);

    // user information availbale then the useEffect will work
    useEffect(() => {
        user && getInterviewList();
    }, [user])

    const getInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.email))
            .orderBy(desc(MockInterview.id));
        setInterviewList(result);
    }

    return (
        <div className='mt-10'>
            <h2 className='font-medium text-xl'><strong>Previous Mock Interviews</strong></h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList && interviewList.map((interview, index) => (
                    <InterviewItemCard
                        interviewItemData={interview}
                        key={index} />
                ))}
            </div>
        </div>
    )
}

export default InterviewList