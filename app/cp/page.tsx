'use client';
import { useState, useEffect } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { CONFIG } from '@/lib/data/config';
import { T } from '@/lib/tokens';
import { fetchCached } from '@/lib/dataCache';

function cfTier(r: number) {
  if (r >= 2400) return { color: '#ff4d4d', label: 'International Grandmaster' };
  if (r >= 2100) return { color: '#ff8c00', label: 'Master' };
  if (r >= 1900) return { color: '#aa00aa', label: 'Candidate Master' };
  if (r >= 1600) return { color: '#3b82f6', label: 'Expert' };
  if (r >= 1400) return { color: '#03a89e', label: 'Specialist' };
  if (r >= 1200) return { color: '#22c55e', label: 'Pupil' };
  return { color: '#94a3b8', label: 'Newbie' };
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div style={{ fontFamily: T.fSerif, fontSize: 44, color: accent || T.t1, letterSpacing: '-.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 8 }}>{label}</div>
    </div>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length < 2) return null;
  const w = 480, h = 96, pad = 4;
  const min = Math.min(...points), max = Math.max(...points);
  const range = Math.max(1, max - min);
  const stepX = (w - pad * 2) / (points.length - 1);
  const path = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = pad + (h - pad * 2) * (1 - (p - min) / range);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const area = `${path} L${(pad + (points.length - 1) * stepX).toFixed(1)},${h - pad} L${pad},${h - pad} Z`;
  const lastX = pad + (points.length - 1) * stepX;
  const lastY = pad + (h - pad * 2) * (1 - (points[points.length - 1] - min) / range);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
      <circle cx={lastX} cy={lastY} r={6} fill={color} opacity={0.25} />
    </svg>
  );
}

function DifficultyBar({ e, m, h }: { e: number; m: number; h: number }) {
  const total = Math.max(1, e + m + h);
  return (
    <div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: T.line }}>
        <div style={{ width: `${(e / total) * 100}%`, background: '#22d3ee' }} />
        <div style={{ width: `${(m / total) * 100}%`, background: '#f59e0b' }} />
        <div style={{ width: `${(h / total) * 100}%`, background: '#ef4444' }} />
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 12, color: T.t4, fontFamily: T.fMono, fontSize: 11, letterSpacing: '.04em' }}>
        <span><span style={{ color: '#22d3ee' }}>{e}</span> easy</span>
        <span><span style={{ color: '#f59e0b' }}>{m}</span> medium</span>
        <span><span style={{ color: '#ef4444' }}>{h}</span> hard</span>
      </div>
    </div>
  );
}

export default function CPPage() {
  const [lc, setLc] = useState<any>(null);
  const [cf, setCf] = useState<any>(null);

  useEffect(() => {
    if (CONFIG.social.leetcode && !CONFIG.social.leetcode.startsWith('REPLACE'))
      fetchCached(`/api/leetcode?username=${CONFIG.social.leetcode}`).then(setLc).catch(() => {});
    if (CONFIG.social.codeforces && !CONFIG.social.codeforces.startsWith('REPLACE'))
      fetchCached(`/api/codeforces?handle=${CONFIG.social.codeforces}`).then(setCf).catch(() => {});
  }, []);

  const lcUser    = lc?.matchedUser;
  const lcContest = lc?.userContestRanking;
  const acSubs    = lcUser?.submitStats?.acSubmissionNum ?? [];
  const solved    = { Easy: 0, Medium: 0, Hard: 0 };
  acSubs.forEach((s: any) => { if (s.difficulty in solved) solved[s.difficulty as keyof typeof solved] = s.count; });
  const totalSolved = solved.Easy + solved.Medium + solved.Hard;

  const cfInfo    = cf?.info;
  const cfCurrent = cfInfo?.rating ?? 0;
  const cfMax     = cfInfo?.maxRating ?? 0;
  const cfRating: any[] = cf?.rating ?? [];
  const cfSeries  = cfRating.map(r => r.newRating as number);
  const tier      = cfTier(cfCurrent);

  const blurb = CONFIG.cp.blurb && !CONFIG.cp.blurb.startsWith('REPLACE') ? CONFIG.cp.blurb : undefined;

  return (
    <PageShell eyebrow="Competitive Programming" title="Problem-solving, kept honest" subtitle={blurb}>
      {({ playSound }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 16 }}>
          {/* LeetCode */}
          <section style={{ borderTop: `1px solid ${T.line}`, paddingTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
              <h2 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 26, color: T.t1, letterSpacing: '-.01em' }}>LeetCode</h2>
              <a href={`https://leetcode.com/${CONFIG.social.leetcode}`} target="_blank" rel="noopener noreferrer"
                onClick={() => playSound('click')}
                onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
                onMouseLeave={e => { (e.currentTarget.style as any).color = T.t5; }}
                style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
                @{CONFIG.social.leetcode} {'\u2197'}
              </a>
            </div>
            {!lcUser ? (
              <div style={{ color: T.t6, fontFamily: T.fMono, fontSize: 12 }}>loading…</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                <div style={{ display: 'flex', gap: 40, alignItems: 'baseline' }}>
                  <Stat label="Contest rating"
                    value={lcContest?.rating ? String(Math.round(lcContest.rating)) : '—'}
                    accent={lcContest?.rating ? '#f59e0b' : undefined} />
                  {lcContest?.attendedContestsCount != null && (
                    <div style={{ color: T.t4, fontFamily: T.fMono, fontSize: 12 }}>
                      {lcContest.attendedContestsCount} contests
                      {lcContest.topPercentage != null && (
                        <span style={{ color: T.t5 }}> · top {lcContest.topPercentage.toFixed(1)}%</span>
                      )}
                    </div>
                  )}
                </div>
                <Stat label="Problems solved" value={String(totalSolved)} accent={T.accent} />
                <DifficultyBar e={solved.Easy} m={solved.Medium} h={solved.Hard} />
              </div>
            )}
          </section>

          {/* Codeforces */}
          <section style={{ borderTop: `1px solid ${T.line}`, paddingTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
              <h2 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 26, color: T.t1, letterSpacing: '-.01em' }}>Codeforces</h2>
              <a href={`https://codeforces.com/profile/${CONFIG.social.codeforces}`} target="_blank" rel="noopener noreferrer"
                onClick={() => playSound('click')}
                onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
                onMouseLeave={e => { (e.currentTarget.style as any).color = T.t5; }}
                style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
                @{CONFIG.social.codeforces} {'\u2197'}
              </a>
            </div>
            {!cfInfo ? (
              <div style={{ color: T.t6, fontFamily: T.fMono, fontSize: 12 }}>loading…</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                <div>
                  <Stat label="Current rating" value={String(cfCurrent)} accent={tier.color} />
                  <div style={{ marginTop: 10, color: tier.color, fontFamily: T.fMono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>{tier.label}</div>
                </div>
                {cfSeries.length > 1 && (
                  <div>
                    <div style={{ color: T.t5, fontSize: 10, fontFamily: T.fMono, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10 }}>
                      Rating over {cfSeries.length} contests
                    </div>
                    <Sparkline points={cfSeries} color={T.accent} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 24, color: T.t4, fontFamily: T.fMono, fontSize: 12, letterSpacing: '.04em' }}>
                  <span>peak <span style={{ color: T.accent }}>{cfMax}</span></span>
                  <span><span style={{ color: T.accent }}>{cfRating.length}</span> contests</span>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
}