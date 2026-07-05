'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export interface Command {
  id: string;
  label: string;
  category: string;
  section?: string;
  page?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (cmd: Command) => void;
  onVinland: () => void;
}

const COMMANDS: Command[] = [
  { id: 'hero',       label: '\u2192 Home',             category: 'Navigate', section: 'hero' },
  { id: 'about',      label: '\u2192 About',            category: 'Navigate', section: 'about' },
  { id: 'projects',   label: '\u2192 Projects',         category: 'Navigate', section: 'projects' },
  { id: 'experience', label: '\u2192 Experience',       category: 'Navigate', section: 'experience' },
  { id: 'hobbies',    label: '\u2192 Hobbies',          category: 'Pages',    page: 'hobbies' },
  { id: 'blog',       label: '\u2192 Blog',             category: 'Navigate', section: 'blog' },
  { id: 'contact',    label: '\u2192 Contact',          category: 'Navigate', section: 'contact' },
  { id: 'github',     label: 'GitHub Stats',             category: 'Pages',    page: 'github' },
  { id: 'cp',         label: 'LeetCode / Codeforces',   category: 'Pages',    page: 'cp' },
  { id: 'now',        label: "What I'm doing Now",       category: 'Pages',    page: 'now' },
];

const EASTER_TRIGGERS = ['vinland', 'askeladd', 'vinland saga'];

export function CommandPalette({ open, onClose, onSelect, onVinland }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const firedRef = useRef(false);

  // Keep latest callbacks in refs so the trigger effect below never needs
  // them in its dependency array (see comment there for why that matters).
  const onVinlandRef = useRef(onVinland);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onVinlandRef.current = onVinland; onCloseRef.current = onClose; }, [onVinland, onClose]);

  useEffect(() => { if (open) { setQuery(''); firedRef.current = false; setTimeout(() => inputRef.current?.focus(), 10); } }, [open]);

  // Only depends on `query` itself — onVinland/onClose are recreated on every
  // parent render, so including them here was re-firing this effect (and the
  // easter egg) on every unrelated re-render even though the query hadn't
  // changed. A ref guard makes it fire at most once per palette session.
  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (EASTER_TRIGGERS.includes(q) && !firedRef.current) {
      firedRef.current = true;
      onVinlandRef.current();
      onCloseRef.current();
    }
  }, [query]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); onClose(); }
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, c) => {
    (acc[c.category] ||= []).push(c); return acc;
  }, {});

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '13vh' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 540, background: '#0a0a0c', border: '1px solid rgba(34,211,238,.2)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 0 80px rgba(34,211,238,.04), 0 30px 70px rgba(0,0,0,.95)' }}>
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid #1c1c20', gap: 10 }}>
          <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: 14 }}>⌘</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && filtered.length > 0) onSelect(filtered[0]); }}
            placeholder="Search or type a command..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f0f0f0', fontSize: 15, fontFamily: 'inherit' }}
          />
          <span style={{ color: '#2a2a2a', fontSize: 11, fontFamily: 'monospace' }}>ESC</span>
        </div>
        {/* Results */}
        <div style={{ maxHeight: 320, overflowY: 'auto', padding: '6px 0' }}>
          {Object.entries(grouped).map(([cat, cmds]) => (
            <div key={cat}>
              <div style={{ padding: '6px 16px 4px', fontSize: 10, fontFamily: 'monospace', color: '#333', letterSpacing: '.12em', textTransform: 'uppercase' }}>{cat}</div>
              {cmds.map(cmd => (
                <div key={cmd.id} onClick={() => onSelect(cmd)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#141416')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  style={{ padding: '9px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#b0b0b0', fontFamily: 'monospace', transition: 'background .1s' }}>
                  <span style={{ color: '#22d3ee', fontSize: 11 }}>\u203a</span>{cmd.label}
                </div>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '22px 16px', textAlign: 'center', color: '#333', fontSize: 13, fontFamily: 'monospace' }}>
              no results — try typing <span style={{ color: '#22d3ee' }}>vinland</span>
            </div>
          )}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #1c1c20', display: 'flex', gap: 18 }}>
          {[['\u21b5','select'],['\u2191\u2193','navigate'],['ESC','close']].map(([k,v]) => (
            <span key={k} style={{ fontFamily: 'monospace', fontSize: 11, color: '#2a2a2a' }}>{k} {v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
