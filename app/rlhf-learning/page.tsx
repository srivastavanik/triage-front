'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CommitTimeline } from '../../components/SecurityHeatmap';

export default function RLHFLearning() {
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
              <span className="highlight-solid cyan text-cyan">RLHF Learning</span>
            </h1>
            <p className="text-[24px] leading-[1.6] text-pale-wood/80 max-w-4xl">
              Continuous improvement from every merged fix, reviewer comment, and security approval - customized to your organization
            </p>
          </motion.div>

          <div className="mb-20">
            <h2 className="text-[36px] font-light mb-12">Learning Signals</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="signal-card positive">
                <div className="signal-type">Positive Rewards</div>
                <ul className="signal-list">
                  <li>Patches merged and remain stable</li>
                  <li>Minimal reviewer edits required</li>
                  <li>Accepted coding patterns</li>
                  <li>Successful exploit elimination</li>
                </ul>
              </div>
              <div className="signal-card negative">
                <div className="signal-type">Negative Feedback</div>
                <ul className="signal-list">
                  <li>Patches rejected or heavily edited</li>
                  <li>Rollbacks after deployment</li>
                  <li>Missed incidents (false negatives)</li>
                  <li>Down-scored findings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-[36px] font-light mb-12">Adaptive Policies</h2>
            <p className="text-[17px] leading-[1.8] text-pale-wood/80 mb-8">
              Learning signals update scanner priorities, agent aggressiveness, finding rankings, and patch patterns. The system converges toward what reliably raises your organization's security floor with minimal noise.
            </p>
            <CommitTimeline />
          </div>

          <div className="metrics-improvement mb-20">
            <h2 className="text-[36px] font-light mb-12">Observable Improvements</h2>
            <div className="improvement-grid">
              {[
                { metric: 'Patch Acceptance', before: '67%', after: '94%' },
                { metric: 'False Positives', before: '23%', after: '< 1%' },
                { metric: 'Time to Fix', before: '4.2 days', after: '2.3 hours' },
                { metric: 'Lines Changed', before: '142', after: '23' }
              ].map((item, i) => (
                <div key={i} className="metric-card">
                  <div className="metric-name">{item.metric}</div>
                  <div className="metric-change">
                    <span className="metric-before">{item.before}</span>
                    <span className="metric-arrow">→</span>
                    <span className="metric-after">{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-16 bg-bg-secondary border border-pale-wood/20 rounded-lg">
            <h3 className="text-[32px] font-light mb-6">See how learning improves your security</h3>
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
        .signal-card {
          padding: 24px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-pale-wood)30;
        }

        .signal-card.positive {
          border-left: 4px solid var(--color-cyan);
        }

        .signal-card.negative {
          border-left: 4px solid var(--color-pale-wood);
        }

        .signal-type {
          font-size: 20px;
          color: var(--color-pale-wood);
          margin-bottom: 16px;
          font-weight: 500;
        }

        .signal-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .signal-list li {
          font-size: 15px;
          color: var(--color-text-secondary);
          padding-left: 20px;
          position: relative;
        }

        .signal-list li::before {
          content: '◆';
          position: absolute;
          left: 0;
          color: var(--color-cyan);
          font-size: 10px;
        }

        .signal-card.negative .signal-list li::before {
          color: var(--color-pale-wood);
        }

        .improvement-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .metric-card {
          padding: 20px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-pale-wood)30;
        }

        .metric-name {
          font-size: 14px;
          color: var(--color-text-tertiary);
          margin-bottom: 12px;
          font-family: var(--font-family-mono);
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-family-mono);
        }

        .metric-before {
          font-size: 20px;
          color: var(--color-text-tertiary);
        }

        .metric-arrow {
          font-size: 20px;
          color: var(--color-cyan);
        }

        .metric-after {
          font-size: 20px;
          color: var(--color-cyan);
          font-weight: 500;
        }
      `}</style>
    </main>
  );
}
