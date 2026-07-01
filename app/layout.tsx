import type { Metadata } from 'next';
import './globals.css';
import { CONFIG } from '@/lib/data/config';

const name = CONFIG.name && !CONFIG.name.startsWith('REPLACE') ? CONFIG.name : CONFIG.alias;

export const metadata: Metadata = {
  title: { default: `${name} — Portfolio`, template: `%s · ${name}` },
  description: CONFIG.heroTagline?.startsWith('REPLACE')
    ? `Personal portfolio of ${name}.`
    : CONFIG.heroTagline,
  authors: [{ name }],
  openGraph: { title: `${name} — Portfolio`, type: 'website' },
  twitter: { card: 'summary' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
