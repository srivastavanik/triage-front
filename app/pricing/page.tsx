'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SiteNav } from '../../components/SiteNav';

const PRICING_TIERS = [
  {
    name: 'Individual (Builder)',
    price: '$29',
    period: '/ month',
    description: 'For solo developers, researchers, and consultants',
    features: [
      'Includes 50k LLM traces / month across IDE, Playground, and Trace Explorer',
      'Pay-as-you-go coverage on traces (e.g., $0.50 per 1k additional traces)',
      'Goal: seed usage and familiarity that later pulls Triage into team and company deployments',
    ],
    cta: 'Get Started',
    ctaStyle: 'secondary',
  },
  {
    name: 'Startup (Team)',
    price: '$49',
    period: '/ engineer / month',
    periodNote: '(billed monthly or annually)',
    description: 'For small AI teams (up to 20)',
    features: [
      'Includes all Individual features plus: multi-user workspaces, shared projects, security APIs, and higher trace limits',
      'Scale by adding seats and trace volume; overages charged per 1k extra traces',
      'Expansion lever: more seats, more protected AI services, and higher-volume observability',
    ],
    cta: 'Get Started',
    ctaStyle: 'primary',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom pricing',
    description: 'For larger orgs and financial / regulated institutions integrating AI into sensitive workflows',
    features: [
      'Everything in Startup plus: SSO/RBAC, audit exports, custom retention, private networking options, and SLAs',
      'Pricing based on platform fee + seats + committed trace volume across environments (dev / staging / prod)',
      'Typical first deal: 50+ engineers and multi-region workloads, expanding as more business units standardize on Triage',
    ],
    cta: 'Contact Us',
    ctaStyle: 'secondary',
  },
];

export default function PricingPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-bg-primary">
      <SiteNav offsetTop={0} />

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-[48px] lg:text-[64px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
              Pricing
            </h1>
            <p className="text-text-secondary text-[18px] max-w-xl mx-auto">
              Simple, transparent pricing that scales with your team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-32">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[#1a1a1a]">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-8 lg:p-10 ${index !== PRICING_TIERS.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-[#1a1a1a]' : ''} ${tier.highlighted ? 'bg-[#0d0d0d]' : 'bg-[#0a0a0a]'}`}
              >
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-[24px] font-medium text-text-primary mb-4">
                    {tier.name}
                  </h2>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[36px] lg:text-[42px] font-medium text-text-primary">
                      {tier.price}
                    </span>
                    <span className="text-text-muted text-[16px]">
                      {tier.period}
                    </span>
                  </div>
                  {tier.periodNote && (
                    <p className="text-text-muted text-[14px]">{tier.periodNote}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-text-secondary text-[15px] mb-8 leading-relaxed">
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-[14px] text-text-secondary leading-relaxed">
                      <span className="text-[#C9A37E] mt-1 shrink-0">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={tier.ctaStyle === 'primary' ? '/contact' : tier.cta === 'Contact Us' ? '/contact' : '/contact'}
                  className={`block w-full text-center py-3 px-6 text-[14px] font-medium transition-colors ${
                    tier.ctaStyle === 'primary'
                      ? 'bg-[#C9A37E] text-[#0a0a0a] hover:bg-[#d8b78f]'
                      : 'border border-[#2a2a2a] text-text-primary hover:border-[#3a3a3a] hover:bg-[#1a1a1a]'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ or additional info */}
      <section className="pb-32">
        <div className="container-max">
          <div className="border border-[#1a1a1a] p-8 lg:p-12 bg-[#0a0a0a]">
            <h3 className="text-[24px] font-medium mb-6">Questions?</h3>
            <p className="text-text-secondary text-[15px] mb-6 max-w-2xl">
              Need help choosing the right plan for your team? We are happy to walk you through the options and help you find the best fit.
            </p>
            <a
              href="mailto:srivastavan@berkeley.edu"
              className="inline-flex items-center gap-2 text-[14px] text-[#C9A37E] hover:text-[#d8b78f] transition-colors"
            >
              Contact us →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-12 bg-[#0a0a0a]">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/FullLogo_Transparent_NoBuffer (1) (1).png"
                alt="Triage"
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

