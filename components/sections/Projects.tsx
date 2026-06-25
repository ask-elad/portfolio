'use client';
import { useState } from 'react';
import { PROJECTS } from '@/lib/data/projects';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoundType } from '@/hooks/useSound';

export function Projects({ playSound }: { playSound: (t: SoundType) => void }) {
  const allTags = ['All', ...Array.from(new Set(PROJECTS.flatMap(p => p.tags)))];
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));

  return (
    <section id="projects" style={{ padding: '100px 40px', maxWidth: 880, margin: '0 auto' }}>
      <SectionLabel>Projects</SectionLabel>

      {/* Filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 40 }}>
        {allTags.map(t => (
          <button key={t} onClick={() => { setFilter(t); playSound('click'); }} onMouseEnter={() => playSound('hover')}
            style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${filter === t ? 'rgba(34,211,238,.4)' : '#222'}`, background: filter === t ? 'rgba(34,211,238,.07)' : 'transparent', color: filter === t ? '#22d3ee' : '#444', fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', transition: 'all .15s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
        {filtered.map(p => (
          <div key={p.id}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,.28)'; e.currentTarget.style.transform = 'translateY(-3px)'; playSound('hover'); }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c20'; e.currentTarget.style.transform = 'translateY(0)'; }}
            style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, overflow: 'hidden', cursor: 'default', transition: 'border-color .2s, transform .2s' }}>
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '16/9', borderBottom: '1px solid #1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontFamily: 'monospace', fontSize: 11, textAlign: 'center', padding: 12 }}>
                add a screenshot \u2014 set <code style={{ color: '#333', marginLeft: 4 }}>image</code> in projects.ts
              </div>
            )}
            <div style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, color: '#e0e0e0' }}>{p.name}</span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 20, background: p.status === 'Live' ? 'rgba(34,211,238,.08)' : 'rgba(251,191,36,.08)', color: p.status === 'Live' ? '#22d3ee' : '#fbbf24', border: `1px solid ${p.status === 'Live' ? 'rgba(34,211,238,.2)' : 'rgba(251,191,36,.2)'}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                {p.status}
              </span>
            </div>
            <p style={{ color: '#555', fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>{p.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: p.url || p.github ? 14 : 0 }}>
              {p.tags.map(t => <span key={t} style={{ fontSize: 11, fontFamily: 'monospace', color: '#3a3a3a', padding: '2px 7px', background: '#131315', borderRadius: 4 }}>{t}</span>)}
            </div>
            {(p.url || p.github) && (
              <div style={{ display: 'flex', gap: 12 }}>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    onClick={() => playSound('click')}
                    onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
                    onMouseLeave={e => { (e.currentTarget.style as any).color = '#444'; }}
                    style={{ color: '#444', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none', transition: 'color .15s' }}>
                    live \u2197
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    onClick={() => playSound('click')}
                    onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
                    onMouseLeave={e => { (e.currentTarget.style as any).color = '#444'; }}
                    style={{ color: '#444', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none', transition: 'color .15s' }}>
                    github \u2197
                  </a>
                )}
              </div>
            )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
