'use client';

import type { JSX } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { KnowledgeGraph } from './KnowledgeGraph';

// Slack message data
interface SlackMessage {
  user: string;
  avatar: string;
  time: string;
  content: string;
  isBot?: boolean;
  hasViewPR?: boolean;
}

// PR review data
interface PRReview {
  file: string;
  lineOld: number;
  lineNew: number;
  codeOld: string;
  codeNew: string;
  bugTitle: string;
  bugDescription: string;
}

const SLACK_MESSAGES: SlackMessage[] = [
  {
    user: 'Nick',
    avatar: '/Nick.png',
    time: '9/16/2025',
    content: 'seeing some weird tool call patterns in prod, model keeps trying to access internal docs folder',
  },
  {
    user: 'Maria',
    avatar: '/maria.jpeg',
    time: '9/16/2025',
    content: 'yeah thats sketchy\n@triage can you check whats going on?',
  },
  {
    user: 'Triage',
    avatar: '/triage-logo.jpg',
    time: '9/16/2025',
    content: 'Found the issue - detected path traversal attempt in tool arguments. I\'ve added guards and blocked the pattern.',
    isBot: true,
    hasViewPR: true,
  },
  {
    user: 'Nick',
    avatar: '/Nick.png',
    time: '9/16/2025',
    content: 'Nice @Maria thats way faster than digging through logs',
  },
];

const PR_REVIEW: PRReview = {
  file: 'security/tool_validator.py',
  lineOld: 47,
  lineNew: 47,
  codeOld: 'return self.execute_tool(path)',
  codeNew: 'return self.execute_tool(self.sanitize_path(path))',
  bugTitle: 'Bug: Path Traversal in Tool Arguments (Security)',
  bugDescription: 'The tool executor was passing user-supplied paths directly without validation. This allowed ../../../ sequences to escape the sandbox. Added path sanitization before execution.',
};

export function LearningPipeline(): JSX.Element {
  const [showPR, setShowPR] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoShow, setAutoShow] = useState(true);

  // Toggle PR visibility when clicking View PR button
  const handleViewPR = useCallback(() => {
    setAutoShow(false); // Disable auto-show once user interacts
    setShowPR(prev => !prev);
  }, []);

  // Auto-show PR on first load
  useEffect(() => {
    if (!autoShow) return;
    
    const timer1 = setTimeout(() => setShowPR(true), 1500);
    const timer2 = setTimeout(() => setShowFeedback(true), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [autoShow]);

  // Show feedback when PR is shown
  useEffect(() => {
    if (showPR) {
      const timer = setTimeout(() => setShowFeedback(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowFeedback(false);
    }
  }, [showPR]);

  return (
    <div className="relative w-full">
      <KnowledgeGraph />
      <div className="container-max relative z-10">
        {/* Section Header */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Learning Loop</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
        <h2 className="text-[40px] lg:text-[56px] font-normal leading-[1.05] tracking-[-0.03em] max-w-[520px]">
          Learning from every interaction
        </h2>
        <div className="flex flex-col justify-center">
          <p className="text-text-secondary text-[16px] lg:text-[17px] leading-relaxed max-w-[520px]">
            Every PR review, security decision, and fix approval becomes a training signal. Triage learns your engineering standards and gets smarter with each interaction.
          </p>
        </div>
      </div>

      {/* Visual: Slack + GitHub PR */}
      <div className="relative max-w-5xl mx-auto pt-8 md:pt-12 lg:pt-16">
        <div className="absolute -bottom-32 top-0 -inset-x-8 md:-bottom-48 md:-inset-x-12 lg:-bottom-64 lg:-inset-x-16 rounded-lg overflow-hidden">
          <Image
            src="/learning-bg.jpg"
            alt=""
            fill
            className="object-cover object-center"
          />
          {/* Top blur gradient */}
          <div className="absolute top-0 left-0 right-0 h-40 z-10 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,transparent)] pointer-events-none" />
        </div>

        <div className="relative z-10">
          {/* Slack Window */}
          <motion.div
            className="bg-[#121212] border border-[#2d2d2d] rounded-xl overflow-hidden shadow-2xl cursor-pointer"
            animate={{
              opacity: showPR ? 0.6 : 1,
              scale: showPR ? 0.98 : 1,
            }}
            transition={{ duration: 0.3 }}
            onClick={() => showPR && setShowPR(false)}
          >
            {/* Slack Header */}
            <div className="h-10 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#cb7676]" />
                <div className="w-3 h-3 rounded-full bg-[#e6cc77]" />
                <div className="w-3 h-3 rounded-full bg-[#4d9375]" />
              </div>
              <span className="text-[13px] text-[#dbd7caee]">Slack</span>
              <div className="w-24" />
            </div>

            {/* Slack Content */}
            <div className="p-3 md:p-6">
              {/* Channel Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                  <h3 className="text-[15px] md:text-[18px] font-bold text-[#dbd7caee]">#ask-triage</h3>
                  <span className="text-[11px] md:text-[13px] text-[#f5f4f0b3]">5 members</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border-2 border-[#121212] overflow-hidden">
                    <Image src="/Nick.png" alt="Nick" width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border-2 border-[#121212] overflow-hidden">
                    <Image src="/maria.jpeg" alt="Maria" width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border-2 border-[#121212] overflow-hidden">
                    <Image src="/triage-logo.jpg" alt="Triage" width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-5">
                {SLACK_MESSAGES.map((msg, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#1e1e1e]">
                      <Image
                        src={msg.avatar}
                        alt={msg.user}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[15px] font-bold text-[#dbd7caee]">{msg.user}</span>
                        {msg.isBot && (
                          <span className="px-1.5 py-0.5 bg-[#4d9375]/20 text-[#4d9375] text-[10px] font-medium rounded">APP</span>
                        )}
                        <span className="text-[12px] text-[#f5f4f0b3]">{msg.time}</span>
                      </div>
                      <p className="text-[15px] text-[#dbd7caee] whitespace-pre-line leading-relaxed">{msg.content}</p>
                      {msg.hasViewPR && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPR();
                          }}
                          className="mt-2 px-3 py-1.5 bg-[#4d9375] hover:bg-[#5eb38d] rounded text-[13px] text-[#0a0a0a] font-medium transition-colors"
                        >
                          {showPR ? 'Hide PR' : 'View PR'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* GitHub PR Overlay - Matching screenshot structure */}
          <AnimatePresence>
            {showPR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-4 md:top-8 left-4 right-4 md:left-auto md:right-4 md:w-[600px] bg-[#121212] border border-[#2d2d2d] rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                onClick={() => setShowPR(false)}
              >
              {/* PR Header */}
              <div className="h-8 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#cb7676]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e6cc77]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4d9375]" />
                </div>
                <span className="text-[12px] text-[#f5f4f0b3]">GitHub Pull Request</span>
                <div className="w-16" />
              </div>

              {/* Single unified review section like the screenshot */}
              <div className="p-5 pb-6">
                {/* Bot header with review status */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1e1e1e] flex items-center justify-center">
                    <Image src="/triage-logo.jpg" alt="Triage" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-[#dbd7caee]">triage-bot</span>
                    <span className="px-1.5 py-0.5 bg-[#4d9375]/20 text-[#4d9375] text-[11px] font-medium rounded">bot</span>
                    <span className="text-[13px] text-[#f5f4f0b3]">reviewed 1m ago</span>
                  </div>
                </div>

                {/* File Path */}
                <div className="mb-4 px-3 py-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded font-mono text-[12px] text-[#f5f4f0b3] overflow-x-auto">
                  {PR_REVIEW.file}
                </div>

                {/* Diff */}
                <div className="bg-[#1e1e1e] border border-[#2d2d2d] rounded overflow-hidden font-mono text-[13px] mb-5">
                  <div className="flex bg-[#cb767620]">
                    <div className="w-14 text-right pr-3 py-1.5 text-[#cb7676] select-none">{PR_REVIEW.lineOld}</div>
                    <div className="w-8 text-center py-1.5 text-[#cb7676]">-</div>
                    <div className="flex-1 py-1.5 pr-4 text-[#cb7676]">{PR_REVIEW.codeOld}</div>
                  </div>
                  <div className="flex bg-[#4d937520]">
                    <div className="w-14 text-right pr-3 py-1.5 text-[#4d9375] select-none">{PR_REVIEW.lineNew}</div>
                    <div className="w-8 text-center py-1.5 text-[#4d9375]">+</div>
                    <div className="flex-1 py-1.5 pr-4 text-[#4d9375]">{PR_REVIEW.codeNew}</div>
                  </div>
                </div>

                {/* Bug title and description */}
                <div className="text-[15px] font-semibold text-[#dbd7caee] mb-2">{PR_REVIEW.bugTitle}</div>
                <p className="text-[14px] text-[#f5f4f0b3] leading-relaxed mb-5">{PR_REVIEW.bugDescription}</p>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-[#4d9375] hover:bg-[#3d7a60] border border-[#4d9375] rounded-lg text-[13px] text-[#0a0a0a] font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#2d2d2d] rounded-lg text-[13px] text-[#dbd7caee] font-medium transition-colors flex items-center gap-2"
                  >
                    <Image src="/triage-logo.jpg" alt="" width={16} height={16} className="w-4 h-4 rounded" />
                    Fix in Triage
                  </button>
                </div>
                
                {/* Learning Loop Checks - Integrated into PR card */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="mt-5 border-t border-[#2d2d2d] pt-4 pb-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                          <span className="text-[12px] font-medium text-[#f5f4f0]">Triage Learning Loop</span>
                          <span className="text-[10px] font-medium text-[#4d9375] px-1.5 py-0.5 bg-[#4d9375]/10 rounded">ACTIVE</span>
                      </div>
                      <div className="space-y-2.5">
                        <motion.div 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-center gap-3"
                        >
                             <div className="w-4 h-4 rounded-full bg-[#4d9375]/20 flex items-center justify-center shrink-0">
                                 <svg className="w-2.5 h-2.5 text-[#4d9375]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                   <polyline points="20 6 9 17 4 12" />
                                 </svg>
                             </div>
                             <span className="text-[12px] text-[#dbd7caee]">Pattern extracted: <span className="font-mono text-[11px] bg-[#f5f4f0]/5 px-1.5 py-0.5 rounded text-[#f5f4f0b3]">path_traversal_fix</span></span>
                        </motion.div>

                        <motion.div 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex items-center gap-3"
                        >
                             <div className="w-4 h-4 rounded-full bg-[#4d9375]/20 flex items-center justify-center shrink-0">
                                 <svg className="w-2.5 h-2.5 text-[#4d9375]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                   <polyline points="20 6 9 17 4 12" />
                                 </svg>
                             </div>
                             <span className="text-[12px] text-[#dbd7caee]">Detection model updated</span>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.1 }}
                          className="flex items-center gap-3"
                        >
                             <div className="w-4 h-4 rounded-full bg-[#4d9375]/20 flex items-center justify-center shrink-0">
                                 <svg className="w-2.5 h-2.5 text-[#4d9375]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                   <polyline points="20 6 9 17 4 12" />
                                 </svg>
                             </div>
                             <span className="text-[12px] text-[#dbd7caee]">Regression test generated</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
  );
}
