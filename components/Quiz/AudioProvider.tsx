"use client";

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  isPlayingBg: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  playBgMusic: () => void;
  stopBgMusic: () => void;
  playSound: (type: 'correct' | 'wrong' | 'tick' | 'levelup' | 'rankup' | 'click') => void;
  setVolume: (v: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const SOUND_URLS = {
  bg: 'https://assets.mixkit.co/music/preview/mixkit-tense-horror-cinematic-theme-274.mp3',
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  levelup: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  rankup: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Placeholder same as levelup
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingBg, setIsPlayingBg] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgAudioRef.current = new Audio(SOUND_URLS.bg);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = volume;

    return () => {
      bgAudioRef.current?.pause();
      bgAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const playBgMusic = () => {
    if (!bgAudioRef.current) return;
    bgAudioRef.current.play().catch(e => console.log("Autoplay blocked", e));
    setIsPlayingBg(true);
  };

  const stopBgMusic = () => {
    bgAudioRef.current?.pause();
    setIsPlayingBg(false);
  };

  const playSound = (type: keyof typeof SOUND_URLS) => {
    if (isMuted || type === 'bg') return;
    const audio = new Audio(SOUND_URLS[type]);
    audio.volume = type === 'tick' ? 0.3 : 0.6;
    audio.play().catch(() => {});
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <AudioContext.Provider value={{
      isPlayingBg,
      isMuted,
      toggleMute,
      playBgMusic,
      stopBgMusic,
      playSound,
      setVolume
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
