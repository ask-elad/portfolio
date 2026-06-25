'use client';
import { useGlitch } from '@/hooks/useGlitch';
import { useTyping } from '@/hooks/useTyping';
import { CONFIG } from '@/lib/data/config';
import { SoundType } from '@/hooks/useSound';

export function Hero({ playSound }: { playSound: (t: SoundType) => void }) {
  const name = useGlitch(CONFIG.name || 'Dev.Name', 900, 250);
  const role = useTyping(CONFIG.roles);

  const scroll = (id: string) => {
    playSound('click');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 40px 60px', maxWidth: 880, margin: '0 auto', position: 'relative' }}>
      {/* Availability badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 44 }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px #22d3ee', animation: 'pulseGlow 2s ease-in-out infinite' }} />
        <span style={{ color: '#666', fontSize: 13, fontFamily: 'monospace' }}>Available for opportunities</span>
      </div>

      {/* Name — glitches in on load */}
      <h1 suppressHydrationWarning style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 'clamp(52px,9vw,100px)', color: '#f0f0f0', letterSpacing: '-.04em', lineHeight: 1, marginBottom: 20, userSelect: 'none' }}>
        {name}
      </h1>

      {/* Typing role */}
      <div style={{ fontFamily: 'monospace', fontSize: 'clamp(15px,2vw,22px)', color: '#555', marginBottom: 28, minHeight: 32, display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#2a2a2a' }}>// </span>
        <span style={{ marginLeft: 8, color: '#b0b0b0' }}>{role}</span>
        <span style={{ marginLeft: 2, color: '#22d3ee', animation: 'blinkEl 1s step-end infinite' }}>\u25ae</span>
      </div>

      {/* Personal tagline */}
      <p style={{ color: '#666', fontSize: 16, lineHeight: 1.85, maxWidth: 500, marginBottom: 52 }}>
        {CONFIG.heroTagline}
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => scroll('projects')}
            onMouseEnter={e => { e.currentTarget.style.background = '#22d3ee'; e.currentTarget.style.color = '#080808'; playSound('hover'); }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#22d3ee'; }}
            style={{ padding: '11px 24px', border: '1px solid #22d3ee', background: 'transparent', color: '#22d3ee', fontFamily: 'monospace', fontSize: 14, borderRadius: 6, cursor: 'pointer', transition: 'all .18s' }}>
            View Projects \u2192
          </button>
          <a href={CONFIG.resumeUrl} download
            onClick={() => playSound('click')}
            onMouseEnter={e => { (e.currentTarget.style as any).background = '#141416'; (e.currentTarget.style as any).color = '#b0b0b0'; playSound('hover'); }}
            onMouseLeave={e => { (e.currentTarget.style as any).background = 'transparent'; (e.currentTarget.style as any).color = '#555'; }}
            style={{ padding: '11px 24px', border: '1px solid #2a2a2a', background: 'transparent', color: '#555', fontFamily: 'monospace', fontSize: 14, borderRadius: 6, cursor: 'pointer', transition: 'all .18s', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Resume
          </a>
        </div>
        <a href={`mailto:${CONFIG.email}`}
          onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
          onMouseLeave={e => { (e.currentTarget.style as any).color = '#555'; }}
          style={{ color: '#555', fontFamily: 'monospace', fontSize: 14, textDecoration: 'none', transition: 'color .18s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Get in touch \u2192
        </a>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 36, left: 40, color: '#252525', fontSize: 11, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}>\u2193</span>
        <span>scroll</span>
      </div>
    </section>
  );
}
