'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/data/config';
import { SoundType } from '@/hooks/useSound';
import { T } from '@/lib/tokens';
import { prefetch } from '@/lib/dataCache';

const NAV = [
  { label: 'About',      section: 'about' },
  { label: 'Work',       section: 'projects' },
  { label: 'Experience', section: 'experience' },
  { label: 'Writing',    section: 'blog' },
  { label: 'Hobbies',    page: '/hobbies' },
  { label: 'GitHub',     page: '/github' },
  { label: 'CP',         page: '/cp' },
  { label: 'Contact',    section: 'contact' },
];

interface Props {
  onCmd: () => void;
  playSound: (t: SoundType) => void;
}

export function Navbar({ onCmd, playSound }: Props) {
  const [blink, setBlink]       = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 530);
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    return () => { clearInterval(t); window.removeEventListener('scroll', s); };
  }, []);

  // Kick off background fetches the moment ANY page loads so GitHub/CP feel
  // instant when the user actually navigates there.
  useEffect(() => {
    if (CONFIG.social.github    && !CONFIG.social.github.startsWith('REPLACE'))
      prefetch(`/api/github?username=${CONFIG.social.github}`);
    if (CONFIG.social.leetcode  && !CONFIG.social.leetcode.startsWith('REPLACE'))
      prefetch(`/api/leetcode?username=${CONFIG.social.leetcode}`);
    if (CONFIG.social.codeforces && !CONFIG.social.codeforces.startsWith('REPLACE'))
      prefetch(`/api/codeforces?handle=${CONFIG.social.codeforces}`);
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
      position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
      background: scrolled ? 'rgba(8,8,8,.85)' : 'rgba(8,8,8,.55)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      borderBottom: scrolled ? `1px solid ${T.line}` : '1px solid transparent',
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 32px',
      transition: 'border-color .3s, background .3s',
    }}>
      <div onClick={goHome}
        onMouseEnter={e => { (e.currentTarget.children[0] as HTMLElement).style.color = T.accent; playSound('hover'); }}
        onMouseLeave={e => { (e.currentTarget.children[0] as HTMLElement).style.color = T.t1; }}
        style={{ justifySelf: 'start', cursor: 'none' }}>
        <span style={{ fontFamily: T.fMono, fontWeight: 600, fontSize: 16, color: T.t1, transition: 'color .15s', letterSpacing: '-.01em', userSelect: 'none' }}>
          {CONFIG.alias}
          <span style={{ opacity: blink ? 1 : 0, color: T.accent, transition: 'opacity .08s' }}>_</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifySelf: 'center' }}>
        {NAV.map(link => (
          <button key={link.label} onClick={() => go(link)}
            onMouseEnter={e => { e.currentTarget.style.color = T.t1; playSound('hover'); }}
            onMouseLeave={e => { e.currentTarget.style.color = T.t4; }}
            style={{ background: 'none', border: 'none', cursor: 'none', color: T.t4, fontSize: 13, fontFamily: T.fSans, padding: '6px 12px', whiteSpace: 'nowrap', transition: 'color .15s', letterSpacing: '.01em' }}>
            {link.label}
          </button>
        ))}
      </div>

      <button onClick={() => { onCmd(); playSound('open'); }}
        onMouseEnter={e => { (e.currentTarget.style as any).borderColor = T.accent + '88'; (e.currentTarget.style as any).color = T.t1; playSound('hover'); }}
        onMouseLeave={e => { (e.currentTarget.style as any).borderColor = T.line; (e.currentTarget.style as any).color = T.t3; }}
        style={{ justifySelf: 'end', background: T.ink, border: `1px solid ${T.line}`, borderRadius: 6, padding: '6px 11px', color: T.t3, fontSize: 12, fontFamily: T.fMono, cursor: 'none', transition: 'all .2s', letterSpacing: '.04em' }}>
        ⌘ K
      </button>
    </nav>
  );
}