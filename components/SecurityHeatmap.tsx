'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const SecurityHeatmap = () => {
  const [activeRepo, setActiveRepo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRepo(prev => (prev + 1) % 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const repos = [
    { name: 'auth-service', severity: 'low', issues: 2, color: 'bg-cyan/30' },
    { name: 'api-gateway', severity: 'medium', issues: 5, color: 'bg-pale-wood/20' },
    { name: 'payment-processor', severity: 'low', issues: 1, color: 'bg-cyan/30' },
    { name: 'user-service', severity: 'high', issues: 8, color: 'bg-pale-wood/40' },
    { name: 'analytics', severity: 'low', issues: 3, color: 'bg-cyan/30' },
    { name: 'notification-service', severity: 'low', issues: 1, color: 'bg-cyan/30' },
    { name: 'admin-panel', severity: 'medium', issues: 4, color: 'bg-pale-wood/20' },
  ];

  return (
    <div className="heatmap-wireframe">
      <div className="heatmap-header">
        <h4 className="text-[14px] text-pale-wood/60">Security Heatmap</h4>
        <div className="heatmap-stats">
          <span className="stat-item">7 repositories</span>
          <span className="stat-divider">|</span>
          <span className="stat-item">24 total issues</span>
        </div>
      </div>
      <div className="heatmap-grid">
        {repos.map((repo, i) => (
          <motion.div
            key={i}
            className={`heatmap-cell ${repo.color} ${activeRepo === i ? 'active' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="cell-name">{repo.name}</div>
            <div className="cell-issues">{repo.issues}</div>
          </motion.div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="legend-item">
          <div className="legend-color bg-cyan/30" />
          Low
        </span>
        <span className="legend-item">
          <div className="legend-color bg-pale-wood/20" />
          Medium
        </span>
        <span className="legend-item">
          <div className="legend-color bg-pale-wood/40" />
          High
        </span>
      </div>
    </div>
  );
};

// Enhanced Commit Security Timeline with Heatmap
export const CommitTimeline = () => {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);
  const weeks = ['W1', 'W7', 'W13', 'W19', 'W25'];
  
  // White to bright cyan gradient data (7 rows x 50 columns)
  const heatmapPattern = [
    'level4,level3,level2,level0,level4,level1,level3,level4,level0,level2,level4,level2,level3,level4,level4,level2,level1,level3,level0,level4,level3,level2,level4,level1,level3,level0,level4,level2,level3,level4,level1,level2,level0,level3,level4,level2,level1,level4,level3,level0,level2,level4,level3,level1,level2,level4,level0,level3,level4,level2',
    'level2,level4,level0,level3,level1,level4,level2,level3,level4,level0,level3,level4,level2,level1,level3,level0,level4,level2,level1,level3,level4,level0,level2,level3,level4,level1,level0,level3,level2,level4,level3,level1,level4,level0,level2,level3,level4,level2,level0,level1,level3,level4,level2,level3,level0,level4,level1,level2,level3,level4',
    'level3,level1,level4,level2,level0,level3,level4,level1,level2,level3,level0,level4,level2,level3,level1,level4,level0,level3,level2,level4,level1,level0,level3,level4,level2,level1,level3,level0,level4,level2,level3,level4,level1,level0,level2,level4,level3,level1,level0,level2,level4,level3,level0,level1,level4,level2,level3,level0,level4,level1',
    'level0,level4,level2,level3,level1,level4,level0,level3,level2,level4,level1,level0,level3,level2,level4,level3,level0,level1,level4,level2,level3,level0,level4,level1,level2,level3,level4,level0,level1,level2,level3,level4,level0,level2,level1,level3,level4,level0,level2,level3,level1,level4,level0,level2,level3,level4,level1,level0,level3,level2',
    'level3,level0,level4,level1,level2,level3,level4,level0,level2,level1,level3,level4,level2,level0,level3,level1,level4,level2,level0,level3,level4,level1,level0,level2,level3,level4,level1,level3,level0,level4,level2,level1,level3,level0,level4,level2,level3,level1,level0,level4,level2,level3,level0,level1,level4,level3,level2,level0,level4,level1',
    'level1,level3,level0,level4,level2,level1,level3,level4,level0,level2,level3,level1,level4,level0,level2,level3,level4,level1,level0,level2,level4,level3,level0,level1,level4,level2,level3,level0,level4,level1,level2,level3,level0,level4,level1,level2,level3,level4,level0,level1,level3,level2,level4,level0,level3,level1,level4,level2,level0,level3',
    'level4,level2,level3,level0,level1,level4,level2,level3,level1,level0,level4,level3,level2,level0,level4,level1,level3,level2,level0,level4,level3,level1,level0,level2,level4,level3,level0,level1,level4,level2,level3,level0,level4,level2,level1,level3,level4,level0,level2,level1,level3,level4,level0,level2,level3,level1,level4,level0,level3,level2'
  ];
  
  const heatmapData = heatmapPattern.map(row => row.split(','));

  // Generate commit details for hover
  const getCommitDetails = (row: number, col: number) => {
    const engineers = ['Engineer 1', 'Engineer 2', 'Engineer 3', 'Security Team', 'DevOps'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    
    const score = 60 + (row * 13 + col) % 40;
    let criticality = 'Low';
    if (score >= 85) criticality = 'Critical';
    else if (score >= 75) criticality = 'High';
    else if (score >= 65) criticality = 'Medium';
    
    return {
      engineer: engineers[(row + col) % engineers.length],
      date: `${months[(row + col) % months.length]} ${1 + (row * col) % 28}, 2025`,
      score,
      criticality
    };
  };

  return (
    <div className="commit-security-timeline">
      <div className="timeline-header">
        <h4 className="text-[14px] text-pale-wood">Commit Security Timeline</h4>
        <div className="timeline-meta">
          <span className="text-pale-wood/60">87 commits since onboarding</span>
          <span className="text-pale-wood/40">•</span>
          <span className="text-pale-wood/60">Security rating per commit</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="security-heatmap-grid">
        <div className="heatmap-weeks">
          <div className="week-spacer"></div>
          <div className="week-label" style={{ gridColumn: '2' }}>W1</div>
          <div className="week-label" style={{ gridColumn: '8' }}>W7</div>
          <div className="week-label" style={{ gridColumn: '14' }}>W13</div>
          <div className="week-label" style={{ gridColumn: '20' }}>W19</div>
          <div className="week-label" style={{ gridColumn: '25' }}>W25</div>
        </div>
        <div className="heatmap-rows">
          {heatmapData.map((row, i) => (
            <div key={i} className="heatmap-row">
              <div className="row-number">{i + 1}</div>
              <div className="row-cells">
                {row.slice(0, 25).map((cell, j) => {
                  const details = getCommitDetails(i, j);
                  return (
                    <div key={j} className="cell-wrapper">
                      <motion.div
                        className={`heatmap-cell ${cell}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: (i * 13 + j) * 0.015,
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                      
                      {/* Hover Tooltip */}
                      <AnimatePresence>
                        {hoveredCell?.row === i && hoveredCell?.col === j && (
                          <motion.div
                            className="commit-tooltip"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="tooltip-row">
                              <span className="tooltip-label">Engineer:</span>
                              <span className="tooltip-value">{details.engineer}</span>
                            </div>
                            <div className="tooltip-row">
                              <span className="tooltip-label">Date:</span>
                              <span className="tooltip-value">{details.date}</span>
                            </div>
                            <div className="tooltip-row">
                              <span className="tooltip-label">Score:</span>
                              <span className="tooltip-value text-cyan">{details.score}/100</span>
                            </div>
                            <div className="tooltip-row">
                              <span className="tooltip-label">Criticality:</span>
                              <span className={`tooltip-criticality ${details.criticality.toLowerCase()}`}>
                                {details.criticality}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="heatmap-legend-extended">
          <span className="legend-text">Less secure</span>
          <div className="legend-gradient">
            <div className="legend-swatch level0" />
            <div className="legend-swatch level1" />
            <div className="legend-swatch level2" />
            <div className="legend-swatch level3" />
            <div className="legend-swatch level4" />
          </div>
          <span className="legend-text">More secure</span>
        </div>
      </div>
    </div>
  );
};

export const VulnerabilityPipeline = () => {
  const stages = [
    { name: 'Detection', count: 18, active: true },
    { name: 'Triage', count: 9, active: true },
    { name: 'Remediation', count: 10, active: true },
    { name: 'Verification', count: 7, active: false },
    { name: 'Closed', count: 5, active: false },
  ];

  return (
    <div className="pipeline-wireframe">
      <div className="pipeline-header">
        <h4 className="text-[14px] text-pale-wood/60">Vulnerability Remediation Pipeline</h4>
      </div>
      <div className="pipeline-stages">
        {stages.map((stage, i) => (
          <div key={i} className="pipeline-stage">
            <div className="stage-header">
              <div className="stage-count">{stage.count}</div>
              <div className="stage-name">{stage.name}</div>
            </div>
            {stage.active && <div className="stage-indicator" />}
            {i < stages.length - 1 && (
              <div className="stage-arrow">→</div>
            )}
          </div>
        ))}
      </div>
      <div className="pipeline-metrics">
        <div className="pipeline-metric">
          <div className="metric-value">19.1h</div>
          <div className="metric-label">MTTR</div>
        </div>
        <div className="pipeline-metric">
          <div className="metric-value">17.0h</div>
          <div className="metric-label">Detection → Fix</div>
        </div>
        <div className="pipeline-metric">
          <div className="metric-value">0</div>
          <div className="metric-label">SLA Breaches</div>
        </div>
      </div>
    </div>
  );
};

export const TestExecution = () => {
  const tests = [
    { name: 'SQL Injection Prevention', status: 'pass' },
    { name: 'XSS Protection', status: 'pass' },
    { name: 'CSRF Token Validation', status: 'pass' },
    { name: 'Auth Bypass Checks', status: 'pass' },
    { name: 'Rate Limiting', status: 'pass' },
    { name: 'Input Sanitization', status: 'pass' },
  ];

  return (
    <div className="test-execution-wireframe">
      <div className="test-header">
        <h4 className="text-[14px] text-pale-wood/60">Security Test Execution</h4>
        <div className="test-status">
          <div className="status-dot" />
          <span>All tests passed</span>
        </div>
      </div>
      <div className="test-list">
        {tests.map((test, i) => (
          <motion.div
            key={i}
            className="test-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="test-check">✓</span>
            <span className="test-name">{test.name}</span>
            <span className="test-badge">PASS</span>
          </motion.div>
        ))}
      </div>
      <div className="test-summary">
        <div className="summary-item">
          <span className="summary-label">Tests Passed</span>
          <span className="summary-value">6/6</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Coverage</span>
          <span className="summary-value">98.5%</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Duration</span>
          <span className="summary-value">4.2s</span>
        </div>
      </div>
    </div>
  );
};

export const MergeReadiness = () => {
  return (
    <div className="merge-readiness-wireframe">
      <div className="merge-header">
        <h4 className="text-[14px] text-pale-wood/60">Merge Readiness</h4>
      </div>
      <div className="merge-checks">
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Security tests</span>
          <span className="check-status">Passed</span>
        </div>
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Evidence packet</span>
          <span className="check-status">Complete</span>
        </div>
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Policy compliance</span>
          <span className="check-status">Verified</span>
        </div>
        <div className="check-item">
          <span className="check-icon">✓</span>
          <span className="check-label">Rollback plan</span>
          <span className="check-status">Ready</span>
        </div>
      </div>
      <div className="merge-action">
        <div className="merge-status">
          <span className="status-icon">✓</span>
          <span className="status-text">Ready to merge</span>
        </div>
        <div className="merge-info">Auto-merge approved by policy</div>
      </div>
    </div>
  );
};

export const PRWireframe = () => {
  return (
    <div className="pr-wireframe">
      <div className="pr-header">
        <div className="pr-title">
          <span className="pr-status">OPEN</span>
          <span className="pr-number">#: Security: Fix 1 high severity vulnerabilities (static_analysis)</span>
        </div>
        <div className="pr-meta">
          <span className="pr-user">paladin-bot</span>
          <span className="pr-files">1 files changed</span>
          <span className="pr-changes">+229 -707</span>
        </div>
      </div>

      <div className="pr-tabs">
        <div className="pr-tab active">Overview</div>
        <div className="pr-tab">Vulnerability Flow</div>
        <div className="pr-tab">Settings</div>
      </div>

      <div className="pr-body">
        <div className="pr-section">
          <div className="pr-section-title">PULL REQUEST DESCRIPTION</div>
          <div className="pr-section-content">
            <div className="pr-doc-item">
              <span className="doc-marker">-</span>
              <span>OWASP Secure Coding Practices</span>
            </div>
            <div className="pr-doc-item">
              <span className="doc-marker">-</span>
              <span>CWE Top 25</span>
            </div>
            <div className="pr-doc-item">
              <span className="doc-marker">-</span>
              <span>NIST SSDF</span>
            </div>
          </div>
        </div>

        <div className="pr-section">
          <div className="pr-section-title">SECURITY TEST EXECUTION</div>
          <div className="pr-test-status">
            <span className="test-pass-icon">✓</span>
            <span>All tests passed</span>
          </div>
          <div className="pr-tests">
            <div className="pr-test-item">✓ SQL Injection Prevention</div>
            <div className="pr-test-item">✓ XSS Protection</div>
            <div className="pr-test-item">✓ CSRF Token Validation</div>
            <div className="pr-test-item">✓ Auth Bypass Checks</div>
          </div>
        </div>

        <div className="pr-section">
          <div className="pr-section-title">MERGE READINESS</div>
          <div className="pr-readiness">
            <div className="readiness-status">
              <span className="ready-icon">✓</span>
              <span>Ready to merge</span>
            </div>
            <div className="readiness-info">Auto-merge approved</div>
          </div>
        </div>

        <div className="pr-section">
          <div className="pr-section-title">FILES CHANGED (1)</div>
          <div className="pr-file">
            <span className="file-toggle">▾</span>
            <span className="file-path">backend/src/controllers/chat.controller.ts</span>
            <span className="file-stats">+229 -707</span>
          </div>
        </div>
      </div>
    </div>
  );
};
