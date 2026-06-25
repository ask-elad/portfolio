'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/data/config';
import { SoundType } from '@/hooks/useSound';

const NAV = [
  { label: 'About',      section: 'about' },
  { label: 'Projects',   section: 'projects' },
  { label: 'Experience', section: 'experience' },
  { label: 'Hobbies',   page: '/hobbies' },
  { label: 'Blog',       section: 'blog' },
  { label: 'GitHub',     page: '/github' },
  { label: 'CP',         page: '/cp' },
  { label: 'Contact',    section: 'contact' },
];

interface Props {
  onCmd: () => void;
  playSound: (t: SoundType) => void;
}

export function Navbar({ onCmd, playSound }: Props) {
  const [blink, setBlink]   = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    return () => { clearInterval(t); window.removeEventListener('scroll', s); };
  }, []);

  const go = (link: typeof NAV[number]) => {
    playSound('click');
    if (link.page) {
      router.push(link.page);
    } else if (link.section) {
      if (window.location.pathname !== '/') {
        router.push('/');
        setTimeout(() => document.getElementById(link.section!)?.scrollIntoView({ behavior: 'smooth' }), 300);
      } else {
        document.getElementById(link.section!)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goHome = () => { playSound('click'); router.push('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 15, left: 0, right: 0, height: 68, zIndex: 100,
      background: scrolled ? 'rgba(8,8,8,.92)' : 'rgba(8,8,8,.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(34,211,238,.2)' : 'transparent'}`,
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 40px',
      transition: 'border-color .3s, background .3s',
    }}>
      {/* Logo — far left edge */}
      <div onClick={goHome}
        onMouseEnter={e => { (e.currentTarget.children[0] as HTMLElement).style.color = '#22d3ee'; playSound('hover'); }}
        onMouseLeave={e => { (e.currentTarget.children[0] as HTMLElement).style.color = '#f0f0f0'; }}
        style={{ justifySelf: 'start', cursor: 'pointer' }}>
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 28, color: '#f0f0f0', transition: 'color .15s', letterSpacing: '-.01em', userSelect: 'none' }}>
          {CONFIG.alias}
          <span style={{ opacity: blink ? 1 : 0, color: '#22d3ee', transition: 'opacity .08s' }}>_</span>
        </span>
      </div>

      {/* Nav links — centered, independent of logo/cmdk widths */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifySelf: 'center' }}>
        {NAV.map(link => (
          <button key={link.label} onClick={() => go(link)}
            onMouseEnter={e => { e.currentTarget.style.color = '#22d3ee'; playSound('hover'); }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e0c8c8ff', fontSize: 22, fontFamily: 'inherit', padding: '6px 15px', whiteSpace: 'nowrap', transition: 'color .15s' }}>
            {link.label}
          </button>
        ))}
      </div>

      {/* ⌘K — far right edge */}
      <button onClick={() => { onCmd(); playSound('open'); }}
        onMouseEnter={e => { (e.currentTarget.style as any).borderColor = 'rgba(34,211,238,.35)'; playSound('hover'); }}
        onMouseLeave={e => { (e.currentTarget.style as any).borderColor = '#2a2a2a'; }}
        style={{ justifySelf: 'end', background: '#0e0e10', border: '1px solid #2a2a2a', borderRadius: 6, padding: '7px 22px', color: '#faf8f8ff', fontSize: 19, fontFamily: 'monospace', cursor: 'pointer', transition: 'border-color .2s' }}>
        ⌘ K
      </button>
    </nav>
  );
}
