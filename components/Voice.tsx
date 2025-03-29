"use client";
import React, { useState, useEffect } from "react";

type State = {
  sender: string;
  response: string | null | undefined;
};

function Voice({
  state,
  displaySettings,
}: {
  state: State;
  displaySettings: boolean;
}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const synth = window.speechSynthesis;

  useEffect(() => {
    const loadVoices = () => {
        let availableVoices = window.speechSynthesis.getVoices();
        
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          setSelectedVoice(availableVoices[0]);
        } else {
          // Force the voices to load properly by re-fetching after a delay
          setTimeout(() => {
            availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
              setSelectedVoice(availableVoices[0]);
            }
          }, 200);
        }
      };
      
    loadVoices();

    if (typeof window !== "undefined" && synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [synth]);

  useEffect(() => {
    if (!state.response || !synth || !selectedVoice) return;

    const utterance = new SpeechSynthesisUtterance(state.response);
    utterance.voice = selectedVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    synth.cancel(); // Ensure any ongoing speech is stopped before starting a new one.
    synth.speak(utterance);

    return () => {
      synth.cancel(); // Clean up when the component unmounts or state changes
    };
  }, [state, selectedVoice, pitch, rate, volume, synth]);

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = voices.find((voice) => voice.name === event.target.value);
    setSelectedVoice(selected || null);
  };

  const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pitchValue = parseFloat(event.target.value);
    setPitch(pitchValue);
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rateValue = parseFloat(event.target.value);
    setRate(rateValue);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(event.target.value);
    setVolume(volumeValue);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {displaySettings && (
        <>
          <div className="w-fit">
            <p className="text-xs text-gray-500 p-2">Voice:</p>
            <select
              value={selectedVoice?.name || ""}
              onChange={handleVoiceChange}
              className="flex-1 bg-purple-500 text-white border border-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-purple-500 dark:focus:border-purple-500"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
          <div className="flex pb-5">
            <div className="p-2">
              <p className="text-xs text-gray-500 p-2">Pitch:</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={handlePitchChange}
                className="accent-purple-500"
              />
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-500 p-2">Rate:</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
                className="accent-purple-500"
              />
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-500 p-2">Volume:</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="accent-purple-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Voice;
