'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Phase 01: Plan - Animated Code Graph
export const PlanVisual = () => {
  return (
    <div className="plan-visual">
      <div className="code-graph">
        <div className="graph-header">
          <span className="graph-title">Code Dependency Graph</span>
          <span className="graph-stats">2.8M nodes • 47 vulnerabilities found</span>
        </div>
        <div className="graph-canvas">
          {/* Central vulnerable node */}
          <motion.div 
            className="graph-node critical"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: ['0 0 0 rgba(242, 203, 189, 0)', '0 0 20px rgba(242, 203, 189, 0.4)', '0 0 0 rgba(242, 203, 189, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="node-label">auth.controller.ts</div>
            <div className="node-vuln">3 HIGH</div>
          </motion.div>
          
          {/* Connected nodes */}
          <div className="graph-node safe node-1">
            <div className="node-label">user.service.ts</div>
          </div>
          <div className="graph-node safe node-2">
            <div className="node-label">db.config.ts</div>
          </div>
          <div className="graph-node warning node-3">
            <div className="node-label">api.routes.ts</div>
            <div className="node-vuln">1 MED</div>
          </div>
          
          {/* Connection lines */}
          <svg className="graph-connections">
            <motion.line x1="50%" y1="50%" x2="20%" y2="20%" stroke="var(--color-cyan)" strokeWidth="1" strokeDasharray="4,4"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.line x1="50%" y1="50%" x2="80%" y2="30%" stroke="var(--color-cyan)" strokeWidth="1" strokeDasharray="4,4"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.line x1="50%" y1="50%" x2="70%" y2="75%" stroke="var(--color-pale-wood)" strokeWidth="1.5" strokeDasharray="4,4"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </div>
      
      <div className="risk-prioritization">
        <div className="risk-item high">
          <div className="risk-badge">HIGH</div>
          <div className="risk-desc">SQL Injection in auth endpoint</div>
        </div>
        <div className="risk-item high">
          <div className="risk-badge">HIGH</div>
          <div className="risk-desc">Unvalidated redirect in login</div>
        </div>
        <div className="risk-item medium">
          <div className="risk-badge">MED</div>
          <div className="risk-desc">Missing rate limit on trial</div>
        </div>
      </div>
    </div>
  );
};

// Phase 02: Code - Live Editor with Inline Suggestions
export const CodeVisual = () => {
  const [suggestion, setSuggestion] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestion(prev => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="code-visual">
      <div className="editor-mock">
        <div className="editor-mock-header">
          <span className="file-name">auth/validator.ts</span>
          <span className="editor-status">● Modified</span>
        </div>
        <div className="editor-mock-body">
          <div className="code-line-mock">
            <span className="line-no">23</span>
            <span className="code">const query = `SELECT * FROM users WHERE email = '${'{email}'}'`;</span>
            <motion.div 
              className="inline-warning"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚠
            </motion.div>
          </div>
          
          {/* Inline suggestion popup */}
          <AnimatePresence mode="wait">
            {suggestion === 1 && (
              <motion.div 
                className="inline-suggestion"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="suggestion-header">
                  <span className="suggestion-icon">∞</span>
                  <span className="suggestion-title">Triage suggests:</span>
                </div>
                <div className="suggestion-body">
                  Use parameterized queries to prevent SQL injection
                </div>
                <div className="suggestion-code">
                  const query = 'SELECT * FROM users WHERE email = ?';
                </div>
                <div className="suggestion-rlhf">
                  Based on 2,847 similar fixes in your org
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Phase 03: Build - Test Execution Terminal
export const BuildVisual = () => {
  const [testLine, setTestLine] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTestLine(prev => (prev + 1) % 5);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const tests = [
    '✓ SQL Injection Prevention',
    '✓ XSS Protection',
    '◉ CSRF Validation',
    '○ Auth Bypass Checks',
    '○ Rate Limiting'
  ];

  return (
    <div className="build-visual">
      <div className="terminal-mock">
        <div className="terminal-mock-header">
          <div className="terminal-dots">
            <div className="dot" style={{ background: 'var(--color-pale-wood)' }} />
            <div className="dot" style={{ background: 'var(--color-pale-wood)' }} />
            <div className="dot" style={{ background: 'var(--color-cyan)' }} />
          </div>
          <span className="terminal-title">$ npm run test:security</span>
        </div>
        <div className="terminal-mock-body">
          {tests.map((test, i) => (
            <motion.div 
              key={i} 
              className={`terminal-line-mock ${i <= testLine ? 'visible' : 'pending'} ${i === testLine ? 'running' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= testLine ? 1 : 0.3, x: 0 }}
            >
              {test}
            </motion.div>
          ))}
          <div className="terminal-summary">
            <span className="summary-label">Coverage:</span>
            <span className="summary-value">98.5%</span>
            <span className="summary-label">Duration:</span>
            <span className="summary-value">4.2s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Phase 04: Review - PR Interface
export const ReviewVisual = () => {
  return (
    <div className="review-visual">
      <div className="pr-mock">
        <div className="pr-mock-header">
          <span className="pr-status-badge">OPEN</span>
          <span className="pr-title">#247: Security: Fix SQL injection vulnerability</span>
        </div>
        <div className="pr-checks">
          <div className="check-item done">
            <span className="check-icon">✓</span>
            <span className="check-label">Security tests passed</span>
          </div>
          <div className="check-item done">
            <span className="check-icon">✓</span>
            <span className="check-label">Evidence packet complete</span>
          </div>
          <div className="check-item done">
            <span className="check-icon">✓</span>
            <span className="check-label">Rollback plan ready</span>
          </div>
        </div>
        <div className="pr-diff-preview">
          <div className="diff-stats">1 file • +7 -15 lines</div>
          <div className="diff-line removed-line">- const query = `SELECT * FROM users WHERE email = '${'{email}'}'`;</div>
          <div className="diff-line added-line">+ const query = 'SELECT * FROM users WHERE email = ?';</div>
        </div>
        <div className="pr-footer">
          <div className="pr-approval">✓ Ready to merge</div>
          <div className="pr-rlhf">Auto-merge approved by policy</div>
        </div>
      </div>
    </div>
  );
};

// Phase 05: Release - Git Workflow
export const ReleaseVisual = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: '◉', label: 'Commit', status: 'Security fix applied' },
    { icon: '↑', label: 'Push', status: 'Pushing to origin/main...' },
    { icon: '⌘', label: 'PR', status: 'Pull request #247 opened' },
    { icon: '✓', label: 'Merge', status: 'Auto-merged successfully' }
  ];

  return (
    <div className="release-visual">
      <div className="git-flow-mock">
        <div className="flow-steps">
          {steps.map((step, i) => (
            <div key={i} className={`flow-step ${i === activeStep ? 'active' : i < activeStep ? 'done' : ''}`}>
              <div className="step-icon-circle">{step.icon}</div>
              <div className="step-label">{step.label}</div>
              {i < steps.length - 1 && (
                <motion.div 
                  className="step-arrow"
                  animate={{ opacity: i === activeStep ? [0.3, 1, 0.3] : 0.3 }}
                  transition={{ duration: 0.8, repeat: i === activeStep ? Infinity : 0 }}
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="flow-status">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="status-text"
            >
              {steps[activeStep].status}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="deployment-info">
        <div className="info-row">
          <span className="info-label">Policy:</span>
          <span className="info-value">Auto-merge eligible (low-risk)</span>
        </div>
        <div className="info-row">
          <span className="info-label">Verification:</span>
          <span className="info-value">All tests passed</span>
        </div>
        <div className="info-row">
          <span className="info-label">Rollback:</span>
          <span className="info-value">git revert a3f2c1b</span>
        </div>
      </div>
    </div>
  );
};

// Phase 06: Operate - Learning Feedback Loop
export const OperateVisual = () => {
  return (
    <div className="operate-visual">
      <div className="feedback-loop">
        <div className="loop-stage">
          <div className="stage-icon">◬</div>
          <div className="stage-title">Production Incident</div>
          <div className="stage-detail">XSS exploit detected</div>
        </div>
        <motion.div 
          className="loop-arrow"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.div>
        <div className="loop-stage">
          <div className="stage-icon">∞</div>
          <div className="stage-title">Correlation</div>
          <div className="stage-detail">Mapped to missed hypothesis</div>
        </div>
        <motion.div 
          className="loop-arrow"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        >
          →
        </motion.div>
        <div className="loop-stage">
          <div className="stage-icon">◆</div>
          <div className="stage-title">Model Update</div>
          <div className="stage-detail">Tactic priority adjusted</div>
        </div>
      </div>
      
      <div className="learning-metrics">
        <div className="metric-box">
          <div className="metric-label">Tactics Optimized</div>
          <div className="metric-value">47 → 12</div>
          <div className="metric-change">74% reduction</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Detection Accuracy</div>
          <div className="metric-value">89% → 99%</div>
          <div className="metric-change">11% improvement</div>
        </div>
      </div>
    </div>
  );
};
