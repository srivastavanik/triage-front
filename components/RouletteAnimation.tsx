'use client';

import type { JSX } from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouletteItem {
  label: string;
  title: string;
  description: string;
}

const ROULETTE_ITEMS: RouletteItem[] = [
  {
    label: 'Inference-time',
    title: 'Prompt injection and scope escalation',
    description: 'Block unsafe tool invocations, detect instruction hijacking, and prevent data exfiltration through model outputs.',
  },
  {
    label: 'Retrieval-time',
    title: 'RAG boundary protection',
    description: 'Guard against poisoned indexes, instruction injection via retrieved content, and over-broad retrieval from weak ACLs.',
  },
  {
    label: 'Training-time',
    title: 'Pipeline and model integrity',
    description: 'Detect data poisoning in fine-tuning datasets, backdoor triggers, and behavior drift from provider changes.',
  },
  {
    label: 'Feedback loops',
    title: 'RLHF signal validation',
    description: 'Prevent reward hacking, validate iterative prompt changes, and catch misaligned incentives before deployment.',
  },
];

const CYCLE_DURATION = 4000;

export function RouletteAnimation(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROULETTE_ITEMS.length);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="roulette-wrapper">
      <div className="roulette-indicators">
        {ROULETTE_ITEMS.map((item, index) => (
          <button
            key={item.label}
            className={`roulette-indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="indicator-label">{item.label}</span>
            <div className="indicator-progress">
              {index === activeIndex && (
                <motion.div
                  className="indicator-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: CYCLE_DURATION / 1000, ease: 'linear' }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="roulette-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="roulette-item-content"
          >
            <h3 className="roulette-item-title">{ROULETTE_ITEMS[activeIndex].title}</h3>
            <p className="roulette-item-description">{ROULETTE_ITEMS[activeIndex].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .roulette-wrapper {
          padding: 48px 0;
        }

        .roulette-indicators {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (max-width: 768px) {
          .roulette-indicators {
            flex-wrap: wrap;
            gap: 16px;
          }
        }

        .roulette-indicator {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-align: center;
          min-width: 140px;
        }

        .indicator-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          margin-bottom: 12px;
          transition: color 0.2s ease;
        }

        .roulette-indicator.active .indicator-label {
          color: var(--color-accent);
        }

        .indicator-progress {
          height: 2px;
          background: var(--color-border-strong);
          border-radius: 1px;
          overflow: hidden;
        }

        .indicator-fill {
          height: 100%;
          background: var(--color-accent);
          transform-origin: left;
        }

        .roulette-content {
          text-align: center;
          min-height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .roulette-item-content {
          max-width: 640px;
          margin: 0 auto;
        }

        .roulette-item-title {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          color: var(--color-text-primary);
        }

        @media (max-width: 768px) {
          .roulette-item-title {
            font-size: 24px;
          }
        }

        .roulette-item-description {
          font-size: 17px;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }
      `}</style>
    </div>
  );
}

export default RouletteAnimation;


