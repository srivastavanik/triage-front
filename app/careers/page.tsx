'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Careers() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const positions = [
    {
      title: 'AI Engineer — Computer Use, Training & Inference',
      department: 'Engineering',
      contract: 'Full-time',
      location: 'On-site, San Francisco',
      posted: 'September 29, 2025',
      description: [
        'Build models that reliably operate computers. You will turn computer-use telemetry into skills that navigate sandboxed VMs, choose the right tools, recover from errors, and produce safe, auditable PRs. You will own pre-training and post-training loops, dataset hygiene, and serving that meets strict p95 and p99 targets.',
        'You will run training on cloud clusters, distill to smaller controllers where it helps control loops, and deploy high-throughput inference with strong safety gates. The standard is production behavior, not lab demos. Success is higher task win-rate, lower irreversibility risk, and lower cost per successful routine.'
      ]
    },
    {
      title: 'Full-Stack Software Engineer',
      department: 'Engineering',
      contract: 'Full-time',
      location: 'On-site, San Francisco',
      posted: 'September 29, 2025',
      description: [
        'Own product surfaces end to end. You will design secure workflows, ship clean UX, and stitch together services and integrations that turn security research into usable product. You will move quickly, instrument your work, and hold a high bar for reliability and readability.',
        'You will work across React and TypeScript on the client and Python or Go on the server. You will partner with security and infra to translate findings into reviewable fixes, with clear gates, rollbacks, and per-tenant isolation. Your work should feel fast, auditable, and trustworthy.'
      ]
    },
    {
      title: 'Backend Software Engineer',
      department: 'Engineering',
      contract: 'Full-time',
      location: 'On-site, San Francisco',
      posted: 'September 29, 2025',
      description: [
        'Build the core services that make agents safe, fast, and scalable. You will design APIs for agent control and VM lifecycle, schedule large workloads across ephemeral compute, and own the correctness and cost of the system. You will profile, trace, and harden the platform until it holds up under real load.',
        'Your focus is reliability and clarity. Jobs are idempotent, actions are capability-scoped, and evidence is captured deterministically. You will turn complex distributed behavior into simple, well-documented services that others can build on without fear.'
      ]
    },
    {
      title: 'Cybersecurity SME + Engineer',
      department: 'Engineering',
      contract: 'Full-time',
      location: 'On-site, San Francisco',
      posted: 'September 29, 2025',
      description: [
        'Translate tradecraft into product. You will design adversarial test suites across web, mobile, CI, and cloud, then encode what works into repeatable checks and safe fixes. Your work will harden our sandboxing and network policy and raise the signal-to-noise ratio of findings.',
        'You write clearly, reason from threat models, and show the limits of each approach. The output is not a one-off report. It is a durable capability: detections, telemetry, confidence scoring, and guidance that help teams merge with confidence.'
      ]
    },
    {
      title: 'Software Engineer Intern (Summer 2026)',
      department: 'Intern',
      contract: 'Internship',
      location: 'On-site, San Francisco',
      posted: 'September 29, 2025',
      description: [
        'Ship something real and leave it running. You will own a scoped project that lands in production, with tests, docs, and dashboards so others can operate it after you return to school. Expect design reviews, security reviews, and fast feedback.',
        'We value curiosity, grit, and work that speaks for itself. Bring a demo, a repository, or a short write-up that shows how you think and what you ship.'
      ]
    },
    {
      title: 'Tell Us What You Can Do (Open Application)',
      department: 'General',
      contract: 'Full-time',
      location: 'On-site, San Francisco',
      posted: 'September 29, 2025',
      description: [
        'If you do not see a perfect fit but can bend our roadmap, tell us how. Describe the problem you would own, how you would measure success, and why you are the one to deliver it. We care about clear thinking, decisive execution, and respect for safety.'
      ]
    }
  ];

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
              <Link href="/" className="hover:text-cyan transition-colors">How it works</Link>
              <Link href="/careers" className="text-cyan">Careers</Link>
              <Link href="/team" className="hover:text-cyan transition-colors">Team</Link>
              <a href="mailto:srivastavan@berkeley.edu" className="hover:text-cyan transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20">
        <div className="container-max max-w-6xl">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-pale-wood/60 hover:text-pale-wood mb-12 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to all Careers
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-[64px] font-light mb-8 leading-[1.1]">
              Build the future of <span className="text-cyan">DevSecOps</span> with us.
            </h1>
            <div className="text-[18px] leading-[1.8] space-y-6 max-w-4xl">
              <p>
                <span className="font-medium">Triage</span> builds autonomous, safety-gated security engineers. We orchestrate AI agents across static analysis, runtime adversarial testing in isolated VMs, and automated remediation PRs.
              </p>
              <p>
                Security today is fragmented and reactive. Tool sprawl, rising cloud cost, and faster release cycles have outpaced human-only workflows. The result: risk compounds while teams stall. That approach won't scale. We are rewiring the security lifecycle around agents that are auditable, reliable, and fast.
              </p>
              <p>
                We are a small, technical team with deep experience in AI, systems, and security. <span className="text-cyan font-medium">We work to win.</span> If you have an edge, reach out.
              </p>
            </div>
          </motion.div>

          {/* Positions Header */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[18px] font-mono uppercase tracking-wider">OPEN POSITIONS</h2>
            <div className="px-4 py-2 bg-cream text-midnight-green font-mono text-[14px] font-medium">
              {positions.length}
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-3 gap-6 mb-12 max-w-3xl">
            <div>
              <label className="block text-[11px] text-pale-wood/60 font-mono mb-2 uppercase tracking-wider">DEPARTMENT</label>
              <select className="career-select">
                <option>All</option>
                <option>Engineering</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-pale-wood/60 font-mono mb-2 uppercase tracking-wider">CONTRACT</label>
              <select className="career-select">
                <option>All</option>
                <option>Full-time</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-pale-wood/60 font-mono mb-2 uppercase tracking-wider">LOCATION</label>
              <select className="career-select">
                <option>All</option>
                <option>On-site, San Francisco</option>
              </select>
            </div>
          </div>

          {/* Positions List */}
          <div className="space-y-0 border border-pale-wood/20">
            {positions.map((position, i) => (
              <div
                key={i}
                className="career-listing-collapsible"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="career-listing-header"
                >
                  <div className="flex-1">
                    <h3 className="text-[24px] font-light mb-2">{position.title}</h3>
                    <div className="text-[13px] text-pale-wood/60">Posted {position.posted}</div>
                  </div>
                  
                  <div className="career-meta-inline">
                    <div className="meta-inline-item">
                      <span className="meta-inline-label">DEPARTMENT</span>
                      <span className="meta-inline-value">{position.department}</span>
                    </div>
                    <div className="meta-inline-item">
                      <span className="meta-inline-label">CONTRACT</span>
                      <span className="meta-inline-value">{position.contract}</span>
                    </div>
                    <div className="meta-inline-item">
                      <span className="meta-inline-label">LOCATION</span>
                      <span className="meta-inline-value">{position.location}</span>
                    </div>
                  </div>

                  <a 
                    href={`mailto:srivastavan@berkeley.edu?subject=${encodeURIComponent(position.title + ' - Triage')}`}
                    className="apply-button"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Apply
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </button>

                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="career-expanded-content">
                        <div className="career-description">
                          {position.description.map((para, j) => (
                            <p key={j}>{para}</p>
                          ))}
                        </div>

                        {/* To Apply - Right under description */}
                        <div className="to-apply-section">
                          <h4 className="text-[16px] font-medium mb-4">To Apply:</h4>
                          <div className="space-y-3 text-[15px] leading-[1.8]">
                            <p>
                              <span className="text-cyan font-medium">1.</span> Email{' '}
                              <a href="mailto:srivastavan@berkeley.edu" className="text-cyan underline">
                                srivastavan@berkeley.edu
                              </a>{' '}
                              with your resume, LinkedIn, GitHub, what makes you amazing, and what you can own end-to-end.
                            </p>
                            <p>
                              <span className="text-cyan font-medium">2.</span> Wait to hear back.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}