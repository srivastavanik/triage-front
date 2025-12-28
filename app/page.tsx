'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FAQ } from '../components/FAQ';
import { TriageAgentWorkflow } from '../components/TriageAgentWorkflow';
import { ObservabilityDashboard } from '../components/ObservabilityDashboard';
import { TraceExplorerDemo } from '../components/TraceExplorerDemo';
import { ModelCatalogue } from '../components/ModelCatalogue';
import { LearningPipeline } from '../components/LearningPipeline';
import { SiteNav } from '../components/SiteNav';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [captureStep, setCaptureStep] = useState(0);
  const [detectStep, setDetectStep] = useState(0);
  const [testStep, setTestStep] = useState(0);
  const [detectPaused, setDetectPaused] = useState(false);
  const [testPaused, setTestPaused] = useState(false);
  const [detectProgress, setDetectProgress] = useState(0);
  const [testProgress, setTestProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  // Auto-cycle detect steps with progress
  useEffect(() => {
    if (detectPaused) {
      const resumeTimer = setTimeout(() => setDetectPaused(false), 10000);
      return () => clearTimeout(resumeTimer);
    }
    
    const progressInterval = setInterval(() => {
      setDetectProgress(prev => {
        if (prev >= 100) {
          setDetectStep(s => (s + 1) % 4);
          return 0;
        }
        return prev + 2; // 50 steps * 100ms = 5 seconds per item
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [detectPaused]);

  // Auto-cycle test steps with progress
  useEffect(() => {
    if (testPaused) {
      const resumeTimer = setTimeout(() => setTestPaused(false), 10000);
      return () => clearTimeout(resumeTimer);
    }
    
    const progressInterval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          setTestStep(s => (s + 1) % 3);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [testPaused]);

  // Reset progress when step changes manually
  const handleDetectClick = (index: number) => {
    setDetectStep(index);
    setDetectProgress(0);
    setDetectPaused(true);
  };

  const handleTestClick = (index: number) => {
    setTestStep(index);
    setTestProgress(0);
    setTestPaused(true);
  };
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const captureSteps = [
    { 
      title: 'Model call tracing', 
      description: 'Capture every model request and response across providers. Track latency, token counts, costs, retries, and failures automatically.' 
    },
    { 
      title: 'Tool and agent execution', 
      description: 'See which tools were invoked, with what arguments, what outputs they returned, and what actions the model took next.' 
    },
    { 
      title: 'RAG and retrieval visibility', 
      description: 'Track retrieved documents, relevance scores, what content entered context, and detect poisoned or malicious documents.' 
    },
    { 
      title: 'Security context', 
      description: 'Capture identity, session metadata, routing decisions, and policy enforcement outcomes for every interaction.' 
    },
  ];

  const detectSteps = [
    { 
      title: 'Tool boundary enforcement', 
      description: 'Block, allow, or require approval for sensitive tool actions. Define scope restrictions and allowlists. Prevent path traversal and sandbox escapes.' 
    },
    { 
      title: 'Retrieval boundary controls', 
      description: 'Enforce allowed sources, required filters, and tenant boundaries. Detect instruction injection via retrieved content.' 
    },
    { 
      title: 'Output boundary protection', 
      description: 'Detect and redact sensitive patterns in outputs. Prevent data exfiltration through model responses and tool results.' 
    },
    { 
      title: 'Audit logging', 
      description: 'Every enforcement decision produces structured audit logs. Full provenance chain for incident response and compliance.' 
    },
  ];

  const testingSteps = [
    { 
      title: 'Incident to test conversion', 
      description: 'Convert real incidents and near-misses into repeatable security tests. Build regression suites from production failures.' 
    },
    { 
      title: 'Change evaluation', 
      description: 'Run security evaluations on every material change: prompt templates, tool definitions, retrieval configuration, and model updates.' 
    },
    { 
      title: 'Drift detection', 
      description: 'Track behavior drift across releases and provider changes. Catch security regressions before they reach production.' 
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-text-primary selection:text-bg-primary">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[1px] bg-text-primary z-[101] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Announcement Bar */}
      <Link 
        href="/blog/triage-raises-1-5m" 
        className="fixed top-0 left-0 right-0 z-[101] overflow-hidden"
      >
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          style={{ objectPosition: 'center 20%' }}
        >
          <source src="/announcement-bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-black/20" />
        {/* Content */}
        <div className="container-max relative z-10">
          <div className="flex items-center justify-center gap-3 py-2.5 text-[13px] text-white">
            <span className="font-medium drop-shadow-sm">Triage raises $1.5M Pre-Seed at a $12M valuation, led by BoxGroup</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white drop-shadow-sm">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <SiteNav offsetTop={40} />

      {/* Hero Section */}
      <section className="pt-52 pb-16">
        <div className="container-max">
              <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 -mx-2 md:-mx-4 lg:-mx-6"
          >
            <div className="text-left space-y-4">
              <h1 className="text-[44px] lg:text-[56px] font-normal leading-[1.1] tracking-[-0.02em]">
                Security is Changing
              </h1>
              <p className="text-[18px] lg:text-[22px] text-text-tertiary font-normal leading-[1.5] max-w-lg">
                Remediate, denoise, and ship faster than ever
              </p>
                </div>
            
            <a href="mailto:srivastavan@berkeley.edu" className="btn-ghost px-10 py-4 rounded-full text-[17px] shrink-0">
              <span className="btn-ghost-text">Get Started</span>
            </a>
              </motion.div>
        </div>
      </section>

      {/* Main Demo - Agent Workflow */}
      <section className="py-4 pb-20 -mt-12">
        <div className="container-max">
          {/* Wrapper with background image */}
          <div className="relative rounded-lg flex flex-col items-center">
            {/* Background image - cropped top tighter, tight horizontal */}
            <div className="absolute -bottom-4 -top-2 -inset-x-2 md:-bottom-8 md:-top-4 md:-inset-x-4 lg:-bottom-10 lg:-top-6 lg:-inset-x-6 rounded-lg overflow-hidden">
              <Image
                src="/wider.png"
                alt=""
                fill
                className="object-cover object-center"
                priority
              />
              {/* Top blur gradient */}
              <div className="absolute top-0 left-0 right-0 h-40 z-10 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,transparent)] pointer-events-none" />
            </div>
            
            {/* PARSE Intro Text - positioned closer to top */}
            <motion.p
            initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-20 text-[13px] text-text-tertiary pt-4 pb-4 text-center"
            >
              Introducing <span className="text-text-secondary font-medium">PARSE</span> (Platform for Agentic Remediation of Static Errors), your web-based answer to AI-Native Security
            </motion.p>
            
            {/* Content - wider with dropshadow */}
            <div className="relative z-10 w-full flex justify-center pb-12 px-4">
              <div className="w-full max-w-6xl">
                <div className="mx-auto w-full transform-gpu scale-[0.95] origin-center rounded-xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
                  <TriageAgentWorkflow />
        </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="py-12 border-y border-[#1a1a1a]">
        <div className="container-max">
          <p className="text-center text-[11px] font-medium tracking-[0.15em] uppercase text-text-muted mb-10">
            Trusted by engineers at
          </p>
          <div className="logo-carousel opacity-60 hover:opacity-100 transition-opacity duration-500 overflow-hidden">
            <div className="logo-track flex items-center gap-5 animate-scroll-logos">
              {/* Triple the logos for seamless infinite scroll */}
              {Array(3).fill([
                { src: '/user_logos/711c05d6-a57a-4567-bdf6-1649d03a68a6.png', alt: 'DittoAI', scale: 1.05 },
                { src: '/logos/image-ebaf55a8-a29f-4b96-a4dd-511a1b997a9f.png', alt: 'Y Combinator', scale: 1.15 },
                { src: '/user_logos/Berkeley.png', alt: 'UC Berkeley', scale: 0.95 },
                { src: '/ucsd-logo-png-transparent.png', alt: 'UCSD', scale: 1.55 },
                { src: '/Stanford-Symbol (1).png', alt: 'Stanford', scale: 1.6 },
                { src: '/user_logos/Nyu_short_black.svg (1) (1).png', alt: 'NYU', scale: 1.05 },
                { src: '/MIT_logo.svg.png', alt: 'MIT', scale: 1.0 },
                { src: '/CMU Logo.png', alt: 'Carnegie Mellon', scale: 1.25 },
                { src: '/Georgia_Tech_Yellow_Jackets_logo.svg.png', alt: 'Georgia Tech', scale: 1.15 },
                { src: '/cornell_seal_simple.png', alt: 'Cornell', scale: 1.7 },
                { src: '/columbia-university-logo-png-columbia-university-crown.png', alt: 'Columbia', scale: 1.6 },
                { src: '/user_logos/amazon-logo-black-transparent-1.png', alt: 'Amazon', scale: 1.0 },
                { src: '/user_logos/novita-ai-logo-png_seeklogo-611671 (1).png', alt: 'Novita', scale: 1.05 },
              ]).flat().map((logo, i) => (
                <div key={i} className="logo-item h-14 w-[150px] flex items-center justify-center shrink-0">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={34}
                    className="w-auto transition-all duration-300"
                    style={{
                      objectFit: 'contain', 
                      filter: 'brightness(0) invert(1)', 
                      height: '34px',
                      maxHeight: '100%',
                      maxWidth: '150px',
                      transform: `scale(${(logo as any).scale ?? 1})`,
                      transformOrigin: 'center',
                    }}
                  />
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Attack Surfaces Covered */}
      <section id="attack-surfaces" className="py-24 bg-[#0d0d0d] overflow-hidden">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[500px]">
            {/* Left side - Heading */}
            <div>
              <h2 className="text-[32px] lg:text-[44px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">
                AI-native attack surfaces require AI-native security
              </h2>
              <p className="text-text-secondary text-[17px] max-w-md leading-relaxed">
                Foundation models with tools and retrieval introduce failure modes that traditional security tools cannot see
              </p>
            </div>

            {/* Right side - Roulette scrolling animation */}
            <div className="relative h-[400px] overflow-hidden">
              {/* Gradient overlays for fade effect */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling content */}
              <div className="animate-roulette-scroll">
                {/* First set of items */}
                {[
                  'Prompt injection and instruction hijacking',
                  'Unsafe tool invocation and scope escalation',
                  'Data exfiltration via outputs and tool results',
                  'Cross-tenant leakage through traces and context',
                  'Poisoned indexes and malicious documents',
                  'Instruction injection via retrieved content',
                  'Over-broad retrieval due to weak ACLs',
                  'Sensitive data pulled into context without controls',
                  'Data poisoning in fine-tuning datasets',
                  'Backdoors triggered by specific patterns',
                  'Behavior drift from pipeline changes',
                  'Weak evaluation that misses regressions',
                  'Reward hacking and misaligned incentives',
                  'Prompt changes without regression tests',
                  'No ground truth for actions taken',
                  'Silent failures that compound over time',
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="py-3"
                  >
                    <span className="text-[28px] lg:text-[36px] font-normal leading-[1.2] tracking-[-0.02em] text-[#666] hover:text-[#f5f4f0] transition-colors duration-300 cursor-default">
                      {item}
              </span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {[
                  'Prompt injection and instruction hijacking',
                  'Unsafe tool invocation and scope escalation',
                  'Data exfiltration via outputs and tool results',
                  'Cross-tenant leakage through traces and context',
                  'Poisoned indexes and malicious documents',
                  'Instruction injection via retrieved content',
                  'Over-broad retrieval due to weak ACLs',
                  'Sensitive data pulled into context without controls',
                  'Data poisoning in fine-tuning datasets',
                  'Backdoors triggered by specific patterns',
                  'Behavior drift from pipeline changes',
                  'Weak evaluation that misses regressions',
                  'Reward hacking and misaligned incentives',
                  'Prompt changes without regression tests',
                  'No ground truth for actions taken',
                  'Silent failures that compound over time',
                ].map((item, i) => (
                  <div 
                    key={`dup-${i}`} 
                    className="py-3"
                  >
                    <span className="text-[28px] lg:text-[36px] font-normal leading-[1.2] tracking-[-0.02em] text-[#666] hover:text-[#f5f4f0] transition-colors duration-300 cursor-default">
                      {item}
              </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBSERVE Section - AI Observability Dashboard */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container-max">
          {/* Section Header */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Observe</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <h2 className="text-[36px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] max-w-xl">
              Ground truth for what your AI systems actually do
            </h2>
            <div className="flex flex-col justify-center">
              <p className="text-text-secondary text-[17px] leading-relaxed max-w-md">
                Structured telemetry across model calls, tool executions, and retrieval events. 
                Know exactly what happened when something goes wrong.
              </p>
            </div>
          </div>

          {/* Full Width Dashboard with Background */}
          <div className="relative rounded-lg flex flex-col items-center">
            {/* Background image - cropped and styled like PARSE section */}
            <div className="absolute -bottom-2 -top-2 -inset-x-4 md:-bottom-4 md:-top-4 md:-inset-x-8 lg:-bottom-6 lg:-top-6 lg:-inset-x-12 rounded-xl overflow-hidden">
              <Image
                src="/p2.png"
                alt=""
                fill
                className="object-cover object-center"
                priority
              />
              {/* Top blur gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 z-10 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,transparent)] pointer-events-none" />
            </div>
            
            {/* Dashboard content */}
            <div className="relative z-10 w-full flex justify-center py-12 px-4">
              <div className="w-full max-w-7xl">
                <div className="mx-auto w-full transform-gpu scale-[0.98] origin-center rounded-xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
                  <ObservabilityDashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPTURE Section - Trace Explorer */}
      <section className="py-32 bg-[#0d0d0d]">
        <div className="container-max">
          {/* Section Header */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Capture</span>
          </div>
          <h2 className="text-[36px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-16 max-w-2xl">
            Reconstruct any interaction end-to-end
          </h2>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Step Accordion */}
            <div className="space-y-0">
              {captureSteps.map((step, index) => (
                <div 
                  key={index}
                  className="border-t border-[#1a1a1a]"
                >
                  <button
                    className={`w-full text-left py-6 transition-colors duration-300 ${captureStep === index ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                    onClick={() => setCaptureStep(index)}
                  >
                    <h3 className="text-[18px] font-medium tracking-[-0.01em]">{step.title}</h3>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: captureStep === index ? 'auto' : 0,
                      opacity: captureStep === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-text-secondary text-[15px] leading-relaxed pb-6 max-w-md">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              ))}
              <div className="border-t border-[#1a1a1a]" />
            </div>

            {/* Right: Visual with Background */}
            <div className="sticky top-24 relative">
              {/* Background image - cropped from top, normal bounds */}
              <div className="absolute overflow-hidden" style={{ top: '-32px', bottom: '-32px', left: '-32px', right: '-32px', zIndex: 0 }}>
                <Image
                  src="/p3.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 40%' }}
                />
                {/* Top blur gradient */}
                <div className="absolute top-0 left-0 right-0 h-16 z-10 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,transparent)] pointer-events-none" />
              </div>
              
              <motion.div
                key={captureStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 py-8"
              >
                <TraceExplorerDemo scenario={captureStep} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ENFORCE Section - Two accordions side by side */}
      <section className="pt-32 pb-16 bg-[#0a0a0a]">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Enforce */}
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Enforce</span>
              </div>
              <h2 className="text-[32px] lg:text-[40px] font-normal leading-[1.1] tracking-[-0.02em] mb-6 max-w-md">
                Runtime controls at the boundaries that matter
              </h2>
              <div className="space-y-0">
                {detectSteps.map((step, index) => (
                  <div 
                    key={index}
                    className="border-t border-[#1a1a1a] relative"
                  >
                    <button
                      className={`w-full text-left py-5 transition-colors duration-300 ${detectStep === index ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                      onClick={() => handleDetectClick(index)}
                    >
                      <h3 className="text-[16px] font-medium tracking-[-0.01em]">{step.title}</h3>
                    </button>
                    
                    {/* Progress bar */}
                    {detectStep === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]">
                        <motion.div 
                          className="h-full bg-[#C9A37E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${detectProgress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      </div>
                    )}
                    
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: detectStep === index ? 'auto' : 0,
                        opacity: detectStep === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary text-[14px] leading-relaxed pb-5 max-w-md">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                ))}
                <div className="border-t border-[#1a1a1a]" />
              </div>
            </div>

            {/* Right: Test & Prevent */}
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Test & Prevent</span>
              </div>
              <h2 className="text-[32px] lg:text-[40px] font-normal leading-[1.1] tracking-[-0.02em] mb-6 max-w-md">
                Convert incidents into regression tests
              </h2>
              <div className="space-y-0">
                {testingSteps.map((step, index) => (
                  <div 
                    key={index}
                    className="border-t border-[#1a1a1a] relative"
                  >
                    <button
                      className={`w-full text-left py-5 transition-colors duration-300 ${testStep === index ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                      onClick={() => handleTestClick(index)}
                    >
                      <h3 className="text-[16px] font-medium tracking-[-0.01em]">{step.title}</h3>
                    </button>
                    
                    {/* Progress bar */}
                    {testStep === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]">
                        <motion.div 
                          className="h-full bg-[#C9A37E]"
                          initial={{ width: 0 }}
                          animate={{ width: `${testProgress}%` }}
                          transition={{ duration: 0.1, ease: "linear" }}
                        />
                      </div>
                    )}
                    
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: testStep === index ? 'auto' : 0,
                        opacity: testStep === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary text-[14px] leading-relaxed pb-5 max-w-md">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                ))}
                <div className="border-t border-[#1a1a1a]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Pipeline Section */}
      <section className="pt-16 pb-32 bg-[#0a0a0a]">
        <LearningPipeline />
      </section>

      {/* Model Catalogue Section */}
      <section className="py-32 bg-[#0d0d0d]">
        <div className="container-max">
          <ModelCatalogue />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container-max">
          <h2 className="text-[36px] lg:text-[42px] font-normal leading-[1.1] tracking-[-0.02em] mb-16 text-center">
            Built for enterprise AI systems
            </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {[
              {
                title: 'VPC Deployment',
                description: 'Deploy in your own cloud with full data residency. Support for AWS, GCP, Azure, and on-prem.',
              },
              {
                title: 'Sub-ms Latency',
                description: 'Policy enforcement happens in microseconds. No perceptible impact on model response times.',
              },
              {
                title: 'Multi-provider',
                description: 'Works with OpenAI, Anthropic, Google, and custom models. Single integration for all providers.',
              },
              {
                title: 'SDK Integration',
                description: 'Drop-in SDKs for Python, TypeScript, and Go. Start capturing traces in under 5 minutes.',
              },
              {
                title: 'SOC 2 Type II',
                description: 'Enterprise security controls with audit logging, SSO, and role-based access control.',
              },
              {
                title: 'Infinite Retention',
                description: 'Store and query traces indefinitely. Build regression suites from historical incidents.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 bg-[#0a0a0a] hover:bg-[#111] transition-colors h-[220px] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-6 h-6" /> {/* Spacer where icon was */}
                  <span className="font-mono text-[11px] text-[#333] group-hover:text-text-muted transition-colors">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-[16px] font-medium text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-[13px] text-text-secondary leading-relaxed max-w-[90%]">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-[#0d0d0d]">
        <FAQ />
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-[40px] lg:text-[48px] font-normal leading-[1.1] tracking-[-0.02em] mb-6">Ready to secure your AI systems?</h2>
            <p className="text-text-secondary text-lg mb-10">
              Get ground truth and control over what your AI systems actually do.
            </p>
            <div className="flex gap-4">
              <a href="mailto:srivastavan@berkeley.edu" className="btn btn-primary btn-large px-10 rounded-full">
                Contact Us
              </a>
              <Link href="/careers" className="btn btn-secondary btn-large px-10 rounded-full">
                View Careers
              </Link>
            </div>
        </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer bg-[#0d0d0d] border-t border-[#1a1a1a]">
        <div className="container-max">
          <div className="footer-grid pt-12">
            <div className="footer-brand">
              <div className="footer-logo flex items-center gap-3 mb-6">
              <Image
                  src="/FullLogo_Transparent_NoBuffer (1) (1).png"
                alt="Triage"
                  width={32}
                  height={32}
                  style={{ objectFit: 'contain' }}
                />
                <span className="text-[16px] font-bold text-text-primary" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>triage</span>
              </div>
              <p className="footer-description text-sm leading-relaxed text-text-tertiary">
                AI-native security and observability for teams building LLM-powered products.
              </p>
            </div>
            
            <div>
              <h5 className="text-[11px] font-medium tracking-widest text-text-muted uppercase mb-6">Product</h5>
              <div className="footer-links">
                <a href="#" className="footer-link text-[14px]">Features</a>
                <a href="#" className="footer-link text-[14px]">Documentation</a>
                <a href="#" className="footer-link text-[14px]">Pricing</a>
                </div>
              </div>

            <div>
              <h5 className="text-[11px] font-medium tracking-widest text-text-muted uppercase mb-6">Company</h5>
              <div className="footer-links">
                <Link href="/careers" className="footer-link text-[14px]">Careers</Link>
                <a href="mailto:srivastavan@berkeley.edu" className="footer-link text-[14px]">Contact</a>
              </div>
          </div>
          
            <div>
              <h5 className="text-[11px] font-medium tracking-widest text-text-muted uppercase mb-6">Resources</h5>
              <div className="footer-links">
                <a href="#" className="footer-link text-[14px]">Blog</a>
                <a href="#" className="footer-link text-[14px]">Security</a>
                <a href="#" className="footer-link text-[14px]">Privacy</a>
            </div>
            </div>
          </div>

          <div className="footer-bottom py-12 border-t border-[#1a1a1a] mt-12">
            <span className="text-[11px] text-text-muted">© 2025 Triage. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
