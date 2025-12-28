'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

type TraceStatus = 'success' | 'error' | 'blocked';
type SafetyStatus = 'safe' | 'flagged' | 'blocked';

interface Span {
  id: string;
  name: string;
  type: 'guard' | 'retrieval' | 'model' | 'tool';
  start: number;
  duration: number;
  status: TraceStatus;
  meta?: Record<string, unknown>;
}

interface PolicyResult {
  policy: string;
  result: 'PASSED' | 'BLOCKED';
  confidence: number;
  details?: string;
}

interface Trace {
  id: string;
  timestamp: Date;
  model: string;
  route: string;
  user: string;
  duration: number;
  tokens: { input: number; output: number };
  cost: number;
  status: TraceStatus;
  spans: Span[];
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  security: PolicyResult[];
  finding?: string;
  remediation?: string;
  guardDecision?: string;
  detector?: string;
  impact?: string;
}

interface Generation {
  id: string;
  timestamp: Date;
  model: string;
  prompt: string;
  completion: string;
  tokens: { input: number; output: number };
  latency: number;
  cached: boolean;
  safety: SafetyStatus;
  route: string;
  issue?: string;
  detectors?: string[];
  actions?: string[];
  evidence?: string[];
}

interface ActivityEvent {
  id: string;
  type: 'model' | 'tool' | 'retrieval' | 'blocked' | 'error';
  message: string;
  timestamp: Date;
}

interface CostModel {
  model: string;
  requests: number;
  tokens: number;
  cost: number;
  costPer1k: number;
}

// ============================================================================
// UTILS
// ============================================================================

function frac(n: number): number {
  return n - Math.floor(n);
}

function seeded01(seed: number): number {
  return frac(Math.sin((seed + 1) * 999.123) * 43758.5453);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatRelativeTime(date: Date): string {
  // Use a fixed reference time to avoid hydration mismatch between server and client
  const referenceTime = new Date('2025-12-28T12:00:00Z').getTime();
  const diff = referenceTime - date.getTime();
  const seconds = Math.floor(Math.abs(diff) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const MODELS = ['gpt-5.2-pro', 'gpt-5.1-codex-max', 'claude-sonnet-4-5-20250929', 'claude-opus-4-5-20251101', 'gemini-3-pro-preview', 'gemini-3-flash-preview', 'grok-4-1-fast-reasoning'];
const ROUTES = ['/chat', '/analysis', '/code-gen', '/search', '/summarize'];
const USERS = ['user_8a9b', 'user_2c3d', 'user_9e1f', 'user_4g5h', 'internal_bot'];

const PROMPTS = [
  'Analyze this security log for suspicious patterns...',
  'Generate a SQL query to find users with expired sessions...',
  'Explain the authentication flow in this codebase...',
  'Summarize the key findings from the penetration test report...',
  'Review this API endpoint for potential vulnerabilities...',
  'Write unit tests for the input validation function...',
  'Compare these two encryption algorithms for our use case...',
];

const COMPLETIONS = [
  'Based on the analysis, I found 3 suspicious IP addresses that attempted multiple failed logins...',
  'SELECT * FROM users WHERE session_expiry < NOW() AND last_activity > DATE_SUB(NOW(), INTERVAL 30 DAY)...',
  'The authentication flow starts with the LoginController which validates credentials against...',
  'Key findings: 2 critical vulnerabilities in the API gateway, 5 medium-severity issues in...',
  'This endpoint has potential SQL injection risk on line 45. The user input is not properly...',
  'Here are comprehensive unit tests covering edge cases for the validation function...',
  'AES-256-GCM provides authenticated encryption which is recommended for your use case...',
];

function generateTrace(seed: number): Trace {
  const r = seeded01(seed);
  const status: TraceStatus = r > 0.92 ? 'error' : r > 0.85 ? 'blocked' : 'success';
  const duration = 200 + seeded01(seed + 1) * 2000;
  const inputTokens = Math.floor(100 + seeded01(seed + 2) * 500);
  const outputTokens = Math.floor(50 + seeded01(seed + 3) * 800);
  const model = MODELS[Math.floor(seeded01(seed + 4) * MODELS.length)];
  
  // Generate spans
  const spans: Span[] = [];
  let currentTime = 0;
  
  // Input guard
  const guardDur = 15 + seeded01(seed + 10) * 40;
  spans.push({
    id: `span_${seed}_guard`,
    name: 'input_guardrail',
    type: 'guard',
    start: currentTime,
    duration: guardDur,
    status: 'success'
  });
  currentTime += guardDur;
  
  // Retrieval (60% chance)
  if (seeded01(seed + 11) > 0.4) {
    const retDur = 80 + seeded01(seed + 12) * 300;
    spans.push({
      id: `span_${seed}_ret`,
      name: 'vector_retrieval',
      type: 'retrieval',
      start: currentTime,
      duration: retDur,
      status: 'success',
      meta: { documents: Math.floor(3 + seeded01(seed + 13) * 7), query: 'semantic search' }
    });
    currentTime += retDur;
  }
  
  // Tool call (30% chance)
  if (seeded01(seed + 14) > 0.7) {
    const toolDur = 50 + seeded01(seed + 15) * 200;
    spans.push({
      id: `span_${seed}_tool`,
      name: 'code_executor',
      type: 'tool',
      start: currentTime,
      duration: toolDur,
      status: seeded01(seed + 16) > 0.9 ? 'error' : 'success',
      meta: { tool: 'sandbox_exec', args: { language: 'python' } }
    });
    currentTime += toolDur;
  }
  
  // Model call
  const modelDur = duration - currentTime - 20;
  spans.push({
    id: `span_${seed}_model`,
    name: 'llm_generation',
    type: 'model',
    start: currentTime,
    duration: Math.max(modelDur, 100),
    status: status === 'blocked' ? 'blocked' : status
  });
  currentTime += Math.max(modelDur, 100);
  
  // Output guard
  spans.push({
    id: `span_${seed}_out_guard`,
    name: 'output_guardrail',
    type: 'guard',
    start: currentTime,
    duration: 15 + seeded01(seed + 17) * 25,
    status: status === 'blocked' ? 'blocked' : 'success'
  });

  const promptIdx = Math.floor(seeded01(seed + 20) * PROMPTS.length);
  
  return {
    id: `trc_${Math.floor(seeded01(seed + 5) * 1000000).toString(36)}`,
    timestamp: new Date(Date.now() - seed * 8000),
    model,
    route: ROUTES[Math.floor(seeded01(seed + 6) * ROUTES.length)],
    user: USERS[Math.floor(seeded01(seed + 7) * USERS.length)],
    duration,
    tokens: { input: inputTokens, output: outputTokens },
    cost: ((inputTokens * 0.01 + outputTokens * 0.03) / 1000),
    status,
    spans,
    request: {
      messages: [
        { role: 'system', content: 'You are a helpful security assistant.' },
        { role: 'user', content: PROMPTS[promptIdx] }
      ],
      temperature: 0.7,
      max_tokens: 2048
    },
    response: {
      content: status === 'blocked' ? '[BLOCKED BY POLICY]' : COMPLETIONS[promptIdx],
      finish_reason: status === 'error' ? 'error' : 'stop'
    },
    security: [
      { policy: 'Prompt Injection', result: status === 'blocked' ? 'BLOCKED' : 'PASSED', confidence: 0.95 + seeded01(seed + 8) * 0.05 },
      { policy: 'PII Detection', result: 'PASSED', confidence: 0.99 },
      { policy: 'Jailbreak Attempt', result: 'PASSED', confidence: 0.97 + seeded01(seed + 9) * 0.03 }
    ]
  };
}

function generateGeneration(seed: number): Generation {
  const r = seeded01(seed);
  const safety: SafetyStatus = r > 0.95 ? 'blocked' : r > 0.88 ? 'flagged' : 'safe';
  const promptIdx = Math.floor(seeded01(seed + 1) * PROMPTS.length);
  
  return {
    id: `gen_${Math.floor(seeded01(seed + 2) * 1000000).toString(36)}`,
    timestamp: new Date(Date.now() - seed * 12000),
    model: MODELS[Math.floor(seeded01(seed + 3) * MODELS.length)],
    prompt: PROMPTS[promptIdx],
    completion: safety === 'blocked' ? '[BLOCKED: Policy violation detected]' : COMPLETIONS[promptIdx],
    tokens: { 
      input: Math.floor(80 + seeded01(seed + 4) * 400), 
      output: Math.floor(100 + seeded01(seed + 5) * 600) 
    },
    latency: 0.3 + seeded01(seed + 6) * 3.5,
    cached: seeded01(seed + 7) > 0.85,
    safety,
    route: ROUTES[Math.floor(seeded01(seed + 8) * ROUTES.length)]
  };
}

function generateActivity(seed: number): ActivityEvent {
  const types: ActivityEvent['type'][] = ['model', 'tool', 'retrieval', 'blocked', 'error'];
  const type = types[Math.floor(seeded01(seed) * (seeded01(seed + 1) > 0.8 ? 5 : 3))];
  
  const messages: Record<ActivityEvent['type'], string[]> = {
    model: ['LLM generation completed', 'Model response cached', 'Streaming response started'],
    tool: ['Code executor invoked', 'API call completed', 'File system access'],
    retrieval: ['Vector search returned 5 docs', 'Knowledge base query', 'Context retrieved'],
    blocked: ['Prompt injection blocked', 'PII leak prevented', 'Rate limit exceeded'],
    error: ['Model timeout', 'Tool execution failed', 'Invalid API response']
  };
  
  return {
    id: `evt_${seed}`,
    type,
    message: messages[type][Math.floor(seeded01(seed + 2) * messages[type].length)],
    timestamp: new Date(Date.now() - seed * 3000)
  };
}

// Pre-generate deterministic data
const INITIAL_TRACES = Array.from({ length: 30 }, (_, i) => generateTrace(i));
const INITIAL_GENERATIONS = Array.from({ length: 15 }, (_, i) => generateGeneration(i));
const INITIAL_ACTIVITIES = Array.from({ length: 20 }, (_, i) => generateActivity(i));

const FEATURED_TRACES: Trace[] = [
  {
    ...generateTrace(201),
    id: 'trc_ragshield',
    model: 'gpt-5.2-pro',
    route: '/analysis',
    status: 'blocked',
    user: 'sec-bot',
    finding: 'Prompt injection tried to escalate tool scope using fake incident context referencing CFO payroll workbook.',
    guardDecision: 'Input guard denied instructions and forced allowlisted tools only.',
    remediation: 'Auto-opened PR to strip user instructions before model call.'
  },
  {
    ...generateTrace(202),
    id: 'trc_vec_spike',
    model: 'gemini-3-pro-preview',
    route: '/retrieval',
    status: 'success',
    user: 'analyst_mira',
    finding: 'Vector search pulled a stale SOC2 PDF; agent cited the wrong control version.',
    guardDecision: 'Context auditor flagged drift and recommended pinning doc version.',
    remediation: 'Issued cache-bust + version pin for compliance corpus.'
  },
  {
    ...generateTrace(203),
    id: 'trc_toolguard',
    model: 'gpt-5.1-codex-max',
    route: '/code-gen',
    status: 'error',
    user: 'ci-bot',
    finding: 'Tool execution sandbox rejected call to `terraform.apply()` because plan was unsigned.',
    guardDecision: 'Tool guard returned HARD FAIL with evidence hash mismatch.',
    remediation: 'Escalated to on-call to re-run plan with approval signature.'
  }
];

const FEATURED_GENERATIONS: Generation[] = [
  {
    ...generateGeneration(301),
    id: 'gen_pii_guard',
    model: 'gpt-5.2-pro',
    route: '/analysis',
    safety: 'flagged',
    issue: 'Model attempted to echo a customer phone number returned by `crm.lookup_customer`.',
    detectors: ['PII Oracle', 'Regex:phone_number'],
    actions: ['digits redacted in-stream', 'triage-pii-004 regression added'],
    evidence: ['tool://crm.lookup_customer#L45']
  },
  {
    ...generateGeneration(302),
    id: 'gen_prompt_injection',
    model: 'claude-opus-4-5-20251101',
    route: '/tickets',
    safety: 'blocked',
    issue: 'User tried to coerce the agent into emailing raw access tokens.',
    detectors: ['Prompt Firewall', 'ToolScope-Guard'],
    actions: ['request dropped', 'user session moved to review queue'],
    evidence: ['prompt://support/incident-55812']
  },
  {
    ...generateGeneration(303),
    id: 'gen_trace_compare',
    model: 'gemini-3-pro-preview',
    route: '/compare',
    safety: 'safe',
    issue: 'Agent summarized two traces and highlighted inconsistent token spend.',
    detectors: ['Spend Anomaly'],
    actions: ['authored diff comment', 'linked to trace `trc_vec_spike`'],
    evidence: ['trace://trc_vec_spike', 'trace://trc_ragshield']
  }
];

const DISPLAY_TRACES = [...FEATURED_TRACES, ...INITIAL_TRACES.slice(0, 12)];
const GENERATION_FEED = [...FEATURED_GENERATIONS, ...INITIAL_GENERATIONS.slice(0, 6)];

const VOLUME_BARS = Array.from({ length: 60 }, (_, i) => ({
  success: 40 + seeded01(i) * 55,
  error: seeded01(i + 100) > 0.85 ? 5 + seeded01(i + 101) * 15 : 0,
  time: `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`
}));

const SPARKLINE_DATA = {
  requests: [45, 52, 48, 61, 58, 72, 68, 85],
  latency: [520, 480, 510, 450, 420, 390, 410, 380],
  errors: [12, 8, 15, 6, 4, 3, 5, 2],
  cost: [35, 42, 38, 48, 52, 58, 62, 68]
};

const COST_BY_MODEL: CostModel[] = [
  { model: 'claude-opus-4-5-20251101', requests: 45230, tokens: 12500000, cost: 412.50, costPer1k: 0.033 },
  { model: 'gpt-5.2-pro', requests: 28100, tokens: 8200000, cost: 328.00, costPer1k: 0.040 },
  { model: 'gpt-5.1-codex-max', requests: 62400, tokens: 18900000, cost: 283.50, costPer1k: 0.015 },
  { model: 'gemini-3-pro-preview', requests: 31200, tokens: 9400000, cost: 141.00, costPer1k: 0.015 },
  { model: 'grok-4-1-fast-reasoning', requests: 18500, tokens: 5100000, cost: 76.50, costPer1k: 0.015 }
];

const DAILY_COSTS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  cost: 35 + seeded01(i) * 25 + (i > 20 ? 10 : 0),
  avg: 45 + (i / 30) * 8
}));

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const Sparkline = ({ data, color, height = 32 }: { data: number[]; color: string; height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="96" height={height} viewBox="0 0 100 100" preserveAspectRatio="none" className="opacity-60">
      <motion.polyline
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const [displayed, setDisplayed] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const startVal = displayed;
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(startVal + (value - startVal) * eased);
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <span>{prefix}{decimals > 0 ? displayed.toFixed(decimals) : Math.round(displayed).toLocaleString()}{suffix}</span>;
};

const StatusBadge = ({ status }: { status: TraceStatus | SafetyStatus }) => {
  const styles: Record<string, string> = {
    success: 'bg-[#f5f4f0]/10 text-[#f5f4f0]',
    safe: 'bg-[#f5f4f0]/10 text-[#f5f4f0]',
    error: 'bg-[#f87171]/10 text-[#f87171]',
    blocked: 'bg-[#f5f4f0]/10 text-[#f5f4f0]',
    flagged: 'bg-[#f5f4f0]/10 text-[#f5f4f0]'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles: Record<string, string> = {
    CRITICAL: 'bg-[#f87171]/20 text-[#f87171] animate-pulse',
    HIGH: 'bg-[#f87171]/10 text-[#f87171]',
    MEDIUM: 'bg-[#f5f4f0]/10 text-[#f5f4f0]',
    LOW: 'bg-[#f5f4f0b3]/10 text-[#f5f4f0b3]'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-tight ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const SpanTypeLabel = ({ type }: { type: Span['type'] }) => {
  const labels: Record<Span['type'], string> = {
    guard: 'GUARD',
    retrieval: 'RETRIEVAL',
    model: 'MODEL',
    tool: 'TOOL'
  };

  return <span className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wider font-medium">{labels[type]}</span>;
};

// ============================================================================
// TRACE DRILLDOWN MODAL
// ============================================================================

const TraceDrilldown = ({ trace, onClose }: { trace: Trace; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('Request');
  const totalDuration = trace.spans.reduce((sum, s) => Math.max(sum, s.start + s.duration), 0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[#181818]/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl bg-[#181818] border border-[#1f1f1f] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '75vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 border-b border-[#1f1f1f] bg-[#181818] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[14px] text-[#61afef]">{trace.id}</span>
            <StatusBadge status={trace.status} />
            <span className="text-[#f5f4f0b3] text-[12px]">{trace.model}</span>
            <span className="text-[#f5f4f0b3] text-[12px]">•</span>
            <span className="text-[#f5f4f0b3] text-[12px]">{trace.route}</span>
          </div>
          <button onClick={onClose} className="text-[#f5f4f0b3] hover:text-[#dbd7caee] transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Waterfall Timeline */}
          <div className="w-[340px] border-r border-[#2a2a2a] bg-[#0d0d0d] p-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] uppercase tracking-wider text-[#f5f4f0b3] font-medium">Execution Trace</h4>
              <span className="text-[11px] text-[#f5f4f0b3] font-mono">{Math.round(trace.duration)}ms total</span>
            </div>
            
            <div className="space-y-3">
              {trace.spans.map((span, i) => {
                const widthPercent = (span.duration / totalDuration) * 100;
                const leftPercent = (span.start / totalDuration) * 100;
                
                return (
                  <motion.div
                    key={span.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <SpanTypeLabel type={span.type} />
                      <span className="text-[12px] text-[#dbd7caee] font-medium flex-1">{span.name}</span>
                      <span className={`text-[10px] ${span.status === 'success' ? 'text-[#f5f4f0]' : span.status === 'blocked' ? 'text-[#f5f4f0]' : 'text-[#f87171]'}`}>
                        {span.status}
                      </span>
                    </div>
                    
                    {/* Timeline bar */}
                    <div className="h-6 bg-[#1a1a1a] rounded relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="absolute h-full rounded bg-[#3a3a3a]"
                        style={{ left: `${leftPercent}%` }}
                      />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-[10px] text-[#dbd7caee] font-mono">{Math.round(span.duration)}ms</span>
                      </div>
                    </div>
                    
                    {span.meta && (
                      <div className="mt-1 text-[10px] text-[#f5f4f0b3]">
                        {Object.entries(span.meta).map(([k, v]) => (
                          <span key={k} className="mr-3">{k}: <span className="text-[#dbd7caee]">{String(v)}</span></span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t border-[#2a2a2a] grid grid-cols-2 gap-3">
              <div className="bg-[#1a1a1a] rounded p-3">
                <div className="text-[10px] text-[#f5f4f0b3] uppercase mb-1">Tokens</div>
                <div className="text-[14px] text-[#dbd7caee] font-mono">
                  {trace.tokens.input.toLocaleString()} → {trace.tokens.output.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded p-3">
                <div className="text-[10px] text-[#f5f4f0b3] uppercase mb-1">Cost</div>
                <div className="text-[14px] text-[#dbd7caee] font-mono">${trace.cost.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* Right: Detail Tabs */}
          <div className="flex-1 bg-[#181818] flex flex-col overflow-hidden">
            <div className="flex border-b border-[#1f1f1f] shrink-0">
              {['Request', 'Response', 'Tools', 'Security', 'Meta'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-[12px] font-medium transition-colors border-b-2 ${
                    activeTab === tab 
                      ? 'border-[#f5f4f0] text-[#dbd7caee]' 
                      : 'border-transparent text-[#f5f4f0b3] hover:text-[#dbd7caee]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'Request' && (
                  <motion.div key="request" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <pre className="text-[12px] text-[#dbd7caee] font-mono whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(trace.request, null, 2)}
                    </pre>
                  </motion.div>
                )}
                
                {activeTab === 'Response' && (
                  <motion.div key="response" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <pre className="text-[12px] text-[#dbd7caee] font-mono whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(trace.response, null, 2)}
                    </pre>
                  </motion.div>
                )}
                
                {activeTab === 'Tools' && (
                  <motion.div key="tools" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {trace.spans.filter(s => s.type === 'tool').length > 0 ? (
                      trace.spans.filter(s => s.type === 'tool').map(span => (
                        <div key={span.id} className="bg-[#181818] border border-[#1f1f1f] rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <SpanTypeLabel type="tool" />
                            <span className="text-[13px] text-[#dbd7caee] font-medium">{span.name}</span>
                            <StatusBadge status={span.status} />
                          </div>
                          {span.meta && (
                            <pre className="text-[11px] text-[#f5f4f0b3] font-mono mt-2">
                              {JSON.stringify(span.meta, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-[#f5f4f0b3] text-[13px] italic">No tool calls in this trace.</div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === 'Security' && (
                  <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {trace.security.map((policy, i) => (
                      <div key={i} className="bg-[#181818] border border-[#1f1f1f] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] text-[#f5f4f0] font-medium">{policy.policy}</span>
                          <span className={`text-[12px] font-medium ${policy.result === 'PASSED' ? 'text-[#f5f4f0]' : 'text-[#f87171]'}`}>
                            {policy.result}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${policy.result === 'PASSED' ? 'bg-[#f5f4f0]' : 'bg-[#f87171]'}`}
                              style={{ width: `${policy.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-[#f5f4f0b3] font-mono">{(policy.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
                
                {activeTab === 'Meta' && (
                  <motion.div key="meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'User ID', value: trace.user },
                        { label: 'Route', value: trace.route },
                        { label: 'Model', value: trace.model },
                        { label: 'Timestamp', value: trace.timestamp.toISOString() },
                        { label: 'Duration', value: `${Math.round(trace.duration)}ms` },
                        { label: 'Status', value: trace.status.toUpperCase() }
                      ].map(item => (
                        <div key={item.label} className="bg-[#181818] border border-[#1f1f1f] rounded p-3">
                          <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide mb-1">{item.label}</div>
                          <div className="text-[13px] text-[#dbd7caee] font-mono">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ObservabilityDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [traceFilter, setTraceFilter] = useState<'all' | 'success' | 'error' | 'blocked'>('all');
  const [expandedGeneration, setExpandedGeneration] = useState<string | null>(null);
  const [costSort, setCostSort] = useState<'cost' | 'requests' | 'tokens'>('cost');
  const activityRef = useRef<HTMLDivElement>(null);

  const filteredTraces = useMemo(() => {
    if (traceFilter === 'all') return DISPLAY_TRACES;
    return DISPLAY_TRACES.filter(t => t.status === traceFilter);
  }, [traceFilter]);

  const sortedCostModels = useMemo(() => {
    return [...COST_BY_MODEL].sort((a, b) => b[costSort] - a[costSort]);
  }, [costSort]);

  const totalCost = COST_BY_MODEL.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="w-full bg-[#121212] border border-[#1a1a1a] rounded-xl overflow-hidden font-sans shadow-2xl relative flex flex-col" style={{ height: '650px' }}>
      {/* Trace Drilldown Overlay */}
      <AnimatePresence>
        {selectedTrace && (
          <TraceDrilldown trace={selectedTrace} onClose={() => setSelectedTrace(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="h-14 border-b border-[#1a1a1a] bg-[#121212] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="text-[14px] font-medium text-[#dbd7caee]">AI Observability</h3>
          </div>
          <div className="h-4 w-[1px] bg-[#1a1a1a]" />
          <div className="flex gap-1">
            {['Overview', 'Traces', 'Generations', 'Cost'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-[#1a1a1a] text-[#dbd7caee] shadow-sm' 
                    : 'text-[#f5f4f0b3] hover:text-[#dbd7caee] hover:bg-[#1a1a1a]/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="text-[12px] text-[#f5f4f0b3]">Last 24h</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ================================================================ */}
          {/* OVERVIEW TAB */}
          {/* ================================================================ */}
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full p-5 overflow-y-auto custom-scrollbar"
            >
              {/* Metric Cards */}
              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Total Requests', value: 2400000, prefix: '', suffix: '', trend: '+12%', up: true, spark: SPARKLINE_DATA.requests, color: '#f5f4f0' },
                  { label: 'Avg Latency', value: 420, prefix: '', suffix: 'ms', trend: '-8%', up: false, spark: SPARKLINE_DATA.latency, color: '#f5f4f0' },
                  { label: 'Error Rate', value: 0.04, prefix: '', suffix: '%', trend: '-15%', up: false, spark: SPARKLINE_DATA.errors, color: '#f5f4f0', decimals: 2 },
                  { label: 'Est. Cost', value: 1241.5, prefix: '$', suffix: '', trend: '+5%', up: true, spark: SPARKLINE_DATA.cost, color: '#f87171', decimals: 2 }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-[#181818] border border-[#1f1f1f] rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[11px] text-[#f5f4f0b3] uppercase tracking-wide">{stat.label}</div>
                      <div className={`text-[11px] font-mono ${stat.up && i !== 3 || !stat.up && i < 3 ? 'text-[#f5f4f0]' : 'text-[#f87171]'}`}>
                        {stat.trend}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-[26px] font-light text-[#dbd7caee]">
                        <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals || 0} />
                      </div>
                      <Sparkline data={stat.spark} color={stat.color} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5 mb-5">
                {/* Volume Chart */}
                <div className="col-span-2 bg-[#181818] border border-[#1f1f1f] rounded-lg p-4 flex flex-col" style={{ height: '240px' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] font-medium text-[#dbd7caee]">Request Volume</div>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-[11px] text-[#f5f4f0b3]">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Success
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#f5f4f0b3]">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Error
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-end gap-[2px] pb-6 relative" style={{ minHeight: '160px' }}>
                    {VOLUME_BARS.map((bar, i) => {
                      const successHeight = Math.round(bar.success * 1.5);
                      const errorHeight = Math.round(bar.error * 1.5);
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-[1px] group relative h-full">
                          {errorHeight > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: errorHeight, opacity: 1 }}
                              transition={{ 
                                duration: 0.8, 
                                delay: i * 0.02,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                              className="bg-[#ef4444] rounded-t-sm w-full"
                            />
                          )}
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: successHeight, opacity: 1 }}
                            transition={{ 
                              duration: 0.8, 
                              delay: i * 0.02 + 0.1,
                              ease: [0.22, 1, 0.36, 1]
                            }}
                            className="bg-[#22c55e] rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity w-full"
                          />
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded px-2 py-1 text-[10px] text-[#dbd7caee] whitespace-nowrap">
                              {bar.time}: {Math.round(bar.success + bar.error)} req
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Time axis */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-[#f5f4f0b3]">
                      {['00:00', '03:00', '06:00', '09:00', '12:00', '15:00'].map(t => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security Anomalies */}
                <div className="col-span-1 bg-[#181818] border border-[#1f1f1f] rounded-lg p-4 overflow-hidden flex flex-col" style={{ height: '240px' }}>
                  <div className="text-[13px] font-medium text-[#dbd7caee] mb-3 shrink-0">Security Anomalies</div>
                  <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
                    {[
                      { type: 'Prompt Injection', count: 12, severity: 'CRITICAL' },
                      { type: 'Jailbreak Attempt', count: 5, severity: 'CRITICAL' },
                      { type: 'PII Leakage', count: 4, severity: 'HIGH' },
                      { type: 'Token Spike', count: 8, severity: 'MEDIUM' },
                      { type: 'Rate Limit', count: 142, severity: 'LOW' }
                    ].map((item, i) => (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-2.5 bg-[#181818] rounded border border-[#1f1f1f] hover:border-[#2d2d2d] transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-[12px] text-[#dbd7caee] font-medium">{item.type}</div>
                          <div className="text-[10px] text-[#f5f4f0b3]">{item.count} events</div>
                        </div>
                        <SeverityBadge severity={item.severity} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Activity Feed */}
              <div className="bg-[#181818] border border-[#1f1f1f] rounded-lg p-4" style={{ height: '140px' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-medium text-[#dbd7caee]">Live Activity</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#f5f4f0b3]">Streaming</span>
                  </div>
                </div>
                <div ref={activityRef} className="space-y-1.5 overflow-y-auto custom-scrollbar" style={{ height: '80px' }}>
                  {INITIAL_ACTIVITIES.slice(0, 8).map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 text-[11px]"
                    >
                      <span className="text-[#f5f4f0b3] w-20 shrink-0 font-medium uppercase">{event.type}</span>
                      <span className="text-[#dbd7caee] flex-1 truncate">{event.message}</span>
                      <span className="text-[#f5f4f0b3] shrink-0">{formatRelativeTime(event.timestamp)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* TRACES TAB */}
          {/* ================================================================ */}
          {activeTab === 'Traces' && (
            <motion.div
              key="traces"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Toolbar */}
              <div className="h-12 border-b border-[#2a2a2a] flex items-center px-4 gap-4 bg-[#0d0d0d] shrink-0">
                <div className="flex items-center gap-2 bg-[#181818] border border-[#1f1f1f] rounded px-3 py-1.5 text-[12px] text-[#f5f4f0b3] w-56">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <span>Search traces...</span>
                </div>
                <div className="flex gap-1">
                  {(['all', 'success', 'error', 'blocked'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setTraceFilter(f)}
                      className={`px-3 py-1 text-[11px] rounded border transition-colors ${
                        traceFilter === f
                          ? 'border-[#f5f4f0]/40 bg-[#f5f4f0]/10 text-[#f5f4f0]'
                          : 'border-[#1f1f1f] text-[#f5f4f0b3] hover:text-[#dbd7caee] hover:bg-[#181818]'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      {f !== 'all' && (
                        <span className="ml-1.5 opacity-60">
                          ({DISPLAY_TRACES.filter(t => t.status === f).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-12 bg-[#181818] text-[11px] uppercase tracking-wider text-[#f5f4f0b3] font-medium px-4 py-2.5 border-b border-[#1f1f1f] shrink-0">
                  <div className="col-span-2">Trace ID</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Route</div>
                  <div className="col-span-2">Model</div>
                  <div className="col-span-2">Latency</div>
                  <div className="col-span-1">Tokens</div>
                  <div className="col-span-1">Cost</div>
                  <div className="col-span-1 text-right">Time</div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#1a1a1a]">
                  {filteredTraces.map((trace, i) => (
                    <motion.div
                      key={trace.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => setSelectedTrace(trace)}
                      className="grid grid-cols-12 px-4 py-3 items-center hover:bg-[#181818] transition-colors cursor-pointer group"
                    >
                      <div className="col-span-2 font-mono text-[12px] text-[#61afef] group-hover:underline">{trace.id}</div>
                      <div className="col-span-1"><StatusBadge status={trace.status} /></div>
                      <div className="col-span-2 text-[12px] text-[#f5f4f0]">{trace.route}</div>
                      <div className="col-span-2 text-[12px] text-[#f5f4f0]">{trace.model}</div>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(trace.duration / 30, 100)}%` }}
                            className="h-full rounded-full bg-[#f5f4f0]"
                          />
                        </div>
                        <span className="text-[11px] text-[#f5f4f0] font-mono">{Math.round(trace.duration)}ms</span>
                      </div>
                      <div className="col-span-1 text-[11px] text-[#f5f4f0] font-mono">
                        {(trace.tokens.input + trace.tokens.output).toLocaleString()}
                      </div>
                      <div className="col-span-1 text-[11px] text-[#f5f4f0] font-mono">${trace.cost.toFixed(3)}</div>
                      <div className="col-span-1 text-[11px] text-[#f5f4f0] text-right">{formatRelativeTime(trace.timestamp)}</div>
                      {(trace.finding || trace.guardDecision || trace.remediation) && (
                        <div className="col-span-12 mt-2 text-[11px] text-[#f5f4f0] flex flex-wrap gap-x-6 gap-y-1 leading-snug">
                          {trace.finding && (
                            <span>
                              <span className="text-[#f5f4f099] uppercase tracking-wide mr-2">Finding</span>
                              {trace.finding}
                            </span>
                          )}
                          {trace.guardDecision && (
                            <span>
                              <span className="text-[#f5f4f099] uppercase tracking-wide mr-2">Guardrail</span>
                              {trace.guardDecision}
                            </span>
                          )}
                          {trace.remediation && (
                            <span>
                              <span className="text-[#f5f4f099] uppercase tracking-wide mr-2">Action</span>
                              {trace.remediation}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* GENERATIONS TAB */}
          {/* ================================================================ */}
          {activeTab === 'Generations' && (
            <motion.div
              key="generations"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Stats Bar */}
              <div className="h-16 border-b border-[#1f1f1f] bg-[#181818] px-5 flex items-center gap-8 shrink-0">
                {[
                  { label: 'Total (24h)', value: '12,450' },
                  { label: 'Avg Tokens', value: '485' },
                  { label: 'Cache Hit', value: '23%' },
                  { label: 'Interventions', value: '0.8%' }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide">{stat.label}</div>
                    <div className="text-[18px] text-[#dbd7caee] font-light">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Generation Feed */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                {GENERATION_FEED.map((gen, i) => {
                  const isExpanded = expandedGeneration === gen.id;
                  
                  return (
                    <motion.div
                      key={gen.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#181818] border border-[#1f1f1f] rounded-lg overflow-hidden"
                    >
                      {/* Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-[#1a1a1a]/50 transition-colors"
                        onClick={() => setExpandedGeneration(isExpanded ? null : gen.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-[#f5f4f0b3] bg-[#181818] px-2 py-1 rounded">{gen.model}</span>
                            <span className="text-[11px] text-[#f5f4f0b3]">{gen.route}</span>
                            {gen.cached && (
                              <span className="text-[10px] text-[#61afef] bg-[#61afef]/10 px-1.5 py-0.5 rounded">CACHED</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={gen.safety} />
                            <span className="text-[11px] text-[#f5f4f0b3]">{formatRelativeTime(gen.timestamp)}</span>
                            <svg 
                              className={`w-4 h-4 text-[#f5f4f0b3] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="text-[13px] text-[#dbd7caee] line-clamp-1">{gen.prompt}</div>
                        
                        {gen.issue && (
                          <p className="text-[11px] text-[#f5f4f0] mt-2">{gen.issue}</p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-3 text-[11px] text-[#f5f4f0b3]">
                          <span>↓ {gen.tokens.input} → ↑ {gen.tokens.output} tokens</span>
                          <span>{gen.latency.toFixed(2)}s</span>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-[#2a2a2a]"
                          >
                            <div className="p-4 space-y-4">
                              <div>
                                <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide mb-2">Prompt</div>
                                <div className="bg-[#181818] rounded p-3 text-[12px] text-[#dbd7caee] font-mono leading-relaxed">
                                  {gen.prompt}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide mb-2">Completion</div>
                                <div className={`bg-[#181818] rounded p-3 text-[12px] font-mono leading-relaxed ${
                                  gen.safety === 'blocked' ? 'text-[#f87171]' : 'text-[#f5f4f0]'
                                }`}>
                                  {gen.completion}
                                </div>
                              </div>
                              {gen.detectors && gen.detectors.length > 0 && (
                                <div>
                                  <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide mb-2">Detectors</div>
                                  <div className="flex flex-wrap gap-2">
                                    {gen.detectors.map(detector => (
                                      <span key={detector} className="px-2 py-0.5 rounded-full bg-[#1f1f1f] text-[11px] text-[#f5f4f0]">
                                        {detector}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {gen.actions && gen.actions.length > 0 && (
                                <div>
                                  <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide mb-2">Actions Taken</div>
                                  <ul className="list-disc list-inside text-[12px] text-[#f5f4f0] space-y-1">
                                    {gen.actions.map(action => (
                                      <li key={action}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {gen.evidence && gen.evidence.length > 0 && (
                                <div>
                                  <div className="text-[10px] text-[#f5f4f0b3] uppercase tracking-wide mb-2">Evidence</div>
                                  <div className="flex flex-wrap gap-2">
                                    {gen.evidence.map(item => (
                                      <span key={item} className="px-2 py-0.5 rounded bg-[#1f1f1f] text-[11px] text-[#f5f4f0] font-mono">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-[#181818] border border-[#1f1f1f] rounded text-[11px] text-[#f5f4f0b3] hover:text-[#dbd7caee] hover:border-[#2d2d2d] transition-colors">
                                  Open in Playground
                                </button>
                                <button className="px-3 py-1.5 bg-[#181818] border border-[#1f1f1f] rounded text-[11px] text-[#f5f4f0b3] hover:text-[#dbd7caee] hover:border-[#2d2d2d] transition-colors">
                                  View Trace
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* COST TAB */}
          {/* ================================================================ */}
          {activeTab === 'Cost' && (
            <motion.div
              key="cost"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto custom-scrollbar p-5"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Total Spend (MTD)', value: `$${totalCost.toFixed(2)}`, sub: '+12% vs last month', subColor: 'text-[#f87171]' },
                  { label: 'Projected Monthly', value: '$1,580.00', sub: 'Based on current rate', subColor: 'text-[#f5f4f0b3]' },
                  { label: 'Daily Average', value: '$52.25', sub: 'Last 7 days', subColor: 'text-[#f5f4f0b3]' },
                  { label: 'Budget Remaining', value: '$754.50', sub: '38% of $2,000', subColor: 'text-[#f5f4f0]', progress: 62 }
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 bg-[#181818] border border-[#1f1f1f] rounded-lg"
                  >
                    <div className="text-[11px] text-[#f5f4f0b3] uppercase tracking-wide mb-2">{card.label}</div>
                    <div className="text-[24px] text-[#dbd7caee] font-light mb-1">{card.value}</div>
                    {card.progress !== undefined && (
                      <div className="h-1.5 bg-[#181818] rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${card.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-[#f5f4f0] rounded-full"
                        />
                      </div>
                    )}
                    <div className={`text-[11px] ${card.subColor}`}>{card.sub}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                {/* Cost by Provider */}
                <div className="bg-[#181818] border border-[#1f1f1f] rounded-lg p-4">
                  <div className="text-[13px] font-medium text-[#dbd7caee] mb-4">Cost by Provider</div>
                  <div className="space-y-3">
                    {[
                      { name: 'OpenAI', cost: 695, color: '#98c379' },
                      { name: 'Anthropic', cost: 404, color: '#f5f4f0' },
                      { name: 'Google', cost: 141, color: '#61afef' }
                    ].map((provider, i) => (
                      <div key={provider.name} className="flex items-center gap-3">
                        <div className="w-20 text-[12px] text-[#dbd7caee]">{provider.name}</div>
                        <div className="flex-1 h-3 bg-[#181818] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(provider.cost / 700) * 100}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: provider.color }}
                          />
                        </div>
                        <div className="w-20 text-right text-[12px] text-[#dbd7caee] font-mono">${provider.cost.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Trend */}
                <div className="bg-[#181818] border border-[#1f1f1f] rounded-lg p-4">
                  <div className="text-[13px] font-medium text-[#dbd7caee] mb-4">Daily Spend (30d)</div>
                  <div className="h-[100px] flex items-end gap-[2px]">
                    {DAILY_COSTS.map((day, i) => (
                      <div key={day.day} className="flex-1 flex flex-col justify-end group relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.cost / 70) * 100}%` }}
                          transition={{ duration: 0.4, delay: i * 0.01 }}
                          className="bg-[#61afef] rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded px-1.5 py-0.5 text-[9px] text-[#dbd7caee] whitespace-nowrap">
                            Day {day.day}: ${day.cost.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost by Model Table */}
              <div className="bg-[#181818] border border-[#1f1f1f] rounded-lg overflow-hidden mb-5">
                <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div className="text-[13px] font-medium text-[#dbd7caee]">Cost by Model</div>
                  <div className="flex gap-1">
                    {(['cost', 'requests', 'tokens'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setCostSort(s)}
                        className={`px-2 py-1 text-[10px] rounded transition-colors ${
                          costSort === s ? 'bg-[#1a1a1a] text-[#dbd7caee]' : 'text-[#f5f4f0b3] hover:text-[#dbd7caee]'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full">
                  <thead className="text-[11px] uppercase tracking-wider text-[#f5f4f0b3]">
                    <tr className="border-b border-[#2a2a2a]">
                      <th className="px-4 py-2 text-left font-medium">Model</th>
                      <th className="px-4 py-2 text-right font-medium">Requests</th>
                      <th className="px-4 py-2 text-right font-medium">Tokens</th>
                      <th className="px-4 py-2 text-right font-medium">Cost</th>
                      <th className="px-4 py-2 text-right font-medium">$/1k</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {sortedCostModels.map((model, i) => (
                      <motion.tr
                        key={model.model}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`hover:bg-[#181818] transition-colors ${i === 0 ? 'bg-[#f5f4f0]/5' : ''}`}
                      >
                        <td className="px-4 py-2.5 text-[12px] text-[#dbd7caee]">
                          {model.model}
                          {i === 0 && <span className="ml-2 text-[9px] text-[#f5f4f0] uppercase">Highest</span>}
                        </td>
                        <td className="px-4 py-2.5 text-[12px] text-[#f5f4f0b3] font-mono text-right">{model.requests.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-[12px] text-[#f5f4f0b3] font-mono text-right">{(model.tokens / 1000000).toFixed(1)}M</td>
                        <td className="px-4 py-2.5 text-[12px] text-[#dbd7caee] font-mono text-right">${model.cost.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-[12px] text-[#f5f4f0b3] font-mono text-right">${model.costPer1k.toFixed(3)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Optimization Tips */}
              <div className="bg-[#181818] border border-[#1f1f1f] rounded-lg p-4">
                <div className="text-[13px] font-medium text-[#dbd7caee] mb-3">Optimization Opportunities</div>
                <div className="space-y-2">
                  {[
                    { tip: 'Switch /analysis route from gpt-5.2-pro to gemini-3-flash-preview', savings: '$45/day' },
                    { tip: 'Enable caching for /summarize endpoint', savings: '$28/day' },
                    { tip: 'Reduce max_tokens for /chat from 2048 to 1024', savings: '$15/day' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-[#181818] rounded border border-[#1f1f1f]"
                    >
                      <span className="text-[12px] text-[#dbd7caee]">{item.tip}</span>
                      <span className="text-[12px] text-[#f5f4f0] font-medium">Save ~{item.savings}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
