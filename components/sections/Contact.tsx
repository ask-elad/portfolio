'use client';
import { CONFIG } from '@/lib/data/config';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';

const LINKS = [
  { label: 'GitHub',   href: () => `https://github.com/${CONFIG.social.github}` },
  { label: 'LinkedIn', href: () => CONFIG.social.linkedin },
  { label: 'Twitter',  href: () => CONFIG.social.twitter },
];

export function Contact({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <section id="contact" style={{ padding: '120px 40px 180px', maxWidth: T.col, margin: '0 auto' }}>
      <SectionLabel>Get in touch</SectionLabel>
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
        style={{ display: 'inline-block', padding: '14px 26px', border: `1px solid ${T.accent}`, color: T.accent, textDecoration: 'none', fontFamily: T.fMono, fontSize: 13, borderRadius: 4, letterSpacing: '.02em', transition: 'all .18s', marginBottom: 32 }}>
        {CONFIG.email} \u2192
      </a>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {LINKS.map(l => (
          <a key={l.label} href={l.href()} target="_blank" rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { (e.currentTarget.style as any).color = T.t1; playSound('hover'); }}
            onMouseLeave={e => { (e.currentTarget.style as any).color = T.t4; }}
            style={{ color: T.t4, textDecoration: 'none', fontFamily: T.fMono, fontSize: 13, transition: 'color .18s', letterSpacing: '.04em' }}>
            {l.label} \u2197
          </a>
        ))}
      </div>
    </section>
  );
}
