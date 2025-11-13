'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CodeDiffView, AllChecksPassed } from '../../components/GitHubElements';

export default function SecurityScanner() {
  return (
    <main className="min-h-screen bg-bg-primary text-pale-wood">
      {/* Header */}
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
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <h1 className="text-[64px] font-light mb-6 leading-[1.1]">
              <span className="highlight-solid cyan text-cyan">Security Scanner</span>
            </h1>
            <p className="text-[24px] leading-[1.6] text-pale-wood/80 max-w-4xl">
              Computer Use Agents that operate inside hardened virtual machines to discover vulnerabilities across desktop, web, and backend infrastructure
            </p>
          </motion.div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: 'Multi-Platform Coverage',
                desc: 'Unified scanning across Linux, macOS, and Windows environments'
              },
              {
                title: 'Dynamic Analysis',
                desc: 'Active probing of HTTP endpoints, RPC interfaces, and desktop clients'
              },
              {
                title: 'Exploit-Aware',
                desc: 'Retrieval over vulnerability databases for structured attack families'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="feature-card-scanner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-[20px] mb-3 text-cyan">{feature.title}</h3>
                <p className="text-[15px] leading-[1.7] text-pale-wood/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-[40px] font-light mb-12">How It Works</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-[24px] mb-4 text-pale-wood">Environment Provisioning</h3>
                <p className="text-[17px] leading-[1.8] text-pale-wood/80 mb-6">
                  The system provisions ephemeral VMs per run, configures network routing and credentials, and hands control to Computer Use Agents. Each agent receives a scoped environment including desktop applications, browsers, backend services, APIs, and local infrastructure.
                </p>
                
                <div className="scanner-env-viz">
                  <div className="env-item">
                    <div className="env-icon">▣</div>
                    <div className="env-label">Desktop Apps & Browsers</div>
                  </div>
                  <div className="env-item">
                    <div className="env-icon">◆</div>
                    <div className="env-label">Backend Services</div>
                  </div>
                  <div className="env-item">
                    <div className="env-icon">◈</div>
                    <div className="env-label">Local Infrastructure</div>
                  </div>
                  <div className="env-item">
                    <div className="env-icon">◉</div>
                    <div className="env-label">Production-like Deployments</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[24px] mb-4 text-pale-wood">Agent Behavior</h3>
                <p className="text-[17px] leading-[1.8] text-pale-wood/80">
                  CUA agents behave like a disciplined red team: they drive the UI, execute CLI commands, navigate browsers, install tools, and chain system calls to discover vulnerabilities that only show up in realistic workflows.
                </p>
              </div>

              <div className="scanner-analysis-grid">
                <div className="analysis-box">
                  <div className="analysis-title">Dynamic Analysis</div>
                  <div className="analysis-desc">Active probing of endpoints and interfaces from within the VM</div>
                </div>
                <div className="analysis-box">
                  <div className="analysis-title">Static Cues</div>
                  <div className="analysis-desc">Hints from code graph to prioritize high-risk components</div>
                </div>
                <div className="analysis-box">
                  <div className="analysis-title">Exploit Corpora</div>
                  <div className="analysis-desc">Structured attack families from vulnerability databases</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Demo */}
          <div className="mb-20">
            <h2 className="text-[40px] font-light mb-12">In Action</h2>
            <AllChecksPassed />
          </div>

          {/* CTA */}
          <div className="text-center py-16 bg-bg-secondary border border-pale-wood/20 rounded-lg">
            <h3 className="text-[32px] font-light mb-6">Ready to secure your infrastructure?</h3>
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
        .feature-card-scanner {
          padding: 24px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-pale-wood)30;
          border-left: 3px solid var(--color-cyan);
          transition: all 0.3s ease;
        }

        .feature-card-scanner:hover {
          border-left-width: 5px;
          transform: translateX(4px);
        }

        .scanner-env-viz {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .env-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
        }

        .env-icon {
          font-size: 24px;
          color: var(--color-cyan);
        }

        .env-label {
          font-size: 14px;
          color: var(--color-pale-wood);
        }

        .scanner-analysis-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        .analysis-box {
          padding: 20px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-pale-wood);
        }

        .analysis-title {
          font-size: 16px;
          color: var(--color-cyan);
          margin-bottom: 8px;
          font-family: var(--font-family-mono);
        }

        .analysis-desc {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}
