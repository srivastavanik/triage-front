import type { Metadata } from "next";
import { akkurat, geistMono } from './fonts';
import "./globals.css";

export const metadata: Metadata = {
  title: "Triage - AI Security and Observability",
  description: "Remediate, denoise, and ship secure AI systems. Full-fidelity telemetry, runtime controls, and regression prevention for LLM-powered products.",
  icons: {
    icon: '/FullLogo_Transparent_NoBuffer (1) (1).png',
    shortcut: '/FullLogo_Transparent_NoBuffer (1) (1).png',
    apple: '/FullLogo_Transparent_NoBuffer (1) (1).png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${akkurat.className} ${geistMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
