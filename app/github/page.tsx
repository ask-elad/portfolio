'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/hooks/useSound';
import { Cursor }   from '@/components/features/Cursor';
import { Navbar }   from '@/components/layout/Navbar';
import { Footer }   from '@/components/layout/Footer';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg }       from '@/components/features/VinlandEasterEgg';
import { SubLabel } from '@/components/ui/SectionLabel';
import { CONFIG }   from '@/lib/data/config';

const COLORS = ['#141416','#0c4a6e','#0369a1','#0ea5e9','#22d3ee'];

function HeatMap({ weeks }: { weeks: { level: 0|1|2|3|4; date?: string; count?: number }[][] }) {
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

  const user  = gh?.user;
  const repos = (gh?.repos ?? []).sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 6);

  let heatmapWeeks: { level: 0|1|2|3|4; date: string; count: number }[][] | null = null;
  if (gh?.contributions?.contributions) {
    const days = gh.contributions.contributions;
    const chunked: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7));
    heatmapWeeks = chunked;
  }

  const stats = [
    { label: 'Public Repos', val: user?.public_repos ?? '—' },
    { label: 'Followers',    val: user?.followers    ?? '—' },
    { label: 'Following',    val: user?.following    ?? '—' },
    { label: 'Stars',        val: repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0) || '—' },
  ];

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex',flexDirection: 'column', }}>
      <Cursor />
      {vinland && <VinlandEasterEgg onClose={() => setVinland(false)} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={handleCmd}
        onVinland={() => { setVinland(true); playSound('vinland'); setCmdOpen(false); }} />
      <Navbar onCmd={() => { setCmdOpen(true); playSound('open'); }} playSound={playSound} />

      <main style={{flex: 1, width: '100%', maxWidth: 880, margin: '0 auto', padding: '100px 40px' }}>
        <button onClick={() => { router.push('/'); playSound('click'); }}
          onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; playSound('hover'); }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontFamily: 'monospace', fontSize: 13, marginBottom: 44, display: 'flex', alignItems: 'center', gap: 6, transition: 'color .15s', padding: 0 }}>
          ← Back
        </button>

        <div style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 44 }}>GitHub</div>

        {loading && <div style={{ color: '#2a2a2a', fontFamily: 'monospace' }}>loading...</div>}

        {!loading && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 40 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: '#22d3ee', marginBottom: 5 }}>{String(s.val)}</div>
                  <div style={{ color: '#444', fontSize: 12, fontFamily: 'monospace' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 24, marginBottom: 40 }}>
              <SubLabel>Contributions — last 12 months</SubLabel>
              {heatmapWeeks ? <HeatMap weeks={heatmapWeeks} /> : <StaticHeatMap />}
            </div>

            {repos.length > 0 && (
              <>
                <SubLabel>Top Repos</SubLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {repos.map((r: any) => (
                    <a key={r.name} href={r.html_url} target="_blank" rel="noopener noreferrer"
                      onClick={() => playSound('click')}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,211,238,.28)'; playSound('hover'); }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1c1c20'; }}
                      style={{ background: '#0a0a0c', border: '1px solid #1c1c20', borderRadius: 10, padding: 20, transition: 'border-color .2s', textDecoration: 'none', display: 'block' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#22d3ee', marginBottom: 6 }}>{r.name}</div>
                      <div style={{ color: '#555', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{r.description || '—'}</div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>★ {r.stargazers_count}</span>
                        {r.language && <span style={{ color: '#3a3a3a', fontSize: 12, fontFamily: 'monospace' }}>{r.language}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            {!user && (
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
