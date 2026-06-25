'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSound }  from '@/hooks/useSound';
import { Cursor }    from '@/components/features/Cursor';
import { Navbar }    from '@/components/layout/Navbar';
import { Footer }    from '@/components/layout/Footer';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg }       from '@/components/features/VinlandEasterEgg';
import { Hobbies }   from '@/components/sections/Hobbies';

export default function HobbiesPage() {
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

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Inter', system-ui, sans-serif", display: 'flex', flexDirection: 'column', }}>
      <Cursor />
      {vinland && <VinlandEasterEgg onClose={() => setVinland(false)} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={handleCmd}
        onVinland={() => { setVinland(true); playSound('vinland'); setCmdOpen(false); }} />
      <Navbar onCmd={() => { setCmdOpen(true); playSound('open'); }} playSound={playSound} />

      <main style={{flex: 1, width: '100%',maxWidth: 1000, margin: '0 auto', padding: '100px 40px' }}>
        <button onClick={() => { router.push('/'); playSound('click'); }}
          onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; playSound('hover'); }}
          onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontFamily: 'monospace', fontSize: 13, marginBottom: 44, display: 'flex', alignItems: 'center', gap: 6, transition: 'color .15s', padding: 0 }}>
          \u2190 Back
        </button>

        <div style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 44 }}>Outside work</div>

        <Hobbies playSound={playSound} />
      </main>
      <Footer />
    </div>
  );
}
