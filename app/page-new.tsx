'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SecurityHeatmap, CommitTimeline, VulnerabilityPipeline, TestExecution, PRWireframe } from '../components/SecurityHeatmap';
import { AutoUnitTests, GitActionsFlow, LiveDiffHighlight } from '../components/AnimatedWorkflow';
import { AdvancedIDEAnimation } from '../components/AdvancedIDE';

// Scroll-triggered phase component
const ScrollPhaseViewer = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.15) setCurrentPhase(0);
      else if (latest < 0.30) setCurrentPhase(1);
      else if (latest < 0.45) setCurrentPhase(2);
      else if (latest < 0.60) setCurrentPhase(3);
      else if (latest < 0.75) setCurrentPhase(4);
      else setCurrentPhase(5);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const phases = [
    {
      number: '01',
      title: 'Plan',
      subtitle: 'Risk-aware backlog generation',
      description: 'Code graphs and recent diffs generate security-relevant work items before they become vulnerabilities',
      component: <SecurityHeatmap />
    },
    {
      number: '02',
      title: 'Code',
      subtitle: 'Real-time security hints',
      description: 'Inline patches that match your coding style and framework conventions',
      component: <LiveDiffHighlight />
    },
    {
      number: '03',
      title: 'Build',
      subtitle: 'Deterministic verification',
      description: 'Automated tests prove the vulnerability is resolved with full reproducibility',
      component: <AutoUnitTests />
    },
    {
      number: '04',
      title: 'Review',
      subtitle: 'Evidence-based pull requests',
      description: 'Complete evidence packets with reproduction, verification, and rollback plans',
      component: <PRWireframe />
    },
    {
      number: '05',
      title: 'Release',
      subtitle: 'Policy-aware deployment',
      description: 'Smart auto-merge for low-risk, human review for high-risk changes',
      component: <GitActionsFlow />
    },
    {
      number: '06',
      title: 'Operate',
      subtitle: 'Continuous learning',
      description: 'Post-merge validation feeds learning signals back into the system',
      component: <CommitTimeline />
    }
  ];

  const active = phases[currentPhase];

  return (
    <section ref={sectionRef} className="scroll-phase-section">
      <div className="container-max">
        <div className="phase-layout">
          <div className="phase-indicators">
            {phases.map((phase, i) => (
              <div 
                key={i} 
                className={`phase-indicator ${i === currentPhase ? 'active' : i < currentPhase ? 'done' : ''}`}
              >
                <div className="indicator-circle">{phase.number}</div>
                <div className="indicator-label">{phase.title}</div>
                {i < phases.length - 1 && <div className="indicator-line" />}
              </div>
            ))}
          </div>

          <div className="phase-content-area">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="phase-header">
                <h3 className="phase-title">{active.subtitle}</h3>
                <p className="phase-description">{active.description}</p>
              </div>
              <div className="phase-component">
                {active.component}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const codeY = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan via-pale-wood to-cyan z-[100] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-dark border-b border-border">
        <div className="container-max">
          <div className="flex items-center justify-between h-[72px]">
            <Image
              src="/logo.png"
              alt="Triage"
              width={32}
              height={32}
              className="w-8 h-8 logo-filter"
            />
            
            <div className="flex items-center gap-10">
              <div className="hidden md:flex items-center gap-8">
                <div className={`mega-dropdown ${dropdownOpen ? 'active' : ''}`}>
                  <button
                    className="dropdown-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  >
                    <span>Products</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <div className="mega-dropdown-content">
                    <div className="mega-grid">
                      <div className="mega-section">
                        <h4 className="mega-section-title">Detection & Analysis</h4>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◉</span>
                          <div>
                            <div className="mega-item-title">Security Scanner</div>
                            <div className="mega-item-desc">AI-powered vulnerability detection across desktop, web, and backend</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◈</span>
                          <div>
                            <div className="mega-item-title">Code Graph Analysis</div>
                            <div className="mega-item-desc">Deep structure and data flow mapping</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">⌘</span>
                          <div>
                            <div className="mega-item-title">Golden Repository</div>
                            <div className="mega-item-desc">Organizational memory and learning signals</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◬</span>
                          <div>
                            <div className="mega-item-title">Exploit Tracing</div>
                            <div className="mega-item-desc">Deterministic reproduction and verification</div>
                          </div>
                        </a>
                      </div>
                      <div className="mega-section">
                        <h4 className="mega-section-title">Automation & Patching</h4>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◆</span>
                          <div>
                            <div className="mega-item-title">Auto-Patch Generator</div>
                            <div className="mega-item-desc">Framework-aware security fixes</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">∞</span>
                          <div>
                            <div className="mega-item-title">RLHF Learning</div>
                            <div className="mega-item-desc">Continuous improvement from merged fixes</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◎</span>
                          <div>
                            <div className="mega-item-title">Policy Engine</div>
                            <div className="mega-item-desc">Smart auto-merge and routing</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◐</span>
                          <div>
                            <div className="mega-item-title">Evidence Packets</div>
                            <div className="mega-item-desc">Complete context for reviewers</div>
                          </div>
                        </a>
                      </div>
                      <div className="mega-section">
                        <h4 className="mega-section-title">Platform & Deployment</h4>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">◑</span>
                          <div>
                            <div className="mega-item-title">CI/CD Integration</div>
                            <div className="mega-item-desc">GitHub, GitLab, Jenkins, CircleCI</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">▣</span>
                          <div>
                            <div className="mega-item-title">IDE Extensions</div>
                            <div className="mega-item-desc">VS Code, IntelliJ, Sublime, Cursor</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">▤</span>
                          <div>
                            <div className="mega-item-title">VPC & Self-Hosted</div>
                            <div className="mega-item-desc">Private deployment options</div>
                          </div>
                        </a>
                        <a href="#" className="mega-item">
                          <span className="mega-icon">▥</span>
                          <div>
                            <div className="mega-item-title">API & SDKs</div>
                            <div className="mega-item-desc">REST, GraphQL, TypeScript, Python</div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="mega-footer">
                      <div className="mega-footer-section">
                        <div className="footer-label">Ready to get started?</div>
                        <a href="#" className="footer-link">View documentation →</a>
                      </div>
                      <div className="mega-footer-section">
                        <div className="footer-label">Need help choosing?</div>
                        <a href="#" className="footer-link">Schedule a demo →</a>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="#pricing" className="nav-link">Pricing</a>
                <a href="#blog" className="nav-link">Blog</a>
              </div>
              <button className="btn btn-primary">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-[72px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(var(--color-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <motion.div 
          className="container-max w-full relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.h1 
                className="mb-8 leading-[0.85]"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -50 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Security that
                <br />
                <span className="text-cyan">writes itself</span>
              </motion.h1>
              
              <motion.p 
                className="text-[20px] leading-[1.6] mb-12 max-w-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -50 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                AI-powered security that embeds into your workflow, finding and fixing vulnerabilities automatically through reinforcement learning.
              </motion.p>
              
              <motion.div 
                className="flex gap-4 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <button className="btn btn-large bg-cyan text-midnight-green hover:bg-pale-wood">
                  Start Free Trial
                </button>
                <button className="btn btn-large btn-secondary">
                  Watch Demo
                </button>
              </motion.div>

              <motion.div 
                className="grid grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: mounted ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <div>
                  <div className="text-[36px] font-mono text-cyan mb-1">156K</div>
                  <div className="text-caption">patches learned</div>
                </div>
                <div>
                  <div className="text-[36px] font-mono text-cyan mb-1">94%</div>
                  <div className="text-caption">merge rate</div>
                </div>
                <div>
                  <div className="text-[36px] font-mono text-cyan mb-1">8.9M</div>
                  <div className="text-caption">learning signals</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              style={{ y: codeY }}
              className="relative"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <AdvancedIDEAnimation />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Logo Carousel */}
      <section className="py-20 bg-secondary border-y border-pale-wood/10 overflow-hidden">
        <div className="container-max">
          <p className="text-center text-[12px] text-pale-wood/40 mb-12 uppercase tracking-widest font-mono">
            Trusted by engineers at
          </p>
          <div className="logo-carousel">
            <motion.div 
              className="logo-track"
              animate={{ x: [0, -1800] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[
                'Berkeley.png', 'stanford-bw-logo.png', 'Nyu_short_black.svg (1) (1).png',
                'amazon-logo-black-transparent-1.png', 'novita-ai-logo-png_seeklogo-611671 (1).png',
                '711c05d6-a57a-4567-bdf6-1649d03a68a6.png', 'ee1a22e0-bf8f-4c49-8728-4fc9ef1a7fbe (1).png',
                '62f3a322559f1b57bbc8998fae009d42.png', 'image-ebaf55a8-a29f-4b96-a4dd-511a1b997a9f.png'
              ].concat([
                'Berkeley.png', 'stanford-bw-logo.png', 'Nyu_short_black.svg (1) (1).png',
                'amazon-logo-black-transparent-1.png', 'novita-ai-logo-png_seeklogo-611671 (1).png',
                '711c05d6-a57a-4567-bdf6-1649d03a68a6.png', 'ee1a22e0-bf8f-4c49-8728-4fc9ef1a7fbe (1).png',
                '62f3a322559f1b57bbc8998fae009d42.png', 'image-ebaf55a8-a29f-4b96-a4dd-511a1b997a9f.png'
              ]).map((logo, i) => (
                <div key={i} className="logo-item">
                  <Image src={`/user_logos/${logo}`} alt="Customer logo" width={120} height={40} className="logo-img" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll-driven Lifecycle Phases */}
      <ScrollPhaseViewer />

      {/* RLHF Learning */}
      <section className="section-padding bg-secondary">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="reveal mb-6">Reinforcement learning from human feedback</h2>
            <p className="reveal text-[20px] text-pale-wood/70 max-w-3xl mx-auto">
              Every merged fix, reviewer comment, and security approval trains the system to be more precise for your organization
            </p>
          </div>

          <div className="reveal mb-16">
            <VulnerabilityPipeline />
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="reveal">
              <TestExecution />
            </div>
            <div className="reveal space-y-8">
              {[
                { metric: 'Patch acceptance', before: '67%', after: '94%' },
                { metric: 'Lines per fix', before: '142', after: '23' },
                { metric: 'False positives', before: '23%', after: '< 1%' },
                { metric: 'Time to fix', before: '4.2 days', after: '2.3 hours' }
              ].map((item, i) => (
                <div key={i} className="outcome-card">
                  <div className="outcome-metric">{item.metric}</div>
                  <div className="outcome-comparison">
                    <span className="outcome-before">{item.before}</span>
                    <span className="outcome-arrow">→</span>
                    <span className="outcome-after">{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Core principles</h2>

          <div className="max-w-4xl mx-auto space-y-12">
            {[
              { icon: '→', label: 'Core promise', text: 'Ship fixes, not alerts' },
              { icon: '∞', label: 'Learning principle', text: 'Raise the baseline continuously with tenant-private reinforcement' },
              { icon: '✓', label: 'Proof principle', text: 'Deterministic evidence before and after the patch, every time' }
            ].map((item, i) => (
              <div key={i} className="reveal principle-card">
                <div className="principle-icon">{item.icon}</div>
                <div className="principle-category">{item.label}</div>
                <h3 className="principle-text">{item.text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cyan text-midnight-green text-center">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
          >
            <h2 className="mb-8 text-midnight-green">Start securing your code today</h2>
            <p className="text-[24px] text-midnight-green/80 mb-12 max-w-2xl mx-auto">
              Join teams shipping secure code faster with Triage
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-large bg-midnight-green text-pale-wood hover:scale-105 transition-all">
                Start Free Trial
              </button>
              <button className="btn btn-large bg-transparent border-2 border-midnight-green text-midnight-green hover:bg-midnight-green hover:text-pale-wood">
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-bg-tertiary border-t border-border">
        <div className="container-max">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <Image
                src="/logo.png"
                alt="Triage"
                width={32}
                height={32}
                className="w-8 h-8 logo-filter mb-6"
              />
              <p className="text-pale-wood/60 mb-8 max-w-sm">
                AI-powered security that embeds into your development workflow.
              </p>
            </div>
            
            {[
              { title: 'PRODUCT', links: ['Features', 'Pricing', 'Enterprise', 'Changelog'] },
              { title: 'RESOURCES', links: ['Documentation', 'API Reference', 'Blog', 'Community'] },
              { title: 'COMPANY', links: ['About', 'Careers', 'Security', 'Privacy'] }
            ].map((section, i) => (
              <div key={i}>
                <h5 className="text-pale-wood mb-6 text-[14px] font-mono">{section.title}</h5>
                <div className="space-y-3">
                  {section.links.map((link) => (
                    <a key={link} href="#" className="block text-[15px] text-pale-wood/60 hover:text-pale-wood transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-8">
            <div className="text-[14px] text-pale-wood/40 text-center">
              © 2025 Triage. Embedded security, for everyone.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
