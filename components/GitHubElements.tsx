'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// All Checks Passed Component
export const AllChecksPassed = () => {
  return (
    <div className="checks-passed-widget">
      <div className="checks-header">
        <div className="check-icon-success">✓</div>
        <div>
          <div className="checks-title">All checks have passed</div>
          <div className="checks-subtitle">6 successful checks</div>
        </div>
      </div>
      <div className="checks-list">
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-name">Code scanning results / CodeQL</span>
          <span className="check-status">Successful in 2s</span>
        </div>
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-name">Security vulnerability scan</span>
          <span className="check-status">Successful in 1m</span>
        </div>
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-name">Triage Security Checks</span>
          <span className="check-status">No secrets detected ✓</span>
        </div>
      </div>
    </div>
  );
};

// Files Changed Component with Diff Preview
export const FilesChanged = () => {
  const [expandedFile, setExpandedFile] = useState(0);

  const files = [
    { 
      name: 'backend/src/controllers/models.controller.ts', 
      changes: '+13 -13',
      diff: {
        removed: ['  if (hasAttachments === \'true\') {', '    const hasImages = attachmentTypes && attachmentTypes.includes(\'image\');'],
        added: ['  if (typeof hasAttachments === \'string\' && hasAttachments === \'true\') {', '    const hasImages = typeof attachmentTypesStr === \'string\' ? attachmentTypesStr.includes(\'image\') : false;']
      }
    },
    { 
      name: 'backend/src/routes/external-auth.routes.ts', 
      changes: '+84 -1',
      diff: {
        removed: ['import { Router } from \'express\';'],
        added: ['import { Router } from \'express\';', 'import { rateLimit } from \'express-rate-limit\';', 'import { validateAuth } from \'../middleware/auth\';']
      }
    },
    { 
      name: 'backend/src/controllers/chat.controller.ts', 
      changes: '+229 -707',
      diff: {
        removed: ['  console.log(\'Performing web search for trial user:\', message);', '  searchResults = await searchService.webSearch(message, 5);'],
        added: ['  const sanitizedMessage = DOMPurify.sanitize(message);', '  console.log(\'Performing web search for trial user:\', sanitizedMessage);', '  searchResults = await searchService.webSearch(sanitizedMessage, 5);']
      }
    }
  ];

  return (
    <div className="files-changed-widget">
      <div className="files-header">
        <span className="files-label">FILES MODIFIED</span>
      </div>
      <div className="files-summary">
        <span className="files-count">{files.length} files changed</span>
        <span className="files-stats">+383 -777</span>
      </div>
      <div className="files-list">
        {files.map((file, i) => (
          <div key={i} className="file-item-wrapper">
            <button
              className={`file-item ${expandedFile === i ? 'expanded' : ''}`}
              onClick={() => setExpandedFile(expandedFile === i ? -1 : i)}
            >
              <span className="file-toggle">{expandedFile === i ? '▼' : '▶'}</span>
              <span className="file-name">{file.name}</span>
              <span className="file-changes">{file.changes}</span>
            </button>
            {expandedFile === i && (
              <div className="file-diff-preview">
                {file.diff.removed.map((line, j) => (
                  <div key={`r-${j}`} className="diff-preview-line removed">
                    <span className="preview-marker">-</span>
                    <span className="preview-code">{line}</span>
                  </div>
                ))}
                {file.diff.added.map((line, j) => (
                  <div key={`a-${j}`} className="diff-preview-line added">
                    <span className="preview-marker">+</span>
                    <span className="preview-code">{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Code Diff View
export const CodeDiffView = () => {
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAdded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="code-diff-view">
      <div className="diff-file-header">
        <span className="diff-filename">backend/src/controllers/chat.controller.ts</span>
        <span className="diff-stats-badge">+229 -707</span>
      </div>
      
      <div className="diff-content">
        <div className="diff-hunk-header">@@ -7,15 +7,74 @@ export class ChatController {'{'}</div>
        
        {/* Removed lines with real content */}
        <motion.div 
          className="diff-line removed"
          animate={{
            background: showAdded ? 'rgba(242, 203, 189, 0.08)' : 'rgba(242, 203, 189, 0.15)'
          }}
        >
          <span className="line-num removed-num">7</span>
          <span className="line-content">
            <span className="line-marker">-</span>
            <span className="line-code">{'    '}console.log('Performing web search for trial user:', message);</span>
          </span>
        </motion.div>

        <motion.div 
          className="diff-line removed"
          animate={{
            background: showAdded ? 'rgba(242, 203, 189, 0.08)' : 'rgba(242, 203, 189, 0.15)'
          }}
        >
          <span className="line-num removed-num">15</span>
          <span className="line-content">
            <span className="line-marker">-</span>
            <span className="line-code">{'    '}searchResults = await searchService.webSearch(message, 5);</span>
          </span>
        </motion.div>

        {/* Added lines with security improvements */}
        {showAdded && (
          <>
            <motion.div 
              className="diff-line added"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <span className="line-num added-num">7</span>
              <span className="line-content">
                <span className="line-marker">+</span>
                <span className="line-code">{'    '}const sanitizedMessage = DOMPurify.sanitize(message);</span>
              </span>
            </motion.div>

            <motion.div 
              className="diff-line added"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <span className="line-num added-num">8</span>
              <span className="line-content">
                <span className="line-marker">+</span>
                <span className="line-code">{'    '}console.log('Performing web search for trial user:', sanitizedMessage);</span>
              </span>
            </motion.div>

            <motion.div 
              className="diff-line added"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="line-num added-num">74</span>
              <span className="line-content">
                <span className="line-marker">+</span>
                <span className="line-code">{'    '}searchResults = await searchService.webSearch(sanitizedMessage, 5);</span>
              </span>
            </motion.div>
          </>
        )}

        {/* Context lines */}
        <div className="diff-line context">
          <span className="line-num context-num">75</span>
          <span className="line-content">
            <span className="line-marker"> </span>
            <span className="line-code">{'    '}systemPrompt += '\n\nSearch Results:\n' + searchResults;</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Merge Status Component
export const MergeStatus = () => {
  return (
    <div className="merge-status-widget">
      <div className="merge-status-row">
        <div className="status-icon-success">✓</div>
        <div>
          <div className="status-title">No conflicts with base branch</div>
          <div className="status-subtitle">Merging can be performed automatically.</div>
        </div>
      </div>
      <div className="merge-actions">
        <button className="merge-button">
          Merge pull request
        </button>
        <span className="merge-hint">You can also merge this with the command line.</span>
      </div>
    </div>
  );
};

// Deployment Success
export const DeploymentSuccess = () => {
  return (
    <div className="deployment-widget">
      <div className="deployment-row">
        <div className="deploy-icon-box">◆</div>
        <div className="deploy-content">
          <div className="deploy-title">This branch was successfully deployed</div>
          <div className="deploy-subtitle">2 active deployments</div>
        </div>
        <button className="deploy-button">Show environments</button>
      </div>
      <div className="deployment-list">
        <div className="deployment-item">
          <span className="deploy-badge">Preview</span>
          <span className="deploy-name">nova-frontend</span>
          <span className="deploy-status">Ready</span>
        </div>
      </div>
    </div>
  );
};
