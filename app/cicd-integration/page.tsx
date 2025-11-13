'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { AllChecksPassed, DeploymentSuccess } from '../../components/GitHubElements';

export default function CICDIntegration() {
  return (
    <main className="min-h-screen bg-bg-primary text-pale-wood">
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
              <Link href="/careers" className="hover:text-cyan transition-colors">Careers</Link>
              <Link href="/team" className="hover:text-cyan transition-colors">Team</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20">
        <div className="container-max max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
            <h1 className="text-[64px] font-light mb-6 leading-[1.1]">
              <span className="highlight-solid cyan text-cyan">CI/CD Integration</span>
            </h1>
            <p className="text-[24px] leading-[1.6] text-pale-wood/80 max-w-4xl">
              First-class integration with GitHub Actions, GitLab CI, Jenkins, and CircleCI for continuous security
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {[
              {
                title: 'Pull Request Checks',
                desc: 'Run targeted static checks and micro-scans on every PR'
              },
              {
                title: 'Ephemeral Environments',
                desc: 'Spin up VMs after deploys or on scheduled basis'
              },
              {
                title: 'Policy-Based Blocking',
                desc: 'Block on critical vulnerabilities, allow lower severities as advisory'
              },
              {
                title: 'Exploit Regression Tests',
                desc: 'Previously fixed exploits run as regression tests in pipeline'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="cicd-feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-[20px] mb-3 text-cyan">{item.title}</h3>
                <p className="text-[15px] leading-[1.7] text-pale-wood/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-20">
            <h2 className="text-[36px] font-light mb-12">Integration Patterns</h2>
            <p className="text-[17px] leading-[1.8] text-pale-wood/80 mb-8">
              Triage integrates as a first-class citizen in your CI/CD pipeline. Jobs can be configured to block on certain policy conditions while allowing lower severities to surface as non-blocking advisory findings. This keeps security continuous rather than a separate, infrequent audit process.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <AllChecksPassed />
              <DeploymentSuccess />
            </div>
          </div>

          <div className="supported-platforms mb-20">
            <h2 className="text-[36px] font-light mb-12">Supported Platforms</h2>
            <div className="platform-grid">
              {['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Azure DevOps', 'Bitbucket Pipelines'].map((platform, i) => (
                <div key={i} className="platform-badge">
                  {platform}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-16 bg-bg-secondary border border-pale-wood/20 rounded-lg">
            <h3 className="text-[32px] font-light mb-6">Integrate security into your pipeline</h3>
            <a 
              href="mailto:srivastavan@berkeley.edu"
              className="inline-block px-10 py-4 bg-cyan text-midnight-green text-[17px] font-medium hover:bg-pale-wood transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cicd-feature-card {
          padding: 24px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-pale-wood)30;
          border-left: 3px solid var(--color-cyan);
          transition: all 0.3s ease;
        }

        .cicd-feature-card:hover {
          border-left-width: 5px;
          transform: translateX(4px);
        }

        .platform-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .platform-badge {
          padding: 16px 24px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-cyan);
          text-align: center;
          font-size: 16px;
          color: var(--color-cyan);
          transition: all 0.2s ease;
        }

        .platform-badge:hover {
          background: var(--color-cyan)10;
        }
      `}</style>
    </main>
  );
}
