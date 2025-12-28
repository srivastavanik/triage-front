'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';

export function TraceMockup(): JSX.Element {
  const traces = [
    { id: 'tr_8f2k9x', model: 'claude-3.5', latency: '234ms', tokens: '1,847', status: 'success' },
    { id: 'tr_3j7m2n', model: 'gpt-4o', latency: '567ms', tokens: '3,201', status: 'success' },
    { id: 'tr_1p5q8w', model: 'claude-3.5', latency: '189ms', tokens: '924', status: 'blocked' },
    { id: 'tr_9k4r6t', model: 'gpt-4o', latency: '412ms', tokens: '2,156', status: 'success' },
  ];

  return (
    <div className="mockup-container">
      <div className="mockup-header">
        <div className="mockup-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <span className="mockup-title">Triage</span>
        <div className="mockup-spacer" />
      </div>

      <div className="mockup-nav">
        <span className="nav-item active">Traces</span>
        <span className="nav-item">Dashboard</span>
        <span className="nav-item">Policies</span>
        <span className="nav-item">Settings</span>
      </div>

      <div className="mockup-content">
        <div className="trace-header-row">
          <span>Trace ID</span>
          <span>Model</span>
          <span>Latency</span>
          <span>Tokens</span>
          <span>Status</span>
        </div>

        {traces.map((trace, i) => (
          <motion.div
            key={trace.id}
            className="trace-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="trace-id">{trace.id}</span>
            <span className="trace-model">{trace.model}</span>
            <span className="trace-latency">{trace.latency}</span>
            <span className="trace-tokens">{trace.tokens}</span>
            <span className={`trace-status ${trace.status}`}>
              <span className="status-dot" />
              {trace.status}
            </span>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .mockup-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          font-family: var(--font-family-mono);
        }

        .mockup-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: var(--color-bg-tertiary);
          border-bottom: 1px solid var(--color-border);
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-bg-elevated);
        }

        .mockup-title {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: var(--color-text-tertiary);
        }

        .mockup-spacer {
          width: 40px;
        }

        .mockup-nav {
          display: flex;
          gap: 24px;
          padding: 0 20px;
          background: var(--color-bg-tertiary);
          border-bottom: 1px solid var(--color-border);
        }

        .nav-item {
          font-size: 13px;
          color: var(--color-text-tertiary);
          padding: 12px 0;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .nav-item.active {
          color: var(--color-text-primary);
          border-bottom-color: var(--color-accent);
        }

        .mockup-content {
          padding: 16px;
        }

        .trace-header-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          border-bottom: 1px solid var(--color-border);
        }

        .trace-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 12px;
          font-size: 13px;
          color: var(--color-text-secondary);
          border-bottom: 1px solid var(--color-border-subtle);
          transition: background 0.15s ease;
        }

        .trace-row:last-child {
          border-bottom: none;
        }

        .trace-row:hover {
          background: var(--color-bg-tertiary);
        }

        .trace-id {
          color: var(--color-teal);
        }

        .trace-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .trace-status.success .status-dot {
          background: #4d9375;
        }

        .trace-status.blocked .status-dot {
          background: #fbbf24;
        }

        .trace-status.error .status-dot {
          background: #cb7676;
        }
      `}</style>
    </div>
  );
}

export function DashboardMockup(): JSX.Element {
  const stats = [
    { label: 'Total Traces', value: '847K', trend: '+12%' },
    { label: 'Blocked', value: '2,341', trend: null },
    { label: 'Avg Latency', value: '234ms', trend: '-8%' },
    { label: 'Token Cost', value: '$1,247', trend: '+3%' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <span className="dashboard-title">Triage Dashboard</span>
        <div className="dashboard-spacer" />
      </div>

      <div className="dashboard-content">
        <div className="stats-row">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
              {stat.trend && (
                <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.trend}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="chart-placeholder">
          <div className="chart-header">
            <span>Trace Volume (24h)</span>
          </div>
          <div className="chart-bars">
            {[40, 65, 55, 80, 70, 90, 85, 75, 60, 70, 80, 65].map((height, i) => (
              <motion.div
                key={i}
                className="chart-bar"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: var(--color-bg-tertiary);
          border-bottom: 1px solid var(--color-border);
        }

        .dashboard-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-bg-elevated);
        }

        .dashboard-title {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: var(--color-text-tertiary);
          font-family: var(--font-family-mono);
        }

        .dashboard-spacer {
          width: 40px;
        }

        .dashboard-content {
          padding: 20px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 640px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-card {
          background: var(--color-bg-tertiary);
          border-radius: 8px;
          padding: 16px;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: var(--color-text-tertiary);
          margin-bottom: 8px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 400;
          font-family: var(--font-family-mono);
          color: var(--color-text-primary);
        }

        .stat-trend {
          display: inline-block;
          font-size: 12px;
          font-family: var(--font-family-mono);
          margin-top: 4px;
        }

        .stat-trend.positive {
          color: #4d9375;
        }

        .stat-trend.negative {
          color: #cb7676;
        }

        .chart-placeholder {
          background: var(--color-bg-tertiary);
          border-radius: 8px;
          padding: 16px;
        }

        .chart-header {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-bottom: 16px;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 100px;
        }

        .chart-bar {
          flex: 1;
          background: var(--color-teal);
          border-radius: 2px;
          transform-origin: bottom;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

export function EnforcementMockup(): JSX.Element {
  const policies = [
    { name: 'Block PII extraction', scope: 'All tools', status: 'active', blocked: 47 },
    { name: 'Require approval for writes', scope: 'database_*', status: 'active', blocked: 12 },
    { name: 'Rate limit external calls', scope: 'http_request', status: 'active', blocked: 156 },
    { name: 'Sandbox file access', scope: 'file_*', status: 'paused', blocked: 0 },
  ];

  return (
    <div className="enforcement-container">
      <div className="enforcement-header">
        <div className="enforcement-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <span className="enforcement-title">Policy Engine</span>
        <div className="enforcement-spacer" />
      </div>

      <div className="enforcement-content">
        {policies.map((policy, i) => (
          <motion.div
            key={policy.name}
            className="policy-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="policy-info">
              <span className="policy-name">{policy.name}</span>
              <span className="policy-scope">{policy.scope}</span>
            </div>
            <div className="policy-stats">
              {policy.blocked > 0 && (
                <span className="policy-blocked">{policy.blocked} blocked</span>
              )}
              <span className={`policy-status ${policy.status}`}>{policy.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .enforcement-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .enforcement-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: var(--color-bg-tertiary);
          border-bottom: 1px solid var(--color-border);
        }

        .enforcement-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-bg-elevated);
        }

        .enforcement-title {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: var(--color-text-tertiary);
          font-family: var(--font-family-mono);
        }

        .enforcement-spacer {
          width: 40px;
        }

        .enforcement-content {
          padding: 8px;
        }

        .policy-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 8px;
          transition: background 0.15s ease;
        }

        .policy-row:hover {
          background: var(--color-bg-tertiary);
        }

        .policy-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .policy-name {
          font-size: 14px;
          color: var(--color-text-primary);
        }

        .policy-scope {
          font-size: 12px;
          font-family: var(--font-family-mono);
          color: var(--color-text-tertiary);
        }

        .policy-stats {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .policy-blocked {
          font-size: 12px;
          font-family: var(--font-family-mono);
          color: var(--color-accent);
        }

        .policy-status {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .policy-status.active {
          background: rgba(74, 222, 128, 0.15);
          color: #4d9375;
        }

        .policy-status.paused {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
        }
      `}</style>
    </div>
  );
}

export function TestMockup(): JSX.Element {
  const tests = [
    { name: 'injection_via_tool_output', result: 'pass', duration: '1.2s' },
    { name: 'pii_extraction_attempt', result: 'pass', duration: '0.8s' },
    { name: 'scope_escalation_blocked', result: 'pass', duration: '2.1s' },
    { name: 'retrieval_boundary_check', result: 'pass', duration: '1.5s' },
  ];

  return (
    <div className="test-container">
      <div className="test-header">
        <div className="test-dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <span className="test-title">Security Tests</span>
        <div className="test-spacer" />
      </div>

      <div className="test-content">
        <div className="test-summary">
          <span className="summary-label">4 passed</span>
          <span className="summary-time">5.6s total</span>
        </div>

        {tests.map((test, i) => (
          <motion.div
            key={test.name}
            className="test-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="test-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 8L7 11L12 5"
                  stroke="#4d9375"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="test-name">{test.name}</span>
            <span className="test-duration">{test.duration}</span>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .test-container {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          font-family: var(--font-family-mono);
        }

        .test-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: var(--color-bg-tertiary);
          border-bottom: 1px solid var(--color-border);
        }

        .test-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-bg-elevated);
        }

        .test-title {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: var(--color-text-tertiary);
        }

        .test-spacer {
          width: 40px;
        }

        .test-content {
          padding: 16px;
        }

        .test-summary {
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--color-border);
        }

        .summary-label {
          font-size: 13px;
          color: #4d9375;
        }

        .summary-time {
          font-size: 13px;
          color: var(--color-text-tertiary);
        }

        .test-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 13px;
        }

        .test-icon {
          flex-shrink: 0;
        }

        .test-name {
          flex: 1;
          color: var(--color-text-secondary);
        }

        .test-duration {
          color: var(--color-text-tertiary);
        }
      `}</style>
    </div>
  );
}


