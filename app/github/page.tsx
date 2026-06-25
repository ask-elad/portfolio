'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/hooks/useSound';
import { Cursor }   from '@/components/features/Cursor';
import { Navbar }   from '@/components/layout/Navbar';
import { Footer }   from '@/components/layout/Footer';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg }       from '@/components/features/VinlandEasterEgg';
import { SectionLabel, SubLabel } from '@/components/ui/SectionLabel';
import { CONFIG }   from '@/lib/data/config';
 
const COLORS = ['#141416', '#0c4a6e', '#0369a1', '#0ea5e9', '#22d3ee'];
 
// ── Contribution heatmap ─────────────────────────────────────────────────────
function HeatMap({ weeks }: { weeks: { level: 0 | 1 | 2 | 3 | 4; date?: string; count?: number }[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 3, minWidth: 'fit-content' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {week.map((day, di) => (
              <div key={di} title={day.date ? `${day.count ?? 0} contributions on ${day.date}` : undefined}
                style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[day.level], transition: 'transform .1s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
        <span style={{ color: '#333', fontSize: 11, fontFamily: 'monospace' }}>Less</span>
        {COLORS.map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />)}
        <span style={{ color: '#333', fontSize: 11, fontFamily: 'monospace' }}>More</span>
      </div>
    </div>
  );
}
 
function StaticHeatMap() {
  const ref = useRef<{ level: 0 | 1 | 2 | 3 | 4 }[][]>();
  if (!ref.current) {
    ref.current = Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => {
        const r = Math.random();
        return { level: (r < .3 ? 0 : r < .6 ? 1 : r < .8 ? 2 : r < .95 ? 3 : 4) as 0 | 1 | 2 | 3 | 4 };
      })
    );
  }
  return <HeatMap weeks={ref.current} />;
}
 
// ── Small stat card ───────────────────────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 700, color: accent ?? '#22d3ee', marginBottom: 5 }}>{value}</div>
      <div style={{ color: '#444', fontSize: 12, fontFamily: 'monospace' }}>{label}</div>
    </div>
  );
}
 
// ── Repo card ─────────────────────────────────────────────────────────────────
function RepoCard({ repo, playSound }: { repo: any; playSound: (t: any) => void }) {
  return (
    <a href={repo.url} target="_blank" rel="noopener noreferrer"
      onClick={() => playSound('click')}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,211,238,.28)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; playSound('hover'); }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1c1c20'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
      style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 20, transition: 'border-color .2s, transform .2s', textDecoration: 'none', display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#22d3ee', fontWeight: 600 }}>{repo.name}</span>
        {repo.isArchived && (
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', border: '1px solid #2a2a2a', borderRadius: 10, padding: '2px 7px', whiteSpace: 'nowrap' }}>archived</span>
        )}
      </div>
      <div style={{ color: '#555', fontSize: 13, marginBottom: 14, lineHeight: 1.55, minHeight: 20 }}>{repo.description || '—'}</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>★ {repo.stars}</span>
        {repo.forks > 0 && <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>⑂ {repo.forks}</span>}
        {repo.language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: repo.language.color || '#555', display: 'inline-block' }} />
            {repo.language.name}
          </span>
        )}
      </div>
    </a>
  );
}
 
export default function GitHubPage() {
  const playSound = useSound();
  const router    = useRouter();
  const [gh, setGh]           = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [vinland, setVinland] = useState(false);
 
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
 
  useEffect(() => {
    if (!CONFIG.social.github || CONFIG.social.github.startsWith('REPLACE')) { setLoading(false); return; }
    fetch(`/api/github?username=${CONFIG.social.github}`)
      .then(r => r.json()).then(setGh).catch(() => {}).finally(() => setLoading(false));
  }, []);
 
  const handleCmd = (cmd: Command) => {
    setCmdOpen(false); playSound('click');
    if (cmd.section) { router.push('/'); setTimeout(() => document.getElementById(cmd.section!)?.scrollIntoView({ behavior: 'smooth' }), 300); }
    else if (cmd.page) router.push('/' + cmd.page);
  };
 
  const user      = gh?.user;
  const pinned    = gh?.pinnedRepos ?? [];
  const topRepos  = gh?.topRepos ?? [];
  const languages = gh?.languages ?? [];
  const streaks   = gh?.streaks;
  const contrib   = gh?.contributions;
 
  let heatmapWeeks: { level: 0 | 1 | 2 | 3 | 4; date: string; count: number }[][] | null = null;
  if (contrib?.calendar?.length) {
    const days = contrib.calendar;
    const chunked: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7));
    heatmapWeeks = chunked;
  }
 
  const stats = [
    { label: 'Public Repos', val: user?.publicRepos ?? '—' },
    { label: 'Followers',    val: user?.followers   ?? '—' },
    { label: 'Following',    val: user?.following   ?? '—' },
    { label: 'Total Stars',  val: gh?.totalStars     ?? '—' },
  ];
 
  const joinedYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : null;
 
  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <Cursor />
      {vinland && <VinlandEasterEgg onClose={() => setVinland(false)} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={handleCmd}
        onVinland={() => { setVinland(true); playSound('vinland'); setCmdOpen(false); }} />
      <Navbar onCmd={() => { setCmdOpen(true); playSound('open'); }} playSound={playSound} />
 
      <main style={{ flex: 1, width: '100%', maxWidth: 880, margin: '0 auto', padding: '100px 40px' }}>
        <button onClick={() => { router.push('/'); playSound('click'); }}
          onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; playSound('hover'); }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontFamily: 'monospace', fontSize: 13, marginBottom: 44, display: 'flex', alignItems: 'center', gap: 6, transition: 'color .15s', padding: 0 }}>
          ← Back
        </button>
 
        <SectionLabel>GitHub</SectionLabel>
 
        {loading && <div style={{ color: '#2a2a2a', fontFamily: 'monospace' }}>loading...</div>}
 
        {!loading && (
          <>
            {/* ── Profile card ─────────────────────────────────────────── */}
            {user?.login && (
              <div style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 24, marginBottom: 32, display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {user.avatarUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.login} style={{ width: 76, height: 76, borderRadius: 12, border: '1px solid #1c1c20', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>{user.name || user.login}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#444' }}>@{user.login}</span>
                  </div>
                  {user.bio && <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, marginBottom: 12, maxWidth: 520 }}>{user.bio}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 12 }}>
                    {user.company && <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>🏢 {user.company}</span>}
                    {user.location && <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>📍 {user.location}</span>}
                    {joinedYear && <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>since {joinedYear}</span>}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <a href={user.url} target="_blank" rel="noopener noreferrer" onClick={() => playSound('click')}
                      onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
                      onMouseLeave={e => { (e.currentTarget.style as any).color = '#555'; }}
                      style={{ color: '#555', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none', transition: 'color .15s' }}>
                      github.com/{user.login} ↗
                    </a>
                    {user.websiteUrl && (
                      <a href={user.websiteUrl.startsWith('http') ? user.websiteUrl : `https://${user.websiteUrl}`} target="_blank" rel="noopener noreferrer" onClick={() => playSound('click')}
                        onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
                        onMouseLeave={e => { (e.currentTarget.style as any).color = '#555'; }}
                        style={{ color: '#555', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none', transition: 'color .15s' }}>
                        website ↗
                      </a>
                    )}
                    {user.twitterUsername && (
                      <a href={`https://twitter.com/${user.twitterUsername}`} target="_blank" rel="noopener noreferrer" onClick={() => playSound('click')}
                        onMouseEnter={e => { (e.currentTarget.style as any).color = '#22d3ee'; playSound('hover'); }}
                        onMouseLeave={e => { (e.currentTarget.style as any).color = '#555'; }}
                        style={{ color: '#555', fontSize: 12, fontFamily: 'monospace', textDecoration: 'none', transition: 'color .15s' }}>
                        @{user.twitterUsername} ↗
                      </a>
                    )}
                  </div>
                </div>
                {user.organizations?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {user.organizations.slice(0, 5).map((org: any) => (
                      <a key={org.login} href={org.url} target="_blank" rel="noopener noreferrer" title={org.login}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={org.avatarUrl} alt={org.login} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #1c1c20' }} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
 
            {/* ── Quick stats ──────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {stats.map(s => <StatCard key={s.label} label={s.label} value={String(s.val)} />)}
            </div>
 
            {/* ── Streaks ──────────────────────────────────────────────── */}
            {streaks && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
                <StatCard label="Current Streak" value={<>🔥 {streaks.current}<span style={{ fontSize: 13, color: '#444' }}> {streaks.current === 1 ? 'day' : 'days'}</span></>} accent="#fbbf24" />
                <StatCard label="Longest Streak" value={<>{streaks.longest}<span style={{ fontSize: 13, color: '#444' }}> {streaks.longest === 1 ? 'day' : 'days'}</span></>} />
                <StatCard label="Contributions (year)" value={String(contrib?.total ?? '—')} />
              </div>
            )}
            {!streaks && <div style={{ marginBottom: 40 }} />}
 
            {/* ── Contribution heatmap ─────────────────────────────────── */}
            <div style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 24, marginBottom: 40 }}>
              <SubLabel>Contributions — last 12 months</SubLabel>
              {heatmapWeeks ? <HeatMap weeks={heatmapWeeks} /> : <StaticHeatMap />}
              {contrib && (contrib.commits != null) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20, paddingTop: 20, borderTop: '1px solid #1c1c20' }}>
                  <span style={{ color: '#555', fontSize: 12, fontFamily: 'monospace' }}><span style={{ color: '#22d3ee' }}>{contrib.commits}</span> commits</span>
                  <span style={{ color: '#555', fontSize: 12, fontFamily: 'monospace' }}><span style={{ color: '#22d3ee' }}>{contrib.pullRequests}</span> pull requests</span>
                  <span style={{ color: '#555', fontSize: 12, fontFamily: 'monospace' }}><span style={{ color: '#22d3ee' }}>{contrib.issues}</span> issues</span>
                  <span style={{ color: '#555', fontSize: 12, fontFamily: 'monospace' }}><span style={{ color: '#22d3ee' }}>{contrib.reviews}</span> reviews</span>
                </div>
              )}
            </div>
 
            {/* ── Language distribution ────────────────────────────────── */}
            {languages.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <SubLabel>Most Used Languages</SubLabel>
                <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 16, background: '#141416' }}>
                  {languages.map((l: any) => (
                    <div key={l.name} title={`${l.name} — ${l.pct}%`} style={{ width: `${l.pct}%`, background: l.color || '#444', minWidth: l.pct > 0 ? 2 : 0 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {languages.map((l: any) => (
                    <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: l.color || '#444', display: 'inline-block' }} />
                      <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{l.name}</span>
                      <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
 
            {/* ── Pinned repos ─────────────────────────────────────────── */}
            {pinned.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <SubLabel>Pinned</SubLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {pinned.map((r: any) => <RepoCard key={r.name} repo={r} playSound={playSound} />)}
                </div>
              </div>
            )}
 
            {/* ── Top repos ────────────────────────────────────────────── */}
            {topRepos.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <SubLabel>{pinned.length > 0 ? 'Most Starred' : 'Top Repos'}</SubLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {topRepos.map((r: any) => <RepoCard key={r.name} repo={r} playSound={playSound} />)}
                </div>
              </div>
            )}
 
            {!user?.login && (
              <p style={{ color: '#333', fontFamily: 'monospace', fontSize: 13 }}>
                Set your GitHub username in <code style={{ color: '#22d3ee' }}>lib/data/config.ts</code> to load live stats.
              </p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}