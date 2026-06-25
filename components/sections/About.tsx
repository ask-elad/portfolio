'use client';
import { CONFIG } from '@/lib/data/config';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function About() {
  return (
    <section id="about" style={{ padding: '100px 40px', maxWidth: 880, margin: '0 auto' }}>
      <SectionLabel>About</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 64 }}>
        <div>
          <p style={{ color: '#b0b0b0', lineHeight: 1.9, fontSize: 16, marginBottom: 22 }}>
            {CONFIG.about.paragraph1}
          </p>
          <p style={{ color: '#777', lineHeight: 1.9, fontSize: 15, marginBottom: 22 }}>
            {CONFIG.about.paragraph2}
          </p>
          {/* Tech line — replaces the skills grid */}
          <p style={{ color: '#555', lineHeight: 1.8, fontSize: 14, borderLeft: '2px solid #1c1c20', paddingLeft: 16 }}>
            {CONFIG.about.techLine}
          </p>
        </div>

        {/* Quick facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {CONFIG.about.facts.map(f => (
            <div key={f.label} style={{ borderBottom: '1px solid #1c1c20', paddingBottom: 16 }}>
              <div style={{ color: '#3a3a3a', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 5 }}>{f.label}</div>
              <div style={{ color: '#b0b0b0', fontSize: 14 }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
