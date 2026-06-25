'use client';
import { useState, useEffect } from 'react';
export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      setHover(['button', 'a', 'input'].includes(tag) || (e.target as HTMLElement)?.style?.cursor === 'pointer');
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); };
  }, []);
  const s = hover ? 44 : 30;
  return (
    <>
      <div style={{ position: 'fixed', left: pos.x - s/2, top: pos.y - s/2, width: s, height: s, border: '1.5px solid #22d3ee', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, transition: 'width .18s, height .18s', opacity: .6, mixBlendMode: 'screen' }} />
      <div style={{ position: 'fixed', left: pos.x - 3, top: pos.y - 3, width: 6, height: 6, background: '#22d3ee', borderRadius: '50%', pointerEvents: 'none', zIndex: 9999 }} />
    </>
  );
}
