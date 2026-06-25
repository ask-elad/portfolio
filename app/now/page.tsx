'use client';
import { useRouter } from 'next/navigation';
import { useSound }  from '@/hooks/useSound';
import { Cursor }    from '@/components/features/Cursor';
import { Navbar }    from '@/components/layout/Navbar';
import { Footer }    from '@/components/layout/Footer';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg }       from '@/components/features/VinlandEasterEgg';
import { CONFIG }    from '@/lib/data/config';
import { useState, useEffect } from 'react';

export default function NowPage() {
  const playSound = useSound();
  const router    = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [vinland, setVinland] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleCmd = (cmd: Command) => {
    setCmdOpen(false); playSound('click');
    if (cmd.section) { router.push('/'); setTimeout(() => document.getElementById(cmd.section!)?.scrollIntoView({ behavior: 'smooth' }), 300); }
    else if (cmd.page) router.push('/' + cmd.page);
  };

  const sections = [
    { label: 'Building', items: CONFIG.now.building },
    { label: 'Learning', items: CONFIG.now.learning },
    { label: 'Reading',  items: CONFIG.now.reading  },
  ];

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', }}>
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

        <div style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 16 }}>Now</div>
        <p style={{ color: '#2a2a2a', fontSize: 13, fontFamily: 'monospace', marginBottom: 60 }}>
          Last updated: {CONFIG.now.lastUpdated} · {CONFIG.now.location}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 48 }}>
          {sections.map(s => (
            <div key={s.label}>
              <div style={{ color: '#c0c0c0', fontFamily: 'monospace', fontSize: 13, fontWeight: 600, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #1c1c20' }}>
                {s.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {s.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 12, marginTop: 2, flexShrink: 0 }}>›</span>
                    <span style={{ color: '#666', fontSize: 14, lineHeight: 1.65 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 80, color: '#1e1e1e', fontSize: 12, fontFamily: 'monospace' }}>
          This page is only discoverable via ⌘K.
        </p>
      </main>
      <Footer />
    </div>
  );
}
