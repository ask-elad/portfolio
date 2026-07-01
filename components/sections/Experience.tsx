'use client';
import { EXPERIENCE } from '@/lib/data/experience';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { T } from '@/lib/tokens';

export function Experience() {
  return (
    <section id="experience" style={{ padding: '120px 40px', maxWidth: T.col, margin: '0 auto' }}>
      <SectionLabel>Experience</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 32, padding: '32px 0', borderTop: `1px solid ${T.line}` }}>
            <div>
              <div style={{ color: i === 0 ? T.accent : T.t4, fontSize: 12, fontFamily: T.fMono, letterSpacing: '.04em' }}>{e.period}</div>
              <div style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, marginTop: 4, letterSpacing: '.08em', textTransform: 'uppercase' }}>{e.type}</div>
            </div>
            <div>
              <h3 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 24, color: T.t1, letterSpacing: '-.01em', lineHeight: 1.2, marginBottom: 4 }}>
                {e.role}
              </h3>
              <a href={e.companyUrl || '#'} target={e.companyUrl ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ color: T.accent, fontSize: 13, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.02em' }}>
                {e.company} \u2197
              </a>
              <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', gap: 12, color: T.t3, fontSize: 14, lineHeight: 1.65 }}>
                    <span style={{ color: T.t6, fontFamily: T.fMono, flexShrink: 0, marginTop: 2 }}>—</span>{b}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8 }}>
                {e.tech.map(t => (
                  <span key={t} style={{ fontSize: 11, fontFamily: T.fMono, color: T.t5, letterSpacing: '.04em' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
