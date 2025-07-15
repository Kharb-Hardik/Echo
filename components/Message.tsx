import React from "react";
import { Message } from "@/app/page";
import { ChevronDownCircle } from "lucide-react";
import LoadingMessage from "./LoadingMessage";

interface Props {
  messages: Message[];
}

export default function Messages({ messages }: Props) {
  const isEmpty = messages.length === 0;

  return (
    <div
      className={`flex flex-col min-h-screen px-6 pt-24 mx-auto ${
        isEmpty ? "pb-52" : "pb-96"
      } max-w-3xl relative`}
      aria-live="polite"
    >
      <LoadingMessage />

      {isEmpty && (
        <div className="flex flex-col items-center justify-center text-center text-lg text-white/80 mb-20 animate-fade-in">
          <p className="animate-pulse">Start a conversation.</p>
          <ChevronDownCircle
            size={32}
            className="mt-8 animate-bounce text-white/90"
          />
        </div>
      )}

      <div className="flex flex-col space-y-6 w-full">
        {messages.map((message, index) => (
          <div key={message.id || index} className="space-y-3">
            {message.response && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 transition-all hover:scale-[1.01] duration-200">
                  {message.response}
                </div>
              </div>
            )}

            {message.sender && (
              <div className="flex justify-end">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-4 rounded-xl shadow-lg max-w-[80%] w-fit">
                  {message.sender}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
