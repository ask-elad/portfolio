'use client';
import { useState, useEffect } from 'react';
export function useTyping(words: string[], typingSpeed = 65, erasingSpeed = 30, pause = 2500) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const target = words[idx];
    let timeout: NodeJS.Timeout;
    if (typing) {
      if (text.length < target.length) timeout = setTimeout(() => setText(target.slice(0, text.length + 1)), typingSpeed);
      else timeout = setTimeout(() => setTyping(false), pause);
    } else {
      if (text.length > 0) timeout = setTimeout(() => setText(text.slice(0, -1)), erasingSpeed);
      else { setIdx(i => (i + 1) % words.length); setTyping(true); }
    }
    return () => clearTimeout(timeout);
  }, [text, typing, idx, words, typingSpeed, erasingSpeed, pause]);
  return text;
}
