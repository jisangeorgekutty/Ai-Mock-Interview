"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAI'
import { LoaderCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useMockInterviewStore } from '@/store/useMockInterviewStore'

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { authUser } = useAuthStore();
    const { createMockInterview } = useMockInterviewStore();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Year of Experience: ${jobExperience}. Based on these details, provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format. Only include question and answer fields.`;

            const result = await chatSession.sendMessage(inputPrompt);
            const mockJsonResp = result.response.text()
                .replace('```json', '')
                .replace('```', '');

            const mockId = uuidv4();

            await createMockInterview({
                mockId,
                jsonMockResp: mockJsonResp,
                jobPosition,
                jobDesc,
                jobExperience,
            });

            setOpenDialog(false);
            router.push(`/dashboard/interview/${mockId}`);
        } catch (error) {
            console.error("Error during mock interview creation:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className='p-10 w-65 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>

            <Dialog open={openDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>
                            Tell us more about your job interview
                        </DialogTitle>
                        <DialogDescription asChild>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <div className='mt-6'>
                                        <label>Job Role</label>
                                        <Input
                                            placeholder="Ex. Full Stack Developer"
                                            required
                                            onChange={(e) => setJobPosition(e.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description</label>
                                        <Textarea
                                            placeholder="Ex. React, Node.js, MongoDB..."
                                            required
                                            onChange={(e) => setJobDesc(e.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input
                                            placeholder="Ex. 3"
                                            type="number"
                                            max="100"
                                            required
                                            onChange={(e) => setJobExperience(e.target.value)}
                                        />
                                    </div>
                                    <div className='flex gap-5 p-5 justify-end'>
                                        <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <LoaderCircle className='animate-spin mr-2' />
                                                    Generating...
                                                </>
                                            ) : 'Start Interview'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
