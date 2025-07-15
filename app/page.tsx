"use client";

import transcript from "@/actions/transcript";
import Message from "@/components/Message";
import Recorder, { mimeType } from "@/components/Recorder";
import SettingsDialog from "@/components/Settings";
import VoiceSettings from "@/components/VoiceSettings";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import Voice, { VoiceConfig } from "@/components/Voice";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

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
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null);
  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((prev) => [
        {
          sender: state.sender,
          response: state.response,
          id: state.id,
        },
        ...prev,
      ]);
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const file = new File([blob], "audio.webm", { type: mimeType });

    if (fileRef.current && submitRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;
      submitRef.current.click();
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-[#1E1B4B] via-[#312E81] to-[#0F172A] to-black relative text-white">
      <header className="flex justify-between items-center fixed top-0 left-0 right-0 px-6 py-4 backdrop-blur-md bg-black/30 shadow-md z-50">
        <Image
          src="/logo.svg"
          alt="App Logo"
          width={32}
          height={32}
          className="rounded-full border-2 border-white shadow-lg"
        />
        <button
          onClick={() => setDisplaySettings(!displaySettings)}
          aria-label="Settings"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
        >
          <SettingsIcon size={16} />
        </button>
      </header>

      <form action={formAction} className="pt-24 pb-36 h-full flex flex-col">
        <section className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-transparent">
          <Message messages={messages} />
        </section>

        <input type="file" name="audio" hidden ref={fileRef} />
        <button type="submit" hidden ref={submitRef} />

        <Voice state={state} onReady={setVoiceConfig} />

        <SettingsDialog
          open={displaySettings}
          onOpenChange={setDisplaySettings}
        >
          {voiceConfig && <VoiceSettings {...voiceConfig} />}
        </SettingsDialog>

        <footer className="fixed bottom-0 left-0 right-0 bg-black backdrop-blur-lg rounded-t-xl shadow-lg px-4 py-2 flex items-center justify-center z-40 ">
          <Recorder uploadAudio={uploadAudio} />
        </footer>
      </form>
    </main>
  );
}
