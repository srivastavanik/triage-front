'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What AI systems does Triage support?',
    answer:
      'Triage works with any AI system built on foundation models, including OpenAI, Anthropic, Google, and open-source models. We support agentic workflows with tool calling, RAG pipelines, and multi-model architectures. Our SDKs integrate with popular frameworks like LangChain, LlamaIndex, and custom implementations.',
  },
  {
    question: 'How does Triage integrate with my existing stack?',
    answer:
      'Integration takes minutes, not weeks. Drop in our SDK alongside your model calls to start capturing traces immediately. We provide native integrations for Python, TypeScript, and Go. For CI/CD, we support GitHub Actions, GitLab CI, Jenkins, and CircleCI with one-line config additions.',
  },
  {
    question: 'What deployment options are available?',
    answer:
      'Triage offers cloud-hosted SaaS with SOC 2 Type II compliance, VPC deployments for enterprises requiring data residency, and fully on-premise installations for air-gapped environments. All deployment modes support the same feature set with no functionality gaps.',
  },
  {
    question: 'How does the learning system work?',
    answer:
      'Every enforcement decision, blocked event, and user-marked false positive feeds back into your tenant-private model. Confirmed incidents and accepted remediations train the system to reduce noise over time. Runtime policies remain hard constraints while detection quality improves continuously.',
  },
  {
    question: 'What does pricing look like?',
    answer:
      'Pricing scales with your usage: number of traces captured, enforcement decisions processed, and seats for your team. We offer a free tier for evaluation and startups. Enterprise plans include dedicated support, custom SLAs, and volume discounts. Contact us for a quote tailored to your needs.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Sign up for a free account to explore the platform with sample data. When you are ready, install our SDK and start sending traces from your staging environment. Our team can walk you through a live demo and help design your security policies for production.',
  },
];

export function FAQ(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section">
      <div className="container-max">
        <div className="faq-layout">
          <div className="faq-header-col">
            <h2 className="faq-heading">Questions & Answers</h2>
          </div>

          <div className="faq-items-col">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button className="faq-question-btn" onClick={() => toggleItem(index)}>
                  <span>{item.question}</span>
                  <span className="faq-toggle-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4V16M4 10H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="faq-answer-wrapper"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="faq-answer-inner">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
        }

        @media (max-width: 1024px) {
          .faq-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .faq-heading {
          font-size: 36px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--color-text-primary);
          position: sticky;
          top: 120px;
        }

        @media (max-width: 768px) {
          .faq-heading {
            font-size: 28px;
            position: static;
          }
        }

        .faq-items-col {
          display: flex;
          flex-direction: column;
        }

        .faq-item {
          border-bottom: 1px solid var(--color-border);
        }

        .faq-question-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 24px 0;
          font-size: 17px;
          font-weight: 400;
          color: var(--color-text-primary);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s ease;
          font-family: inherit;
        }

        .faq-question-btn:hover {
          color: var(--color-text-secondary);
        }

        .faq-toggle-icon {
          color: var(--color-text-tertiary);
          transition: transform 0.3s ease;
          flex-shrink: 0;
          margin-left: 16px;
        }

        .faq-item.open .faq-toggle-icon {
          transform: rotate(45deg);
        }

        .faq-answer-wrapper {
          overflow: hidden;
        }

        .faq-answer-inner {
          padding-bottom: 24px;
        }

        .faq-answer-inner p {
          font-size: 16px;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }
      `}</style>
    </section>
  );
}

export default FAQ;


