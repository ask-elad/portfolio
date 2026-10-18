import { ImageResponse } from 'next/og';
import { CONFIG } from '@/lib/data/config';

export const runtime = 'edge';
export const alt = `${CONFIG.name} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const name = CONFIG.name && !CONFIG.name.startsWith('REPLACE') ? CONFIG.name : CONFIG.alias;
  const tagline = CONFIG.heroTagline?.startsWith('REPLACE') ? `Personal portfolio of ${name}.` : CONFIG.heroTagline;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#080808',
          color: '#e5e5e5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, color: '#4ade80', letterSpacing: 4 }}>
          {CONFIG.alias?.toUpperCase() ?? name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 32, color: '#a3a3a3', maxWidth: 980, lineHeight: 1.35 }}>{tagline}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#737373' }}>
          <span>{CONFIG.location}</span>
          <span style={{ color: '#4ade80' }}>// portfolio</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
