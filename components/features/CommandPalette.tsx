'use client';

import { useEffect, useRef, useState } from 'react';

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
  { id: 'hero', label: '→ Home', category: 'Navigate', section: 'hero' },
  { id: 'about', label: '→ About', category: 'Navigate', section: 'about' },
  { id: 'projects', label: '→ Projects', category: 'Navigate', section: 'projects' },
  { id: 'experience', label: '→ Experience', category: 'Navigate', section: 'experience' },
  { id: 'hobbies', label: '→ Hobbies', category: 'Pages', page: 'hobbies' },
  { id: 'blog', label: '→ Blog', category: 'Navigate', section: 'blog' },
  { id: 'contact', label: '→ Contact', category: 'Navigate', section: 'contact' },
  { id: 'github', label: 'GitHub Stats', category: 'Pages', page: 'github' },
  { id: 'cp', label: 'LeetCode & Codeforces', category: 'Pages', page: 'cp' },
  { id: 'now', label: "What I'm doing Now", category: 'Pages', page: 'now' },
];

const EASTER_TRIGGERS = ['vinland', 'askeladd', 'vinland saga'];

export function CommandPalette({
  open,
  onClose,
  onSelect,
  onVinland,
}: Props) {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [query, setQuery] = useState('');

  /* -------------------------------------------------------------------------- */
  /*                                    Refs                                    */
  /* -------------------------------------------------------------------------- */

  const inputRef = useRef<HTMLInputElement>(null);
  const firedRef = useRef(false);

  const onVinlandRef = useRef(onVinland);
  const onCloseRef = useRef(onClose);

  /* -------------------------------------------------------------------------- */
  /*                                  Effects                                   */
  /* -------------------------------------------------------------------------- */

  // Keep latest callbacks in refs
  useEffect(() => {
    onVinlandRef.current = onVinland;
    onCloseRef.current = onClose;
  }, [onVinland, onClose]);

  // Reset palette whenever opened
  useEffect(() => {
    if (!open) return;

    setQuery('');
    firedRef.current = false;

    setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  // Easter egg trigger
  useEffect(() => {
    const q = query.toLowerCase().trim();

    if (EASTER_TRIGGERS.includes(q) && !firedRef.current) {
      firedRef.current = true;
      onVinlandRef.current();
      onCloseRef.current();
    }
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  /* -------------------------------------------------------------------------- */
  /*                                  Helpers                                   */
  /* -------------------------------------------------------------------------- */

  if (!open) return null;

  const filtered = COMMANDS.filter(
    (command) =>
      command.label.toLowerCase().includes(query.toLowerCase()) ||
      command.category.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, command) => {
    (acc[command.category] ||= []).push(command);
    return acc;
  }, {});

  /* -------------------------------------------------------------------------- */
  /*                                    JSX                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '13vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 700,
          background: '#0a0a0c',
          border: '1px solid rgba(34,211,238,.2)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow:
            '0 0 80px rgba(34,211,238,.04), 0 30px 70px rgba(0,0,0,.95)',
        }}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Search Input                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '13px 16px',
            borderBottom: '1px solid #1c1c20',
            gap: 10,
          }}
        >
          <span
            style={{
              color: '#22d3ee',
              fontFamily: 'monospace',
              fontSize: 35,
            }}
          >
            ⌘
          </span>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered.length > 0) {
                onSelect(filtered[0]);
              }
            }}
            placeholder="Search or type a command..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f0f0f0',
              fontSize: 15,
              fontFamily: 'inherit',
            }}
          />

          <span
            style={{
              color: '#2a2a2a',
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            ESC
          </span>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Results                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div
          style={{
            maxHeight: 900,
            overflowY: 'auto',
            padding: '6px 0',
          }}
        >
          {Object.entries(grouped).map(([category, commands]) => (
            <div key={category}>
              <div
                style={{
                  padding: '6px 16px 4px',
                  fontSize: 20,
                  fontFamily: 'monospace',
                  color: '#333',
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </div>

              {commands.map((command) => (
                <div
                  key={command.id}
                  onClick={() => onSelect(command)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#141416';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  style={{
                    padding: '9px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 20,
                    color: '#b0b0b0',
                    fontFamily: 'monospace',
                    transition: 'background .1s',
                  }}
                >
                  <span
                    style={{
                      color: '#22d3ee',
                      fontSize: 11,
                    }}
                  >
                    ›
                  </span>

                  {command.label}
                </div>
              ))}
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              style={{
                padding: '22px 16px',
                textAlign: 'center',
                color: '#333',
                fontSize: 13,
                fontFamily: 'monospace',
              }}
            >
              no results — try typing{' '}
              <span style={{ color: '#22d3ee' }}>vinland</span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Footer                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid #1c1c20',
            display: 'flex',
            gap: 18,
          }}
        >
          {[
            ['↵', 'select'],
            ['↑↓', 'navigate'],
            ['ESC', 'close'],
          ].map(([key, value]) => (
            <span
              key={key}
              style={{
                fontFamily: 'monospace',
                fontSize: 15,
                color: '#5f5d5dff',
              }}
            >
              {key} {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}