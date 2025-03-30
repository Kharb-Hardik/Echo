'use server';

async function transcript(prevState: any, formData: FormData) {
    console.log("Previous State:", prevState);

    const id = Math.random().toString(36);

    if (
        !process.env.AZURE_API_KEY ||
        !process.env.AZURE_CHAT_API_KEY ||
        !process.env.AZURE_ENDPOINT ||
        !process.env.AZURE_CHAT_ENDPOINT ||
        !process.env.AZURE_DEPLOYMENT_NAME ||
        !process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME
    ) {
        console.error("Azure credentials not set");
        return {
            sender: "",
            response: "Azure credentials not set",
        };
    }

    const file = formData.get("audio") as File;

    if (!file || file.size === 0) {
        return {
            sender: "",
            response: "No audio file uploaded",
        };
    }

    console.log(">> Received file:", file);

    // Prepare FormData for transcription
    const transcriptionFormData = new FormData();
    transcriptionFormData.append("file", file);
    transcriptionFormData.append("model", "whisper-1");

    console.log("== Sending request for transcription ==");

    // Azure OpenAI Whisper Transcription API
    const transcriptionResponse = await fetch(
        `${process.env.AZURE_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/audio/transcriptions?api-version=2023-09-01-preview`,
        {
            method: "POST",
            headers: {
                "api-key": process.env.AZURE_API_KEY,
            },
            body: transcriptionFormData,
        }
    );

    if (!transcriptionResponse.ok) {
        const errorText = await transcriptionResponse.text();
        console.error("Transcription error:", errorText);
        return {
            sender: "",
            response: "Failed to transcribe audio.",
        };
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcribedText = transcriptionResult.text || "No transcription available.";

    console.log(`Transcription: ${transcribedText}`);

    // Azure OpenAI Chat Completion API
    const chatResponse = await fetch(
        `${process.env.AZURE_CHAT_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME}/chat/completions?api-version=2023-09-01-preview`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_CHAT_API_KEY,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a helpful assistant. You will answer questions and reply 'I cannot answer that' if you don't know the answer.",
                    },
                    {
                        role: "user",
                        content: transcribedText,
                    },
                ],
                max_tokens: 100,
            }),
        }
    );

    if (!chatResponse.ok) {
        const errorText = await chatResponse.text();
        console.error("Chat error:", errorText);
        return {
            sender: transcribedText,
            response: "Failed to generate response.",
        };
    }

    const chatResult = await chatResponse.json();
    const response = chatResult.choices?.[0]?.message?.content || "No response generated.";

    console.log("Final Output:", prevState, "+++", transcribedText);

    return {
        sender: transcribedText,
        response: response,
        id: id,
    };
}

export default transcript;
