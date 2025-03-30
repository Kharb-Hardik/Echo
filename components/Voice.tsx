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
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynth(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    if (!synth) return;

    const loadVoices = () => {
      let availableVoices = synth.getVoices();
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0]);
      } else {
        // Retry fetching voices after a short delay
        setTimeout(() => {
          availableVoices = synth.getVoices();
          setVoices(availableVoices);
          if (availableVoices.length > 0 && !selectedVoice) {
            setSelectedVoice(availableVoices[0]);
          }
        }, 200);
      }
    };

    loadVoices();

    if (synth.onvoiceschanged !== undefined) {
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

    synth.cancel();
    synth.speak(utterance);

    return () => {
      synth.cancel();
    };
  }, [state, selectedVoice, pitch, rate, volume, synth]);

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = voices.find((voice) => voice.name === event.target.value);
    setSelectedVoice(selected || null);
  };

  const handlePitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPitch(parseFloat(event.target.value));
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(event.target.value));
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center text-white w-full mt-4">
      {displaySettings && (
        <>
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="text-sm text-gray-400">Voice</label>
              <select
                value={selectedVoice?.name || ""}
                onChange={handleVoiceChange}
                className="w-full bg-purple-600 text-white border border-gray-700 rounded-lg p-2 mt-1"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-400">Pitch</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={handlePitchChange}
                  className="accent-purple-500 mt-1"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-400">Rate</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={handleRateChange}
                  className="accent-purple-500 mt-1"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-400">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="accent-purple-500 mt-1"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Voice;
