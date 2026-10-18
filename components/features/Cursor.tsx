'use client';
import { useEffect, useRef, useState } from 'react';
import { T } from '@/lib/tokens';

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const dwellTimer = useRef<number | null>(null);

  useEffect(() => {
    const resetDwell = () => {
      setDimmed(false);
      if (dwellTimer.current) window.clearTimeout(dwellTimer.current);
      dwellTimer.current = window.setTimeout(() => setDimmed(true), 320);
    };
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      resetDwell();
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = !!el.closest('a, button, input, textarea, select, [role="button"]');
      setHover(interactive);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      if (dwellTimer.current) window.clearTimeout(dwellTimer.current);
    };
  }, []);

  const opacity = hover ? 1 : dimmed ? 0.35 : 0.85;
  const accent = T.accent;

  return (
    <>
      {/* Plus-glyph collapses into a hollow square on hover over interactive elements */}
      <svg
        width="22"
        height="22"
        aria-hidden
        style={{
          position: 'fixed',
          left: pos.x - 11,
          top: pos.y - 11,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity,
          transition: 'opacity .18s ease',
        }}
      >
        {hover ? (
          <rect x="4" y="4" width="14" height="14" fill="none" stroke={accent} strokeWidth="1" />
        ) : (
          <>
            <line x1="11" y1="3"  x2="11" y2="19" stroke={accent} strokeWidth="1" />
            <line x1="3"  y1="11" x2="19" y2="11" stroke={accent} strokeWidth="1" />
            <line x1="9"  y1="3"  x2="13" y2="3"  stroke={accent} strokeWidth="1" opacity="0.6" />
            <line x1="9"  y1="19" x2="13" y2="19" stroke={accent} strokeWidth="1" opacity="0.6" />
            <line x1="3"  y1="9"  x2="3"  y2="13" stroke={accent} strokeWidth="1" opacity="0.6" />
            <line x1="19" y1="9"  x2="19" y2="13" stroke={accent} strokeWidth="1" opacity="0.6" />
          </>
        )}
      </svg>

      {/* Coord readout — only when hovering interactive */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: pos.x + 16,
          top: pos.y + 14,
          pointerEvents: 'none',
          zIndex: 9999,
          fontFamily: T.fMono,
          fontSize: 10,
          letterSpacing: '0.04em',
          color: T.t5,
          opacity: hover ? 1 : 0,
          transition: 'opacity .18s ease',
          whiteSpace: 'nowrap',
        }}
      >
        [x:{String(pos.x).padStart(4, '0')} y:{String(pos.y).padStart(4, '0')}]
      </div>
    </>
  );
}
