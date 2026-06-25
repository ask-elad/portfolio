'use client';
import { useState, useEffect } from 'react';
const CHARS = 'abcdefghijklmnopqrstuvwxyz!<>_\\/[]=+*?#@$';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];
export function useGlitch(finalText: string, duration = 900, delay = 300) {
  const [display, setDisplay] = useState(() => finalText.split('').map(rand).join(''));
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const resolved = Math.floor(p * finalText.length);
      setDisplay(finalText.split('').map((ch, i) => (i < resolved ? ch : rand())).join(''));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, finalText, duration]);
  return display;
}
