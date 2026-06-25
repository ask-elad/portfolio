import { CONFIG } from '@/lib/data/config';

export function Footer() {
  return (
    <footer
      style={{
        height: '70px',
        borderTop: '1px solid rgba(34,211,238,.2)',
        padding: '0 30px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
      }}
    >
      {/* Left */}
      <span
        style={{
          color: '#f3dadaff',
          fontSize: 17,
          fontFamily: 'monospace',
          justifySelf: 'start',
        }}
      >
        designed &amp; built by {CONFIG.name || CONFIG.alias}
      </span>

      {/* Center */}
      <span
        style={{
          color: '#f3dadaff',
          fontSize: 17,
          fontFamily: 'monospace',
          justifySelf: 'center',
        }}
      >
        @{CONFIG.alias}
      </span>

      {/* Right */}
      <span
        style={{
          color: '#f7dfdfff',
          fontSize: 17,
          fontFamily: 'monospace',
          justifySelf: 'end',
        }}
      >
        {CONFIG.location}
      </span>
    </footer>
  );
}