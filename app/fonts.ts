import { Inter, JetBrains_Mono } from 'next/font/google';

// Inter as Akkurat alternative - Light (300) and Regular (400) weights
export const akkurat = Inter({
  subsets: ['latin'],
  weight: ['300', '400'], // Akkurat Light and Regular
  display: 'swap',
});

// JetBrains Mono as Fragment Mono alternative
export const fragmentMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-fragment',
  display: 'swap',
});