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
  title: { default: `${name} | Human`, template: `%s · ${name}` },
  description,
  authors: [{ name }],
  icons: {
    icon: [
      { url: '/logos/favicon.svg', type: 'image/svg+xml' },
      { url: '/logos/favicon.png', type: 'image/png' },
      { url: '/logos/favicon.ico' },
    ],
    shortcut: '/logos/favicon.ico',
    apple: '/logos/apple-touch-icon.png',
  },
  openGraph: {
    title: `${name} | Human`,
    description,
    type: 'website',
    siteName: `${name} | Human`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${name} | Human`,
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
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
