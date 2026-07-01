'use client';
import { useState } from 'react';
import { PROJECTS } from '@/lib/data/projects';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';

const STATUS_COLOR: Record<string, string> = { Live: T.accent, Building: '#fbbf24', Archived: T.t4 };

function StatusDot({ status }: { status: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: STATUS_COLOR[status] || T.t4, fontFamily: T.fMono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', boxShadow: status === 'Live' ? '0 0 6px currentColor' : 'none' }} />
      {status}
    </span>
  );
}

function ProjectLinks({ p, playSound }: { p: any; playSound: (t: SoundType) => void }) {
  return (
    <div style={{ display: 'flex', gap: 18 }}>
      {p.url && (
        <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => playSound('click')}
          onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
          onMouseLeave={e => { (e.currentTarget.style as any).color = T.t3; }}
          style={{ color: T.t3, fontSize: 12, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
          Live \u2197
        </a>
      )}
      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={() => playSound('click')}
          onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
          onMouseLeave={e => { (e.currentTarget.style as any).color = T.t3; }}
          style={{ color: T.t3, fontSize: 12, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
          Source \u2197
        </a>
      )}
    </div>
  );
}

export function Projects({ playSound }: { playSound: (t: SoundType) => void }) {
  const allTags = ['All', ...Array.from(new Set(PROJECTS.flatMap(p => p.tags)))];
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));
  const [featured, ...rest] = filtered;

  return (
    <section id="projects" style={{ padding: '120px 40px', maxWidth: T.col, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <SectionLabel>Selected work</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 36 }}>
          {allTags.map(t => (
            <button key={t} onClick={() => { setFilter(t); playSound('click'); }} onMouseEnter={() => playSound('hover')}
              style={{ padding: '4px 10px', borderRadius: 999, border: 'none', background: 'transparent', color: filter === t ? T.accent : T.t4, fontSize: 11, fontFamily: T.fMono, cursor: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
              {filter === t ? '•' : ' '} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Featured project */}
      {featured && (
        <article style={{ marginBottom: 64 }}>
          {featured.image ? (
            <div style={{ overflow: 'hidden', borderRadius: 6, marginBottom: 24, border: `1px solid ${T.line}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.image} alt={featured.name} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', transition: 'transform .6s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/7', borderRadius: 6, marginBottom: 24, border: `1px dashed ${T.t6}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.t5, fontFamily: T.fMono, fontSize: 11 }}>
              featured screenshot \u2014 set <code style={{ marginLeft: 6, color: T.t4 }}>image</code> in projects.ts
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, gap: 16, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 'clamp(28px,3.6vw,40px)', color: T.t1, letterSpacing: '-.02em', lineHeight: 1.1 }}>
              {featured.name}
            </h3>
            <StatusDot status={featured.status} />
          </div>
          <p style={{ color: T.t3, fontSize: 16, lineHeight: 1.7, maxWidth: 580, marginBottom: 18 }}>
            {featured.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
            {featured.tags.map(t => (
              <span key={t} style={{ fontSize: 11, fontFamily: T.fMono, color: T.t4, letterSpacing: '.04em' }}>{t}</span>
            ))}
          </div>
          <ProjectLinks p={featured} playSound={playSound} />
        </article>
      )}

      {/* Rest of projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 44, rowGap: 56, borderTop: `1px solid ${T.line}`, paddingTop: 56 }}>
        {rest.map(p => (
          <article key={p.id}
            onMouseEnter={() => playSound('hover')}
            style={{ display: 'flex', flexDirection: 'column' }}>
            {p.image && (
              <div style={{ overflow: 'hidden', borderRadius: 4, marginBottom: 18, border: `1px solid ${T.line}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', transition: 'transform .5s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
              <h4 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 22, color: T.t1, letterSpacing: '-.01em', lineHeight: 1.2 }}>
                {p.name}
              </h4>
              <span style={{ color: T.t5, fontFamily: T.fMono, fontSize: 11 }}>{p.year}</span>
            </div>
            <StatusDot status={p.status} />
            <p style={{ color: T.t3, fontSize: 14, lineHeight: 1.65, margin: '12px 0 14px' }}>{p.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 14, marginTop: 'auto' }}>
              {p.tags.map(t => <span key={t} style={{ fontSize: 11, fontFamily: T.fMono, color: T.t5 }}>{t}</span>)}
            </div>
            <ProjectLinks p={p} playSound={playSound} />
          </article>
        ))}
      </div>
    </section>
  );
}
