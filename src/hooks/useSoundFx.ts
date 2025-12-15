"use client";

import { useCallback, useRef, useEffect } from "react";

export const useSoundFx = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction/mount (lazily)
    // We don't init immediately to avoid "AudioContext was not allowed to start" warning
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContextRef.current = new AudioCtx();
    }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, startTime = 0) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    // Resume context if suspended (browser policy)
    if (ctx.state === "suspended") {
        ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  }, []);

  const playCoin = useCallback(() => {
    // Two-tone coin sound (B5 -> E6)
    playTone(987.77, "square", 0.1, 0); // B5
    playTone(1318.51, "square", 0.4, 0.1); // E6
  }, [playTone]);

  const playJump = useCallback(() => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playCrash = useCallback(() => {
     if (!audioContextRef.current) return;
     const ctx = audioContextRef.current;
     if (ctx.state === "suspended") ctx.resume();

     // Noise buffer for explosion/crash
     const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
     const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
     const data = buffer.getChannelData(0);
     for (let i = 0; i < bufferSize; i++) {
         data[i] = Math.random() * 2 - 1;
     }

     const noise = ctx.createBufferSource();
     noise.buffer = buffer;

     const gain = ctx.createGain();
     gain.gain.setValueAtTime(0.2, ctx.currentTime);
     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

     noise.connect(gain);
     gain.connect(ctx.destination);
     noise.start();
  }, []);

  const playClick = useCallback(() => {
      playTone(800, "sine", 0.05);
  }, [playTone]);

  const playSuccess = useCallback(() => {
      // Zelda-ish success
      playTone(523.25, "triangle", 0.1, 0); // C
      playTone(659.25, "triangle", 0.1, 0.1); // E
      playTone(783.99, "triangle", 0.1, 0.2); // G
      playTone(1046.50, "triangle", 0.4, 0.3); // C high
  }, [playTone]);

  return { playCoin, playJump, playCrash, playClick, playSuccess };
};
