'use client';
import { BLOG_POSTS, BLOG_URL } from '@/lib/data/blog';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoundType } from '@/hooks/useSound';

export function Blog({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <section id="blog" style={{ padding: '100px 40px', maxWidth: 880, margin: '0 auto' }}>
      <SectionLabel>Writing</SectionLabel>
      <div>
        {BLOG_POSTS.map(p => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { e.currentTarget.style.paddingLeft = '14px'; e.currentTarget.style.borderLeftColor = 'rgba(34,211,238,.3)'; playSound('hover'); }}
            onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0'; e.currentTarget.style.borderLeftColor = 'transparent'; }}
            style={{ padding: '20px 0', borderTop: '1px solid #1c1c20', borderLeft: '2px solid transparent', cursor: 'pointer', transition: 'all .2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#b0b0b0', fontSize: 15, marginBottom: 8, lineHeight: 1.5 }}>{p.title}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.tags.map(t => <span key={t} style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>#{t}</span>)}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 24 }}>
              <div style={{ color: '#444', fontSize: 12, fontFamily: 'monospace' }}>{p.date}</div>
              <div style={{ color: '#333', fontSize: 11, fontFamily: 'monospace', marginTop: 4 }}>{p.readTime} read</div>
            </div>
          </a>
        ))}
        <div style={{ borderTop: '1px solid #1c1c20', paddingTop: 20 }}>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#22d3ee'; playSound('hover'); }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#444'; }}
            style={{ color: '#444', fontSize: 13, fontFamily: 'monospace', textDecoration: 'none', transition: 'color .15s' }}>
            All posts \u2192
          </a>
        </div>
      </div>
    </section>
  );
}
