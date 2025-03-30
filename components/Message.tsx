import React from 'react';
import { Message } from "@/app/page"
import { ChevronDownCircle } from 'lucide-react';
import LoadingMessage from './LoadingMessage';

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {
  return (
    <div className={`flex flex-col min-h-screen p-10 pt-20 mx-auto ${
      messages.length > 0 ? "pb-96" : "pb-52"
    } max-w-3xl relative`}>
      <LoadingMessage />
      {!messages.length && (
        <div className='ml-2 bottom-0 left-0 right-0 flex flex-col items-center justify-center text-center text-xl mb-20'>
          <p className='text-white animate-pulse'>Start a conversation.</p>
          <br />
          <ChevronDownCircle 
            size={50}
            className='animate-bounce text-white'
          />
        </div>
      )}
      <div className='space-y-6 w-full'>
        {messages.map((message, index) => (
          <div key={message.id || index} className='space-y-3'>
            {message.response && (
              <div className='flex justify-start'>
                <div className='bg-gray-800 text-white p-4 rounded-xl shadow-md max-w-[80%] w-fit'>
                  {message.response}
                </div>
              </div>
            )}
            
            {message.sender && (
              <div className='flex justify-end'>
                <div className='message text-white p-4 rounded-xl shadow-md max-w-[80%] w-fit'>
                  {message.sender}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Render LoadingMessage */}
      

      {/* Message to appear at the bottom */}
      
    </div>
  )
}

export default Messages;
