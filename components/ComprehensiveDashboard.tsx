'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const IDEAndDashboard = () => {
  const [activeVuln, setActiveVuln] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVuln(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const vulnerabilities = [
    { line: 8, severity: 'HIGH', issue: 'Unauthenticated Trial Endpoint' },
    { line: 16, severity: 'MEDIUM', issue: 'Inconsistent Parameter Naming' },
    { line: 27, severity: 'MEDIUM', issue: 'State Manipulation Without Auth' }
  ];

  return (
    <div className="dashboard-ide-split">
      {/* Left: Management Dashboard */}
      <div className="dashboard-panel">
        <div className="dashboard-header">
          <h3 className="dashboard-title">Security Dashboard</h3>
          <div className="dashboard-actions">
            <button className="dashboard-btn">+ Onboard Repository</button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">REPOSITORIES</div>
            <div className="stat-value">7</div>
            <div className="stat-meta">5 secure • 1 at risk</div>
          </div>
          <div className="stat-card critical">
            <div className="stat-label">HIGH SEVERITY</div>
            <div className="stat-value">13</div>
            <div className="stat-meta">Requires immediate action</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">SCANS THIS WEEK</div>
            <div className="stat-value">15</div>
            <div className="stat-meta">0 currently running</div>
          </div>
          <div className="stat-card success">
            <div className="stat-label">AUTO-FIXED</div>
            <div className="stat-value">4</div>
            <div className="stat-meta">52 pending</div>
          </div>
        </div>

        {/* Security Heatmap */}
        <div className="dashboard-heatmap">
          <div className="heatmap-title">
            <span>Security Heatmap</span>
            <span className="heatmap-meta">7 repositories</span>
          </div>
          <div className="heatmap-subtitle">
            24 total issues • Last scan: 2 hours ago
          </div>
          <div className="heatmap-grid-dashboard">
            {[
              { name: 'auth-service', issues: 0, severity: 'safe' },
              { name: 'api-gateway', issues: 1, severity: 'low' },
              { name: 'payment-processor', issues: 4, severity: 'high' },
              { name: 'user-management', issues: 3, severity: 'medium' },
              { name: 'analytics-engine', issues: 1, severity: 'low' },
              { name: 'notification-service', issues: 1, severity: 'low' },
              { name: 'backend-core', issues: 18, severity: 'critical' }
            ].map((repo, i) => (
              <div 
                key={i} 
                className={`repo-card ${repo.severity}`}
                style={{ 
                  gridColumn: i < 6 ? 'span 2' : 'span 3',
                  gridRow: i === 6 ? '2' : '1' 
                }}
              >
                <div className="repo-name">{repo.name}</div>
                {repo.issues > 0 && <div className="repo-issues">{repo.issues}</div>}
                {repo.issues === 0 && <div className="repo-status">No issues</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: IDE with Security Issues */}
      <div className="ide-panel">
        <div className="ide-panel-header">
          <div className="ide-breadcrumb-bar">
            <span className="breadcrumb-item">backend/src/routes</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">chat.routes.ts</span>
          </div>
          <div className="ide-status-bar">
            <span className="status-modified">● Modified</span>
            <span className="status-item">Problems</span>
          </div>
        </div>

        <div className="ide-main-area">
          {/* Editor */}
          <div className="ide-editor-section">
            <div className="editor-line-nums">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`line-num ${i === 7 ? 'highlight' : ''}`}>{i + 1}</div>
              ))}
            </div>
            <div className="editor-code-section">
              <div className="code-line">import {'{ Router }'} from 'express';</div>
              <div className="code-line">import {'{ authenticate }'} from '../middleware/auth';</div>
              <div className="code-line">import {'{ chatController }'} from '../controllers/chat.controller';</div>
              <div className="code-line"></div>
              <div className="code-line">const router = Router();</div>
              <div className="code-line"></div>
              <div className="code-line">// Trial chat endpoint (no auth required)</div>
              <div className="code-line vuln-line">
                {"router.post('/trial', (req, res) => chatController.trialChat(req, res));"}
              </div>
              <div className="code-line"></div>
              <div className="code-line">// Protected routes</div>
              <div className="code-line">router.use(authenticate);</div>
              <div className="code-line">router.use(authorize);</div>
            </div>
          </div>

          {/* Problems Panel */}
          <div className="ide-problems-panel">
            <div className="problems-header">
              <div className="problems-tab active">Security</div>
              <div className="problems-count">
                {vulnerabilities.length} security • 0 lint issues
              </div>
            </div>
            
            <div className="problems-list">
              {vulnerabilities.map((vuln, i) => (
                <div key={i} className={`problem-item ${activeVuln === i ? 'active' : ''}`}>
                  <div className="problem-header">
                    <span className="problem-icon">◉</span>
                    <span className="problem-line">Line {vuln.line}</span>
                    <span className={`problem-severity ${vuln.severity.toLowerCase()}`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <div className="problem-text">{vuln.issue}</div>
                </div>
              ))}
            </div>

            {/* Triage Assistant */}
            <div className="assistant-box">
              <div className="assistant-box-header">
                <span className="assistant-icon">∞</span>
                <span>Security Review Available</span>
                <span className="assistant-badge">INFO</span>
              </div>
              <div className="assistant-box-body">
                <div className="assistant-suggestion">
                  LINE 8: Add rate limiting to /trial endpoint to prevent abuse
                </div>
                <div className="assistant-rlhf">
                  <div className="rlhf-icon">∞</div>
                  <div className="rlhf-text">
                    Based on 2,847 similar patches merged in your org
                  </div>
                </div>
                <button className="assistant-apply-btn">✓ Apply Fix</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
