'use client'

import transcript from "@/actions/transcript";
import Message from "@/components/Message";
import Recorder, { mimeType } from "@/components/Recorder";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";



const initialState={
  sender:"",
  response:"",
  id:""
}

export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {

  const fileRef=useRef<HTMLInputElement | null>(null);
  const submitRef=useRef<HTMLButtonElement | null>(null);
  const [state,formAction]=useActionState(transcript,initialState);
  const [messages,setMessages]= useState<Message[]>([]);

  useEffect(()=>{
    if(state.response && state.sender){
      setMessages(messages =>[
        {
          sender:state.sender || "",
          response:state.response || "",
          id:state.id || ""
        },
        ...messages
      ]);
    }  
  },[state]);


  const uploadAudio=(blob:Blob)=>{
    const file=new File([blob],"audio.webm",{type:mimeType});

    //set file as value of hidden file input field
      if(fileRef.current){
        const dataTransfer=new DataTransfer();
        dataTransfer.items.add(file);

        fileRef.current.files=dataTransfer.files;

        if(submitRef.current){
          submitRef.current.click();
        }
      }
  };

  return (
    <main className="bg-black h-screen overflow-y-auto ">

      {/* Header */}
      <header className="flex justify-between fixed top-0 text-white w-full p-5 ">
        <Image
          src="/logo.png"
          alt="Logo"
          height={50}
          width={50}
          className="object-contain rounded-full"
        />
        <SettingsIcon
          size={40}
          className="p-2 m-2 rounded-full cursor-pointer bg-purple-400 text-black transition-all ease-in-out duration-150 hover:bg-purple-700 hover:text-white"
        />
      </header>
 
      {/* Form */}
      <form action={formAction} className="flex flex-col bg-black ">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
            <Message />
        </div>

        <input type="file" name='audio' hidden ref={fileRef}/>
        <button type="submit" hidden ref={submitRef}/>

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio}/>

          <div></div>
        </div>

      </form>
    </main>
  );
}
