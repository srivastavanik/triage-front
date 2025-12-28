'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SiteNav } from '../../components/SiteNav';

export default function TeamsPage() {
  const [activeModel, setActiveModel] = useState<number>(0);

  const OPERATING_MODELS = [
    {
      title: 'Security-owned deployment',
      role: 'CISO / AppSec / SecEng',
      desc: 'A security team owns policy and risk posture, and uses Triage to monitor AI execution paths, investigate incidents, and enforce controls across products.',
      economics: [
        'Reduces breach probability by turning opaque behavior into traces',
        'Lowers incident response cost by shortening RCA time',
        'Standardizes controls without multiplying headcount',
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
      economics: [
        'Cuts wasted spend from retries & bad routing',
        'Prevents quality regressions hitting retention',
        'Speeds delivery by making failures reproducible',
      ],
      outputs: [
        'Debuggable traces for agent behavior',
        'Guardrails in CI/CD for prompt changes',
        'Lower latency/cost via tuning',
      ],
    },
    {
      title: 'Shared deployment',
      role: 'Recommended',
      desc: 'Security defines the policy and severity model. Engineering owns uptime, quality, and velocity. Triage becomes the shared runtime layer.',
      economics: [
        'Less organizational drag & fewer handoffs',
        'Controls that do not block delivery',
        'A single trace format for audit & incident response',
      ],
      outputs: [
        'Unified governance & velocity',
        'Shared visibility into risk & reliability',
        'Faster feedback loops for all teams',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#000000] text-[#f5f4f0] font-sans selection:bg-[#C9A37E] selection:text-[#000000]">
      <SiteNav />

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#1a1a1a] to-transparent opacity-20 pointer-events-none" />
        
        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-[48px] lg:text-[72px] font-normal leading-[1.05] tracking-[-0.03em] mb-8">
              Security and economics for AI systems
            </h1>
            <p className="text-[20px] lg:text-[24px] text-text-secondary leading-relaxed max-w-2xl mb-12">
              Built for CISOs. Adopted by builders. <br />
              <span className="text-text-primary">One platform for AI security outcomes.</span>
            </p>
            
            <p className="text-[16px] text-text-muted leading-relaxed max-w-2xl mb-12">
              Triage secures LLM-powered products across inference, retrieval, and training workflows. It works as a security control for traditional environments or as a daily engineering tool for teams shipping AI features. Same data, same controls, different ownership models.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:srivastavan@berkeley.edu" className="bg-[#f5f4f0] text-[#000000] px-8 py-4 rounded-lg font-medium hover:bg-[#dbd7ca] transition-colors text-center">
                Request access
              </a>
              <Link href="/#product" className="px-8 py-4 rounded-lg font-medium border border-[#2d2d2d] hover:bg-[#1a1a1a] transition-colors text-center text-text-secondary">
                See how teams deploy it
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Positioning */}
      <section className="py-24 border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-[32px] lg:text-[40px] font-normal leading-[1.1] tracking-[-0.02em] mb-8">
                Not a single "team product." A security system that adapts to how you run.
              </h2>
            </div>
            <div className="space-y-8">
              <p className="text-text-secondary text-[16px] leading-relaxed">
                AI changes the shape of the attack surface. The failure modes are not confined to code. They include prompts, tool calls, retrieval chains, data curation, evaluation harnesses, and model routing.
              </p>
              <p className="text-text-secondary text-[16px] leading-relaxed">
                Triage is intentionally malleable: it can be owned by a security organization, embedded into a platform team, or used directly by the engineers building AI systems.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  'Centralized governance when you need policy, auditability, and control.',
                  'Developer-native workflows when you need speed, iteration, and coverage.',
                  'A shared source of truth so security and engineering stop arguing about what happened.'
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A37E] mt-2.5 shrink-0" />
                    <p className="text-text-primary">{item}</p>
                  </div>
                ))}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {OPERATING_MODELS.map((model, idx) => (
              <div 
                key={idx}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 flex flex-col hover:border-[#2d2d2d] transition-colors"
              >
                <div className="mb-6">
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

                <div className="space-y-6 mt-auto">
                  <div>
                    <h4 className="text-[13px] font-medium text-text-primary mb-3">Why it wins economically</h4>
                    <ul className="space-y-2">
                      {model.economics.map((item, i) => (
                        <li key={i} className="text-[13px] text-text-muted flex gap-2">
                          <span className="text-[#2d2d2d]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-medium text-text-primary mb-3">Typical outputs</h4>
                    <ul className="space-y-2">
                      {model.outputs.map((item, i) => (
                        <li key={i} className="text-[13px] text-text-muted flex gap-2">
                          <span className="text-[#2d2d2d]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
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
              <p className="text-text-secondary text-[18px] leading-relaxed mb-8">
                AI systems incur costs in places most teams do not measure: inference waste, retrieval noise, tool failures, latent prompt regressions, and incident response time. Triage makes these measurable and controllable.
              </p>
              
              <div className="p-6 bg-[#121212] border border-[#1a1a1a] rounded-lg">
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#C9A37E] mb-4">Simple ROI Framing</h4>
                <p className="font-mono text-[13px] text-text-primary leading-relaxed">
                  ROI = (reduced incidents + reduced engineering time + reduced inference waste + reduced churn) − platform cost
                </p>
              </div>
            </div>

            <div className="space-y-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl overflow-hidden">
              {[
                { title: 'Risk-adjusted loss', desc: 'Fewer successful exploits, smaller blast radius, higher confidence in control effectiveness.' },
                { title: 'Engineering time', desc: 'Faster debugging, fewer escalations, fewer recurring failure patterns.' },
                { title: 'Compute spend', desc: 'Fewer retries, better routing, lower token waste, reduced provider churn.' },
                { title: 'Support and uptime', desc: 'Fewer "AI did something weird" tickets, less downtime, fewer rollbacks.' },
                { title: 'Compliance overhead', desc: 'Evidence-quality telemetry for audits and reviews, without manual log stitching.' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[#0a0a0a] flex flex-col md:flex-row md:items-center gap-4 hover:bg-[#121212] transition-colors">
                  <h3 className="w-48 text-[15px] font-medium text-text-primary shrink-0">{item.title}</h3>
                  <p className="text-[14px] text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Persona Grid */}
      <section className="py-32 bg-[#000000]">
        <div className="container-max">
          <h2 className="text-[32px] font-normal tracking-[-0.02em] mb-12">Who uses Triage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: 'CISO / Security Leadership',
                points: ['Own policy, reporting, and risk posture.', 'Get evidence, not opinions.', 'Prove controls work at runtime.']
              },
              {
                role: 'AppSec / Product Security',
                points: ['Turn AI behavior into enforceable rules.', 'Catch regressions before they ship.', 'Reduce "unknown unknowns".']
              },
              {
                role: 'Platform / Infrastructure',
                points: ['Standardize instrumentation across teams.', 'Reduce cost variance & timeouts.', 'Monitor reliability across providers.']
              },
              {
                role: 'AI Engineers',
                points: ['Debug agent behavior with context.', 'Validate retrieval quality.', 'Close loop between evals & prod.']
              }
            ].map((card, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 flex flex-col h-full hover:border-[#2d2d2d] transition-colors">
                <h3 className="text-[16px] font-bold text-text-primary mb-4">{card.role}</h3>
                <ul className="space-y-3 mt-auto">
                  {card.points.map((pt, j) => (
                    <li key={j} className="text-[13px] text-text-muted leading-relaxed">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[20px] font-medium text-text-primary mb-6">For traditional security teams</h3>
              <ul className="space-y-4">
                {[
                  'Centralized AI telemetry, investigations, and policy enforcement',
                  'Runtime guardrails for tool use, data access, and exfiltration patterns',
                  'Audit-ready evidence across inference, retrieval, and training pipelines'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-text-secondary">
                    <span className="text-[#C9A37E] mt-1.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[20px] font-medium text-text-primary mb-6">For startups and product teams</h3>
              <ul className="space-y-4">
                {[
                  'Trace-driven debugging of agents and RAG systems',
                  'Regression detection for prompts, retrieval, and routing',
                  'Cost controls across tokens, latency, retries, and provider usage'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-text-secondary">
                    <span className="text-[#C9A37E] mt-1.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it lands / Adoption */}
      <section className="py-32 bg-[#000000]">
        <div className="container-max">
          <div className="max-w-2xl mb-16">
            <h2 className="text-[36px] font-normal tracking-[-0.02em] mb-4">Adoption that matches your constraints</h2>
            <p className="text-text-secondary text-[17px]">
              Some teams start with governance. Others start with engineering pain. Triage supports both entry points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-[#1a1a1a] rounded-xl p-8 bg-gradient-to-b from-[#0a0a0a] to-[#000000]">
              <div className="text-[12px] uppercase tracking-wider text-[#C9A37E] mb-4">Start from Governance</div>
              <ul className="space-y-3">
                <li className="text-text-primary text-[15px]">1. Define policies and severity thresholds</li>
                <li className="text-text-primary text-[15px]">2. Instrument critical systems</li>
                <li className="text-text-primary text-[15px]">3. Expand coverage with standard controls</li>
              </ul>
            </div>
            <div className="border border-[#1a1a1a] rounded-xl p-8 bg-gradient-to-b from-[#0a0a0a] to-[#000000]">
              <div className="text-[12px] uppercase tracking-wider text-[#C9A37E] mb-4">Start from Engineering</div>
              <ul className="space-y-3">
                <li className="text-text-primary text-[15px]">1. Instrument one high-traffic AI workflow</li>
                <li className="text-text-primary text-[15px]">2. Use traces to remove latency/failure hotspots</li>
                <li className="text-text-primary text-[15px]">3. Add guardrails once you have observability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 border-t border-[#1a1a1a] bg-[#0a0a0a] text-center">
        <div className="container-max max-w-3xl mx-auto">
          <h2 className="text-[40px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
            Deploy it as a security product or an engineering system.
          </h2>
          <p className="text-[20px] text-text-secondary mb-10">
            The outcome is the same: Lower AI risk. Lower operating cost. Faster iteration.
          </p>
          <a href="mailto:srivastavan@berkeley.edu" className="inline-block bg-[#f5f4f0] text-[#000000] px-10 py-4 rounded-lg font-medium hover:bg-[#dbd7ca] transition-colors">
            Talk to us
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#000000] border-t border-[#1a1a1a]">
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
      
      {/* Footer is handled by layout/page structure, but we can add standard footer here if needed or let layout handle it. 
          Assuming standard footer is globally applied or manually added. Adding standard footer structure here to match other pages. */}
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

