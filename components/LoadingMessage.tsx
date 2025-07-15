"use client";

import { useFormStatus } from "react-dom";
import { BeatLoader } from "react-spinners";

export default function LoadingMessage() {
  const { pending } = useFormStatus();

  if (!pending) return null;

  return (
    <div className="flex justify-end my-3" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3 rounded-xl px-5 py-3 max-w-[80%] w-fit bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl transition-all duration-300">
        <span className="text-sm text-white opacity-80">
          Transcribing audio...
        </span>
        <BeatLoader size={8} color="#ffffff" />
      </div>
    </div>
  );
}
