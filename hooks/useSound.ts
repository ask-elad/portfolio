'use client';
import { useRef, useCallback } from 'react';

export type SoundType = 'click' | 'hover' | 'open' | 'vinland';

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  };
  return useCallback((type: SoundType = 'click') => {
    try {
      const ctx = getCtx();
      if (type === 'vinland') {
        [82.4, 123.5, 164.8].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.5 + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
          osc.start(); osc.stop(ctx.currentTime + 3.1);
        });
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      switch (type) {
        case 'click':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.start(); osc.stop(ctx.currentTime + 0.1);
          break;
        case 'hover':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(660, ctx.currentTime);
          gain.gain.setValueAtTime(0.018, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.start(); osc.stop(ctx.currentTime + 0.04);
          break;
        case 'open':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(330, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.14);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.start(); osc.stop(ctx.currentTime + 0.2);
          break;
      }
    } catch (_) {}
  }, []);
}
