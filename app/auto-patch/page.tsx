'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CodeDiffView, MergeStatus } from '../../components/GitHubElements';

export default function AutoPatch() {
  return (
    <main className="min-h-screen bg-bg-primary text-pale-wood">
      <nav className="fixed w-full top-0 z-50 backdrop-blur-dark border-b border-border">
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
            <div className="flex items-center gap-8 text-[15px]">
              <Link href="/" className="hover:text-cyan transition-colors">Product</Link>
              <Link href="/careers" className="hover:text-cyan transition-colors">Careers</Link>
              <Link href="/team" className="hover:text-cyan transition-colors">Team</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20">
        <div className="container-max max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
            <h1 className="text-[64px] font-light mb-6 leading-[1.1]">
              <span className="highlight-solid cyan text-cyan">Auto-Patch Generator</span>
            </h1>
            <p className="text-[24px] leading-[1.6] text-pale-wood/80 max-w-4xl">
              Framework-aware security fixes that align with your coding style and are automatically validated before deployment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <h2 className="text-[32px] font-light mb-8">The Process</h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Scoping', desc: 'Code graph limits patches to the smallest responsible region' },
                  { step: '02', title: 'Synthesis', desc: 'Security models generate framework-aware fixes' },
                  { step: '03', title: 'Validation', desc: 'Runs tests and exploit replays to verify the fix' },
                  { step: '04', title: 'Packaging', desc: 'Creates PR with evidence and risk rationale' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="process-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="step-num">{item.step}</div>
                    <div>
                      <div className="step-title">{item.title}</div>
                      <div className="step-desc">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="visual-label">LIVE PATCH GENERATION</div>
              <CodeDiffView />
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-[32px] font-light mb-8">Framework-Aware Fixes</h2>
            <p className="text-[17px] leading-[1.8] text-pale-wood/80 mb-8">
              The generator is tightly integrated with Golden Repository data, reusing patterns from previously accepted fixes in your organization. This improves both correctness and developer trust by ensuring patches match your team's conventions.
            </p>
            <MergeStatus />
          </div>

          <div className="text-center py-16 bg-bg-secondary border border-pale-wood/20 rounded-lg">
            <h3 className="text-[32px] font-light mb-6">Start automating security fixes</h3>
            <a 
              href="mailto:srivastavan@berkeley.edu"
              className="inline-block px-10 py-4 bg-cyan text-midnight-green text-[17px] font-medium hover:bg-pale-wood transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .process-step {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: var(--color-bg-secondary);
          border-left: 2px solid var(--color-cyan);
        }

        .step-num {
          font-size: 28px;
          font-family: var(--font-family-mono);
          color: var(--color-cyan);
          font-weight: 300;
        }

        .step-title {
          font-size: 18px;
          color: var(--color-pale-wood);
          margin-bottom: 4px;
        }

        .step-desc {
          font-size: 15px;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}
