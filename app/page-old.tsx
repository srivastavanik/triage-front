'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { SecurityHeatmap, CommitTimeline, VulnerabilityPipeline, TestExecution, MergeReadiness, PRWireframe } from '../components/SecurityHeatmap';
import { AutoUnitTests, GitActionsFlow, LiveDiffHighlight } from '../components/AnimatedWorkflow';
import { AdvancedIDEAnimation } from '../components/AdvancedIDE';

// Comprehensive IDE Wireframe with Progressive Animations
const IDEWireframe = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [scanningLine, setScanningLine] = useState(0);
  const [highlightState, setHighlightState] = useState('scan'); // scan, warn, fix, done
  const [showFix, setShowFix] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    
    // Progressive highlight animation
    const highlightSequence = async () => {
      setHighlightState('scan');
      await new Promise(r => setTimeout(r, 1500));
      setHighlightState('warn');
      await new Promise(r => setTimeout(r, 1500));
      setShowFix(true);
      await new Promise(r => setTimeout(r, 800));
      setHighlightState('fix');
      await new Promise(r => setTimeout(r, 2000));
      setHighlightState('done');
      await new Promise(r => setTimeout(r, 1500));
      setShowFix(false);
      setHighlightState('scan');
    };

    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % 3);
      highlightSequence();
    }, 8000);
    
    const scanInterval = setInterval(() => {
      setScanningLine(prev => (prev + 1) % 12);
    }, 400);
    
    highlightSequence();
    
    return () => {
      clearInterval(phaseInterval);
      clearInterval(scanInterval);
    };
  }, [isInView]);

  const vulnerabilities = [
    {
      file: 'backend/src/routes/chat.routes.ts',
      line: 8,
      severity: 'HIGH',
      issue: 'Unauthenticated Trial Endpoint with Potential Abuse',
      suggestion: 'Add rate limiting to /trial endpoint to prevent abuse (e.g., express-rate-limit with strict limits per IP)',
      code: `router.post('/trial', (req, res) => chatController.trialChat(req, res));`,
      changes: '+229 -707',
      rlhf: 'Based on 2,847 similar patches merged in your codebase'
    },
    {
      file: 'backend/src/controllers/chat.controller.ts',
      line: 16,
      severity: 'MEDIUM',
      issue: 'Inconsistent Route Parameter Naming',
      suggestion: 'Standardize parameter naming across routes',
      code: `router.get('/conversations/:id', (req, res) => chatController.getConversation(req, res));`,
      changes: '+86 -11',
      rlhf: 'Approved by security team in 94% of similar cases'
    },
    {
      file: 'backend/src/routes/chat.routes.ts',
      line: 27,
      severity: 'MEDIUM',
      issue: 'State Manipulation Without Authorization',
      suggestion: 'Add authorization check before state modification',
      code: `router.patch('/conversations/:conversationId', chatController.updateConversation);`,
      changes: '+102 -34',
      rlhf: 'Matches 156 accepted PR reviews across 12 repos'
    }
  ];

  const current = vulnerabilities[currentPhase];

  return (
    <div ref={ref} className="ide-full">
      {/* Top bar */}
      <div className="ide-top-bar">
        <div className="ide-breadcrumb">
          <span className="breadcrumb-item">IDE</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">backend</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item text-cyan">{current.file.split('/').pop()}</span>
        </div>
        <div className="ide-actions">
          <span className="action-item">Pull</span>
          <span className="action-item modified">● Modified</span>
          <span className="action-item">Push</span>
          <span className="action-item">PR</span>
        </div>
      </div>

      {/* Main content */}
      <div className="ide-main">
        {/* Left sidebar - file tree */}
        <div className="ide-sidebar">
          <div className="sidebar-header">backend</div>
          <div className="sidebar-tree">
            <div className="tree-item">▸ .claude</div>
            <div className="tree-item expanded">▾ backend</div>
            <div className="tree-item nested">▸ scripts</div>
            <div className="tree-item nested expanded">▾ src</div>
            <div className="tree-item nested-2">▸ config</div>
            <div className="tree-item nested-2 expanded">▾ controllers</div>
            <div className="tree-item nested-3 warn">● chat.controller.ts</div>
            <div className="tree-item nested-2 expanded">▾ routes</div>
            <div className="tree-item nested-3 active warn">● chat.routes.ts</div>
            <div className="tree-item nested-3">auth.routes.ts</div>
            <div className="tree-item nested-2">▸ middleware</div>
            <div className="tree-item nested-2">▸ models</div>
            <div className="tree-item nested">▸ tests</div>
            <div className="tree-item">app.ts</div>
          </div>
        </div>

        {/* Center - code editor */}
        <div className="ide-center">
          {/* File tabs */}
          <div className="ide-tabs">
            <div className="file-tab">{current.file}</div>
            <div className="file-tab">chat.controller.ts</div>
          </div>

          {/* Editor */}
          <div className="ide-editor">
            <div className="editor-gutter">
              {[1, 2, 3, 4, 5, 6, 7, current.line, 9, 10, 11, 12].map((lineNum, idx) => (
                <div 
                  key={idx}
                  className={`gutter-line ${lineNum === current.line ? 'highlight' : ''} ${scanningLine === idx ? 'scanning' : ''}`}
                >
                  {lineNum}
                </div>
              ))}
            </div>
            <div className="editor-code">
              {[
                "import { Router } from 'express';",
                "import { authenticate } from '../middleware/auth';",
                "import { ChatController } from '../controllers/chat.controller';",
                "",
                "const router = Router();",
                "",
                "// Trial chat endpoint (no auth required)",
                showFix ? "router.post('/trial', rateLimit(), chatController.trialChat);" : current.code,
                "",
                "// Protected routes",
                "router.use(authenticate);",
                "router.use(au"
              ].map((line, idx) => {
                const isVulnLine = idx === 7;
                let lineClass = 'code-line';
                
                if (isVulnLine) {
                  if (highlightState === 'scan') lineClass += ' highlight-cyan';
                  else if (highlightState === 'warn') lineClass += ' highlight-warn';
                  else if (highlightState === 'fix') lineClass += ' highlight-fixing';
                  else if (highlightState === 'done') lineClass += ' highlight-done';
                }
                
                if (scanningLine === idx && highlightState === 'scan') {
                  lineClass += ' scanning-line';
                }
                
                return (
                  <div key={idx} className={lineClass}>
                    {isVulnLine && highlightState !== 'done' && <span className="error-marker">◉</span>}
                    {isVulnLine && highlightState === 'done' && <span className="success-marker">✓</span>}
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right panel - security issues */}
        <div className="ide-right-panel">
          <div className="panel-tabs">
            <div className="panel-tab">Problems</div>
            <div className="panel-tab active">Security</div>
          </div>
          <div className="panel-content">
            <div className="panel-stat">
              <span className="stat-count">{vulnerabilities.length}</span>
              <span className="stat-label">security issues</span>
              <span className="stat-count">●</span>
              <span className="stat-label">0 lint issues</span>
            </div>

            {/* Issues list */}
            <div className="issues-list">
              {vulnerabilities.map((vuln, i) => (
                <div 
                  key={i} 
                  className={`issue-item ${i === currentPhase ? 'active' : ''}`}
                  onClick={() => setCurrentPhase(i)}
                >
                  <div className="issue-header">
                    <span className="issue-icon">◉</span>
                    <span className="issue-line">Line {vuln.line}</span>
                    <span className={`issue-severity severity-${vuln.severity.toLowerCase()}`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <div className="issue-text">{vuln.issue}</div>
                </div>
              ))}
            </div>

            {/* Security Assistant Panel */}
            <div className="assistant-panel">
              <div className="assistant-panel-header">
                <span className="text-cyan">◬</span>
                <span>Security Review Available</span>
                <span className="info-badge">INFO</span>
              </div>
              <div className="assistant-panel-body">
                <div className="panel-suggestion">
                  LINE {current.line}: {current.suggestion}
                </div>
                <div className="panel-rlhf">
                  <div className="rlhf-indicator">∞</div>
                  <div className="rlhf-content">{current.rlhf}</div>
                </div>
                <div className="panel-actions">
                  <button className="panel-btn primary">✓ Apply Fix</button>
                  <button className="panel-btn">Discuss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ide-bottom-bar">
        <div className="bottom-stat">
          <span className="stat-label">Ln {current.line}, Col 1</span>
        </div>
        <div className="bottom-stat">
          <span className="stat-label">UTF-8</span>
        </div>
        <div className="bottom-stat">
          <span className="stat-label">TypeScript</span>
        </div>
        <div className="bottom-stat">
          <span className="stat-icon">◉</span>
          <span className="stat-label text-cyan">Triage Active</span>
        </div>
      </div>
    </div>
  );
};


// Code diff visualization
const CodeDiff = () => {
  const [showFix, setShowFix] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFix(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="code-diff">
      <div className="diff-header">
        <span className="text-cyan">src/auth/login.ts</span>
      </div>
      <div className="diff-content">
        <motion.div
          className="diff-line removed"
          initial={{ opacity: 1 }}
          animate={{ opacity: showFix ? 0.3 : 1 }}
        >
          <span className="line-number">23</span>
          <span className="line-marker">-</span>
          <span className="code-text">password = request.body.password;</span>
        </motion.div>
        {showFix && (
          <motion.div 
            className="diff-line added"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="line-number">23</span>
            <span className="line-marker">+</span>
            <span className="code-text">password = sanitize(request.body.password);</span>
        </motion.div>
        )}
        <div className="diff-line context">
          <span className="line-number">24</span>
          <span className="line-marker"> </span>
          <span className="code-text">user = await db.findUser(username);</span>
        </div>
      </div>
    </div>
  );
};

// Animated metrics counter
const AnimatedCounter = ({ end, duration = 2, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Scroll-triggered phase component
const ScrollPhaseViewer = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll progress to phases more gradually
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
      description: 'Inline patches at file and function level that match your coding style and framework conventions',
      component: <LiveDiffHighlight />
    },
    {
      number: '03',
      title: 'Build',
      subtitle: 'Deterministic verification',
      description: 'Every fix includes automated tests proving the vulnerability is resolved with full reproducibility',
      component: <AutoUnitTests />
    },
    {
      number: '04',
      title: 'Review',
      subtitle: 'Evidence-based pull requests',
      description: 'Complete evidence packets with reproduction steps, verification, and rollback plans',
      component: <PRWireframe />
    },
    {
      number: '05',
      title: 'Release',
      subtitle: 'Policy-aware deployment',
      description: 'Smart auto-merge for low-risk classes, structured sign-off for higher-risk changes',
      component: <GitActionsFlow />
    },
    {
      number: '06',
      title: 'Operate',
      subtitle: 'Continuous learning',
      description: 'Post-merge validation and incident correlation feed learning signals back into planning',
      component: <VulnerabilityPipeline />
    }
  ];

  const active = phases[currentPhase];

  return (
    <section ref={sectionRef} className="scroll-phase-section">
      <div className="container-max">
        <div className="phase-layout">
          {/* Phase indicators */}
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

          {/* Content area */}
          <div className="phase-content-area">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
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
  const networkY = useTransform(scrollY, [1000, 2000], [100, -100]);

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
      {/* Animated progress bar */}
        <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan via-pale-wood to-cyan z-[100] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Floating security indicators */}
      <div className="fixed top-24 right-8 z-40 space-y-2 hidden lg:block">
        <motion.div
          className="security-badge"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-cyan mr-2" />
          <span className="text-[12px]">SECURE</span>
        </motion.div>
        <motion.div 
          className="security-badge"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <div className="w-2 h-2 bg-pale-wood mr-2" />
          <span className="text-[12px]">SCANNING</span>
        </motion.div>
      </div>

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

      {/* Hero Section with Live Code Scanning */}
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
                AI-powered security that embeds into your workflow, finding and fixing vulnerabilities automatically.
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

              {/* Live metrics */}
        <motion.div
                className="grid grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
                animate={{ opacity: mounted ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <div>
                  <div className="text-[40px] font-mono text-cyan mb-1">
                    <AnimatedCounter end={156} />K
                  </div>
                  <div className="text-caption">patches learned</div>
                </div>
                <div>
                  <div className="text-[40px] font-mono text-cyan mb-1">
                    <AnimatedCounter end={94} suffix="%" />
                  </div>
                  <div className="text-caption">merge rate</div>
                </div>
                <div>
                  <div className="text-[40px] font-mono text-cyan mb-1">
                    <AnimatedCounter end={8} />.<AnimatedCounter end={9} />M
                  </div>
                  <div className="text-caption">learning signals</div>
                </div>
              </motion.div>
            </div>

            {/* Live vulnerability scanner */}
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

        {/* Animated network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <motion.path
            d="M0,200 Q400,100 800,200"
            stroke="var(--color-cyan)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </section>

      {/* Trusted By - Rotating Logos */}
      <section className="py-20 bg-secondary border-y border-pale-wood/10 overflow-hidden">
        <div className="container-max">
          <p className="text-center text-[12px] text-pale-wood/40 mb-12 uppercase tracking-widest font-mono">
            Trusted by engineers at
          </p>
          <div className="logo-carousel">
          <motion.div
              className="logo-track"
              animate={{ x: [0, -1800] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {/* First set of logos */}
              {[
                'Berkeley.png',
                'stanford-bw-logo.png',
                'Nyu_short_black.svg (1) (1).png',
                'amazon-logo-black-transparent-1.png',
                'novita-ai-logo-png_seeklogo-611671 (1).png',
                '711c05d6-a57a-4567-bdf6-1649d03a68a6.png',
                'ee1a22e0-bf8f-4c49-8728-4fc9ef1a7fbe (1).png',
                '62f3a322559f1b57bbc8998fae009d42.png',
                'image-ebaf55a8-a29f-4b96-a4dd-511a1b997a9f.png'
              ].map((logo, i) => (
                <div key={`set1-${i}`} className="logo-item">
                  <Image
                    src={`/user_logos/${logo}`}
                    alt="Customer logo"
                    width={120}
                    height={40}
                    className="logo-img"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[
                'Berkeley.png',
                'stanford-bw-logo.png',
                'Nyu_short_black.svg (1) (1).png',
                'amazon-logo-black-transparent-1.png',
                'novita-ai-logo-png_seeklogo-611671 (1).png',
                '711c05d6-a57a-4567-bdf6-1649d03a68a6.png',
                'ee1a22e0-bf8f-4c49-8728-4fc9ef1a7fbe (1).png',
                '62f3a322559f1b57bbc8998fae009d42.png',
                'image-ebaf55a8-a29f-4b96-a4dd-511a1b997a9f.png'
              ].map((logo, i) => (
                <div key={`set2-${i}`} className="logo-item">
                  <Image
                    src={`/user_logos/${logo}`}
                    alt="Customer logo"
                    width={120}
                    height={40}
                    className="logo-img"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real-time Detection Visualization */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="reveal mb-6">Real-time vulnerability detection and patching</h2>
            <p className="reveal text-[18px] text-pale-wood/70 max-w-3xl mx-auto">
              AI-powered analysis that learns from every merged fix in your organization
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="reveal">
              <SecurityHeatmap />
            </div>
            <div className="reveal">
              <CodeDiff />
            </div>
          </div>
        </div>
      </section>

      {/* Attack Surface Visualization */}
      <section className="section-padding relative overflow-hidden">
          <motion.div
          className="container-max relative z-10"
          style={{ y: networkY }}
        >
          <div className="text-center mb-20">
            <h2 className="reveal mb-6">Embedded Security, For Everyone</h2>
            <p className="reveal text-[20px] text-pale-wood/70 max-w-3xl mx-auto">
              Security as a built-in property of software, not an afterthought
            </p>
          </div>

          <div className="reveal max-w-5xl mx-auto mb-20">
            <div className="grid md:grid-cols-3 gap-0 border border-cyan">
              {[
                { label: 'Before Triage', value: '100%', color: 'text-pale-wood/60' },
                { label: 'After 30 days', value: '23%', color: 'text-pale-wood/80' },
                { label: 'After 90 days', value: '2%', color: 'text-cyan' }
              ].map((stat, i) => (
                <div key={i} className="text-center p-12 border-r border-cyan last:border-r-0">
                  <div className={`text-[56px] font-mono mb-3 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-[14px] text-pale-wood/60">{stat.label}</div>
                  <div className="text-[12px] text-pale-wood/40 mt-2">Attack Surface</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12 text-[18px] leading-[1.9] max-w-4xl mx-auto">
            <p className="reveal">
              Triage treats security as a <span className="text-cyan border-b border-cyan">built-in property of software</span>, not an afterthought. "Embedded security" means the system sits inside everyday engineering loops so that discovery, reproduction, patching, verification, and shipping occur where work already happens.
            </p>
            
            <p className="reveal">
              "Security for everyone" means <span className="text-cyan border-b border-cyan">any contributor can understand, act on, and verify</span> a finding without becoming a specialist. The platform's agents learn from each team's actual behavior, so evidence quality, patch precision, and merge rates improve over time for the entire organization.
            </p>
          </div>
          </motion.div>

        {/* Network visualization background */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={i}
              cx={`${20 + (i % 5) * 20}%`}
              cy={`${20 + Math.floor(i / 5) * 20}%`}
              r="3"
              fill="var(--color-cyan)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </svg>
      </section>

      {/* Scroll-driven Lifecycle Phases */}
      <ScrollPhaseViewer />


      {/* Golden Repository Visualization */}
      <section className="section-padding bg-secondary relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="reveal mb-12 text-center">Golden Repository as organizational memory</h2>
            
            <div className="reveal text-center mb-16">
              <p className="text-[20px] leading-[1.8] text-pale-wood/80">
                A tenant-private store of code structure, runtime maps, exploit traces, patch history, and learning signals
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="reveal">
                <div className="repository-card">
                  <div className="repo-icon">⌘</div>
                  <div className="repo-label">Code Structure</div>
                  <div className="repo-data">
                    <AnimatedCounter end={2} />.<AnimatedCounter end={8} />M nodes
                  </div>
                  <div className="repo-detail">Comprehensive code graphs across all repositories</div>
                </div>
              </div>
              <div className="reveal">
                <div className="repository-card">
                  <div className="repo-icon">∞</div>
                  <div className="repo-label">Patch History</div>
                  <div className="repo-data">
                    <AnimatedCounter end={156} />K applied
                  </div>
                  <div className="repo-detail">Merged fixes feeding reinforcement learning</div>
                </div>
              </div>
              <div className="reveal">
                <div className="repository-card">
                  <div className="repo-icon">◆</div>
                  <div className="repo-label">Learning Signals</div>
                  <div className="repo-data">
                    <AnimatedCounter end={8} />.<AnimatedCounter end={9} />M events
                  </div>
                  <div className="repo-detail">Continuous RLHF from team behavior</div>
                </div>
              </div>
            </div>

            <div className="reveal mt-12">
              <CommitTimeline />
            </div>
          </div>
        </div>

        {/* Data flow visualization */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-20 bg-cyan"
              style={{
                left: `${10 + i * 6}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Evidence Standards */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Evidence that any engineer can read</h2>

          <div className="max-w-6xl mx-auto">
            <div className="evidence-grid">
              {[
                {
                  title: 'One-page summary',
                  content: 'Entry point, impact, root cause, and the exact locations touched',
                  metric: '< 60 sec',
                  label: 'to understand'
                },
                {
                  title: 'Reproduction',
                  content: 'A short, stepwise script or sequence with prerequisites and expected pre-patch behavior',
                  metric: '100%',
                  label: 'reproducible'
                },
                {
                  title: 'Verification',
                  content: 'The same sequence post-patch, with clear pass criteria and artifacts',
                  metric: '0',
                  label: 'false positives'
                },
                {
                  title: 'Change set',
                  content: 'A minimal diff and targeted tests',
                  metric: '< 10',
                  label: 'lines changed'
                },
                {
                  title: 'Rollback',
                  content: 'A concrete plan with a single command or revert ref',
                  metric: '1',
                  label: 'command'
                }
            ].map((item, i) => (
              <motion.div
                key={i}
                  className="evidence-card"
                  initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                    viewport={{ once: false }}
                >
                  <div className="evidence-header">
                    <span className="evidence-number">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="evidence-title">{item.title}</h4>
                  </div>
                  <p className="evidence-content">{item.content}</p>
                  <div className="evidence-metric">
                    <div className="metric-value">{item.metric}</div>
                    <div className="metric-label">{item.label}</div>
                  </div>
              </motion.div>
            ))}
              </div>
          </div>
        </div>
      </section>


      {/* RLHF Learning System */}
      <section className="section-padding">
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
              <h3 className="text-[28px] mb-12 pb-4 border-b border-cyan">Learning signals captured</h3>
              <div className="space-y-6">
                {[
                  { 
                    signal: 'Merged patches without edits', 
                    weight: 'Primary signal',
                    impact: 'Reinforces patch quality and code style preferences',
                    strength: 95
                  },
                  { 
                    signal: 'Reviewer comments and modifications', 
                    weight: 'Style learning',
                    impact: 'Adapts to team conventions and patterns',
                    strength: 87
                  },
                  { 
                    signal: 'Test stability across versions', 
                    weight: 'Verification quality',
                    impact: 'Improves reproducibility and evidence strength',
                    strength: 92
                  },
                  { 
                    signal: 'Incident correlation mapping', 
                    weight: 'Feedback loop',
                    impact: 'Links production issues to missed hypotheses',
                    strength: 78
                  },
                  { 
                    signal: 'Auto-merge vs manual review', 
                    weight: 'Policy calibration',
                    impact: 'Tunes risk thresholds to team tolerance',
                    strength: 89
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="rlhf-signal"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: false }}
                  >
                    <div className="signal-header">
                      <span className="signal-name">{item.signal}</span>
                      <span className="signal-strength">{item.strength}%</span>
                    </div>
                    <div className="signal-weight">{item.weight}</div>
                    <div className="signal-impact">{item.impact}</div>
                    <motion.div 
                      className="signal-bar"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: item.strength / 100 }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                      viewport={{ once: false }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="reveal space-y-12">
              <div>
                <h3 className="text-[28px] mb-12 pb-4 border-b border-cyan">Adaptation outcomes</h3>
                <div className="space-y-8">
                  {[
                    { 
                      metric: 'Patch acceptance rate',
                      before: '67%',
                      after: '94%',
                      mechanism: 'Learns idiomatic code patterns from merged PRs'
                    },
                    { 
                      metric: 'Lines changed per fix',
                      before: '142',
                      after: '23',
                      mechanism: 'Minimizes scope based on reviewer feedback'
                    },
                    { 
                      metric: 'False positive rate',
                      before: '23%',
                      after: '< 1%',
                      mechanism: 'Penalizes noisy tactics through outcome scoring'
                    },
                    { 
                      metric: 'Time to first fix',
                      before: '4.2 days',
                      after: '2.3 hours',
                      mechanism: 'Reuses proven playbooks and environment recipes'
                    }
                  ].map((item, i) => (
                    <div key={i} className="outcome-card">
                      <div className="outcome-metric">{item.metric}</div>
                      <div className="outcome-comparison">
                        <span className="outcome-before">{item.before}</span>
                        <span className="outcome-arrow">→</span>
                        <span className="outcome-after">{item.after}</span>
                      </div>
                      <div className="outcome-mechanism">{item.mechanism}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal">
                <TestExecution />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Observable Trajectory */}
      <section className="section-padding bg-secondary">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Observable trajectory</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              {
                direction: '↓',
                metric: 'False positives',
                from: '23%',
                to: '< 1%',
                detail: 'Noisy tactics penalized',
                color: 'text-cyan'
              },
              {
                direction: '↑',
                metric: 'Evidence quality',
                from: '156 lines',
                to: '< 50 lines',
                detail: 'Shorter and stronger',
                color: 'text-cyan'
              },
              {
                direction: '↓',
                metric: 'Mean time to fix',
                from: '4.2 days',
                to: '< 3 hours',
                detail: 'Playbooks reused',
                color: 'text-pale-wood'
              },
              {
                direction: '↑',
                metric: 'Auto-merge rate',
                from: '12%',
                to: '67%',
                detail: 'More classes eligible',
                color: 'text-cyan'
              }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                className="trajectory-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              viewport={{ once: false }}
              >
                <div className={`trajectory-direction ${item.color}`}>{item.direction}</div>
                <h4 className="trajectory-metric">{item.metric}</h4>
                <div className="trajectory-values">
                  <span className="value-from">{item.from}</span>
                  <span className="value-arrow">→</span>
                  <span className={`value-to ${item.color}`}>{item.to}</span>
                </div>
                <p className="trajectory-detail">{item.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
      </section>

      {/* Operating Model */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">End-to-end operating model</h2>

          <div className="operating-flow">
            {[
              {
                step: 'Connect',
                cmd: '$ triage connect',
                description: 'Link version control and select services and environments. Use least-privilege, read-only tokens by default',
                status: 'Ready'
              },
              {
                step: 'Index',
                cmd: '$ triage index',
                description: 'Build code and data-flow graphs, dependency and permission maps. Store in Golden Repository with versioning',
                status: 'Processing'
              },
              {
                step: 'Scan',
                cmd: '$ triage scan --mode=comprehensive',
                description: 'Convert diffs, graphs, and manifests into ranked hypotheses. Partition work across desktop and web runners',
                status: 'Running'
              },
              {
                step: 'Patch',
                cmd: '$ triage patch --verify',
                description: 'Propose minimal, framework-aware diffs with targeted tests. Replay the exploit path after patch to prove failure',
                status: 'Generating'
              },
              {
                step: 'Deploy',
                cmd: '$ triage deploy --auto-merge',
                description: 'Open pull request with evidence packet. Auto-merge where policy allows, route high-risk to reviewers',
                status: 'Deploying'
              },
              {
                step: 'Learn',
                cmd: '$ triage analyze --feedback',
                description: 'Score outcomes and update exploration spread, routing, patch templates. All learning remains tenant-private',
                status: 'Learning'
              }
            ].map((phase, i) => (
            <motion.div
                key={i}
                className="operating-step"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: false }}
              >
                <div className="step-marker">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-content">
                  <div className="step-header">
                    <h3 className="step-title">{phase.step}</h3>
                    <span className="step-status">{phase.status}</span>
                  </div>
                  <div className="step-command">{phase.cmd}</div>
                  <p className="step-description">{phase.description}</p>
                </div>
                {i < 5 && (
                  <motion.div 
                    className="step-connector"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
                    viewport={{ once: false }}
                  />
                )}
            </motion.div>
            ))}
          </div>

          <div className="reveal mt-16">
            <PRWireframe />
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="section-padding bg-gradient-to-br from-bg-secondary to-midnight-green/20">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Governance and safety</h2>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                category: 'Access Control',
                items: [
                  { label: 'Scoping', value: 'Repository-level' },
                  { label: 'RBAC', value: 'Granular roles' },
                  { label: 'SSO/SAML', value: 'Enterprise ready' },
                  { label: 'SCIM', value: 'Auto-provisioning' }
                ]
              },
              {
                category: 'Data Protection',
                items: [
                  { label: 'Encryption', value: 'End-to-end' },
                  { label: 'Keys', value: 'Customer-managed' },
                  { label: 'Retention', value: 'Configurable' },
                  { label: 'Audit logs', value: 'Immutable' }
                ]
              },
              {
                category: 'Policy Enforcement',
                items: [
                  { label: 'Allow/Deny lists', value: 'Customizable' },
                  { label: 'Egress rules', value: 'Network-level' },
                  { label: 'Rate limits', value: 'Adaptive' },
                  { label: 'Maintenance windows', value: 'Scheduled' }
                ]
              }
            ].map((section, i) => (
              <div key={i} className="governance-section reveal">
                <h3 className="governance-title">{section.category}</h3>
                <div className="governance-items">
                  {section.items.map((item, j) => (
                    <div key={j} className="governance-item">
                      <span className="item-label">{item.label}</span>
                      <span className="item-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="reveal text-center text-[16px] mt-16 text-pale-wood/70">
            These controls ensure embedded security enhances velocity without expanding risk
          </p>
        </div>
      </section>

      {/* Deployment Patterns */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Deployment patterns</h2>

          <div className="deployment-grid">
            {[
              {
                title: 'Managed Shared',
                level: 'Standard',
                description: 'Managed control plane with shared workers for evaluation and low-risk scopes',
                features: ['Quick setup', 'Cost-effective', 'Automatic updates', 'Shared infrastructure'],
                latency: '< 100ms',
                cost: '$'
              },
              {
                title: 'VPC-Resident',
                level: 'Professional',
                description: 'Managed control plane with VPC-resident workers when artifacts must remain in your cloud',
                features: ['Data sovereignty', 'Network isolation', 'Custom policies', 'Private workers'],
                latency: '< 50ms',
                cost: '$$'
              },
              {
                title: 'Self-Hosted',
                level: 'Enterprise',
                description: 'Fully self-hosted or air-gapped when maximum isolation is required',
                features: ['Complete control', 'Air-gapped option', 'On-premises', 'Custom SLAs'],
                latency: '< 10ms',
                cost: '$$$'
              }
            ].map((pattern, i) => (
              <motion.div
                key={i}
                className="deployment-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: false }}
              >
                <div className="deployment-level">{pattern.level}</div>
                <h3 className="deployment-title">{pattern.title}</h3>
                <p className="deployment-description">{pattern.description}</p>
                <div className="deployment-features">
                  {pattern.features.map((feature, j) => (
                    <div key={j} className="feature-tag">{feature}</div>
                  ))}
                </div>
                <div className="deployment-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Latency</span>
                    <span className="metric-value">{pattern.latency}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Cost</span>
                    <span className="metric-value">{pattern.cost}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section-padding bg-secondary">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Metrics that prove inclusion and improvement</h2>

          <div className="metrics-dashboard">
            <div className="metrics-header reveal">
              <h3>Real-time Security Dashboard</h3>
              <div className="dashboard-status">
                <div className="status-dot" />
                <span>Live</span>
              </div>
            </div>

            <div className="metrics-grid">
              {[
                { label: 'Accepted-PR rate', value: 94, unit: '%', trend: '+12%' },
                { label: 'Mean time to fix', value: 2.3, unit: 'hrs', trend: '-67%' },
                { label: 'False positive rate', value: 0.8, unit: '%', trend: '-89%' },
                { label: 'Auto-merge eligible', value: 67, unit: '%', trend: '+45%' },
                { label: 'Exploit repro rate', value: 99.9, unit: '%', trend: '+8%' },
                { label: 'Incident correlation', value: 12, unit: 'ms', trend: '-34%' }
              ].map((metric, i) => (
          <motion.div
                  key={i}
                  className="metric-card"
                  initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
            viewport={{ once: false }}
                >
                  <div className="metric-label">{metric.label}</div>
                  <div className="metric-value">
                    <AnimatedCounter end={metric.value} />
                    {metric.unit}
                  </div>
                  <div className="metric-trend">
                    {metric.trend.startsWith('+') ? '↑' : '↓'} {metric.trend}
                  </div>
          </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maturity Model */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Maturity model with inclusive checkpoints</h2>

          <div className="maturity-timeline">
            {[
              {
                phase: 'Discovery & Trust',
                number: '01',
                timeframe: 'Week 1-2',
                description: 'First deterministic repros land in CI. Engineers validate that evidence is readable and repeatable without expert help',
                milestones: ['First scan completed', 'Evidence reviewed', 'Team onboarded']
              },
              {
                phase: 'Patch Culture',
                number: '02',
                timeframe: 'Week 3-6',
                description: 'Minimal diffs and targeted tests become standard. Reviewers spend less time deciphering and more time deciding',
                milestones: ['First auto-patch', 'Review time reduced', 'CI integrated']
              },
              {
                phase: 'Policy-Eligible Autonomy',
                number: '03',
                timeframe: 'Month 2-3',
                description: 'Low-risk classes meet guard criteria for auto-merge. Security work is distributed and predictable',
                milestones: ['Auto-merge enabled', 'Policy tuned', 'Metrics tracked']
              },
              {
                phase: 'Continuous Elevation',
                number: '04',
                timeframe: 'Month 4+',
                description: 'Agents proactively retest exploit corridors after changes. Classes that required specialists become routine fixes',
                milestones: ['Full automation', 'Learning optimized', 'Zero-touch security']
              }
            ].map((phase, i) => (
          <motion.div
                key={i}
                className="maturity-phase"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: false }}
              >
                <div className="phase-marker">
                  <div className="phase-number">{phase.number}</div>
                  <div className="phase-timeframe">{phase.timeframe}</div>
                </div>
                <div className="phase-content">
                  <h3 className="phase-name">{phase.phase}</h3>
                  <p className="phase-description">{phase.description}</p>
                  <div className="phase-milestones">
                    {phase.milestones.map((milestone, j) => (
                      <div key={j} className="milestone-item">
                        <div className="milestone-check">✓</div>
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>
          </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="section-padding bg-gradient-to-b from-bg-primary to-bg-secondary">
        <div className="container-max">
          <h2 className="reveal mb-20 text-center">Core principles</h2>

          <div className="principles-grid">
            {[
              { 
                principle: 'Ship fixes, not alerts',
                category: 'Core promise',
                icon: '→'
              },
              { 
                principle: 'Embed security where engineers already work',
                category: 'Design principle',
                icon: '◉'
              },
              { 
                principle: 'Make every finding understandable and actionable by any contributor',
                category: 'Accessibility principle',
                icon: '◈'
              },
              { 
                principle: 'Raise the baseline continuously with tenant-private reinforcement',
                category: 'Learning principle',
                icon: '∞'
              },
              { 
                principle: 'Deterministic evidence before and after the patch, every time',
                category: 'Proof principle',
                icon: '✓'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="principle-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
            viewport={{ once: false }}
              >
                <div className="principle-icon">{item.icon}</div>
                <div className="principle-category">{item.category}</div>
                <h3 className="principle-text">{item.principle}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Perspective */}
      <section className="section-padding relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            viewport={{ once: false }}
            >
              <h2 className="reveal mb-16">Final perspective</h2>
              
              <div className="space-y-12 text-[20px] leading-[2]">
                <p className="reveal">
                  Embedded security works when three things are true. First, the system lives <span className="text-cyan border-b border-cyan">inside the development lifecycle</span> instead of in a separate queue.
                </p>
                
                <p className="reveal">
                  Second, every person who touches the codebase can <span className="text-cyan border-b border-cyan">understand and act on findings</span> without specialized training because evidence is clear and reproducible.
                </p>
                
                <p className="reveal">
                  Third, the system <span className="text-cyan border-b border-cyan">learns from what your organization accepts</span> and rejects so that the next run is more precise than the last.
                </p>
                
                <motion.p 
                  className="reveal text-cyan text-[32px] font-light py-16"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                viewport={{ once: false }}
                >
                  Triage is built to satisfy all three.
                </motion.p>
                
                <p className="reveal text-pale-wood/90">
                  The result is security that belongs to everyone, improves continuously, and ships as merged, verifiable fixes.
                </p>
              </div>
              </motion.div>
          </div>
        </div>

        {/* Closing ambient effect */}
        <div className="absolute inset-0 opacity-5">
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan blur-[200px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
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