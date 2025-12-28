'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '../../../components/SiteNav';

export default function BlogPost(): JSX.Element {
  return (
    <main className="min-h-screen bg-bg-primary">
      <SiteNav offsetTop={0} />

      {/* Article */}
      <article className="pt-40 pb-32">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/blog" className="text-text-muted text-[14px] hover:text-text-secondary transition-colors mb-8 inline-flex items-center gap-2">
                ← All articles
              </Link>
            </motion.div>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                  Company
                </span>
              </div>
              <h1 className="text-[36px] lg:text-[48px] font-normal leading-[1.15] tracking-[-0.02em] mb-6">
                Triage Raises $1.5M to Secure AI-Native Applications
              </h1>
              <div className="flex items-center gap-4 text-text-muted text-[14px]">
                <span>Dec 27, 2024</span>
                <span className="w-1 h-1 bg-text-muted rounded-full" />
                <span>4 min read</span>
              </div>
            </motion.header>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <p className="text-text-secondary text-[18px] leading-[1.8] mb-8">
                Triage has raised $1.5M in pre-seed funding to build an AI-native security and observability platform for teams shipping LLM-powered products. The round was led by <a href="https://www.boxgroup.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-primary transition-colors">BoxGroup</a>, with participation from <a href="https://precursorvc.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-primary transition-colors">Precursor Ventures</a> and notable angels including Zach Lloyd (CEO, Warp.dev), Michael Fertik (First ever investor in AnySphere), Bill Shope (Tidal Partners), Niklas de la Motte, and Cory Levy (Z Fellows).
              </p>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-12">
                This capital accelerates development of the platform and expands early deployments with teams that need security guarantees for inference, retrieval, and training workflows.
              </p>

              <h2 className="text-[24px] lg:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6 mt-16">
                AI Security Was Not Meant to Be Guesswork
              </h2>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-6">
                Modern software increasingly includes models that:
              </p>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-8 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Generate and execute code</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Call tools with real permissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Retrieve proprietary context through RAG</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Learn from new data and feedback loops</span>
                </li>
              </ul>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-8">
                That creates a new operational reality: security incidents can originate inside model behavior, not just at the API perimeter. Prompt injection, tool misuse, data exfiltration through retrieval, and training-time poisoning do not map cleanly onto legacy application security workflows.
              </p>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-12">
                When model behavior cannot be reproduced and explained trace-by-trace, mitigation becomes improvisation.
              </p>

              <h2 className="text-[24px] lg:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6 mt-16">
                Legacy Security Tools Cannot See Inside the AI Stack
              </h2>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-6">
                Traditional security stacks are strong at network and application telemetry, but they typically do not capture:
              </p>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-8 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>The full prompt assembly and runtime context</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>The tool invocation sequence and outputs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Retrieval inputs, rankings, and cited sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Model responses as they evolve across turns and agents</span>
                </li>
              </ul>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-6">
                Without that visibility, teams struggle to answer basic questions after an incident:
              </p>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-12 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>What did the model see?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Why did it choose that action?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Which data influenced the output?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>What change prevents recurrence without breaking functionality?</span>
                </li>
              </ul>

              <h2 className="text-[24px] lg:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6 mt-16">
                Triage: Security and Observability for LLM Products
              </h2>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-8">
                Triage is designed as an end-to-end system that spans instrumentation, detection and reasoning, and remediation with learning.
              </p>

              <h3 className="text-[18px] font-medium text-text-secondary mb-4 mt-10">
                1. Capture: full-fidelity AI telemetry
              </h3>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-8 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Model call tracing across providers (requests, responses, tool calls, latency, tokens, retries, failures)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Agent execution traces (what ran, with which arguments, what returned, what happened next)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>RAG visibility (retrieved chunks, ranks and scores, citation links, prompt assembly)</span>
                </li>
              </ul>

              <h3 className="text-[18px] font-medium text-text-secondary mb-4 mt-10">
                2. Detect and reason: AI-native threat coverage
              </h3>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-8 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Security detections tailored to inference, retrieval, and training routes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Investigation workflows that connect traces, prompts, tools, and retrieved data into a single storyline</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Policy-driven analysis aligned with common AI attack patterns (including prompt injection and data leakage)</span>
                </li>
              </ul>

              <h3 className="text-[18px] font-medium text-text-secondary mb-4 mt-10">
                3. Remediate and learn: close the loop
              </h3>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-12 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Minimal-diff remediation suggestions (prompt hardening, tool schema constraints, retrieval filters, policy updates)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Test and evaluation harnesses to prevent regressions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Feedback-driven improvements that turn incidents, false positives, and accepted fixes into structured learning signals over time</span>
                </li>
              </ul>

              <p className="text-text-secondary text-[18px] leading-[1.8] mb-12 p-6 bg-[#121212] border border-[#1a1a1a]">
                The goal is simple: make AI systems measurable, debuggable, and defensible in production.
              </p>

              <h2 className="text-[24px] lg:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6 mt-16">
                What Comes Next
              </h2>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-6">
                The new funding expands:
              </p>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-12 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Provider and framework integrations for faster instrumentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Stronger trace analysis and automated root-cause workflows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>More robust remediation and evaluation tooling for safe iteration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Early customer deployments and case studies demonstrating measurable security posture improvements</span>
                </li>
              </ul>

              <h2 className="text-[24px] lg:text-[28px] font-normal leading-[1.2] tracking-[-0.01em] mb-6 mt-16">
                Work With Triage
              </h2>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-6">
                Triage is partnering with teams building LLM-powered products that need:
              </p>

              <ul className="text-text-tertiary text-[17px] leading-[1.8] mb-8 space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Deep visibility into model and agent behavior</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>Practical defenses against AI-native attack surfaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-text-muted mt-2">–</span>
                  <span>A remediation loop that improves security without slowing shipping velocity</span>
                </li>
              </ul>

              <p className="text-text-tertiary text-[17px] leading-[1.8] mb-12">
                For pilots, partnerships, or roles, the fastest path is a direct introduction through the site&apos;s contact channel.
              </p>

              {/* CTA */}
              <div className="mt-16 p-8 bg-[#121212] border border-[#1a1a1a]">
                <h3 className="text-[20px] font-normal mb-4">
                  Ready to secure your AI systems?
                </h3>
                <p className="text-text-tertiary text-[16px] mb-6">
                  Get in touch to learn how Triage can help your team ship secure AI products faster.
                </p>
                <Link
                  href="mailto:srivastavan@berkeley.edu"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-bg-primary bg-text-primary px-6 py-3 hover:bg-text-secondary transition-colors"
                >
                  Contact Us
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/FullLogo_Transparent_NoBuffer (1) (1).png"
                alt="Triage"
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
              />
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

