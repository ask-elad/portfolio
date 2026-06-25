'use client';
import { CONFIG } from '@/lib/data/config';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoundType } from '@/hooks/useSound';

const LINKS = [
  { label: 'Email',    icon: '\u2709', href: () => `mailto:${CONFIG.email}` },
  { label: 'GitHub',   icon: 'gh',    href: () => `https://github.com/${CONFIG.social.github}` },
  { label: 'LinkedIn', icon: 'in',    href: () => CONFIG.social.linkedin },
  { label: 'Twitter',  icon: '\u{1D54F}',   href: () => CONFIG.social.twitter },
];

export function Contact({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <section id="contact" style={{ padding: '100px 40px 160px', maxWidth: 880, margin: '0 auto' }}>
      <SectionLabel>Contact</SectionLabel>
      <h2 style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 'clamp(32px,5vw,64px)', color: '#f0f0f0', letterSpacing: '-.035em', marginBottom: 16 }}>
        Let&#39;s build something.
      </h2>
      <p style={{ color: '#666', fontSize: 16, marginBottom: 52, maxWidth: 460, lineHeight: 1.85 }}>
        {CONFIG.contactLine}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {LINKS.map(l => (
          <a key={l.label} href={l.href()} target={l.label !== 'Email' ? '_blank' : undefined} rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { (e.currentTarget.style as any).borderColor = 'rgba(34,211,238,.4)'; (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
            onMouseLeave={e => { (e.currentTarget.style as any).borderColor = '#2a2a2a'; (e.currentTarget.style as any).color = '#666'; }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: '1px solid #2a2a2a', borderRadius: 6, color: '#666', textDecoration: 'none', fontFamily: 'monospace', fontSize: 13, transition: 'all .18s' }}>
            <span style={{ fontSize: 12 }}>{l.icon}</span>{l.label}
          </a>
        ))}
      </div>
    </section>
  );
}
