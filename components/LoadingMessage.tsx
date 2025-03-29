'use client';

import { useFormStatus } from "react-dom";
import { BeatLoader } from "react-spinners";

function LoadingMessage() {
    const { pending } = useFormStatus();
    return (
        pending && (
            <div className="flex justify-end my-3">
                <div className="flex items-center justify-center rounded-xl p-4 max-w-[80%] w-fit bg-gray-700 shadow-lg animate-pulse">
                    <BeatLoader size={8} color="#ffffff" />
                </div>
            </div>
        )
    )
}

export default LoadingMessage;
