import type { Metadata } from 'next';
import './globals.css';
import { CONFIG } from '@/lib/data/config';
import { getSiteUrl } from '@/lib/siteUrl';

const name = CONFIG.name && !CONFIG.name.startsWith('REPLACE') ? CONFIG.name : CONFIG.alias;
const description = CONFIG.heroTagline?.startsWith('REPLACE')
  ? `Personal portfolio of ${name}.`
  : CONFIG.heroTagline;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: `${name} — Portfolio`, template: `%s · ${name}` },
  description,
  authors: [{ name }],
  openGraph: {
    title: `${name} — Portfolio`,
    description,
    type: 'website',
    siteName: `${name} — Portfolio`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${name} — Portfolio`,
    description,
    creator: CONFIG.social?.twitter?.split('/').pop() ? `@${CONFIG.social.twitter.split('/').pop()}` : undefined,
  },
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
