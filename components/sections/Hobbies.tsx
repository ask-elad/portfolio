'use client';
import { useState, useEffect } from 'react';
import { CONFIG } from '@/lib/data/config';
import { CHESS_CONFIG, STANDUP_CONFIG, CUSTOM_HOBBIES, CustomHobby } from '@/lib/data/hobbies';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';

/* ───────── shared atoms ───────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: T.t5, fontSize: 10, fontFamily: T.fMono, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: T.t5, fontSize: 12, fontStyle: 'italic', fontFamily: T.fSerif, marginTop: 10, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function Tags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16 }}>
      {tags.map(t => (
        <span key={t} style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.04em' }}>— {t}</span>
      ))}
    </div>
  );
}

function Photo({ src, alt, ratio = '16/10' }: { src?: string; alt: string; ratio?: string }) {
  if (src) {
    return (
      <div style={{ width: '100%', aspectRatio: ratio, overflow: 'hidden', background: '#050506', borderRadius: 4 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .8s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
      </div>
    );
  }
  return (
    <div style={{ width: '100%', aspectRatio: ratio, borderRadius: 4, border: `1px dashed ${T.t6}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.t6, fontFamily: T.fMono, fontSize: 11, textAlign: 'center', padding: 12 }}>
      add a photo — set <code style={{ marginLeft: 4, color: T.t5 }}>image</code> in hobbies.ts
    </div>
  );
}

/* ───────── chess (live) ───────── */

interface ChessMode { last: { rating: number }; record: { win: number; loss: number; draw: number } }
interface ChessData { chess_rapid?: ChessMode; chess_blitz?: ChessMode; chess_bullet?: ChessMode }

function ChessFeature({ playSound }: { playSound: (t: SoundType) => void }) {
  const [data, setData] = useState<ChessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!CONFIG.social.chess || CONFIG.social.chess.startsWith('REPLACE')) { setLoading(false); return; }
    fetch(`/api/chess?username=${CONFIG.social.chess}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const modeData: Record<string, ChessMode | undefined> = {
    rapid: data?.chess_rapid, blitz: data?.chess_blitz, bullet: data?.chess_bullet,
  };
  const ratings = CHESS_CONFIG.showControls
    .map(c => ({ ctrl: c, m: modeData[c] }))
    .filter(x => x.m);

  return (
    <article style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'center', padding: '64px 0', borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
      <div>
        <Eyebrow>Hobby No. 01 — The board</Eyebrow>
        <h2 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 'clamp(36px,5vw,56px)', color: T.t1, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 22 }}>
          Chess, mostly to lose well.
        </h2>
        <p style={{ color: T.t3, fontSize: 16, lineHeight: 1.75, maxWidth: 460, marginBottom: 28 }}>
          {CHESS_CONFIG.line}
        </p>

        {loading && <div style={{ color: T.t6, fontFamily: T.fMono, fontSize: 12 }}>fetching ratings…</div>}

        {!loading && ratings.length > 0 && (
          <div style={{ display: 'flex', gap: 40, marginTop: 8 }}>
            {ratings.map(({ ctrl, m }) => (
              <div key={ctrl}>
                <div style={{ fontFamily: T.fSerif, fontSize: 40, color: T.t1, lineHeight: 1, letterSpacing: '-.02em' }}>{m!.last.rating}</div>
                <div style={{ color: T.t5, fontFamily: T.fMono, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', marginTop: 8 }}>{ctrl}</div>
              </div>
            ))}
          </div>
        )}

        {CONFIG.social.chess && !CONFIG.social.chess.startsWith('REPLACE') && (
          <a href={`https://chess.com/member/${CONFIG.social.chess}`} target="_blank" rel="noopener noreferrer"
            onClick={() => playSound('click')}
            onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
            onMouseLeave={e => { (e.currentTarget.style as any).color = T.t4; }}
            style={{ display: 'inline-block', marginTop: 28, color: T.t4, fontSize: 12, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
            chess.com/{CONFIG.social.chess} \u2197
          </a>
        )}
      </div>

      <div>
        <Photo src="/hobbies/chess.jpg" alt="Chess" ratio="4/5" />
        <Caption>Drop a photo at <code>/public/hobbies/chess.jpg</code>.</Caption>
      </div>
    </article>
  );
}

/* ───────── stand-up ───────── */

function StandupFeature({ playSound }: { playSound: (t: SoundType) => void }) {
  return (
    <article style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 56, alignItems: 'center', padding: '64px 0', borderBottom: `1px solid ${T.line}` }}>
      <div>
        <Photo src="/hobbies/standup.jpg" alt="Stand-up" ratio="4/5" />
        <Caption>Mic stand, bad lighting, perfect.</Caption>
      </div>
      <div>
        <Eyebrow>Hobby No. 02 — On stage</Eyebrow>
        <h2 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 'clamp(36px,5vw,56px)', color: T.t1, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 22 }}>
          Stand-up, when nerves allow.
        </h2>
        <p style={{ color: T.t3, fontSize: 16, lineHeight: 1.75, maxWidth: 460, marginBottom: 24 }}>
          {STANDUP_CONFIG.line}
        </p>

        {STANDUP_CONFIG.recordings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <Eyebrow>Selected recordings</Eyebrow>
            {STANDUP_CONFIG.recordings.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                onClick={() => playSound('click')}
                onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
                onMouseLeave={e => { (e.currentTarget.style as any).color = T.t3; }}
                style={{ color: T.t3, fontSize: 14, fontFamily: T.fSerif, textDecoration: 'none', transition: 'color .15s' }}>
                {r.title} <span style={{ color: T.t6, fontFamily: T.fMono, fontSize: 11 }}>· {r.platform}</span>
              </a>
            ))}
          </div>
        )}

        {STANDUP_CONFIG.upcoming.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Eyebrow>Upcoming</Eyebrow>
            {STANDUP_CONFIG.upcoming.map((u, i) => (
              <div key={i} style={{ color: T.t3, fontSize: 13, fontFamily: T.fMono, marginBottom: 4 }}>
                {u.date} — {u.venue}, {u.city}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ───────── custom hobbies (asymmetric) ───────── */

function CustomCard({ hobby, span }: { hobby: CustomHobby; span: number }) {
  const ratio = span === 2 ? '16/9' : '4/5';
  return (
    <article style={{ gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column' }}>
      <Photo src={hobby.image} alt={hobby.name} ratio={ratio} />
      {hobby.caption && <Caption>{hobby.caption}</Caption>}
      <div style={{ marginTop: 22 }}>
        {hobby.tagline && <Eyebrow>{hobby.tagline}</Eyebrow>}
        <h3 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: span === 2 ? 34 : 26, color: T.t1, letterSpacing: '-.01em', lineHeight: 1.15, marginBottom: 12 }}>
          <span style={{ marginRight: 10 }}>{hobby.emoji}</span>{hobby.name}
        </h3>
        <p style={{ color: T.t3, fontSize: 15, lineHeight: 1.7, maxWidth: 520 }}>{hobby.description}</p>
        {hobby.comments && hobby.comments.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {hobby.comments.map((c, i) => (
              <li key={i} style={{ color: T.t4, fontSize: 13, fontFamily: T.fMono, display: 'flex', gap: 10 }}>
                <span style={{ color: T.t6 }}>—</span>{c}
              </li>
            ))}
          </ul>
        )}
        <Tags tags={hobby.tags} />
      </div>
    </article>
  );
}

/* ───────── exported ───────── */

export function Hobbies({ playSound }: { playSound: (t: SoundType) => void }) {
  const sizeToSpan = (s?: string) => (s === 'lg' || s === 'xl') ? 2 : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ChessFeature playSound={playSound} />
      <StandupFeature playSound={playSound} />

      {CUSTOM_HOBBIES.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 56, rowGap: 96, padding: '72px 0',
        }}>
          {CUSTOM_HOBBIES.map(h => (
            <CustomCard key={h.id} hobby={h} span={sizeToSpan(h.size)} />
          ))}
        </div>
      )}

      {CUSTOM_HOBBIES.length === 0 && (
        <p style={{ marginTop: 56, color: T.t6, fontSize: 12, fontFamily: T.fMono }}>
          Add more hobbies in <code style={{ color: T.t4 }}>lib/data/hobbies.ts</code>. Mix <code style={{ color: T.t4 }}>size: 'lg'</code> with <code style={{ color: T.t4 }}>'md'</code> for an editorial rhythm.
        </p>
      )}
    </div>
  );
}
