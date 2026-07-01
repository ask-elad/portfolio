'use client';
import { CONFIG } from '@/lib/data/config';
import { PageShell } from '@/components/layout/PageShell';
import { T } from '@/lib/tokens';

export default function NowPage() {
  const sections = [
    { label: 'Building', items: CONFIG.now.building },
    { label: 'Learning', items: CONFIG.now.learning },
    { label: 'Reading',  items: CONFIG.now.reading  },
  ];

  return (
    <PageShell eyebrow="Now" title="What I&rsquo;m focused on">
      {() => (
        <>
          <p style={{ color: T.t5, fontSize: 12, fontFamily: T.fMono, marginBottom: 56, letterSpacing: '.04em' }}>
            Last updated: {CONFIG.now.lastUpdated} \u00b7 {CONFIG.now.location}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sections.map((s, i) => (
              <div key={s.label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 40, padding: '32px 0', borderTop: i === 0 ? `1px solid ${T.line}` : 'none', borderBottom: `1px solid ${T.line}` }}>
                <h3 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 22, color: T.t1, letterSpacing: '-.01em', lineHeight: 1.2 }}>{s.label}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {s.items.map((item, j) => (
                    <li key={j} style={{ color: T.t2, fontSize: 15, lineHeight: 1.65 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 64, color: T.t6, fontSize: 12, fontFamily: T.fMono }}>
            Discovered only via \u2318 K. Updated whenever life turns a page.
          </p>
        </>
      )}
    </PageShell>
  );
}
