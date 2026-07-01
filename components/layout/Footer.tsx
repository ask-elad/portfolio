import { CONFIG } from '@/lib/data/config';
import { T } from '@/lib/tokens';

export function Footer() {
  const name = CONFIG.name && !CONFIG.name.startsWith('REPLACE') ? CONFIG.name : CONFIG.alias;
  return (
    <footer style={{
      borderTop: `1px solid ${T.line}`,
      marginTop: 96,
      background: 'rgba(255,255,255,0.015)',
    }}>
      <div style={{
        maxWidth: T.wide,
        margin: '0 auto',
        padding: '28px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span style={{ color: T.t3, fontSize: 12, fontFamily: T.fMono, letterSpacing: '.04em' }}>
          {'\u00a9'} {new Date().getFullYear()} {name}
        </span>
        <span style={{ color: T.t4, fontSize: 11, fontFamily: T.fMono, letterSpacing: '.08em' }}>
          {CONFIG.location} {'\u00b7'} press {'\u2318'} K
        </span>
      </div>
    </footer>
  );
}
