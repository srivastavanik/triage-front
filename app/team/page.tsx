'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Team() {
  const [highlightName, setHighlightName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHighlightName(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-cream text-midnight-green">
      {/* Header */}
      <nav className="fixed w-full top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-midnight-green/10">
        <div className="container-max">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Triage"
                width={36}
                height={36}
                className="logo-filter"
                style={{ width: 'auto', height: '36px' }}
              />
            </Link>
            <div className="flex items-center gap-8 text-[15px] text-midnight-green/70">
              <Link href="/" className="hover:text-midnight-green transition-colors">Product</Link>
              <Link href="/careers" className="hover:text-midnight-green transition-colors">Careers</Link>
              <Link href="/team" className="text-midnight-green">Team</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-16">
        <div className="container-max max-w-5xl">
          {/* Nick's Profile */}
          <motion.div
            className="grid lg:grid-cols-2 gap-16 items-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Photo */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Image
                  src="/nick.jpg"
                  alt="Nick Srivastava"
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                  style={{ border: '6px solid #0e3638', maxWidth: '100%', height: 'auto' }}
                />
              </motion.div>
            </div>

            {/* Content */}
            <div>
              <motion.h1 
                className="text-[64px] font-light mb-6 leading-[1.05]"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className={`team-name-highlight ${highlightName ? 'active' : ''}`}>
                  Nick Srivastava
                </span>
              </motion.h1>
              
              <div className="h-1 w-40 mb-8" style={{ background: '#0e3638' }} />

              <h2 className="text-[32px] font-light mb-12" style={{ color: '#038c8c' }}>
                Founder & CEO
              </h2>

              <div className="text-[18px] leading-[1.9] mb-12 space-y-6">
                <p>
                  Nick studied Computer Science, Data Science, and Economics at the University of California, Berkeley before leaving to build Triage full time. He specializes in backend systems, artificial intelligence, and applied machine learning, and has worked with Mercor and Berkeley's Artificial Intelligence Research (BAIR) Lab.
                </p>
                <p className="font-medium text-[19px]">
                  At 19, he set out to make embedded security accessible, continuous, and default for modern software teams.
                </p>
              </div>

              <div className="mb-10">
                <a 
                  href="mailto:srivastavan@berkeley.edu"
                  className="text-[20px] font-medium hover:opacity-70 transition-opacity"
                  style={{ color: '#038c8c' }}
                >
                  srivastavan@berkeley.edu
                </a>
              </div>

              <a
                href="https://www.linkedin.com/in/srivastavan/"
                target="_blank"
                rel="noopener noreferrer"
                className="team-linkedin-btn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </motion.div>

          {/* Coming Soon Section */}
          <motion.div
            className="text-center py-16 border-t"
            style={{ borderColor: 'rgba(14, 54, 56, 0.15)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-[36px] font-light mb-12">Rest of Team: Coming Soon</h3>
            
            <div>
              <p className="text-[18px] mb-6 font-light">Want to Join Us?</p>
              <Link 
                href="/careers"
                className="team-careers-btn"
              >
                View Open Positions →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .team-name-highlight {
          position: relative;
          display: inline-block;
        }

        .team-name-highlight::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 8px;
          width: 0;
          height: 100%;
          background: rgba(3, 140, 140, 0.15);
          z-index: -1;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .team-name-highlight.active::after {
          width: 100%;
        }

        .team-linkedin-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          background: #0e3638;
          color: #f6f4f1;
          font-size: 17px;
          font-weight: 500;
          border: 2px solid #0e3638;
          transition: all 0.3s ease;
        }

        .team-linkedin-btn:hover {
          background: transparent;
          color: #0e3638;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(14, 54, 56, 0.15);
        }

        .team-careers-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: #0e3638;
          color: #f6f4f1;
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .team-careers-btn:hover {
          background: #038c8c;
          transform: translateX(4px);
        }
      `}</style>
    </main>
  );
}