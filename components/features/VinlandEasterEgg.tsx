'use client';
import { useState, useEffect, useCallback } from 'react';

type Phase = 'glitch' | 'darken' | 'draw' | 'quote' | 'attr' | 'sig' | 'hold' | 'fade';

const QUOTE = `A true warrior doesn't fight\nbecause he hates what is in front of him.\n\nHe fights for what is behind him.`;
const ATTR  = '\u2014 Askeladd, Vinland Saga';
const SIG   = 'askelad_';
const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export function VinlandEasterEgg({ onClose }: { onClose: () => void }) {
  const [phase, setPhase]         = useState<Phase>('glitch');
  const [quoteText, setQuoteText] = useState('');
  const [sigText, setSigText]     = useState('');
  const [attrVis, setAttrVis]     = useState(false);
  const [opacity, setOpacity]     = useState(0);

  const close = useCallback(() => {
    setPhase('fade');
    setOpacity(0);
    setTimeout(onClose, 800);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Glitch
      setPhase('glitch');
      await sleep(200);
      if (cancelled) return;

      // Darken
      setPhase('darken');
      setOpacity(1);
      await sleep(500);
      if (cancelled) return;

      // Draw the Norse mark
      setPhase('draw');
      await sleep(2200);
      if (cancelled) return;

      // Type the quote
      setPhase('quote');
      for (let i = 0; i <= QUOTE.length; i++) {
        if (cancelled) return;
        setQuoteText(QUOTE.slice(0, i));
        await sleep(16);
      }
      await sleep(400);
      if (cancelled) return;

      // Attribution fades in
      setAttrVis(true);
      await sleep(700);
      if (cancelled) return;

      // Signature types out
      setPhase('sig');
      for (let i = 0; i <= SIG.length; i++) {
        if (cancelled) return;
        setSigText(SIG.slice(0, i));
        await sleep(90);
      }
      await sleep(1400);
      if (cancelled) return;

      // Fade out
      close();
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [close]);

  const contentVisible = ['draw','quote','attr','sig','hold'].includes(phase);
  const animate = (delay: string, duration: string) =>
    contentVisible ? `drawStroke ${duration} ${delay} ease forwards` : 'none';

  return (
    <>
      {/* Page glitch flash */}
      {phase === 'glitch' && (
        <style>{`
          body { animation: vinlandGlitch 0.2s step-end forwards; }
          @keyframes vinlandGlitch {
            0%  { filter: none; }
            20% { filter: hue-rotate(90deg) saturate(0.2); transform: translate(-3px,1px); }
            40% { filter: invert(0.18); transform: translate(3px,-2px); }
            60% { filter: brightness(2.5); transform: translate(-2px,2px); }
            80% { filter: saturate(0); transform: translate(2px,-1px); }
            100%{ filter: none; transform: translate(0); }
          }
        `}</style>
      )}

      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: '#010103',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 40px',
          opacity: phase === 'fade' ? 0 : opacity,
          transition: 'opacity 0.7s ease',
          pointerEvents: opacity > 0 ? 'all' : 'none',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 520 }}>

          {/* Norse Compass — draws itself stroke by stroke */}
          <svg width="128" height="128" viewBox="0 0 200 200"
            style={{ display: 'block', margin: '0 auto 44px', opacity: contentVisible ? 1 : 0, transition: 'opacity 0.5s' }}>

            {/* Outer ring — circumference ~553 */}
            <circle cx="100" cy="100" r="88" fill="none" stroke="#22d3ee" strokeWidth="0.8"
              strokeDasharray="553" strokeDashoffset="553"
              style={{ animation: animate('0s','0.9s') }} />

            {/* N-S spoke — length 176 */}
            <line x1="100" y1="12" x2="100" y2="188" stroke="#22d3ee" strokeWidth="0.6"
              strokeDasharray="176" strokeDashoffset="176"
              style={{ animation: animate('0.95s','0.45s') }} />
            {/* E-W spoke */}
            <line x1="12" y1="100" x2="188" y2="100" stroke="#22d3ee" strokeWidth="0.6"
              strokeDasharray="176" strokeDashoffset="176"
              style={{ animation: animate('0.95s','0.45s') }} />
            {/* NW-SE diagonal — length ~249 */}
            <line x1="38" y1="38" x2="162" y2="162" stroke="#22d3ee" strokeWidth="0.5"
              strokeDasharray="249" strokeDashoffset="249"
              style={{ animation: animate('1.2s','0.4s') }} />
            {/* NE-SW diagonal */}
            <line x1="162" y1="38" x2="38" y2="162" stroke="#22d3ee" strokeWidth="0.5"
              strokeDasharray="249" strokeDashoffset="249"
              style={{ animation: animate('1.2s','0.4s') }} />
            {/* Inner ring — circumference ~239 */}
            <circle cx="100" cy="100" r="38" fill="none" stroke="#22d3ee" strokeWidth="0.7"
              strokeDasharray="239" strokeDashoffset="239"
              style={{ animation: animate('1.45s','0.55s') }} />
            {/* Cardinal tick marks */}
            {([[100,12,100,4],[188,100,196,100],[100,188,100,196],[12,100,4,100]] as number[][]).map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="1"
                strokeDasharray="12" strokeDashoffset="12"
                style={{ animation: animate(`${1.8 + i*0.04}s`,'0.2s') }} />
            ))}
            {/* Center dot */}
            <circle cx="100" cy="100" r="3.5" fill="#22d3ee"
              style={{ opacity: 0, animation: contentVisible ? 'fadeInEl 0.35s 2.0s ease forwards' : 'none' }} />
          </svg>

          {/* Quote — types out */}
          <div style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 18, color: '#c8c8c8', lineHeight: 1.95,
            fontStyle: 'italic', whiteSpace: 'pre-line', marginBottom: 24,
            minHeight: 130,
          }}>
            {quoteText && (
              <>
                &ldquo;{quoteText}
                {['quote'].includes(phase) && (
                  <span style={{ animation: 'blinkEl 1s step-end infinite', color: '#22d3ee' }}>█</span>
                )}
                {phase !== 'quote' && <>&rdquo;</>}
              </>
            )}
          </div>

          {/* Attribution */}
          <div style={{
            fontFamily: 'monospace', fontSize: 12, color: '#444', marginBottom: 36,
            opacity: attrVis ? 1 : 0, transition: 'opacity 0.6s',
          }}>
            {ATTR}
          </div>

          {/* Signature */}
          {(phase === 'sig' || phase === 'hold') && (
            <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#22d3ee', letterSpacing: '.08em' }}>
              {sigText}
              <span style={{ animation: 'blinkEl 1s step-end infinite' }}>|</span>
            </div>
          )}

          <div style={{ marginTop: 32, fontFamily: 'monospace', fontSize: 10, color: '#1e1e1e' }}>
            esc or click to close
          </div>
        </div>
      </div>
    </>
  );
}
