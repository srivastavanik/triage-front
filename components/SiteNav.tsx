'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type SiteNavProps = {
  offsetTop?: number;
};

const LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/teams', label: 'Teams' },
  { href: '/careers', label: 'Careers' },
  { href: '/blog', label: 'Blog' },
];

export function SiteNav({ offsetTop = 0 }: SiteNavProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const mobileTop = offsetTop + 72; // nav height

  return (
    <>
      <nav className="nav-fixed bg-[#0a0a0a] border-b border-transparent" style={{ top: `${offsetTop}px` }}>
        <div className="container-max">
          <div className="nav-inner">
            <Link href="/" className="nav-logo flex items-center gap-3 h-10">
              <Image
                src="/FullLogo_Transparent_NoBuffer (1) (1).png"
                alt="Triage"
                width={32}
                height={32}
                className="h-8 w-8"
                style={{ objectFit: 'contain' }}
              />
              <span
                className="text-[24px] font-bold tracking-tight text-text-primary"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                triage
              </span>
            </Link>

            <div className="nav-links hidden md:flex">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link text-[14px]">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:srivastavan@berkeley.edu"
                className="btn btn-primary hidden md:inline-flex text-[14px] rounded-full"
              >
                Contact Us
              </a>

              <button
                className="md:hidden p-2 text-text-primary"
                onClick={toggleMobile}
                aria-label="Toggle menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="md:hidden fixed left-0 right-0 bg-[#0a0a0a] border-b border-[#1a1a1a] z-[99]"
          style={{ top: `${mobileTop}px` }}
        >
          <div className="container-max py-6 space-y-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[16px] text-text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href="mailto:srivastavan@berkeley.edu" className="btn btn-primary w-full rounded-full text-center text-[14px]">
              Contact Us
            </a>
          </div>
        </div>
      )}
    </>
  );
}

