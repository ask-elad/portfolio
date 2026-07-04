'use client';
import { useState, useEffect, useRef } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { CONFIG } from '@/lib/data/config';
import { T } from '@/lib/tokens';
import { fetchCached, getCached } from '@/lib/dataCache';

const COLORS = ['#0e0e10','#0c4a6e','#0369a1','#0ea5e9','#22d3ee'];

function HeatMap({ weeks }: { weeks: { level: 0|1|2|3|4; date?: string; count?: number }[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 3, minWidth: 'fit-content' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((day, di) => (
              <div key={di} title={day.date ? `${day.count ?? 0} contributions on ${day.date}` : undefined}
                style={{ width: 11, height: 11, borderRadius: 2, background: COLORS[day.level] }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StaticHeatMap() {
  const ref = useRef<{ level: 0|1|2|3|4 }[][]>();
  if (!ref.current) {
    ref.current = Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => {
        const r = Math.random();
        return { level: (r < .3 ? 0 : r < .6 ? 1 : r < .8 ? 2 : r < .95 ? 3 : 4) as 0|1|2|3|4 };
      })
    );
  }
  return <HeatMap weeks={ref.current} />;
}

export default function GitHubPage() {
  const url = CONFIG.social.github && !CONFIG.social.github.startsWith('REPLACE')
    ? `/api/github?username=${CONFIG.social.github}` : null;

  const [gh, setGh]           = useState<any>(() => url ? getCached(url) : null);
  const [loading, setLoading] = useState(() => url ? !getCached(url) : false);

  useEffect(() => {
    if (!url) return;
    fetchCached(url).then(data => { setGh(data); setLoading(false); }).catch(() => setLoading(false));
  }, [url]);

  const user     = gh?.user;
  const allRepos = (gh?.repos ?? []) as any[];
  const pinned   = CONFIG.github.pinnedRepos ?? [];
  const featured = pinned.length
    ? pinned.map((n: string) => allRepos.find(r => r.name === n)).filter(Boolean).slice(0, 4)
    : [...allRepos].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()).slice(0, 4);

  let heatmapWeeks: { level: 0|1|2|3|4; date: string; count: number }[][] | null = null;
  if (gh?.contributions?.contributions) {
    const days = gh.contributions.contributions;
    const chunked: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7));
    heatmapWeeks = chunked;
  }

  const blurb = CONFIG.github.blurb && !CONFIG.github.blurb.startsWith('REPLACE') ? CONFIG.github.blurb : undefined;

  return (
    <PageShell eyebrow="GitHub" title="What I&rsquo;m shipping" subtitle={blurb}>
      {({ playSound }) => (
        <>
          {loading && <div style={{ color: T.t6, fontFamily: T.fMono, fontSize: 12 }}>loading…</div>}

          {!loading && (
            <>
              {user && (
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 56, paddingBottom: 32, borderBottom: `1px solid ${T.line}` }}>
                  {user.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt={user.login}
                      style={{ width: 72, height: 72, borderRadius: '50%', border: `1px solid ${T.line}`, background: T.line }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: T.fSerif, fontSize: 22, color: T.t1, letterSpacing: '-.01em' }}>
                        {user.name || user.login}
                      </span>
                      <span style={{ color: T.t5, fontFamily: T.fMono, fontSize: 12 }}>@{user.login}</span>
                    </div>
                    {user.bio && (
                      <p style={{ color: T.t3, fontSize: 13, margin: '6px 0 0', lineHeight: 1.55, maxWidth: 520 }}>{user.bio}</p>
                    )}
                    <div style={{ display: 'flex', gap: 22, marginTop: 12, color: T.t4, fontFamily: T.fMono, fontSize: 11, letterSpacing: '.06em' }}>
                      <span><span style={{ color: T.t2 }}>{user.public_repos ?? 0}</span> repos</span>
                      <span><span style={{ color: T.t2 }}>{user.followers ?? 0}</span> followers</span>
                      <span><span style={{ color: T.t2 }}>{user.following ?? 0}</span> following</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 64 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.14em', textTransform: 'uppercase' }}>Contribution rhythm — last 12 months</span>
                  {user && <span style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono }}>@{user.login}</span>}
                </div>
                {heatmapWeeks ? <HeatMap weeks={heatmapWeeks} /> : <StaticHeatMap />}
              </div>

              {featured.length > 0 && (
                <>
                  <div style={{ color: T.t5, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 24 }}>
                    {pinned.length ? 'Pinned' : 'Recent work'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {featured.map((r: any, i: number) => (
                      <a key={r.name} href={r.html_url} target="_blank" rel="noopener noreferrer"
                        onClick={() => playSound('click')}
                        onMouseEnter={e => { const h = e.currentTarget.querySelector('h3') as HTMLElement | null; if (h) h.style.color = T.accent; playSound('hover'); }}
                        onMouseLeave={e => { const h = e.currentTarget.querySelector('h3') as HTMLElement | null; if (h) h.style.color = T.t1; }}
                        style={{ padding: '28px 0', borderTop: `1px solid ${T.line}`, borderBottom: i === featured.length - 1 ? `1px solid ${T.line}` : 'none', textDecoration: 'none', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'baseline', cursor: 'none' }}>
                        <div>
                          <h3 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 24, color: T.t1, letterSpacing: '-.01em', lineHeight: 1.2, marginBottom: 8, transition: 'color .15s' }}>{r.name}</h3>
                          <p style={{ color: T.t3, fontSize: 14, lineHeight: 1.65, margin: 0, maxWidth: 520 }}>{r.description || 'No description.'}</p>
                        </div>
                        <div style={{ textAlign: 'right', color: T.t5, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.04em' }}>
                          {r.language && <div style={{ color: T.t4 }}>{r.language}</div>}
                          <div style={{ marginTop: 4 }}>Updated {new Date(r.pushed_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}

              {!pinned.length && allRepos.length > 0 && (
                <p style={{ marginTop: 32, color: T.t6, fontSize: 12, fontFamily: T.fMono }}>
                  Tip: add repo names to <code style={{ color: T.t4 }}>github.pinnedRepos</code> in config.ts to curate this list.
                </p>
              )}

              {user && (
                <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer"
                  onClick={() => playSound('click')}
                  onMouseEnter={e => { (e.currentTarget.style as any).color = T.accent; playSound('hover'); }}
                  onMouseLeave={e => { (e.currentTarget.style as any).color = T.t4; }}
                  style={{ display: 'inline-block', marginTop: 40, color: T.t4, fontSize: 13, fontFamily: T.fMono, textDecoration: 'none', letterSpacing: '.04em', transition: 'color .15s' }}>
                  See everything on GitHub ↗
                </a>
              )}

              {!user && (
                <p style={{ color: T.t6, fontFamily: T.fMono, fontSize: 13 }}>
                  Set your GitHub username in <code style={{ color: T.accent }}>lib/data/config.ts</code> to load live stats.
                </p>
              )}
            </>
          )}
        </>
      )}
    </PageShell>
  );
}