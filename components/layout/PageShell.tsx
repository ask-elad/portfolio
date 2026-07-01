'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/hooks/useSound';
import { Cursor } from '@/components/features/Cursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette, Command } from '@/components/features/CommandPalette';
import { VinlandEasterEgg } from '@/components/features/VinlandEasterEgg';
import { T } from '@/lib/tokens';
import type { SoundType } from '@/hooks/useSound';

interface Props {
  eyebrow: string;
  title?: string;
  subtitle?: string;
  maxWidth?: number;
  children: (ctx: { playSound: (t: SoundType) => void }) => React.ReactNode;
}

export function PageShell({ eyebrow, title, subtitle, maxWidth = T.col, children }: Props) {
  const playSound = useSound();
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [vinland, setVinland] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleCmd = useCallback((cmd: Command) => {
    setCmdOpen(false); playSound('click');
    if (cmd.section) { router.push('/'); setTimeout(() => document.getElementById(cmd.section!)?.scrollIntoView({ behavior: 'smooth' }), 300); }
    else if (cmd.page) router.push('/' + cmd.page);
  }, [playSound, router]);

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.t1, fontFamily: T.fSans }}>
      <Cursor />
      {vinland && <VinlandEasterEgg onClose={() => setVinland(false)} />}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onSelect={handleCmd}
        onVinland={() => { setVinland(true); playSound('vinland'); setCmdOpen(false); }} />
      <Navbar onCmd={() => { setCmdOpen(true); playSound('open'); }} playSound={playSound} />

      <main style={{ paddingTop: 68 }}>
        <div style={{ maxWidth, margin: '0 auto', padding: '88px 40px 40px' }}>
          <button onClick={() => { router.push('/'); playSound('click'); }}
            onMouseEnter={e => { e.currentTarget.style.color = T.accent; playSound('hover'); }}
            onMouseLeave={e => { e.currentTarget.style.color = T.t4; }}
            style={{ background: 'none', border: 'none', cursor: 'none', color: T.t4, fontFamily: T.fMono, fontSize: 12, marginBottom: 56, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'color .15s', padding: 0 }}>
            <span style={{ display: 'inline-block', width: 14, height: 1, background: 'currentColor' }} />
            Back
          </button>

          <div style={{ color: T.accent, fontFamily: T.fMono, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: title ? 18 : 40, fontWeight: 500 }}>
            {eyebrow}
          </div>
          {title && (
            <h1 style={{ fontFamily: T.fSerif, fontWeight: 400, fontSize: 'clamp(40px,6vw,68px)', color: T.t1, letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: subtitle ? 18 : 40 }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ color: T.t3, fontSize: 17, lineHeight: 1.7, maxWidth: 560, marginBottom: 48 }}>
              {subtitle}
            </p>
          )}

          {children({ playSound })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
