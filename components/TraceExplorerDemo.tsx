'use client';

import type { JSX } from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TraceExplorerDemoProps {
  scenario?: number;
}

// Scenario 0: Model call tracing - focus on model calls, latency, tokens, costs
const SCENARIO_0_TRACES = [
  { id: '1', time: '11/25/2025, 11:52:44 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '1,247 → 892', latency: '2.4s', cost: '$0.032', status: 'success' as const },
  { id: '2', time: '11/25/2025, 11:52:42 PM', provider: 'OpenAI', model: 'gpt-5.2-pro', tokens: '3,891 → 1,456', latency: '4.1s', cost: '$0.089', status: 'success' as const },
  { id: '3', time: '11/25/2025, 11:51:42 PM', provider: 'Anthropic', model: 'claude-sonnet-4-5', tokens: '0 → 0', latency: '186ms', cost: '<$0.001', status: 'error' as const },
  { id: '4', time: '11/25/2025, 11:51:40 PM', provider: 'Anthropic', model: 'claude-opus-4-5', tokens: '2,156 → 3,241', latency: '8.2s', cost: '$0.142', status: 'success' as const },
  { id: '5', time: '11/25/2025, 11:51:31 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '892 → 445', latency: '1.8s', cost: '$0.021', status: 'success' as const },
];

// Scenario 1: Tool and agent execution - focus on tool calls
const SCENARIO_1_TRACES = [
  { id: '1', time: '11/25/2025, 11:52:44 PM', provider: 'OpenAI', model: 'gpt-5.2-pro', tokens: '2,891 → 1,234', latency: '3.2s', cost: '$0.067', status: 'success' as const },
  { id: '2', time: '11/25/2025, 11:52:40 PM', provider: 'Anthropic', model: 'claude-sonnet-4-5', tokens: '1,456 → 892', latency: '2.8s', cost: '$0.045', status: 'success' as const },
  { id: '3', time: '11/25/2025, 11:52:35 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '3,210 → 1,890', latency: '4.5s', cost: '$0.082', status: 'success' as const },
  { id: '4', time: '11/25/2025, 11:52:30 PM', provider: 'OpenAI', model: 'gpt-5.2-pro', tokens: '0 → 0', latency: '120ms', cost: '<$0.001', status: 'error' as const },
  { id: '5', time: '11/25/2025, 11:52:25 PM', provider: 'Anthropic', model: 'claude-opus-4-5', tokens: '4,521 → 2,187', latency: '6.1s', cost: '$0.134', status: 'success' as const },
];

// Scenario 2: RAG and retrieval - focus on retrieval operations
const SCENARIO_2_TRACES = [
  { id: '1', time: '11/25/2025, 11:52:44 PM', provider: 'OpenAI', model: 'text-embedding-3-large', tokens: '512 → 0', latency: '89ms', cost: '$0.002', status: 'success' as const },
  { id: '2', time: '11/25/2025, 11:52:43 PM', provider: 'Anthropic', model: 'claude-sonnet-4-5', tokens: '8,234 → 2,891', latency: '5.6s', cost: '$0.187', status: 'success' as const },
  { id: '3', time: '11/25/2025, 11:52:40 PM', provider: 'OpenAI', model: 'text-embedding-3-large', tokens: '1,024 → 0', latency: '112ms', cost: '$0.004', status: 'success' as const },
  { id: '4', time: '11/25/2025, 11:52:38 PM', provider: 'OpenAI', model: 'gpt-5.2-pro', tokens: '12,456 → 3,210', latency: '8.9s', cost: '$0.312', status: 'success' as const },
  { id: '5', time: '11/25/2025, 11:52:30 PM', provider: 'OpenAI', model: 'text-embedding-3-large', tokens: '256 → 0', latency: '45ms', cost: '$0.001', status: 'success' as const },
];

// Scenario 3: Security context - focus on security metadata
const SCENARIO_3_TRACES = [
  { id: '1', time: '11/25/2025, 11:52:44 PM', provider: 'OpenAI', model: 'gpt-5.2-pro', tokens: '2,891 → 1,567', latency: '3.8s', cost: '$0.078', status: 'success' as const },
  { id: '2', time: '11/25/2025, 11:52:40 PM', provider: 'Anthropic', model: 'claude-sonnet-4-5', tokens: '1,234 → 0', latency: '890ms', cost: '$0.019', status: 'error' as const },
  { id: '3', time: '11/25/2025, 11:52:35 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '3,456 → 2,109', latency: '4.2s', cost: '$0.091', status: 'success' as const },
  { id: '4', time: '11/25/2025, 11:52:30 PM', provider: 'Anthropic', model: 'claude-opus-4-5', tokens: '5,678 → 3,421', latency: '7.3s', cost: '$0.198', status: 'success' as const },
  { id: '5', time: '11/25/2025, 11:52:25 PM', provider: 'OpenAI', model: 'gpt-5.2-pro', tokens: '0 → 0', latency: '67ms', cost: '<$0.001', status: 'error' as const },
];

const SCENARIO_CONFIGS = [
  { 
    title: 'Model Calls',
    traces: SCENARIO_0_TRACES,
    defaultTab: 'Request',
  },
  { 
    title: 'Agent Execution',
    traces: SCENARIO_1_TRACES,
    defaultTab: 'Tools',
  },
  { 
    title: 'RAG Retrieval',
    traces: SCENARIO_2_TRACES,
    defaultTab: 'Retrieval',
  },
  { 
    title: 'Security',
    traces: SCENARIO_3_TRACES,
    defaultTab: 'Security',
  },
];

export function TraceExplorerDemo({ scenario = 0 }: TraceExplorerDemoProps): JSX.Element {
  const config = SCENARIO_CONFIGS[scenario] || SCENARIO_CONFIGS[0];
  const [selectedTrace, setSelectedTrace] = useState(config.traces[0]);
  const [activeTab, setActiveTab] = useState(config.defaultTab);

  // Reset when scenario changes
  useEffect(() => {
    const newConfig = SCENARIO_CONFIGS[scenario] || SCENARIO_CONFIGS[0];
    setSelectedTrace(newConfig.traces[0]);
    setActiveTab(newConfig.defaultTab);
  }, [scenario]);

  // Auto-cycle through traces
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = config.traces.findIndex(t => t.id === selectedTrace.id);
      const nextIndex = (currentIndex + 1) % config.traces.length;
      setSelectedTrace(config.traces[nextIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedTrace, config.traces]);

  const getTabs = () => {
    switch (scenario) {
      case 0: return ['Request', 'Response', 'Meta'];
      case 1: return ['Tools', 'Execution', 'Output'];
      case 2: return ['Retrieval', 'Sources', 'Context'];
      case 3: return ['Security', 'Policy', 'Audit'];
      default: return ['Request', 'Response', 'Meta'];
    }
  };

  const renderTabContent = () => {
    // Scenario 0: Model call tracing
    if (scenario === 0) {
      if (activeTab === 'Request') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">PARAMETERS</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Temperature</div>
                <div className="text-[12px] font-mono text-text-primary">0.7</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Max Tokens</div>
                <div className="text-[12px] font-mono text-text-primary">4096</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Top P</div>
                <div className="text-[12px] font-mono text-text-primary">0.95</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Frequency Penalty</div>
                <div className="text-[12px] font-mono text-text-primary">0.0</div>
              </div>
            </div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">PROMPT</div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3" style={{ fontFamily: 'var(--font-geist-mono), "Geist Mono", monospace' }}>
              <div className="text-[11px] text-[#C9A37E] mb-1">system:</div>
              <div className="text-[11px] text-text-secondary leading-relaxed mb-3">
                You are a security analyst reviewing code for vulnerabilities.
              </div>
              <div className="text-[11px] text-[#C9A37E] mb-1">user:</div>
              <div className="text-[11px] text-text-secondary leading-relaxed">
                Review this API endpoint for SQL injection and authentication bypass vulnerabilities...
              </div>
            </div>
          </div>
        );
      }
      if (activeTab === 'Response') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">MODEL OUTPUT</div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3 mb-4">
              <div className="text-[11px] font-mono text-text-secondary leading-relaxed">
                I found 2 security issues in this endpoint:
              </div>
              <div className="text-[11px] font-mono text-text-secondary leading-relaxed mt-2">
                <span className="text-[#cb7676]">1. SQL Injection (High)</span> - Line 45
              </div>
              <div className="text-[10px] font-mono text-text-muted ml-4">User input concatenated directly into query</div>
              <div className="text-[11px] font-mono text-text-secondary leading-relaxed mt-2">
                <span className="text-[#C9A37E]">2. Missing Auth Check (Medium)</span> - Line 23
              </div>
              <div className="text-[10px] font-mono text-text-muted ml-4">Endpoint lacks session validation</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Finish Reason</div>
                <div className="text-[12px] font-mono text-text-primary">stop</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Output Tokens</div>
                <div className="text-[12px] font-mono text-text-primary">{selectedTrace.tokens.split(' → ')[1]}</div>
              </div>
            </div>
          </div>
        );
      }
      if (activeTab === 'Meta') {
        return (
          <div className="space-y-3">
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
              <div className="text-[10px] text-text-muted uppercase mb-1">Trace ID</div>
              <div className="text-[11px] font-mono text-text-primary">tr_8f2k4n9x_{selectedTrace.id}</div>
            </div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
              <div className="text-[10px] text-text-muted uppercase mb-1">Latency Breakdown</div>
              <div className="text-[10px] font-mono text-text-secondary mt-1">Queue: 45ms • Inference: {selectedTrace.latency} • Network: 12ms</div>
            </div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
              <div className="text-[10px] text-text-muted uppercase mb-1">Retry Count</div>
              <div className="text-[11px] font-mono text-text-primary">{selectedTrace.status === 'error' ? '3 (exhausted)' : '0'}</div>
            </div>
          </div>
        );
      }
    }

    // Scenario 1: Tool and agent execution
    if (scenario === 1) {
      if (activeTab === 'Tools') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">TOOL INVOCATIONS</div>
            <div className="space-y-3">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#C9A37E]">read_file</span>
                  <span className="text-[10px] text-text-muted">142ms</span>
                </div>
                <div className="text-[10px] font-mono text-text-secondary bg-[#121212] p-2">
                  {`{ "path": "src/api/auth.ts", "lines": "40-80" }`}
                </div>
                <div className="text-[10px] text-[#4d9375] mt-2">✓ Returned 41 lines</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#C9A37E]">run_terminal</span>
                  <span className="text-[10px] text-text-muted">1.2s</span>
                </div>
                <div className="text-[10px] font-mono text-text-secondary bg-[#121212] p-2">
                  {`{ "command": "npm run test:security" }`}
                </div>
                <div className="text-[10px] text-[#4d9375] mt-2">✓ Exit code 0</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#C9A37E]">apply_diff</span>
                  <span className="text-[10px] text-text-muted">56ms</span>
                </div>
                <div className="text-[10px] font-mono text-text-secondary bg-[#121212] p-2">
                  {`{ "file": "src/api/auth.ts", "changes": 3 }`}
                </div>
                <div className="text-[10px] text-[#4d9375] mt-2">✓ Applied successfully</div>
              </div>
            </div>
          </div>
        );
      }
      if (activeTab === 'Execution') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">EXECUTION FLOW</div>
            <div className="space-y-2">
              {[
                { step: 1, action: 'Analyzed request context', duration: '120ms' },
                { step: 2, action: 'Read target file', duration: '142ms' },
                { step: 3, action: 'Identified security patterns', duration: '890ms' },
                { step: 4, action: 'Generated fix proposal', duration: '1.4s' },
                { step: 5, action: 'Ran validation tests', duration: '1.2s' },
                { step: 6, action: 'Applied changes', duration: '56ms' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                  <div className="w-5 h-5 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-[10px] text-text-muted">{item.step}</div>
                  <div className="flex-1 text-[11px] text-text-secondary">{item.action}</div>
                  <div className="text-[10px] font-mono text-text-muted">{item.duration}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (activeTab === 'Output') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">AGENT OUTPUT</div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
              <div className="text-[11px] font-mono text-text-secondary leading-relaxed">
                Fixed 2 security vulnerabilities in <span className="text-[#C9A37E]">src/api/auth.ts</span>:
              </div>
              <div className="mt-3 space-y-2">
                <div className="text-[10px] font-mono">
                  <span className="text-[#cb7676]">- const query = `SELECT * FROM users WHERE id = ${"{"}id{"}"}`;</span>
                </div>
                <div className="text-[10px] font-mono">
                  <span className="text-[#4d9375]">+ const query = db.prepare(&apos;SELECT * FROM users WHERE id = ?&apos;).bind(id);</span>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    // Scenario 2: RAG and retrieval
    if (scenario === 2) {
      if (activeTab === 'Retrieval') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">RETRIEVAL OPERATION</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Vector Store</div>
                <div className="text-[12px] font-mono text-text-primary">pinecone-security</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Top K</div>
                <div className="text-[12px] font-mono text-text-primary">5</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Similarity Threshold</div>
                <div className="text-[12px] font-mono text-text-primary">0.78</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Chunks Retrieved</div>
                <div className="text-[12px] font-mono text-text-primary">4</div>
              </div>
            </div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">QUERY EMBEDDING</div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
              <div className="text-[11px] font-mono text-text-secondary">
                &quot;SQL injection prevention best practices for Node.js&quot;
              </div>
              <div className="text-[10px] text-text-muted mt-2">1536 dimensions • text-embedding-3-large</div>
            </div>
          </div>
        );
      }
      if (activeTab === 'Sources') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">RETRIEVED DOCUMENTS</div>
            <div className="space-y-3">
              {[
                { title: 'OWASP SQL Injection Prevention', score: 0.94, source: 'owasp.org' },
                { title: 'Node.js Security Best Practices', score: 0.89, source: 'nodejs.org/security' },
                { title: 'Parameterized Queries Guide', score: 0.85, source: 'internal/security-docs' },
                { title: 'SQL Injection Attack Patterns', score: 0.82, source: 'cve.mitre.org' },
              ].map((doc, i) => (
                <div key={i} className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-text-primary">{doc.title}</span>
                    <span className="text-[10px] font-mono text-[#4d9375]">{doc.score}</span>
                  </div>
                  <div className="text-[10px] text-text-muted">{doc.source}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (activeTab === 'Context') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">ASSEMBLED CONTEXT</div>
            <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3 mb-3">
              <div className="text-[10px] text-text-muted uppercase mb-2">Context Window</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#121212] rounded overflow-hidden">
                  <div className="h-full bg-[#C9A37E]" style={{ width: '68%' }} />
                </div>
                <span className="text-[10px] font-mono text-text-muted">8,234 / 12,000</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted">System Prompt</div>
                <div className="text-[11px] font-mono text-text-primary">1,245 tokens</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted">Retrieved Context</div>
                <div className="text-[11px] font-mono text-text-primary">5,891 tokens</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted">User Query</div>
                <div className="text-[11px] font-mono text-text-primary">1,098 tokens</div>
              </div>
            </div>
          </div>
        );
      }
    }

    // Scenario 3: Security context
    if (scenario === 3) {
      if (activeTab === 'Security') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">SECURITY CHECKS</div>
            <div className="space-y-3">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-text-primary">Prompt Injection Scan</span>
                  <span className="text-[10px] text-[#4d9375]">passed</span>
                </div>
                <div className="text-[10px] text-text-muted">No injection patterns in input</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-text-primary">Tool Scope Validation</span>
                  <span className="text-[10px] text-[#4d9375]">passed</span>
                </div>
                <div className="text-[10px] text-text-muted">All calls within sandbox boundary</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-text-primary">Output PII Detection</span>
                  <span className="text-[10px] text-[#4d9375]">passed</span>
                </div>
                <div className="text-[10px] text-text-muted">No sensitive data leaked</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-text-primary">Rate Limit Check</span>
                  <span className="text-[10px] text-[#4d9375]">passed</span>
                </div>
                <div className="text-[10px] text-text-muted">Under threshold (42/100 rpm)</div>
              </div>
            </div>
          </div>
        );
      }
      if (activeTab === 'Policy') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">POLICY DECISIONS</div>
            <div className="space-y-3">
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Applied Policy</div>
                <div className="text-[11px] font-mono text-text-primary">security-review-v2</div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Tool Allowlist</div>
                <div className="text-[10px] font-mono text-text-secondary mt-1">
                  read_file, search_codebase, apply_diff
                </div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Path Restrictions</div>
                <div className="text-[10px] font-mono text-text-secondary mt-1">
                  src/**, !node_modules/**, !.env*
                </div>
              </div>
              <div className="bg-[#1e1e1e] border border-[#1a1a1a] rounded-lg p-3">
                <div className="text-[10px] text-text-muted uppercase mb-1">Approval Required</div>
                <div className="text-[11px] font-mono text-text-primary">No (auto-approved)</div>
              </div>
            </div>
          </div>
        );
      }
      if (activeTab === 'Audit') {
        return (
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">AUDIT LOG</div>
            <div className="space-y-2">
              {[
                { time: '11:52:44.123', event: 'Request received', user: 'usr_dev_01' },
                { time: '11:52:44.145', event: 'Policy evaluated', policy: 'security-review-v2' },
                { time: '11:52:44.156', event: 'Tool call: read_file', status: 'allowed' },
                { time: '11:52:45.312', event: 'Tool call: apply_diff', status: 'allowed' },
                { time: '11:52:48.567', event: 'Response generated', tokens: '1,567' },
                { time: '11:52:48.589', event: 'Output validated', result: 'clean' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                  <div className="text-[10px] font-mono text-text-muted whitespace-nowrap">{log.time}</div>
                  <div className="text-[11px] text-text-secondary">{log.event}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    return null;
  };

  const tabs = getTabs();

  return (
    <div className="trace-explorer rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#121212] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-5 py-3 md:py-4 border-b border-[#1a1a1a] bg-[#1e1e1e]">
        <div className="flex items-center gap-2 md:gap-4">
          <button className="text-[11px] md:text-[13px] text-text-muted hover:text-text-secondary flex items-center gap-1">
            ← Observability
          </button>
          <span className="text-[12px] md:text-[14px] font-medium text-text-primary">{config.title}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button className="px-2 md:px-3 py-1 md:py-1.5 bg-[#1a1a1a] border border-[#1a1a1a] rounded text-[10px] md:text-[12px] text-text-secondary hover:text-text-primary">
            Filters
          </button>
          <button className="hidden md:block px-3 py-1.5 bg-[#1a1a1a] border border-[#1a1a1a] rounded text-[12px] text-text-secondary hover:text-text-primary">
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[400px] md:h-[480px]">
        {/* Left - Trace List */}
        <div className="w-full md:w-[380px] h-[140px] md:h-full border-b md:border-b-0 md:border-r border-[#1a1a1a] overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-[12px]">
              <thead className="sticky top-0 bg-[#121212]">
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Provider</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {config.traces.map((trace) => (
                  <tr
                    key={trace.id}
                    className={`border-b border-[#121212] cursor-pointer transition-colors ${
                      selectedTrace.id === trace.id ? 'bg-[#1a1a1a]' : 'hover:bg-[#1e1e1e]'
                    }`}
                    onClick={() => setSelectedTrace(trace)}
                  >
                    <td className="px-4 py-2.5 text-text-secondary whitespace-nowrap text-[11px]">{trace.time.split(', ')[1]}</td>
                    <td className="px-4 py-2.5 text-text-primary font-medium text-[11px]">{trace.provider}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] ${
                        trace.status === 'error' ? 'text-[#cb7676]' : 'text-[#4d9375]'
                      }`}>
                        {trace.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right - Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenario}-${selectedTrace.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 bg-[#121212] flex flex-col"
          >
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-1.5 p-2 border-b border-[#1a1a1a]">
              <div className="bg-[#1e1e1e] rounded-lg p-1.5 text-center">
                <div className="text-[8px] text-text-muted uppercase mb-0.5">Status</div>
                <div className={`text-[9px] font-medium ${
                  selectedTrace.status === 'error' ? 'text-[#cb7676]' :
                  selectedTrace.status === 'success' ? 'text-[#4d9375]' :
                  'text-text-muted'
                }`}>
                  {selectedTrace.status}
                </div>
              </div>
              <div className="bg-[#1e1e1e] rounded-lg p-1.5 text-center">
                <div className="text-[8px] text-text-muted uppercase mb-0.5">Tokens</div>
                <div className="text-[9px] font-mono text-text-primary">{selectedTrace.tokens.split(' → ')[0]}</div>
              </div>
              <div className="bg-[#1e1e1e] rounded-lg p-1.5 text-center">
                <div className="text-[8px] text-text-muted uppercase mb-0.5">Latency</div>
                <div className="text-[9px] font-mono text-text-primary">{selectedTrace.latency}</div>
              </div>
              <div className="bg-[#1e1e1e] rounded-lg p-1.5 text-center">
                <div className="text-[8px] text-text-muted uppercase mb-0.5">Cost</div>
                <div className="text-[9px] font-mono text-text-primary">{selectedTrace.cost}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1a1a1a]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-[12px] border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'text-text-primary border-text-primary'
                      : 'text-text-muted border-transparent hover:text-text-secondary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderTabContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
