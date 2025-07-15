"use client";
import { useEffect, useState } from "react";

type State = {
  sender: string;
  response: string | null | undefined;
};

function Voice({
  state,
  onReady,
}: {
  state: State;
  onReady: (config: VoiceConfig) => void;
}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
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
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        if (!selectedVoice) {
          setSelectedVoice(availableVoices[0]);
        }
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth, selectedVoice]);

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

  // Provide settings to parent so they can show in dialog
  useEffect(() => {
    onReady({
      voices,
      selectedVoice,
      setSelectedVoice,
      pitch,
      setPitch,
      rate,
      setRate,
      volume,
      setVolume,
    });
  }, [voices, selectedVoice, pitch, rate, volume]);

  return null;
}

export default Voice;

export type VoiceConfig = {
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
