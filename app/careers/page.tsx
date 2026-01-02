'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { JSX } from 'react';
import { useState } from 'react';
import { SiteNav } from '../../components/SiteNav';

export default function Careers(): JSX.Element {
  const [openRole, setOpenRole] = useState<number | null>(null);

  const roles = [
    {
      title: 'ML / Infra Engineer',
      mission: 'Build the data and compute substrate that makes Triage trustworthy at scale: high-fidelity telemetry ingestion, durable storage, low-latency querying, and learning loops that improve detections and remediations over time.',
      responsibilities: [
        'Design and operate multi-tenant pipelines for AI telemetry (model calls, tool traces, RAG retrievals, costs/latency/errors) with strong guarantees on ordering, integrity, and retention.',
        'Build storage and indexing systems for trace search and analytics (time-series + columnar + blob), including schema evolution and backfills without downtime.',
        'Implement evaluation and training pipelines (datasets, labeling workflows, offline/online evals, regression gates) that tie detection quality to shipped releases.',
        'Own core infrastructure: orchestration, CI/CD for data jobs, reliability, capacity planning, and cost controls (especially around high-volume trace ingest).',
        'Establish observability for the observability platform: SLIs/SLOs, anomaly detection, incident response, and automated runbooks.',
        'Harden the platform against data exfiltration and tampering risks (PII handling, encryption, access boundaries, audit logs).'
      ],
      qualifications: [
        'Strong systems background: distributed systems, streaming, storage engines, or large-scale data processing.',
        'Production experience with at least two of: Kafka/PubSub, ClickHouse/BigQuery/Snowflake, Postgres, Redis, object storage, OpenTelemetry.',
        'Comfortable shipping infrastructure that is secure by default (encryption, RBAC, secrets, tenancy boundaries).',
        'Fluency in one systems language (Go/Rust) and strong engineering rigor (testing, rollout discipline, performance profiling).'
      ],
      niceToHave: [
        'Experience with ML pipelines (feature generation, dataset curation, eval harnesses, RLHF/DPO tooling).',
        'Familiarity with LLM application traces (tool execution graphs, RAG assembly, structured prompts).'
      ],
      success: 'Trace ingestion is reliable under spikes, queries are fast and predictable, and model/security learning loops have reproducible data provenance and regression tests.'
    },
    {
      title: 'Backend / Security Engineer',
      mission: 'Build the secure, enterprise-grade product foundation: APIs, tenancy, permissions, integrations, and the security reasoning surfaces that teams trust in production.',
      responsibilities: [
        'Implement core backend services for trace ingestion, trace search, policy configuration, alerting, and remediation workflows.',
        'Build multi-tenant identity and access controls (RBAC/ABAC), audit logging, and secure admin tooling.',
        'Develop hardened ingestion endpoints and SDKs with strict validation, replay protection, and safe handling of secrets and sensitive payloads.',
        'Implement detection primitives: rules engines, anomaly signals, policy enforcement, and integration points for security frameworks and customer workflows.',
        'Integrate with the ecosystem (SIEM/logging, ticketing, Slack, cloud providers, CI) with attention to least-privilege and secure defaults.',
        'Drive secure engineering practices: threat modeling, dependency hygiene, security reviews, and vulnerability response.'
      ],
      qualifications: [
        'Strong backend engineering fundamentals (APIs, databases, caching, concurrency, performance).',
        'Demonstrated security engineering judgment: authn/authz, secure storage, key management, auditability, and incident response basics.',
        'Experience with multi-tenant SaaS constraints (data isolation, noisy neighbor mitigation, quota controls).',
        'Proficiency in Go/Rust/TypeScript (or similar) and a track record of shipping production services.'
      ],
      niceToHave: [
        'Familiarity with OpenTelemetry, distributed tracing, or log analytics products.',
        'Exposure to application security, detection engineering, or adversarial thinking (abuse cases, prompt injection patterns, data poisoning vectors).'
      ],
      success: 'Customers can safely onboard and operate at scale with clear boundaries, strong audit trails, and low operational friction—without compromising security.'
    },
    {
      title: 'AI Engineer',
      mission: 'Ship the reasoning layer: model-driven detection, triage, and remediation for AI-native attack surfaces across inference, retrieval, tool use, and training routes.',
      responsibilities: [
        'Build model-facing systems that analyze traces end-to-end: prompt + tools + retrieval context + outputs + downstream effects.',
        'Implement RAG pipelines and citation-grounded reasoning for detections and remediation recommendations, with measurable accuracy and low hallucination rates.',
        'Design eval suites for AI security and reliability (attack simulations, adversarial prompts, tool misuse cases), and tie results to deployment gates.',
        'Develop learning loops: dataset curation, human feedback capture, preference modeling, and post-training workflows (e.g., DPO/RL-style improvements) where appropriate.',
        'Create developer-facing abstractions (policies, templates, “fix suggestions”, sandbox replays) that make security outcomes actionable.',
        'Build safe model orchestration: routing across providers, tool permissioning, prompt/tool-level controls, and rigorous red-teaming practices.'
      ],
      qualifications: [
        'Strong applied LLM engineering skills: prompt/tool design, RAG, eval harnesses, failure analysis, and iterative improvement grounded in data.',
        'Experience building production AI systems with measurable quality metrics (precision/recall, latency, cost, robustness).',
        'Solid software engineering fundamentals (APIs, data pipelines, testing, deployment discipline).',
        'Ability to reason adversarially about model behavior and abuse patterns.'
      ],
      niceToHave: [
        'Prior work in security, detection engineering, or trust/safety for AI systems.',
        'Familiarity with structured generation, constrained decoding, agent execution traces, or sandboxed tool environments.'
      ],
      success: 'Detections are grounded, explainable, and hard to evade; remediations are minimal-diff and high-signal; quality improves release-over-release with clean evaluation evidence.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f4f0]">
      <SiteNav offsetTop={0} />

      <div className="pt-32 pb-20">
        <div className="container-max max-w-6xl">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-[#f5f4f0b3] hover:text-[#f5f4f0] mb-12 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="max-w-3xl mb-8">
          <p className="text-[14px] uppercase tracking-[0.25em] text-[#f5f4f099] mb-6">Careers</p>
          <h1 className="text-[48px] lg:text-[64px] font-normal leading-[1.05] tracking-[-0.03em]">
            Triage is an applied team focused on <br />
            <span className="text-[#C9A37E]">securing the future of AI software.</span>
            </h1>
        </div>
        
        <div className="relative h-[480px] w-full border border-[#1a1a1a]">
          <Image
            src="/careers-hero.jpg"
            alt="Triage team working session"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
            </div>
          </motion.div>

      {/* Roles */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.4em] text-[#f5f4f0b3]">Roles we’re hiring</h2>
          <div className="px-3 py-1 text-[12px] border border-[#f5f4f0b3]">{roles.length} roles</div>
            </div>
        <div className="space-y-4">
          {roles.map((role, index) => {
            const isOpen = openRole === index;
            return (
              <div key={role.title} className="border border-[#2d2d2d] bg-[#0d0d0d]">
                <button
                  onClick={() => setOpenRole(isOpen ? null : index)}
                  className="w-full flex items-start justify-between gap-6 p-6 text-left hover:bg-[#111111] transition-colors"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] uppercase tracking-[0.4em] text-[#f5f4f0b3]">Role {index + 1}</span>
                    <h3 className="text-[24px] leading-tight text-[#f5f4f0]">{role.title}</h3>
                    <p className="text-[15px] text-[#f5f4f0b3] line-clamp-2">{role.mission}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-[#f5f4f0b3] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
                {isOpen && (
                  <div className="border-t border-[#2d2d2d] p-6 space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="text-[12px] uppercase tracking-[0.35em] text-[#f5f4f0b3] mb-2">Mission</h4>
                        <p className="text-[15px] text-[#f5f4f0]">{role.mission}</p>
                      </div>
                      <div>
                        <h4 className="text-[12px] uppercase tracking-[0.35em] text-[#f5f4f0b3] mb-2">What success looks like</h4>
                        <p className="text-[15px] text-[#f5f4f0]">{role.success}</p>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="text-[12px] uppercase tracking-[0.35em] text-[#f5f4f0b3] mb-2">Responsibilities</h4>
                        <ul className="list-disc pl-5 space-y-1 text-[#f5f4f0] marker:text-[#f5f4f0]">
                          {role.responsibilities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        </div>
                      <div>
                        <h4 className="text-[12px] uppercase tracking-[0.35em] text-[#f5f4f0b3] mb-2">Qualifications</h4>
                        <ul className="list-disc pl-5 space-y-1 text-[#f5f4f0] marker:text-[#f5f4f0]">
                          {role.qualifications.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                          </div>
                        </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="text-[12px] uppercase tracking-[0.35em] text-[#f5f4f0b3] mb-2">Nice to have</h4>
                        <ul className="list-disc pl-5 space-y-1 text-[#f5f4f0] marker:text-[#f5f4f0]">
                          {role.niceToHave.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-[14px] text-[#f5f4f0b3]">
                          Interested? Email:
                        </p>
                        <a
                          href={`mailto:srivastavan@berkeley.edu?subject=${encodeURIComponent(role.title + ' - Triage')}`}
                          className="inline-flex items-center gap-2 px-6 py-2 border border-[#f5f4f0] text-[#f5f4f0] text-[13px] tracking-tight hover:bg-[#f5f4f0] hover:text-[#0a0a0a] transition-colors mt-4"
                        >
                          Email srivastavan@berkeley.edu
                        </a>
                      </div>
                    </div>
                  </div>
                  )}
              </div>
            );
          })}
          </div>
      </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-[#0d0d0d] border-t border-[#1a1a1a]">
        <div className="container-max">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/FullLogo_Transparent_NoBuffer (1) (1).png"
                alt="Triage"
                width={60}
                height={16}
                className="h-5 w-auto opacity-60"
                style={{ objectFit: 'contain' }}
              />
              <span className="text-[14px] text-[#f5f4f0b3]" style={{ fontFamily: '-apple-system, SF Pro Display, system-ui, sans-serif' }}>
                triage
              </span>
            </div>
            <div className="text-[13px] text-[#f5f4f0b3]">
              © 2025 Triage. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
