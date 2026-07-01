'use client';
import { BLOG_POSTS, BLOG_URL } from '@/lib/data/blog';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';

export function Blog({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <section id="blog" style={{ padding: '120px 40px', maxWidth: T.col, margin: '0 auto' }}>
      <SectionLabel>Writing</SectionLabel>
      <div>
        {BLOG_POSTS.map((p, i) => (
          <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { const h = e.currentTarget.querySelector('h4') as HTMLElement | null; if (h) h.style.color = T.accent; playSound('hover'); }}
            onMouseLeave={e => { const h = e.currentTarget.querySelector('h4') as HTMLElement | null; if (h) h.style.color = T.t1; }}
            style={{ padding: '26px 0', borderTop: `1px solid ${T.line}`, borderBottom: i === BLOG_POSTS.length - 1 ? `1px solid ${T.line}` : 'none', cursor: 'none', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'baseline', textDecoration: 'none' }}>
            <div>
              <h4 style={{ fontFamily: T.fSerif, fontWeight: 400, color: T.t1, fontSize: 22, letterSpacing: '-.01em', lineHeight: 1.25, marginBottom: 8, transition: 'color .15s' }}>{p.title}</h4>
              <div style={{ display: 'flex', gap: 14, color: T.t5, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.04em' }}>
                {p.tags.map(t => <span key={t}>{t.toLowerCase()}</span>)}
              </div>
            </div>
            <div style={{ textAlign: 'right', color: T.t4, fontSize: 12, fontFamily: T.fMono, whiteSpace: 'nowrap' }}>
              <div>{p.date}</div>
              <div style={{ color: T.t5, marginTop: 4 }}>{p.readTime}</div>
            </div>
          </a>
        ))}
        <div style={{ paddingTop: 24 }}>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = T.accent; playSound('hover'); }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = T.t3; }}
            style={{ color: T.t3, fontSize: 13, fontFamily: T.fMono, textDecoration: 'none', transition: 'color .15s', letterSpacing: '.04em' }}>
            All posts \u2192
          </a>
        </div>
      </div>
    </section>
  );
}
