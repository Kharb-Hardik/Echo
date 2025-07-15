import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import activeIcon from "@/img/active.gif";
import notActiveIcon from "@/img/non-active.png";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    getMicPerm();
  }, []);

  const getMicPerm = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setPermission(true);
        setStream(streamData);
      } catch {
        alert("Please Allow Microphone Permission");
      }
    } else {
      alert("Media Recorder is not Supported in your Browser.");
    }
  };

  const startRecording = () => {
    if (!stream || pending) return;

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    media.start();

    const localChunks: Blob[] = [];
    media.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        localChunks.push(event.data);
      }
    };

    setAudioChunks(localChunks);
    setRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorder.current || pending) return;

    mediaRecorder.current.stop();
    setRecording(false); // ✅ Immediately reset UI state

    // Handle audio processing async
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });

      // Start processing but UI is already updated
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="w-full flex items-center justify-center text-white">
      {!permission && (
        <button
          onClick={getMicPerm}
          className="text-sm bg-purple-600 px-3 py-1 rounded-md hover:bg-purple-700 transition"
        >
          Get Mic Access
        </button>
      )}

      {permission && (
        <Image
          alt={recording ? "Recording..." : "Start Recording"}
          src={recording ? activeIcon : notActiveIcon}
          onClick={toggleRecording}
          priority
          className={`w-12 mx-auto h-12 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-150 ${
            recording ? "animate-pulse" : ""
          }`}
        />
      )}
    </div>
  );
}

export default Recorder;
