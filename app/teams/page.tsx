'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SiteNav } from '../../components/SiteNav';
import { EconomicsGraph } from '../../components/EconomicsGraph';

// ROI Animation Component
function ROIFormula() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [phase, setPhase] = useState(0);
  
  const terms = [
    { text: 'reduced incidents', delay: 0 },
    { text: ' + ', delay: 0.8, isOperator: true },
    { text: 'reduced engineering time', delay: 1.2 },
    { text: ' + ', delay: 2.0, isOperator: true },
    { text: 'reduced inference waste', delay: 2.4 },
    { text: ' + ', delay: 3.2, isOperator: true },
    { text: 'reduced churn', delay: 3.6 },
    { text: ' − ', delay: 4.2, isOperator: true },
    { text: 'platform cost', delay: 4.6 },
  ];
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setPhase(1), 5800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);
  
  return (
    <div ref={ref} className="py-8">
      <div className="text-[14px] md:text-[16px] leading-relaxed font-light">
        <span className="text-text-muted">(</span>
        {terms.map((term, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: term.delay }}
            className={term.isOperator ? 'text-text-muted' : 'text-text-primary'}
          >
            {term.text}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: 5.0 }}
          className="text-text-muted"
        >
          )
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: 5.2 }}
          className="text-text-muted"
        >
          {' '}={' '}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 5.4 }}
          className={`inline-block font-medium ${phase === 1 ? 'bg-[#22c55e] text-[#000000] px-1.5 py-0.5' : 'text-text-primary'}`}
        >
          ROI
        </motion.span>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const OPERATING_MODELS = [
    {
      title: 'Security-owned deployment',
      role: 'CISO / AppSec / SecEng',
      desc: 'A security team owns policy and risk posture, and uses Triage to monitor AI execution paths, investigate incidents, and enforce controls across products.',
      changes: [
        'Opaque model behavior becomes inspectable traces',
        'Incident response time drops dramatically',
        'Controls scale without multiplying headcount',
      ],
      outputs: [
        'Policy gates for prompt/tool behavior',
        'Centralized investigations with evidence',
        'Security reporting on runtime events',
      ],
    },
    {
      title: 'Engineering-owned deployment',
      role: 'Platform / Infra / Product',
      desc: 'Engineers use Triage as part of shipping. They instrument AI features, observe failures and regressions, and remediate issues before they become incidents.',
      changes: [
        'Failures become reproducible, not anecdotal',
        'Regressions get caught before shipping',
        'Wasted spend on retries disappears',
      ],
      outputs: [
        'Debuggable traces for agent behavior',
        'Guardrails in CI/CD for prompt changes',
        'Lower latency and cost via tuning',
      ],
    },
    {
      title: 'Shared deployment',
      role: 'Recommended',
      desc: 'Security defines the policy and severity model. Engineering owns uptime, quality, and velocity. Triage becomes the shared runtime layer.',
      changes: [
        'Fewer handoffs, fewer "can\'t reproduce" loops',
        'Controls that ship with code, not against it',
        'One trace format for audit and incident response',
      ],
      outputs: [
        'Unified governance and velocity',
        'Shared visibility into risk and reliability',
        'Faster feedback loops for all teams',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f4f0] font-sans selection:bg-[#C9A37E] selection:text-[#000000]">
      <SiteNav />

      {/* Hero Section */}
      <section className="pt-40 pb-24 relative bg-[#0a0a0a] overflow-hidden">
        {/* Right side economics graph animation */}
        <div className="absolute top-0 right-0 w-1/2 h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />
          <EconomicsGraph />
        </div>

        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-[48px] lg:text-[72px] font-normal leading-[1.05] tracking-[-0.03em] mb-8 text-[#C9A37E]">
              Security and economics for AI systems
            </h1>
            <p className="text-[20px] lg:text-[24px] leading-relaxed max-w-2xl mb-8 text-[#d8b78f]">
              Built for CISOs. Adopted by builders. <br />
              <span className="text-white font-medium drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">One platform for AI security outcomes.</span>
            </p>
            
            <p className="text-[16px] leading-relaxed max-w-2xl text-white/80">
              Triage secures LLM-powered products across inference, retrieval, and training workflows. It works as a security control for traditional environments or as a daily engineering tool for teams shipping AI features. Same data, same controls, different ownership models.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Positioning + Use Cases Merged */}
      <section className="py-24 border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div>
              <h2 className="text-[32px] lg:text-[40px] font-normal leading-[1.1] tracking-[-0.02em] mb-8">
                Not a single "team product." A security system that adapts to how you run.
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-text-secondary text-[16px] leading-relaxed">
                AI changes the shape of the attack surface. The failure modes are not confined to code. They include prompts, tool calls, retrieval chains, data curation, evaluation harnesses, and model routing.
              </p>
              <p className="text-text-secondary text-[16px] leading-relaxed">
                Triage is intentionally malleable: it can be owned by a security organization, embedded into a platform team, or used directly by the engineers building AI systems.
              </p>
              
              <div className="space-y-3 pt-4">
                <p className="text-text-primary">Centralized governance when you need policy, auditability, and control.</p>
                <p className="text-text-primary">Developer-native workflows when you need speed, iteration, and coverage.</p>
                <p className="text-text-primary">A shared source of truth so security and engineering stop arguing about what happened.</p>
              </div>
            </div>
          </div>
          
          {/* Merged Use Cases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-[#1a1a1a]">
            <div>
              <h3 className="text-[18px] font-medium text-text-primary mb-5">For traditional security teams</h3>
              <div className="space-y-3">
                <p className="text-[15px] text-text-secondary">Centralized AI telemetry, investigations, and policy enforcement</p>
                <p className="text-[15px] text-text-secondary">Runtime guardrails for tool use, data access, and exfiltration patterns</p>
                <p className="text-[15px] text-text-secondary">Audit-ready evidence across inference, retrieval, and training pipelines</p>
              </div>
            </div>
            <div>
              <h3 className="text-[18px] font-medium text-text-primary mb-5">For startups and product teams</h3>
              <div className="space-y-3">
                <p className="text-[15px] text-text-secondary">Trace-driven debugging of agents and RAG systems</p>
                <p className="text-[15px] text-text-secondary">Regression detection for prompts, retrieval, and routing</p>
                <p className="text-[15px] text-text-secondary">Cost controls across tokens, latency, retries, and provider usage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose your operating model */}
      <section className="py-32 bg-[#000000]">
        <div className="container-max">
          <div className="mb-16">
            <h2 className="text-[36px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-4">
              Choose your operating model
            </h2>
            <p className="text-text-secondary text-[18px]">
              Deploy Triage to fit your org structure, not the other way around.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
            {OPERATING_MODELS.map((model, idx) => (
              <div 
                key={idx}
                className="bg-[#0a0a0a] p-8 flex flex-col"
              >
                <div className="mb-8">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#C9A37E] mb-3">
                    {model.role}
                  </div>
                  <h3 className="text-[24px] font-medium text-text-primary mb-4">
                    {model.title}
                  </h3>
                  <p className="text-text-secondary text-[15px] leading-relaxed">
                    {model.desc}
                  </p>
                </div>

                <div className="space-y-8 mt-auto">
                  <div>
                    <h4 className="text-[13px] font-medium text-text-primary mb-4">What changes for you</h4>
                    <div className="space-y-2">
                      {model.changes.map((item, i) => (
                        <p key={i} className="text-[13px] text-text-muted">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-medium text-text-primary mb-4">Typical outputs</h4>
                    <div className="space-y-2">
                      {model.outputs.map((item, i) => (
                        <p key={i} className="text-[13px] text-text-muted">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Economic Utility */}
      <section className="py-32 bg-[#0a0a0a] border-y border-[#1a1a1a]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-[40px] lg:text-[56px] font-normal leading-[1.05] tracking-[-0.03em] mb-8">
                Security that pays for itself
              </h2>
              <p className="text-text-secondary text-[18px] leading-relaxed mb-6">
                AI systems incur costs in places most teams do not measure: inference waste, retrieval noise, tool failures, latent prompt regressions, and incident response time. Triage makes these measurable and controllable.
              </p>
              
              {/* Animated ROI Formula */}
              <ROIFormula />
            </div>

            <div className="border border-[#1a1a1a] overflow-hidden">
              {[
                { title: 'Risk-adjusted loss', desc: 'Fewer successful exploits, smaller blast radius, higher confidence in control effectiveness.' },
                { title: 'Engineering time', desc: 'Faster debugging, fewer escalations, fewer recurring failure patterns.' },
                { title: 'Compute spend', desc: 'Fewer retries, better routing, lower token waste, reduced provider churn.' },
                { title: 'Support and uptime', desc: 'Fewer "AI did something weird" tickets, less downtime, fewer rollbacks.' },
                { title: 'Compliance overhead', desc: 'Evidence-quality telemetry for audits and reviews, without manual log stitching.' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[#0a0a0a] border-b border-[#1a1a1a] last:border-b-0 flex flex-col md:flex-row md:items-center gap-4">
                  <h3 className="w-48 text-[15px] font-medium text-text-primary shrink-0">{item.title}</h3>
                  <p className="text-[14px] text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Persona Grid - Redesigned */}
      <section className="py-32 bg-[#000000]">
        <div className="container-max">
          <h2 className="text-[36px] font-normal tracking-[-0.02em] mb-16">Who uses Triage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
            {[
              {
                role: 'CISO / Security Leadership',
                tagline: 'Own the risk posture',
                points: ['Own policy, reporting, and risk posture for AI products.', 'Get evidence, not opinions: what the model saw, what it did, what tools ran.', 'Prove controls work at runtime.']
              },
              {
                role: 'AppSec / Product Security',
                tagline: 'Make AI testable',
                points: ['Turn AI behavior into enforceable, testable rules.', 'Catch prompt and retrieval regressions before they ship.', 'Reduce "unknown unknowns" in agent workflows.']
              },
              {
                role: 'Platform / Infrastructure',
                tagline: 'Standardize instrumentation',
                points: ['Standardize instrumentation and guardrails across teams.', 'Reduce cost variance, timeouts, and provider failure modes.', 'Monitor reliability across model providers and tool chains.']
              },
              {
                role: 'AI Engineers',
                tagline: 'Debug with context',
                points: ['Debug agent behavior with full execution context.', 'Validate retrieval quality and prevent data leakage.', 'Close the loop between eval failures and production traces.']
              }
            ].map((card, i) => (
              <div key={i} className="bg-[#0a0a0a] p-10 flex flex-col">
                <div className="mb-6">
                  <p className="text-[11px] uppercase tracking-widest text-text-muted mb-2">{card.tagline}</p>
                  <h3 className="text-[20px] font-medium text-text-primary">{card.role}</h3>
                </div>
                <div className="space-y-3 mt-auto">
                  {card.points.map((pt, j) => (
                    <p key={j} className="text-[14px] text-text-secondary leading-relaxed">
                      {pt}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it lands / Adoption - Simplified */}
      <section className="py-32 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="container-max">
          <div className="max-w-2xl mb-16">
            <h2 className="text-[36px] font-normal tracking-[-0.02em] mb-4">Adoption that matches your constraints</h2>
            <p className="text-text-secondary text-[17px]">
              Some teams start with governance. Others start with engineering pain. Triage supports both entry points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
            <div className="bg-[#000000] p-10">
              <div className="text-[12px] uppercase tracking-wider text-[#C9A37E] mb-6">Start from Governance</div>
              <div className="space-y-4">
                <p className="text-text-primary text-[15px]">1. Define policies and severity thresholds</p>
                <p className="text-text-primary text-[15px]">2. Instrument critical systems</p>
                <p className="text-text-primary text-[15px]">3. Expand coverage with standard controls</p>
              </div>
            </div>
            <div className="bg-[#000000] p-10">
              <div className="text-[12px] uppercase tracking-wider text-[#C9A37E] mb-6">Start from Engineering</div>
              <div className="space-y-4">
                <p className="text-text-primary text-[15px]">1. Instrument one high-traffic AI workflow</p>
                <p className="text-text-primary text-[15px]">2. Use traces to remove latency/failure hotspots</p>
                <p className="text-text-primary text-[15px]">3. Add guardrails once you have observability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 border-t border-[#1a1a1a] bg-[#000000] text-center">
        <div className="container-max max-w-3xl mx-auto">
          <h2 className="text-[40px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
            Deploy it as a security product or an engineering system.
          </h2>
          <p className="text-[20px] text-text-secondary mb-10">
            The outcome is the same: Lower AI risk. Lower operating cost. Faster iteration.
          </p>
          <a href="mailto:srivastavan@berkeley.edu" className="inline-block bg-[#f5f4f0] text-[#000000] px-10 py-4 font-medium hover:bg-[#dbd7ca] transition-colors">
            Talk to us
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="container-max max-w-3xl mx-auto space-y-12">
          {[
            {
              q: 'Is Triage for security teams or engineering teams?',
              a: 'Both. The platform is designed so ownership can sit with security, engineering, or a shared model without duplicating tooling.'
            },
            {
              q: 'Does this slow teams down?',
              a: 'The goal is the opposite: make AI failures reproducible and prevent regressions early, so teams spend less time firefighting.'
            },
            {
              q: 'Where does the economic value actually come from?',
              a: 'From measurable reductions in incident cost, engineering time, compute waste, and quality regressions that spill into support and churn.'
            }
          ].map((item, i) => (
            <div key={i}>
              <h3 className="text-[18px] font-medium text-text-primary mb-3">{item.q}</h3>
              <p className="text-text-secondary text-[15px] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                triage
              </span>
            </Link>
            <p className="text-text-muted text-[13px]">
              © 2025 Triage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
