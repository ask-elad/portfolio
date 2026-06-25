'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSound }  from '@/hooks/useSound';
import { Cursor }    from '@/components/features/Cursor';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg }       from '@/components/features/VinlandEasterEgg';
import { Navbar }    from '@/components/layout/Navbar';
import { Footer }    from '@/components/layout/Footer';
import { Hero }      from '@/components/sections/Hero';
import { About }     from '@/components/sections/About';
import { Projects }  from '@/components/sections/Projects';
import { Experience} from '@/components/sections/Experience';
import { Blog }      from '@/components/sections/Blog';
import { Contact }   from '@/components/sections/Contact';

export default function HomeClient() {
  const [cmdOpen, setCmdOpen]   = useState(false);
  const [vinland, setVinland]   = useState(false);
  const playSound = useSound();
  const router    = useRouter();

  // Global ⌘K shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => { if (!v) playSound('open'); return !v; });
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [playSound]);

  const handleCommand = useCallback((cmd: Command) => {
    playSound('click');
    setCmdOpen(false);
    if (cmd.page === 'github')  { router.push('/github'); return; }
    if (cmd.page === 'cp')      { router.push('/cp');     return; }
    if (cmd.page === 'now')     { router.push('/now');    return; }
    if (cmd.section) {
      setTimeout(() => document.getElementById(cmd.section!)?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [playSound, router]);

  const showVinland = useCallback(() => {
    setCmdOpen(false);
    setVinland(true);
    playSound('vinland');
  }, [playSound]);

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f0f0f0', fontFamily: "'Inter', system-ui, -apple-system, sans-serif"}}>
      <Cursor />
      {vinland && <VinlandEasterEgg onClose={() => setVinland(false)} />}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSelect={handleCommand}
        onVinland={showVinland}
      />
      <Navbar onCmd={() => { setCmdOpen(true); playSound('open'); }} playSound={playSound} />
      <main style={{ paddingTop: 68 }}>
        <Hero       playSound={playSound} />
        <Divider />
        <About />
        <Divider />
        <Projects   playSound={playSound} />
        <Divider />
        <Experience />
        <Divider />
        <Blog       playSound={playSound} />
        <Divider />
        <Contact    playSound={playSound} />
      </main>
      <Footer />
    </div>
  );
}

function Divider() {
  return <div style={{ maxWidth: 880, margin: '0 auto', borderTop: '1px solid #1c1c20' }} />;
}
