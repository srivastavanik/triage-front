'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureSectionProps {
  label: string;
  title: string;
  description: string;
  bullets?: string[];
  linkText?: string;
  linkHref?: string;
  children: ReactNode;
  reversed?: boolean;
}

export function FeatureSection({
  label,
  title,
  description,
  bullets,
  linkText,
  linkHref,
  children,
  reversed = false,
}: FeatureSectionProps): JSX.Element {
  return (
    <section className="section">
      <div className="container-max">
        <div className={`feature-grid ${reversed ? 'reversed' : ''}`}>
          <motion.div
            className="feature-text"
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="feature-label-text">{label}</span>
            <h2 className="feature-title-text">{title}</h2>
            <p className="feature-desc-text">{description}</p>

            {bullets && bullets.length > 0 && (
              <ul className="feature-bullets">
                {bullets.map((bullet, index) => (
                  <li key={index} className="feature-bullet">
                    <span className="bullet-marker" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {linkText && linkHref && (
              <a href={linkHref} className="feature-cta-link">
                {linkText}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </motion.div>

          <motion.div
            className="feature-visual-wrapper"
            initial={{ opacity: 0, x: reversed ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .feature-grid.reversed {
          direction: rtl;
        }

        .feature-grid.reversed > :global(*) {
          direction: ltr;
        }

        @media (max-width: 1024px) {
          .feature-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .feature-grid.reversed {
            direction: ltr;
          }
        }

        .feature-text {
          max-width: 480px;
        }

        .feature-label-text {
          display: block;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          margin-bottom: 16px;
        }

        .feature-title-text {
          font-size: 36px;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 20px;
          color: var(--color-text-primary);
        }

        @media (max-width: 768px) {
          .feature-title-text {
            font-size: 28px;
          }
        }

        .feature-desc-text {
          font-size: 17px;
          line-height: 1.7;
          color: var(--color-text-secondary);
          margin-bottom: 24px;
        }

        .feature-bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-bullet {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 15px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .bullet-marker {
          width: 4px;
          height: 4px;
          background: var(--color-text-primary);
          border-radius: 50%;
          margin-top: 8px;
          flex-shrink: 0;
        }

        .feature-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          color: var(--color-accent);
          transition: gap 0.2s ease;
        }

        .feature-cta-link:hover {
          gap: 10px;
        }

        .feature-visual-wrapper {
          position: relative;
        }
      `}</style>
    </section>
  );
}

export default FeatureSection;


