'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Auto Unit Tests Component
export const AutoUnitTests = () => {
  const [testPhase, setTestPhase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTestPhase(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tests = [
    { name: 'SQL Injection Prevention', status: testPhase > 0 ? 'pass' : 'running' },
    { name: 'XSS Protection', status: testPhase > 1 ? 'pass' : testPhase === 1 ? 'running' : 'pending' },
    { name: 'CSRF Validation', status: testPhase > 2 ? 'pass' : testPhase === 2 ? 'running' : 'pending' },
    { name: 'Auth Bypass Checks', status: testPhase > 2 ? 'pass' : 'pending' },
  ];

  return (
    <div className="unit-tests-wireframe">
      <div className="tests-header">
        <span className="text-cyan">$</span>
        <span className="text-pale-wood/70">npm run test:security --coverage</span>
      </div>
      <div className="tests-body">
        {tests.map((test, i) => (
          <motion.div
            key={i}
            className={`test-row ${test.status}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
          >
            <span className="test-status-icon">
              {test.status === 'pass' && '✓'}
              {test.status === 'running' && '◉'}
              {test.status === 'pending' && '○'}
            </span>
            <span className="test-name">{test.name}</span>
            <span className="test-status-text">{test.status.toUpperCase()}</span>
          </motion.div>
        ))}
      </div>
      <div className="tests-footer">
        <div className="test-summary-item">
          <span className="summary-label">Coverage</span>
          <span className="summary-value">98.5%</span>
        </div>
        <div className="test-summary-item">
          <span className="summary-label">Duration</span>
          <span className="summary-value">4.2s</span>
        </div>
        {testPhase === 3 && (
          <motion.div 
            className="merge-ready-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ✓ MERGE READY
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Git Actions Animation
export const GitActionsFlow = () => {
  const [action, setAction] = useState('pull');
  
  useEffect(() => {
    const sequence = async () => {
      setAction('pull');
      await new Promise(r => setTimeout(r, 2000));
      setAction('commit');
      await new Promise(r => setTimeout(r, 2000));
      setAction('push');
      await new Promise(r => setTimeout(r, 2000));
      setAction('pr');
      await new Promise(r => setTimeout(r, 2000));
    };
    
    const interval = setInterval(sequence, 8000);
    sequence();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="git-flow-wireframe">
      <div className="git-timeline">
        <div className={`git-step ${action === 'pull' ? 'active' : 'done'}`}>
          <div className="step-icon">↓</div>
          <div className="step-label">Pull</div>
          {action === 'pull' && <div className="step-progress" />}
        </div>
        <div className="git-connector" />
        <div className={`git-step ${action === 'commit' ? 'active' : action !== 'pull' ? 'done' : ''}`}>
          <div className="step-icon">◉</div>
          <div className="step-label">Commit</div>
          {action === 'commit' && <div className="step-progress" />}
        </div>
        <div className="git-connector" />
        <div className={`git-step ${action === 'push' ? 'active' : action === 'pr' ? 'done' : ''}`}>
          <div className="step-icon">↑</div>
          <div className="step-label">Push</div>
          {action === 'push' && <div className="step-progress" />}
        </div>
        <div className="git-connector" />
        <div className={`git-step ${action === 'pr' ? 'active' : ''}`}>
          <div className="step-icon">⌘</div>
          <div className="step-label">PR</div>
          {action === 'pr' && <div className="step-progress" />}
        </div>
      </div>
      <div className="git-status">
        {action === 'pull' && <span>Fetching latest changes...</span>}
        {action === 'commit' && <span>Security fixes applied</span>}
        {action === 'push' && <span>Pushing to origin/main...</span>}
        {action === 'pr' && <span className="text-cyan">Pull request #247 opened ✓</span>}
      </div>
    </div>
  );
};

// Enhanced Diff Visualization
export const LiveDiffHighlight = () => {
  const [diffState, setDiffState] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDiffState(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="enhanced-diff">
      <div className="diff-header-bar">
        <span className="diff-file-path">backend/src/controllers/chat.controller.ts</span>
        <span className="diff-change-stats">+229 -707</span>
      </div>

      <div className="diff-body">
        {/* Removed lines */}
        <motion.div 
          className="diff-group removed-group"
          animate={{
            background: diffState >= 1 ? 'rgba(242, 203, 189, 0.08)' : 'transparent'
          }}
        >
          <div className="diff-line-num">-7,15</div>
          <div className="diff-code-block">
            <div className="diff-code-line removed">
              <span className="line-marker">-</span>
              <span className="line-text">console.log('Performing web search for trial user:', message);</span>
            </div>
            <div className="diff-code-line removed">
              <span className="line-marker">-</span>
              <span className="line-text">searchResults = await searchService.webSearch(message, 5);</span>
            </div>
          </div>
        </motion.div>

        {/* Added lines */}
        {diffState >= 2 && (
          <motion.div 
            className="diff-group added-group"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className="diff-line-num">+7,74</div>
            <div className="diff-code-block">
              <div className="diff-code-line added">
                <span className="line-marker">+</span>
                <span className="line-text">console.log('Performing web search for trial user:', sanitizedMessage);</span>
              </div>
              <div className="diff-code-line added">
                <span className="line-marker">+</span>
                <span className="line-text">searchResults = await searchService.webSearch(sanitizedMessage, 5);</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Context */}
        <div className="diff-code-line context-line">
          <span className="line-marker"> </span>
          <span className="line-text">systemPrompt += '\n\nSearch Results:\n' + searchResults;</span>
        </div>
      </div>

      {diffState === 3 && (
        <motion.div 
          className="diff-approval-bar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="approval-check">✓</span>
          <span className="approval-text">Patch verified • Input sanitization applied</span>
        </motion.div>
      )}
    </div>
  );
};
