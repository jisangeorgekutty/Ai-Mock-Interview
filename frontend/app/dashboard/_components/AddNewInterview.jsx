"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAI'
import { LoaderCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '@/store/useAuthStore'
import moment from 'moment'
import { MockInterview } from '@/utils/schema'
import {db} from '@/utils/db'
import { useRouter } from 'next/navigation'


function AddNewInterview() {
    // create a state
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResoponse, setJsonResponse] = useState([]);
    const router=useRouter();

    const {authUser}=useAuthStore();
    const user=authUser;
    

    console.log("User",user?.email);

    // form submit onSubmit method call
    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition, jobDesc, jobExperience)
        const inputPromt = "Job Position: " + jobPosition + ",Job Description: " + jobDesc + ",Year of Experiece: " + jobExperience + ",Depends on Job Position,Job Description & Year of Experience give us " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " interview questions along with answer in JSON format,Give us question and answer field on JSON"
        const result = await chatSession.sendMessage(inputPromt);
        const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
        console.log(mockJsonResp);
        setJsonResponse(mockJsonResp)

        // db storing
        if (mockJsonResp) {
            const store = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: mockJsonResp,
                jobPosition: jobPosition,
                jobDesc: jobDesc,
                jobExperience: jobExperience,
                createdBy: user?.email,
                createdAt: moment().format('DD-MM-yy')
            }).returning({ mockId: MockInterview.mockId })
            console.log("Instered Id" + store)

            if(store){
                setOpenDialog(false);
                router.push('/dashboard/interview/'+store[0].mockId);
            }

        }else{
            console.log("ERORR");
        }
        setLoading(false)
    }
    return (
        <div>
            <div className='p-10 w-65 border rounded-lg bg-secondary
         hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}>
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us mmore about your job interviewing</DialogTitle>
                        <DialogDescription asChild>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <div>
                                        <h2>Add details about your job role,Job description and years of experience</h2>
                                        <div className='mt-6 my-3'>
                                            <label>Job Role</label>
                                            <Input placeholder="Ex. Full Stack Developer" required
                                                onChange={(event) => setJobPosition(event.target.value)}
                                            />
                                        </div>
                                        <div className='my-3'>
                                            <label>Job Description</label>
                                            <Textarea placeholder="Ex. React,Js,NodeJs,MySql...." required
                                                onChange={(event) => setJobDesc(event.target.value)}
                                            />
                                        </div>
                                        <div className='my-3'>
                                            <label>No.of Year Experience</label>
                                            <Input placeholder="Ex. 5" type="number" max="100" required
                                                onChange={(event) => setJobExperience(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex gap-5 p-5 justify-end'>
                                        <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ?
                                                <>
                                                    <LoaderCircle className='animate-spin' />'Generating from AI'
                                                </> : 'Start Interview'
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview