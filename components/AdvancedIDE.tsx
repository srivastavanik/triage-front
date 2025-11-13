'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export const AdvancedIDEAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [gitAction, setGitAction] = useState('idle');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  const originalCode = "router.post('/trial', (req, res) => chatController.trialChat(req, res));";
  const fixedCode = "router.post('/trial', rateLimit({ max: 5 }), chatController.trialChat);";

  useEffect(() => {
    if (!isInView) {
      setAnimationPhase(0);
      setTypedText('');
      setGitAction('idle');
      return;
    }

    const runAnimation = async () => {
      // Phase 0: Scanning (tan highlight progressive)
      setAnimationPhase(0);
      await new Promise(r => setTimeout(r, 2000));
      
      // Phase 1: Detection (flash red, text turns cyan)
      setAnimationPhase(1);
      await new Promise(r => setTimeout(r, 1500));
      
      // Phase 2: Fixing (typing out new code)
      setAnimationPhase(2);
      for (let i = 0; i <= fixedCode.length; i++) {
        setTypedText(fixedCode.substring(0, i));
        await new Promise(r => setTimeout(r, 30));
      }
      
      // Phase 3: Fixed (green/cyan confirmation)
      setAnimationPhase(3);
      await new Promise(r => setTimeout(r, 2000));
      
      // Git workflow
      setGitAction('commit');
      await new Promise(r => setTimeout(r, 1500));
      setGitAction('push');
      await new Promise(r => setTimeout(r, 1500));
      setGitAction('pr');
      await new Promise(r => setTimeout(r, 2000));
      
      // Reset
      await new Promise(r => setTimeout(r, 1000));
      setAnimationPhase(0);
      setTypedText('');
      setGitAction('idle');
    };

    const interval = setInterval(runAnimation, 15000);
    runAnimation();
    
    return () => clearInterval(interval);
  }, [isInView, fixedCode.length]);

  return (
    <div ref={ref} className="advanced-ide-container">
      {/* IDE Editor Section */}
      <div className="advanced-ide-editor">
        <div className="ide-editor-header">
          <div className="editor-tabs-row">
            <div className="editor-tab active">backend/src/routes/auth.routes.ts</div>
            <div className="editor-tab">middleware/security.ts</div>
          </div>
          <div className="editor-actions">
            <span className={`editor-action ${gitAction === 'commit' ? 'active' : gitAction !== 'idle' ? 'done' : ''}`}>
              ◉ Commit
            </span>
            <span className={`editor-action ${gitAction === 'push' ? 'active' : gitAction === 'pr' ? 'done' : ''}`}>
              ↑ Push
            </span>
            <span className={`editor-action ${gitAction === 'pr' ? 'active' : ''}`}>
              ⌘ PR
            </span>
          </div>
        </div>

        <div className="ide-editor-body">
          <div className="editor-line-numbers">
            <span>6</span>
            <span>7</span>
            <span className="line-highlight">8</span>
            <span>9</span>
            <span>10</span>
          </div>
          <div className="editor-code-area">
            <div className="editor-line">const router = Router();</div>
            <div className="editor-line"></div>
            
            {/* Animated vulnerability line */}
            <div className={`editor-line vulnerable-line phase-${animationPhase}`}>
              <AnimatePresence mode="wait">
                {animationPhase < 2 && (
                  <motion.span
                    key="original"
                    className={`code-content ${animationPhase === 1 ? 'flash-red' : ''}`}
                    exit={{ opacity: 0 }}
                  >
                    {originalCode}
                  </motion.span>
                )}
                {animationPhase >= 2 && (
                  <motion.span
                    key="fixed"
                    className="code-content fixed-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {typedText}
                    {animationPhase === 2 && <span className="typing-cursor">|</span>}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Progressive tan highlight overlay */}
              {animationPhase === 0 && (
                <motion.div 
                  className="highlight-overlay tan"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
              
              {/* Cyan text transformation */}
              {animationPhase === 1 && (
                <motion.div 
                  className="highlight-overlay cyan"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              )}
            </div>
            
            <div className="editor-line"></div>
            <div className="editor-line">// Protected routes</div>
          </div>
        </div>

        {/* Security notification */}
        <AnimatePresence>
          {animationPhase === 3 && (
            <motion.div 
              className="security-notification"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <span className="notif-icon">✓</span>
              <span>Vulnerability fixed and verified</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Git Workflow Visualization */}
      <div className="git-workflow-visual">
        <div className="workflow-branch">
          <div className={`workflow-node ${gitAction !== 'idle' ? 'active' : ''}`}>
            <div className="node-icon">◉</div>
            <div className="node-label">Local</div>
            {gitAction === 'commit' && (
              <motion.div 
                className="node-pulse"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          
          <motion.div 
            className="workflow-arrow"
            animate={{ 
              opacity: gitAction === 'push' ? [0.3, 1, 0.3] : 0.3 
            }}
            transition={{ duration: 0.8, repeat: gitAction === 'push' ? Infinity : 0 }}
          >
            →
          </motion.div>
          
          <div className={`workflow-node ${gitAction === 'push' || gitAction === 'pr' ? 'active' : ''}`}>
            <div className="node-icon">◈</div>
            <div className="node-label">Origin</div>
            {gitAction === 'push' && (
              <motion.div 
                className="node-pulse"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          
          <motion.div 
            className="workflow-arrow"
            animate={{ 
              opacity: gitAction === 'pr' ? [0.3, 1, 0.3] : 0.3 
            }}
            transition={{ duration: 0.8, repeat: gitAction === 'pr' ? Infinity : 0 }}
          >
            →
          </motion.div>
          
          <div className={`workflow-node ${gitAction === 'pr' ? 'active' : ''}`}>
            <div className="node-icon">▣</div>
            <div className="node-label">PR #247</div>
            {gitAction === 'pr' && (
              <motion.div 
                className="node-pulse"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </div>
        
        <div className="workflow-status">
          {gitAction === 'idle' && <span className="text-pale-wood/60">Ready to commit security fix</span>}
          {gitAction === 'commit' && <span className="text-cyan">Committing changes...</span>}
          {gitAction === 'push' && <span className="text-cyan">Pushing to origin/main...</span>}
          {gitAction === 'pr' && (
            <span className="text-cyan">
              ✓ Pull request opened • Auto-merge approved
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
