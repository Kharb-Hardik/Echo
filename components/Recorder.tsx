'use client'
import Image from 'next/image'
import React, { act, use, useEffect, useRef, useState } from 'react'
import activeIcon from '@/img/active.gif'
import notActiveIcon from '@/img/non-active.png'
import { useFormStatus } from 'react-dom'
import { StopCircle } from 'lucide-react'

export const mimeType="audio/webm"

function Recorder({uploadAudio}:{uploadAudio:(blob:Blob)=>void}) {
    const mediaRecorder= useRef<MediaRecorder | null>(null);
    const {pending}=useFormStatus();
    const [permission,setPermission]=useState(false);
    const [stream,setStream]=useState<MediaStream | null>(null);
    const [recordingStatus,setRecrodingStatus]=useState("inactive");
    const [audioChunks,setAudioChunks]=useState<Blob[]>([]);

    useEffect(()=>{
        getMicPerm();
    },[]);

    const getMicPerm=async()=>{
        if("MediaRecorder" in window){
            try{
                const steamData=await navigator.mediaDevices.getUserMedia({audio:true});
                setPermission(true);
                setStream(steamData);
            }catch(error:any){
                alert("Please Allow Microphone Permission");
            }
        }
        else{
                alert("Media Recorder is not Supported in your Browser.");
            }
        
    }

    const startRecording=()=>{
        if(stream===null || pending) return;
        setRecrodingStatus("recording");

        //create new media recorder using stream
        //stream is where we take permission from user
        //but we need a new media
        const media=new MediaRecorder(stream,{mimeType});
        mediaRecorder.current=media;
        mediaRecorder.current.start();

        let localAudioChunks: Blob[]=[];
        mediaRecorder.current.ondataavailable=(event)=>{
            if(typeof event.data === "undefined") return;
            if(event.data.size===0) return;

            localAudioChunks.push(event.data);
        }

        setAudioChunks(localAudioChunks);
    }

    const stopRecording=()=>{
        if(mediaRecorder.current===null || pending) return;
            
        setRecrodingStatus("inactive");
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop=()=>{
            const audioBlob=new Blob(audioChunks,{type:mimeType});
            const audioUrl=URL.createObjectURL(audioBlob);
            uploadAudio(audioBlob);
            setAudioChunks([]);
        }
    }
  
    return (
    <div className='flex items-center justify-center text-white'>

        {!permission && (
            <button onClick={getMicPerm}>Get Microphone Permission</button>
        )};

        {pending && (
            <Image 
                alt="Recording"
                src={activeIcon}
                width={125}
                height={125}
                priority
                className='assistant gray-scale'
            />
        )}

        {permission && recordingStatus==="inactive" &&!pending &&(
            <Image 
                alt="Not Recording"
                src={notActiveIcon}
                width={125}
                height={125}
                onClick={startRecording}
                priority={true}
                className='assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out'
            />
        )}

        {recordingStatus==="recording" && (
            <Image 
                alt="Recording"
                src={activeIcon}
                width={125}
                height={125}
                onClick={stopRecording}
                priority={true}
                className='assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out'
            />
        )}
    </div>
  )
}

export default Recorder