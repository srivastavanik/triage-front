import type { Metadata } from "next";
import { akkurat, fragmentMono } from './fonts';
import "./globals.css";

export const metadata: Metadata = {
  title: "Triage - Embedded Security, For Everyone",
  description: "Ship fixes, not alerts. Embedded security that lives inside your development lifecycle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${akkurat.className} ${fragmentMono.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
