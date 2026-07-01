'use client';
import { useGlitch } from '@/hooks/useGlitch';
import { useTyping } from '@/hooks/useTyping';
import { CONFIG } from '@/lib/data/config';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';

export function Hero({ playSound }: { playSound: (t: SoundType) => void }) {
  const name = useGlitch(CONFIG.name && !CONFIG.name.startsWith('REPLACE') ? CONFIG.name : 'Dev.Name', 900, 250);
  const role = useTyping(CONFIG.roles);

  const scroll = (id: string) => {
    playSound('click');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const currently = CONFIG.about.facts.find(f => f.label === 'Currently')?.value;

  return (
    <section id="hero" style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 40px 80px', maxWidth: T.col, margin: '0 auto', position: 'relative' }}>
      {/* Availability badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: T.accent, boxShadow: '0 0 10px #22d3ee', animation: 'pulseGlow 2s ease-in-out infinite' }} />
        <span style={{ color: T.t4, fontSize: 12, fontFamily: T.fMono, letterSpacing: '.04em' }}>Available for opportunities</span>
      </div>

      {/* Name — glitches in on load. Mono keeps the developer voice. */}
      <h1 suppressHydrationWarning style={{ fontFamily: T.fMono, fontWeight: 700, fontSize: 'clamp(52px,9vw,104px)', color: T.t1, letterSpacing: '-.045em', lineHeight: 1, marginBottom: 22, userSelect: 'none' }}>
        {name}
      </h1>

      {/* Typing role */}
      <div style={{ fontFamily: T.fMono, fontSize: 'clamp(14px,1.6vw,18px)', color: T.t4, marginBottom: 36, minHeight: 28, display: 'flex', alignItems: 'center' }}>
        <span style={{ color: T.t6 }}>// </span>
        <span style={{ marginLeft: 8, color: T.t2 }}>{role}</span>
        <span style={{ marginLeft: 3, color: T.accent, animation: 'blinkEl 1s step-end infinite' }}>{'\u25ae'}</span>
      </div>

      {/* Personal tagline — serif gives it warmth */}
      <p style={{ fontFamily: T.fSerif, color: T.t2, fontSize: 'clamp(22px,2.6vw,30px)', lineHeight: 1.35, letterSpacing: '-.01em', maxWidth: 560, marginBottom: 48 }}>
        {CONFIG.heroTagline}
      </p>

      {/* CTAs — Resume is the primary action; the others are supporting */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <a href={CONFIG.resumeUrl} download
          onClick={() => playSound('click')}
          onMouseEnter={e => { e.currentTarget.style.background = '#67e8f9'; e.currentTarget.style.borderColor = '#67e8f9'; e.currentTarget.style.boxShadow = '0 0 24px rgba(34,211,238,.35)'; playSound('hover'); }}
          onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = '0 0 18px rgba(34,211,238,.22)'; }}
          style={{ padding: '13px 24px', border: `1px solid ${T.accent}`, background: T.accent, color: T.bg, fontFamily: T.fMono, fontSize: 13, fontWeight: 600, borderRadius: 4, textDecoration: 'none', transition: 'all .18s', letterSpacing: '.04em', boxShadow: '0 0 18px rgba(34,211,238,.22)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Download resume {'\u2193'}
        </a>
        <button onClick={() => scroll('projects')}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.t3; e.currentTarget.style.color = T.t1; playSound('hover'); }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.t3; }}
          style={{ padding: '12px 22px', border: `1px solid ${T.line}`, background: 'transparent', color: T.t3, fontFamily: T.fMono, fontSize: 13, borderRadius: 4, cursor: 'none', transition: 'all .18s', letterSpacing: '.02em' }}>
          View projects {'\u2192'}
        </button>
        <a href={`mailto:${CONFIG.email}`}
          onMouseEnter={e => { (e.currentTarget.style as any).color = T.t1; playSound('hover'); }}
          onMouseLeave={e => { (e.currentTarget.style as any).color = T.t3; }}
          style={{ color: T.t3, fontFamily: T.fMono, fontSize: 13, textDecoration: 'none', transition: 'color .18s', letterSpacing: '.02em' }}>
          Email {'\u2197'}
        </a>
      </div>

      {currently && !currently.startsWith('REPLACE') && (
        <div style={{ marginTop: 56, color: T.t4, fontFamily: T.fMono, fontSize: 12, display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <span style={{ color: T.t5, letterSpacing: '.16em', textTransform: 'uppercase', fontSize: 10 }}>Currently</span>
          <span style={{ color: T.t2, fontFamily: T.fSans }}>{currently}</span>
        </div>
      )}
    </section>
  );
}
