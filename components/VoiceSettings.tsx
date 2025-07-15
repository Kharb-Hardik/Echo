"use client";
import React from "react";

type Props = {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (v: SpeechSynthesisVoice | null) => void;
  pitch: number;
  setPitch: (v: number) => void;
  rate: number;
  setRate: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const VoiceSettings = ({
  voices,
  selectedVoice,
  setSelectedVoice,
  pitch,
  setPitch,
  rate,
  setRate,
  volume,
  setVolume,
}: Props) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 space-y-6 text-white">
      <div>
        <label className="text-sm text-black mb-1 block">Voice</label>
        <select
          value={selectedVoice?.name || ""}
          onChange={(e) => {
            const voice = voices.find((v) => v.name === e.target.value);
            setSelectedVoice(voice || null);
          }}
          className="w-full bg-transparent border border-black/20 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          {voices.map((voice) => (
            <option
              key={voice.name}
              value={voice.name}
              className="bg-white text-black"
            >
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <RangeSlider
        label="Pitch"
        min={0.5}
        max={2}
        step={0.1}
        value={pitch}
        onChange={setPitch}
      />
      <RangeSlider
        label="Rate"
        min={0.5}
        max={2}
        step={0.1}
        value={rate}
        onChange={setRate}
      />
      <RangeSlider
        label="Volume"
        min={0}
        max={1}
        step={0.1}
        value={volume}
        onChange={setVolume}
      />
    </div>
  );
};

export default VoiceSettings;

const RangeSlider = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-sm text-black/80">
      <label>{label}</label>
      <span className="text-xs font-mono">{value.toFixed(1)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-black transition"
    />
  </div>
);
