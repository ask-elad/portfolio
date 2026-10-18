'use client';
import { useState } from 'react';
import { CONFIG } from '@/lib/data/config';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';

const LINKS = [
  { label: 'github',   handle: () => `@${CONFIG.social.github}`,                 logo: '/logos/github',   href: () => `https://github.com/${CONFIG.social.github}` },
  { label: 'linkedin', handle: () => '/in/' + (CONFIG.social.linkedin.split('/in/')[1]?.replace(/\/$/, '') ?? ''), logo: '/logos/linkedin', href: () => CONFIG.social.linkedin },
  { label: 'twitter',  handle: () => '@' + (CONFIG.social.twitter.split('/').filter(Boolean).pop() ?? ''),         logo: '/logos/twitter',  href: () => CONFIG.social.twitter },
];

// Walks through candidate extensions until one loads. Resilient to the
// browser caching a 404 or React dropping the onError on hydration.
const EXT_ORDER = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
function SocialIcon({ base }: { base: string }) {
  const [i, setI] = useState(0);
  if (i >= EXT_ORDER.length) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}.${EXT_ORDER[i]}`}
      alt=""
      onError={() => setI(n => n + 1)}
      style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: 2 }}
    />
  );
}

export function Contact({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <section id="contact" style={{ padding: '120px 40px 180px', maxWidth: T.col, margin: '0 auto' }}>
      <h2 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 'clamp(40px,6vw,72px)', color: T.t1, letterSpacing: '-.025em', lineHeight: 1.05, marginBottom: 28 }}>
        Let&rsquo;s build something good.
      </h2>
      <p style={{ color: T.t3, fontSize: 17, marginBottom: 48, maxWidth: 520, lineHeight: 1.7 }}>
        {CONFIG.contactLine}
      </p>

      <a href={`mailto:${CONFIG.email}`}
        onClick={() => playSound('click')}
        onMouseEnter={e => { (e.currentTarget.style as any).background = T.accent; (e.currentTarget.style as any).color = T.bg; playSound('hover'); }}
        onMouseLeave={e => { (e.currentTarget.style as any).background = 'transparent'; (e.currentTarget.style as any).color = T.accent; }}
        style={{ display: 'inline-block', padding: '14px 26px', border: `1px solid ${T.accent}`, color: T.accent, textDecoration: 'none', fontFamily: T.fMono, fontSize: 13, borderRadius: 2, letterSpacing: '.02em', transition: 'all .18s', marginBottom: 32 }}>
        {CONFIG.email} \u2192
      </a>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {LINKS.map(l => (
          <a key={l.label} href={l.href()} target="_blank" rel="noopener noreferrer"
            aria-label={l.label}
            onClick={() => playSound('click')}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = T.accent;
              el.style.background = 'rgba(74,222,128,0.06)';
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 8px 24px -12px rgba(74,222,128,0.5)';
              const arrow = el.querySelector('[data-arrow]') as HTMLElement | null;
              if (arrow) { arrow.style.color = T.accent; arrow.style.transform = 'translate(2px, -2px)'; }
              const handle = el.querySelector('[data-handle]') as HTMLElement | null;
              if (handle) handle.style.color = T.t1;
              playSound('hover');
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = T.line;
              el.style.background = T.ink;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
              const arrow = el.querySelector('[data-arrow]') as HTMLElement | null;
              if (arrow) { arrow.style.color = T.t5; arrow.style.transform = 'translate(0, 0)'; }
              const handle = el.querySelector('[data-handle]') as HTMLElement | null;
              if (handle) handle.style.color = T.t3;
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px 10px 12px', border: `1px solid ${T.line}`, borderRadius: 2, background: T.ink, textDecoration: 'none', fontFamily: T.fMono, fontSize: 13, transition: 'border-color .2s, background .2s, transform .2s, box-shadow .2s' }}>
            <SocialIcon base={l.logo} />
            <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ color: T.t5, fontSize: 10, letterSpacing: '.08em' }}>{l.label}</span>
              <span data-handle style={{ color: T.t3, fontSize: 13, transition: 'color .2s' }}>{l.handle()}</span>
            </span>
            <span data-arrow style={{ color: T.t5, marginLeft: 2, transition: 'color .2s, transform .2s' }}>{'↗'}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
