'use client';
import { CONFIG } from '@/lib/data/config';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { T } from '@/lib/tokens';

export function About() {
  return (
    <section id="about" style={{ padding: '120px 40px', maxWidth: T.col, margin: '0 auto' }}>
      <SectionLabel>About</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 72 }}>
        <div>
          <p style={{ fontFamily: T.fSerif, color: T.t1, lineHeight: 1.4, fontSize: 26, letterSpacing: '-.01em', marginBottom: 28 }}>
            {CONFIG.about.paragraph1}
          </p>
          <p style={{ color: T.t3, lineHeight: 1.75, fontSize: 16, marginBottom: 28 }}>
            {CONFIG.about.paragraph2}
          </p>
          <p style={{ color: T.t4, lineHeight: 1.7, fontSize: 14, fontFamily: T.fMono, borderLeft: `2px solid ${T.line}`, paddingLeft: 16 }}>
            {CONFIG.about.techLine}
          </p>
        </div>

        <dl style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: 0 }}>
          {CONFIG.about.facts.map((f, i) => (
            <div key={f.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 18, padding: '14px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.line}` }}>
              <dt style={{ color: T.t5, fontSize: 10, fontFamily: T.fMono, textTransform: 'uppercase', letterSpacing: '.14em', paddingTop: 3 }}>{f.label}</dt>
              <dd style={{ color: T.t2, fontSize: 14, lineHeight: 1.5, margin: 0 }}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
