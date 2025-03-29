'use client'

import transcript from "@/actions/transcript";
import Message from "@/components/Message";
import Recorder, { mimeType } from "@/components/Recorder";
import Voice from "@/components/Voice";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";

const initialState = {
  sender: "",
  response: "",
  id: ""
}

export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {

  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [state, formAction] = useActionState(transcript, initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);

  useEffect(() => {
    if (state.response && state.sender) {
      setMessages(messages => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || ""
        },
        ...messages
      ]);
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: mimeType });

    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      fileRef.current.files = dataTransfer.files;

      if (submitRef.current) {
        submitRef.current.click();
      }
    }
  };

  return (
    <main className="h-screen overflow-y-auto bg-gradient-to-b from-purple-500 to-black relative">

      {/* Header */}
      <header className="flex justify-between items-center fixed top-0 left-0 right-0 text-white w-full p-5 z-50 bg-transparent">
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
          onClick={() => setDisplaySettings(!displaySettings)}
        />
      </header>

      {/* Form */}
      <form action={formAction} className="flex flex-col h-full pt-20"> 
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          <Message messages={messages} />
        </div>

        <input type="file" name='audio' hidden ref={fileRef} />
        <button type="submit" hidden ref={submitRef} />

        <div className="fixed bottom-0 w-full bg-black rounded-t-xl z-40 p-4">
          <Recorder uploadAudio={uploadAudio} />
          <div>
            <Voice
              state={state}
              displaySettings={displaySettings}
            />
          </div>
        </div>
      </form>
    </main>
  );
}
