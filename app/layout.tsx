import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARYAN RAI',        // REPLACE_ME: "Your Name — AI Backend Developer"
  description: 'Portfolio website of askelad', // REPLACE_ME: Your meta description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
