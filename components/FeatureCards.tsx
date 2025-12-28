'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="card flex flex-col items-start gap-4 p-8 bg-radial-giga border-[#2d2d2d]"
    >
      <div className="p-2.5 bg-[#2d2d2d] rounded-lg text-text-primary border border-[#2d2d2d]">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="text-base font-normal text-text-primary tracking-tight">{title}</h4>
        <p className="text-[14px] leading-relaxed text-text-tertiary">{description}</p>
      </div>
    </motion.div>
  );
}

export function FeatureCards(): JSX.Element {
  const features = [
    {
      title: "Performance enhancement",
      description: "Designed to help you hit KPIs and maintain low latency across model providers.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 11z"/><path d="M3 11v12"/><path d="M21 11v12"/>
        </svg>
      )
    },
    {
      title: "Custom suggestions",
      description: "Based on your unique business requirements and security policy definitions.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
        </svg>
      )
    },
    {
      title: "Auto improve",
      description: "Ready-to-implement policy improvements surfaced from real trace patterns.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      )
    },
    {
      title: "Extremely customizable",
      description: "Fine-tune every nuance of remediation flows to match your existing business logic.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 12V2.5"/><path d="M12 12l9 2.5"/><path d="M12 12l-9 2.5"/>
        </svg>
      )
    },
    {
      title: "Auto policy writing",
      description: "Get started with just a transcript of what your ideal security behavior looks like.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      )
    },
    {
      title: "Built-in Copilot",
      description: "AI helps you build your ideal security agent through conversational interaction.",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <FeatureCard key={i} {...feature} />
      ))}
    </div>
  );
}

