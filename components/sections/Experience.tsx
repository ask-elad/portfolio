'use client';
import { EXPERIENCE } from '@/lib/data/experience';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Experience() {
  return (
    <section id="experience" style={{ padding: '100px 40px', maxWidth: 880, margin: '0 auto' }}>
      <SectionLabel>Experience</SectionLabel>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Timeline spine */}
        <div style={{ position: 'absolute', left: 0, top: 6, bottom: 0, width: 1, background: 'linear-gradient(to bottom, rgba(34,211,238,.6), #1c1c20 90%)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
          {EXPERIENCE.map((e, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {/* Timeline dot */}
              <div style={{ position: 'absolute', left: -33, top: 5, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? '#22d3ee' : '#1c1c20', border: `2px solid ${i === 0 ? '#22d3ee' : '#2a2a2a'}`, boxShadow: i === 0 ? '0 0 12px rgba(34,211,238,.5)' : 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 16, color: '#e0e0e0' }}>{e.role}</div>
                  <a href={e.companyUrl || '#'} target={e.companyUrl ? '_blank' : undefined} rel="noopener noreferrer"
                    style={{ color: '#22d3ee', fontSize: 14, marginTop: 3, display: 'block', textDecoration: 'none' }}>
                    {e.company}
                  </a>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#555', fontSize: 12, fontFamily: 'monospace' }}>{e.period}</div>
                  <div style={{ color: '#3a3a3a', fontSize: 11, fontFamily: 'monospace', marginTop: 3 }}>{e.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                {e.bullets.map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, color: '#666', fontSize: 14 }}>
                    <span style={{ color: '#252525', fontFamily: 'monospace', flexShrink: 0 }}>\u2014</span>{b}
                  </div>
                ))}
              </div>
              {/* Tech tags — skills live here */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {e.tech.map(t => (
                  <span key={t} style={{ fontSize: 11, fontFamily: 'monospace', color: '#3a3a3a', padding: '2px 8px', background: '#0e0e10', border: '1px solid #1a1a1a', borderRadius: 4 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
