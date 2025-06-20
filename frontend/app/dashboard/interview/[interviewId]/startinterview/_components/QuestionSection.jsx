import { text } from 'drizzle-orm/mysql-core'
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionSection({mockInterviewQuestion,activeIndexQuestion}) {
    console.log("TEST"+mockInterviewQuestion)
    console.log("TEST"+activeIndexQuestion)
    const textToSpeech=(text)=>{
        if('speechSynthesis' in window){
            const speech=new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech)
        }else{
            alert("Sorry, browser dosn't support text to speech");
        }
    }
  return mockInterviewQuestion&&(
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {mockInterviewQuestion && mockInterviewQuestion.map((question,index)=>(
                <h2 key={index} className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer border ${activeIndexQuestion==index&&'bg-primary text-white'}`}>Question #{index+1}</h2>
            ))}
        </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeIndexQuestion]?.question}</h2>
        <Volume2 onClick={()=>textToSpeech(mockInterviewQuestion[activeIndexQuestion]?.question)} />
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>  
    </div>
  )
}

export default QuestionSection
