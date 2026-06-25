'use client';
import { useState, useEffect } from 'react';
import { CONFIG } from '@/lib/data/config';
import { CHESS_CONFIG, STANDUP_CONFIG, CUSTOM_HOBBIES } from '@/lib/data/hobbies';
import { SoundType } from '@/hooks/useSound';

interface ChessMode { last: { rating: number }; record: { win: number; loss: number; draw: number } }
interface ChessData { chess_rapid?: ChessMode; chess_blitz?: ChessMode; chess_bullet?: ChessMode }

// Uniform card shell — every hobby (live-stat ones and custom ones) renders inside this,
// so the page stays visually consistent no matter how many hobbies get added.
function HobbyCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10,
      padding: 22, transition: 'border-color .2s, transform .2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,.28)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c20'; }}>
      {children}
    </div>
  );
}

// Photo slot — shows the real image if one is set, otherwise a tasteful
// placeholder so it's obvious where to drop a picture in later.
function HobbyImage({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', marginBottom: 16, background: '#050506' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: '100%', aspectRatio: '16/9', borderRadius: 8, marginBottom: 16,
      border: '1px dashed #232327', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#2a2a2a', fontFamily: 'monospace', fontSize: 11, textAlign: 'center', padding: 12,
    }}>
      add a photo \u2014 set <code style={{ color: '#3a3a3a' }}>image</code> in hobbies.ts
    </div>
  );
}

function ChessCard({ playSound }: { playSound: (t: SoundType) => void }) {
  const [data, setData]     = useState<ChessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    if (!CONFIG.social.chess || CONFIG.social.chess.startsWith('REPLACE')) { setLoading(false); return; }
    fetch(`/api/chess?username=${CONFIG.social.chess}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const modeData: Record<string, ChessMode | undefined> = {
    rapid:  data?.chess_rapid,
    blitz:  data?.chess_blitz,
    bullet: data?.chess_bullet,
  };

  return (
    <HobbyCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>\u265f</span>
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#d0d0d0', fontSize: 15 }}>Chess</span>
      </div>
      <p style={{ color: '#666', fontSize: 14, lineHeight: 1.85, marginBottom: 20 }}>{CHESS_CONFIG.line}</p>

      {loading && <div style={{ color: '#2a2a2a', fontFamily: 'monospace', fontSize: 12 }}>fetching stats...</div>}
      {error   && <div style={{ color: '#2a2a2a', fontFamily: 'monospace', fontSize: 12 }}>stats unavailable</div>}

      {!loading && !error && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CHESS_CONFIG.showControls.map(ctrl => {
            const m = modeData[ctrl];
            if (!m) return null;
            const total = m.record.win + m.record.loss + m.record.draw;
            const wr = total > 0 ? Math.round((m.record.win / total) * 100) : 0;
            return (
              <div key={ctrl} style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: '#444', fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>{ctrl}</span>
                  <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 24, fontWeight: 700 }}>{m.last.rating}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ color: '#4ade80', fontSize: 12, fontFamily: 'monospace' }}>W {m.record.win}</span>
                  <span style={{ color: '#f87171', fontSize: 12, fontFamily: 'monospace' }}>L {m.record.loss}</span>
                  <span style={{ color: '#555',    fontSize: 12, fontFamily: 'monospace' }}>D {m.record.draw}</span>
                  <span style={{ color: '#444',    fontSize: 12, fontFamily: 'monospace', marginLeft: 'auto' }}>{wr}% WR</span>
                </div>
              </div>
            );
          })}
          <a href={`https://chess.com/member/${CONFIG.social.chess}`} target="_blank" rel="noopener noreferrer"
            onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
            onMouseLeave={e => { (e.currentTarget.style as any).color = '#3a3a3a'; }}
            style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none', marginTop: 4, transition: 'color .15s' }}>
            chess.com/{CONFIG.social.chess} \u2197
          </a>
        </div>
      )}
    </HobbyCard>
  );
}

function StandupCard({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <HobbyCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>\U0001f3a4</span>
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#d0d0d0', fontSize: 15 }}>Stand-up Comedy</span>
      </div>
      <p style={{ color: '#666', fontSize: 14, lineHeight: 1.85, marginBottom: 20 }}>{STANDUP_CONFIG.line}</p>

      {STANDUP_CONFIG.recordings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {STANDUP_CONFIG.recordings.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
              onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
              onMouseLeave={e => { (e.currentTarget.style as any).color = '#444'; }}
              style={{ color: '#444', fontSize: 13, fontFamily: 'monospace', textDecoration: 'none', display: 'flex', gap: 8, alignItems: 'center', transition: 'color .15s' }}>
              <span style={{ color: '#2a2a2a' }}>\u203a</span>
              {r.title} <span style={{ color: '#2a2a2a' }}>({r.platform})</span>
            </a>
          ))}
        </div>
      )}

      {STANDUP_CONFIG.upcoming.length > 0 && (
        <div>
          <div style={{ color: '#2a2a2a', fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>Upcoming</div>
          {STANDUP_CONFIG.upcoming.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, color: '#555', fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: '#22d3ee', fontFamily: 'monospace' }}>{s.date}</span>
              <span>{s.venue}</span>
              <span style={{ color: '#3a3a3a' }}>{s.city}</span>
            </div>
          ))}
        </div>
      )}

      {STANDUP_CONFIG.recordings.length === 0 && STANDUP_CONFIG.upcoming.length === 0 && (
        <div style={{ color: '#2a2a2a', fontSize: 12, fontFamily: 'monospace' }}>recordings coming soon</div>
      )}
    </HobbyCard>
  );
}

export function Hobbies({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
      <ChessCard playSound={playSound} />
      <StandupCard playSound={playSound} />
      {/* Custom hobbies — add as many as you like in lib/data/hobbies.ts, no code changes needed */}
      {CUSTOM_HOBBIES.map(h => (
        <HobbyCard key={h.id}>
          <HobbyImage src={h.image} alt={h.name} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>{h.emoji}</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#d0d0d0', fontSize: 15 }}>{h.name}</span>
          </div>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.85, marginBottom: h.comments?.length ? 14 : 16 }}>{h.description}</p>
          {h.comments && h.comments.length > 0 && (
            <ul style={{ margin: 0, marginBottom: 16, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {h.comments.map((c, i) => (
                <li key={i} style={{ color: '#555', fontSize: 13, fontFamily: 'monospace', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#2a2a2a' }}>\u203a</span>{c}
                </li>
              ))}
            </ul>
          )}
          {h.links?.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
              onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
              onMouseLeave={e => { (e.currentTarget.style as any).color = '#444'; }}
              style={{ color: '#444', fontSize: 13, fontFamily: 'monospace', textDecoration: 'none', display: 'block', marginBottom: 6, transition: 'color .15s' }}>
              \u203a {l.label}
            </a>
          ))}
        </HobbyCard>
      ))}
    </div>
  );
}
