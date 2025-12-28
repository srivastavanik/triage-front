import { Inter } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';

// Inter for clean sans-serif typography (similar to Warp)
export const akkurat = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-akkurat',
});

// Geist Mono for code (Vercel's monospace font)
export const geistMono = GeistMono;
