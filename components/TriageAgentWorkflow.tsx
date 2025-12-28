'use client';

import type { JSX } from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Vitesse Dark syntax highlighting colors (exact match from spec)
const SYNTAX = {
  keyword: '#4d9375',       // Sage/olive green for keywords (const, let, function, if, import, export)
  variable: '#dbd7caee',    // Warm cream for variables and identifiers
  string: '#c98a7d',        // Terracotta/muted coral for strings
  function: '#dcdcaa',      // Soft yellow for function names
  method: '#80a665',        // Lighter olive green for methods
  comment: '#758575',       // Gray-green, muted for comments
  number: '#4c9a91',        // Teal/cyan for numbers
  punctuation: '#858585',   // Medium gray for punctuation
  operator: '#cb7676',      // Soft red for operators
  plain: '#dbd7caee',       // Warm cream for default text
  property: '#b8a965',      // Muted gold/olive for properties
  global: '#dbd7caee',      // Same as foreground for globals like document
  interpolation: '#bd976a', // Warm brown for template interpolation
};

// Tokenize code for syntax highlighting (Vitesse Dark style)
function tokenize(code: string): { text: string; color: string }[] {
  const tokens: { text: string; color: string }[] = [];
  let match;

  // First pass: identify all tokens with their positions
  const allTokens: { start: number; end: number; text: string; color: string }[] = [];

  // Comments (Python # and JS //)
  const commentRegex = /(\/\/.*$|#.*$)/gm;
  while ((match = commentRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX.comment });
  }

  // Strings (terracotta/coral)
  const stringRegex = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  while ((match = stringRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX.string });
  }

  // Keywords (sage/olive green) - const, let, function, if, etc.
  const keywordRegex = /\b(import|export|from|const|let|var|function|async|await|return|if|else|throw|new|try|catch|for|while|class|extends|interface|type|def|true|false|None|private|public|self)\b/g;
  while ((match = keywordRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX.keyword });
  }

  // Operators (soft red)
  const operatorRegex = /(=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/<>=!])/g;
  while ((match = operatorRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX.operator });
  }

  // Globals like document, window (same as foreground)
  const globalRegex = /\b(document|window|console|Math|JSON|Object|Array|String|Number|Boolean|Promise|Error)\b/g;
  while ((match = globalRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX.global });
  }

  // Class names and types (warm cream) - PascalCase words
  const classRegex = /\b([A-Z][a-zA-Z0-9]*)\b/g;
  while ((match = classRegex.exec(code)) !== null) {
    const text = match[1];
    if (!['None', 'True', 'False'].includes(text)) {
      allTokens.push({ start: match.index, end: match.index + text.length, text, color: SYNTAX.variable });
    }
  }

  // Method calls (lighter olive green) - after dot, before paren
  const methodRegex = /\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  while ((match = methodRegex.exec(code)) !== null) {
    const start = match.index + 1; // skip the dot
    allTokens.push({ start, end: start + match[1].length, text: match[1], color: SYNTAX.method });
  }

  // Standalone function calls (soft yellow)
  const standaloneFuncRegex = /\b([a-z_][a-zA-Z0-9_]*)\s*\(/g;
  while ((match = standaloneFuncRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[1].length, text: match[1], color: SYNTAX.function });
  }

  // Object properties after dot (muted gold/olive)
  const propRegex = /\.([a-zA-Z_][a-zA-Z0-9_]*)(?!\s*\()/g;
  while ((match = propRegex.exec(code)) !== null) {
    const start = match.index + 1;
    allTokens.push({ start, end: start + match[1].length, text: match[1], color: SYNTAX.property });
  }

  // Numbers (teal/cyan)
  const numberRegex = /\b\d+\.?\d*\b/g;
  while ((match = numberRegex.exec(code)) !== null) {
    allTokens.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX.number });
  }

  // Sort by position and remove overlaps
  allTokens.sort((a, b) => a.start - b.start);
  
  // Build result
  let pos = 0;
  for (const token of allTokens) {
    if (token.start > pos) {
      tokens.push({ text: code.slice(pos, token.start), color: SYNTAX.plain });
    }
    if (token.start >= pos) {
      tokens.push({ text: token.text, color: token.color });
      pos = token.end;
    }
  }
  if (pos < code.length) {
    tokens.push({ text: code.slice(pos), color: SYNTAX.plain });
  }

  return tokens.length > 0 ? tokens : [{ text: code, color: SYNTAX.plain }];
}

// Task queue items
interface Task {
  id: string;
  name: string;
  status: 'generating' | 'ready';
  additions: number;
  deletions: number;
  time?: string;
}

// Code file with syntax-highlighted content
interface CodeFile {
  name: string;
  lines: { num: number; type: 'add' | 'remove' | 'context'; code: string }[];
}

// Scenario definition
interface Scenario {
  id: string;
  title: string;
  userQuery: string;
  model: string;
  files: CodeFile[];
  agentMessages: string[];
  retrievals: { source: string; section: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'prompt-injection',
    title: 'Prompt Injection Detection',
    userQuery: 'Fix the security vulnerability where user input bypasses the system prompt in tool arguments.',
    model: 'Opus 4.5',
    files: [
      {
        name: 'security/validators.ts',
        lines: [
          { num: 1, type: 'context', code: "import React, { useState, useEffect } from 'react';" },
          { num: 2, type: 'context', code: "import { ToolRunner, RequestContext } from '../runtime';" },
          { num: 3, type: 'context', code: "import { auditLog } from './logging';" },
          { num: 4, type: 'add', code: "import { sanitizeInput, detectInjection } from './guards';" },
          { num: 5, type: 'context', code: '' },
          { num: 6, type: 'context', code: 'export class SecurityValidator {' },
          { num: 7, type: 'context', code: '  private toolRunner: ToolRunner;' },
          { num: 8, type: 'context', code: '  private config: ValidatorConfig;' },
          { num: 9, type: 'context', code: '' },
          { num: 10, type: 'context', code: '  constructor(runner: ToolRunner) {' },
          { num: 11, type: 'context', code: '    this.toolRunner = runner;' },
          { num: 12, type: 'context', code: '  }' },
          { num: 13, type: 'context', code: '' },
          { num: 14, type: 'remove', code: '  async executeToolCall(input: string) {' },
          { num: 14, type: 'add', code: '  async executeToolCall(input: string, context: RequestContext) {' },
          { num: 15, type: 'add', code: '    if (detectInjection(input, context)) {' },
          { num: 16, type: 'add', code: "      auditLog.record('injection_blocked', { input, context });" },
          { num: 17, type: 'add', code: "      throw new SecurityError('Injection attempt blocked');" },
          { num: 18, type: 'add', code: '    }' },
          { num: 19, type: 'add', code: '    const sanitized = sanitizeInput(input);' },
          { num: 20, type: 'remove', code: '    return this.toolRunner.execute(input);' },
          { num: 20, type: 'add', code: '    return this.toolRunner.execute(sanitized);' },
          { num: 21, type: 'context', code: '  }' },
          { num: 22, type: 'context', code: '}' },
        ],
      },
      {
        name: 'config/security.yaml',
        lines: [
          { num: 1, type: 'context', code: '# Security configuration for Triage' },
          { num: 2, type: 'context', code: 'version: 2.0' },
          { num: 3, type: 'context', code: '' },
          { num: 4, type: 'context', code: 'runtime:' },
          { num: 5, type: 'context', code: '  timeout_ms: 30000' },
          { num: 6, type: 'context', code: '  max_retries: 3' },
          { num: 7, type: 'context', code: '' },
          { num: 8, type: 'context', code: 'security:' },
          { num: 9, type: 'add', code: '  injection_detection: true' },
          { num: 10, type: 'add', code: '  pattern_matching: strict' },
          { num: 11, type: 'add', code: '  audit_logging: enabled' },
          { num: 12, type: 'context', code: '  rate_limiting: true' },
          { num: 13, type: 'context', code: '  max_tokens: 4096' },
        ],
      },
    ],
    agentMessages: [
      'I\'ll add input validation to prevent prompt injection attacks in the tool execution path.',
      'Now updating the security configuration to enable injection detection and audit logging.',
      'Done. Tool execution now validates inputs against known injection patterns before processing.',
    ],
    retrievals: [
      { source: 'OWASP Top 10 LLMs', section: 'LLM01: Prompt Injection' },
      { source: 'Internal Security Policy', section: 'Section 3.2: Input Validation' },
    ],
  },
  {
    id: 'data-exfiltration',
    title: 'Data Exfiltration Prevention',
    userQuery: 'The model is leaking PII through tool call responses. Add output filtering to prevent sensitive data from being returned.',
    model: 'GPT 5.2',
    files: [
      {
        name: 'security/output_filter.py',
        lines: [
          { num: 1, type: 'context', code: 'from typing import Any, Dict, List, Optional' },
          { num: 2, type: 'context', code: 'from dataclasses import dataclass' },
          { num: 3, type: 'add', code: 'from .pii_detector import PIIDetector' },
          { num: 4, type: 'add', code: 'from .redaction import RedactionEngine' },
          { num: 5, type: 'context', code: '' },
          { num: 6, type: 'context', code: '@dataclass' },
          { num: 7, type: 'context', code: 'class FilterConfig:' },
          { num: 8, type: 'context', code: '    strict_mode: bool = True' },
          { num: 9, type: 'context', code: '    log_detections: bool = True' },
          { num: 10, type: 'context', code: '' },
          { num: 11, type: 'context', code: 'class OutputFilter:' },
          { num: 12, type: 'context', code: '    def __init__(self, config: FilterConfig):' },
          { num: 13, type: 'context', code: '        self.config = config' },
          { num: 14, type: 'add', code: '        self.pii_detector = PIIDetector()' },
          { num: 15, type: 'add', code: '        self.redactor = RedactionEngine()' },
          { num: 16, type: 'context', code: '' },
          { num: 17, type: 'remove', code: '    def process(self, output: str) -> str:' },
          { num: 17, type: 'add', code: '    def process(self, output: str, context: RequestContext) -> str:' },
          { num: 18, type: 'remove', code: '        return output' },
          { num: 18, type: 'add', code: '        pii_matches = self.pii_detector.scan(output)' },
          { num: 19, type: 'add', code: '        if pii_matches:' },
          { num: 20, type: 'add', code: '            self.audit_log.record("pii_detected", pii_matches)' },
          { num: 21, type: 'add', code: '            return self.redactor.redact(output, pii_matches)' },
          { num: 22, type: 'add', code: '        return output' },
        ],
      },
      {
        name: 'security/pii_patterns.yaml',
        lines: [
          { num: 1, type: 'context', code: '# PII Detection Patterns' },
          { num: 2, type: 'context', code: 'version: 1.0' },
          { num: 3, type: 'context', code: '' },
          { num: 4, type: 'context', code: 'patterns:' },
          { num: 5, type: 'add', code: '  ssn: "\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b"' },
          { num: 6, type: 'add', code: '  credit_card: "\\\\b\\\\d{4}[- ]?\\\\d{4}[- ]?\\\\d{4}[- ]?\\\\d{4}\\\\b"' },
          { num: 7, type: 'add', code: '  email: "\\\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Z|a-z]{2,}\\\\b"' },
          { num: 8, type: 'add', code: '  phone: "\\\\b\\\\d{3}[-.\\\\s]?\\\\d{3}[-.\\\\s]?\\\\d{4}\\\\b"' },
          { num: 9, type: 'context', code: '' },
          { num: 10, type: 'context', code: 'actions:' },
          { num: 11, type: 'add', code: '  default: redact' },
          { num: 12, type: 'add', code: '  ssn: block' },
          { num: 13, type: 'context', code: '  severity: high' },
        ],
      },
    ],
    agentMessages: [
      'I\'ll add PII detection and redaction to the output filter to prevent data exfiltration.',
      'Let me also add the PII pattern definitions for common sensitive data types.',
      'Done. Output responses now scan for PII patterns and redact or block sensitive data.',
    ],
    retrievals: [
      { source: 'OWASP Top 10 LLMs', section: 'LLM06: Sensitive Information Disclosure' },
      { source: 'Data Protection Policy', section: 'PII Handling Requirements' },
    ],
  },
];

const TASKS: Task[] = [
  { id: '1', name: 'Prompt Injection Scan', status: 'generating', additions: 0, deletions: 0 },
  { id: '2', name: 'Tool Permission Audit', status: 'generating', additions: 0, deletions: 0 },
  { id: '3', name: 'RAG Boundary Check', status: 'generating', additions: 0, deletions: 0 },
  { id: '4', name: 'Output Sanitization', status: 'generating', additions: 0, deletions: 0 },
];

const COMPLETED_TASKS: Task[] = [
  { id: '5', name: 'PII Leakage Fix', status: 'ready', additions: 47, deletions: 12, time: 'now' },
  { id: '6', name: 'Input Validation Rules', status: 'ready', additions: 23, deletions: 5, time: '15m' },
  { id: '7', name: 'Token Limit Guards', status: 'ready', additions: 31, deletions: 8, time: '45m' },
];

const AVAILABLE_MODELS = [
  'Opus 4.5',
  'GPT 5.2',
  'Gemini 3.0 Flash',
  'Claude Sonnet 4',
  'GPT 5.1 Codex',
];

export function TriageAgentWorkflow(): JSX.Element {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<'thinking' | 'retrieving' | 'coding' | 'complete'>('thinking');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [visibleRetrievals, setVisibleRetrievals] = useState(0);
  const [visibleFileIndex, setVisibleFileIndex] = useState(0);
  const [visibleLineIndex, setVisibleLineIndex] = useState(0);
  const [activeFileTab, setActiveFileTab] = useState(0);
  const [thinkingText, setThinkingText] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Agent count and model selection state
  const [agentCount, setAgentCount] = useState(1);
  const [selectedModels, setSelectedModels] = useState<string[]>(['Opus 4.5']);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  
  // Update selected models when agent count changes
  const handleAgentCountChange = (count: number) => {
    setAgentCount(count);
    setSelectedModels(prev => {
      const newModels = [...prev];
      while (newModels.length < count) {
        newModels.push(AVAILABLE_MODELS[newModels.length % AVAILABLE_MODELS.length]);
      }
      return newModels.slice(0, count);
    });
  };
  
  const handleModelChange = (index: number, model: string) => {
    setSelectedModels(prev => {
      const newModels = [...prev];
      newModels[index] = model;
      return newModels;
    });
  };

  // Terminal test output lines for each scenario - aligned with Vitesse theme
  const TERMINAL_OUTPUTS: Record<string, string[]> = {
    'prompt-injection': [
      '(venv) triage@dev ~/security % npm run test:security',
      '',
      '> triage@1.0.0 test:security',
      '> jest --testPathPattern=security',
      '',
      ' RUNS  tests/security/validators.test.ts',
      '',
      '  SecurityValidator',
      '    ✓ should detect injection in tool arguments (45ms)',
      '    ✓ should allow clean input through (12ms)',
      '    ✓ should log blocked attempts to audit (8ms)',
      '    ✓ should sanitize partial injection attempts (23ms)',
      '',
      ' PASS  tests/security/validators.test.ts',
      '',
      'Test Suites: 1 passed, 1 total',
      'Tests:       4 passed, 4 total',
      'Time:        2.341s',
      '',
      '(venv) triage@dev ~/security % ',
    ],
    'data-exfiltration': [
      '(venv) triage@dev ~/security % python -m pytest tests/security/ -v',
      '',
      'collected 5 items',
      '',
      'test_output_filter.py::test_detects_email_pii PASSED',
      'test_output_filter.py::test_detects_ssn_pii PASSED',
      'test_output_filter.py::test_redacts_detected_pii PASSED',
      'test_output_filter.py::test_logs_pii_detections PASSED',
      'test_output_filter.py::test_allows_clean_output PASSED',
      '',
      '========================= 5 passed in 1.23s =========================',
      '',
      '(venv) triage@dev ~/security % ',
    ],
  };

  const scenario = SCENARIOS[scenarioIndex];

  // Autoscroll chat when any content changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleMessages, thinkingText, visibleRetrievals, phase]);

  // Terminal test output animation - starts during coding phase
  useEffect(() => {
    if (phase !== 'coding' && phase !== 'complete') {
      setTerminalLines([]);
      return;
    }

    // Delay start slightly so terminal appears after some code is written
    const startDelay = phase === 'coding' ? 2000 : 0;
    
    const timeout = setTimeout(() => {
      const outputs = TERMINAL_OUTPUTS[scenario.id] || TERMINAL_OUTPUTS['prompt-injection'];
      let lineIndex = 0;
      setTerminalLines([]);

      const interval = setInterval(() => {
        if (lineIndex < outputs.length) {
          setTerminalLines(prev => [...prev, outputs[lineIndex]]);
          lineIndex++;
        } else {
          clearInterval(interval);
        }
      }, 120);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [phase, scenario.id]);

  // Autoscroll terminal - instant scroll for better feel
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);
  const fileDiffCounts = useMemo(() => {
    return scenario.files.map((f) => {
      const additions = f.lines.filter((l) => l.type === 'add').length;
      const deletions = f.lines.filter((l) => l.type === 'remove').length;
      return { additions, deletions };
    });
  }, [scenario.files]);

  // Animation sequence
  useEffect(() => {
    let mounted = true;
    
    const runSequence = async () => {
      // Reset state
      setPhase('thinking');
      setVisibleMessages(0);
      setVisibleRetrievals(0);
      setVisibleFileIndex(0);
      setVisibleLineIndex(0);
      setActiveFileTab(0);
      setThinkingText('Thinking');

      await new Promise(r => setTimeout(r, 1500));
      if (!mounted) return;

      // Retrieving phase
      setPhase('retrieving');
      setThinkingText('');
      
      for (let i = 0; i < scenario.retrievals.length; i++) {
        await new Promise(r => setTimeout(r, 800));
        if (!mounted) return;
        setVisibleRetrievals(i + 1);
      }

      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      // Coding phase
      setPhase('coding');
      
      for (let fileIdx = 0; fileIdx < scenario.files.length; fileIdx++) {
        setVisibleFileIndex(fileIdx);
        setActiveFileTab(fileIdx);
        setVisibleLineIndex(0);
        
        // Show message for this file
        if (fileIdx < scenario.agentMessages.length) {
          setVisibleMessages(fileIdx + 1);
        }
        
        await new Promise(r => setTimeout(r, 600));
        if (!mounted) return;

        // Animate lines one by one
        const file = scenario.files[fileIdx];
        for (let lineIdx = 0; lineIdx < file.lines.length; lineIdx++) {
          setVisibleLineIndex(lineIdx + 1);
          await new Promise(r => setTimeout(r, 120));
          if (!mounted) return;
        }

        await new Promise(r => setTimeout(r, 800));
        if (!mounted) return;
      }

      // Final message
      setVisibleMessages(scenario.agentMessages.length);
      setPhase('complete');

      await new Promise(r => setTimeout(r, 5000));
      if (!mounted) return;

      // Next scenario
      setScenarioIndex(prev => (prev + 1) % SCENARIOS.length);
    };

    runSequence();
    return () => { mounted = false; };
  }, [scenarioIndex]);

  return (
    <div className="relative w-full h-[400px] md:h-[650px]">
      {/* Main Window */}
      <div className="absolute inset-0 bg-[#121212] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col font-sans">
        {/* Window Chrome */}
        <div className="h-10 bg-[#121212] border-b border-[#1a1a1a] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#cb7676]" />
            <div className="w-3 h-3 rounded-full bg-[#e6cc77]" />
            <div className="w-3 h-3 rounded-full bg-[#4d9375]" />
          </div>
          <span className="text-[13px] text-[#dbd7caee]">Triage</span>
          <div className="w-20" /> {/* Spacer for symmetry */}
        </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Task Queue - Hidden on mobile */}
        <div className="hidden md:flex w-[240px] bg-[#121212] border-r border-[#1a1a1a] flex-col text-[13px]">
          {/* In Progress */}
          <div className="p-3 border-b border-[#1a1a1a]">
            <div className="text-[11px] font-semibold text-[#dbd7caee] uppercase tracking-wide mb-3">
              In Progress {TASKS.length}
            </div>
            <div className="space-y-1">
              {TASKS.map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-[#1a1a1a] cursor-pointer">
                  <div className="mt-0.5">
                    <svg className="w-4 h-4 text-[#758575] animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#dbd7caee] truncate">{task.name}</div>
                    <div className="text-[11px] text-[#758575]">Generating</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready for Review */}
          <div className="p-3 flex-1">
            <div className="text-[11px] font-semibold text-[#dbd7caee] uppercase tracking-wide mb-3">
              Ready for Review {COMPLETED_TASKS.length}
            </div>
            <div className="space-y-1">
              {COMPLETED_TASKS.map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-[#1a1a1a] cursor-pointer">
                  <div className="mt-0.5">
                    <svg className="w-4 h-4 text-[#4d9375]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#dbd7caee] truncate flex items-center gap-2">
                      {task.name}
                      <span className="text-[11px] text-[#758575]">{task.time}</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-[#4d9375]">+{task.additions}</span>
                      <span className="text-[#758575]"> </span>
                      <span className="text-[#cb7676]">-{task.deletions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: Agent Chat */}
        <div className="flex-1 flex flex-col bg-[#121212] md:border-r border-[#1a1a1a] min-w-0 md:min-w-[360px]">
          {/* Title */}
          <div className="h-12 border-b border-[#1a1a1a] flex items-center px-5">
            <span className="text-[15px] font-medium text-[#dbd7caee]">{scenario.title}</span>
          </div>

          {/* Chat Content */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
            {/* User Query */}
            <div className="bg-[#121212] rounded-lg p-4 border border-[#1a1a1a]">
              <p className="text-[14px] text-[#dbd7caee] leading-relaxed">{scenario.userQuery}</p>
            </div>

            {/* Thinking Animation */}
            <AnimatePresence>
              {phase === 'thinking' && thinkingText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-4 h-4 border-2 border-[#758575] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[13px] text-[#758575] thinking-shimmer">{thinkingText}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Retrieval Blocks with Wipe Animation */}
            <AnimatePresence>
              {visibleRetrievals > 0 && (
                <div className="space-y-2">
                  {scenario.retrievals.slice(0, visibleRetrievals).map((retrieval, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '100%' }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#121212] border border-[#1a1a1a] rounded px-3 py-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#758575] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className="text-[12px] text-[#758575]">Pulled {retrieval.source}:</span>
                        <span className="text-[12px] text-[#dbd7caee]">{retrieval.section}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Agent Messages and File Changes */}
            <AnimatePresence>
              {visibleMessages > 0 && (
                <div className="space-y-4">
                  {scenario.agentMessages.slice(0, visibleMessages).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-[14px] text-[#dbd7caee] leading-relaxed mb-3">{msg}</p>
                      
                      {/* File Change Card */}
                      {scenario.files[i] && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-[#121212] border border-[#1a1a1a] rounded-lg overflow-hidden"
                        >
                          <div className="px-3 py-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#758575]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                              <polyline points="13 2 13 9 20 9" />
                            </svg>
                            <span className="text-[13px] text-[#dbd7caee] font-sans">{scenario.files[i].name}</span>
                            <span className="text-[12px] text-[#4d9375]">
                              +{fileDiffCounts[i]?.additions ?? 0}
                            </span>
                            <span className="text-[12px] text-[#cb7676]">
                              -{fileDiffCounts[i]?.deletions ?? 0}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Completion Status */}
            <AnimatePresence>
              {phase === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[13px] text-[#4d9375]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Security fix applied and validated.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#1a1a1a]">
            <div className="bg-[#121212] rounded-lg overflow-hidden border border-[#1a1a1a]">
              <div className="px-4 py-3 text-[14px] text-[#758575]">
                Describe a security issue to investigate...
              </div>
              <div className="px-4 py-2 border-t border-[#1a1a1a] flex items-center justify-between relative">
                {/* Agent count + Model selector */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAgentSelector(!showAgentSelector)}
                    className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#252525] rounded text-[12px] text-[#dbd7caee] flex items-center gap-1.5 transition-colors"
                  >
                    <span className="text-[#4d9375] font-medium">{agentCount}x</span>
                    <span className="text-[#758575]">|</span>
                    <span>{selectedModels[0]}</span>
                    <svg className={`w-3 h-3 text-[#758575] transition-transform ${showAgentSelector ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                
                {/* Dropdown for agent/model selection */}
                {showAgentSelector && (
                  <div className="absolute bottom-full left-4 mb-2 w-64 bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg shadow-xl overflow-hidden z-50">
                    {/* Agent count selector */}
                    <div className="p-3 border-b border-[#2d2d2d]">
                      <div className="text-[10px] uppercase tracking-wider text-[#758575] mb-2">Agent Instances</div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(count => (
                          <button
                            key={count}
                            onClick={() => handleAgentCountChange(count)}
                            className={`flex-1 py-1.5 rounded text-[12px] font-medium transition-colors ${
                              agentCount === count
                                ? 'bg-[#4d9375] text-[#0a0a0a]'
                                : 'bg-[#121212] text-[#dbd7caee] hover:bg-[#252525]'
                            }`}
                          >
                            {count}x
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Model selectors for each agent */}
                    <div className="p-3 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-[#758575] mb-2">Model Selection</div>
                      {Array.from({ length: agentCount }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-[11px] text-[#758575] w-5">#{idx + 1}</span>
                          <select
                            value={selectedModels[idx] || AVAILABLE_MODELS[0]}
                            onChange={(e) => handleModelChange(idx, e.target.value)}
                            className="flex-1 bg-[#121212] border border-[#2d2d2d] rounded px-2 py-1.5 text-[12px] text-[#dbd7caee] focus:outline-none focus:border-[#4d9375]"
                          >
                            {AVAILABLE_MODELS.map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="w-6 h-6 rounded-full bg-[#121212] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#758575]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Code Diff - Hidden on mobile */}
        <div className="hidden md:flex flex-1 bg-[#121212] flex-col min-w-[400px]">
          {/* File Tabs */}
          <div className="h-10 bg-[#121212] border-b border-[#1a1a1a] flex items-center">
            {scenario.files.map((file, i) => (
              <div
                key={i}
                onClick={() => setActiveFileTab(i)}
                className={`h-full px-4 flex items-center gap-2 cursor-pointer border-r border-[#1a1a1a] ${
                  activeFileTab === i ? 'bg-[#121212]' : 'bg-[#121212]'
                }`}
              >
                <span className={`text-[13px] font-sans ${activeFileTab === i ? 'text-[#dbd7caee]' : 'text-[#758575]'}`}>
                  {file.name.split('/').pop()}
                </span>
                {activeFileTab === i && (
                  <svg className="w-3 h-3 text-[#758575]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto font-mono text-[13px] leading-[1.6]">
            {scenario.files[activeFileTab]?.lines.map((line, i) => {
              const shouldShow = activeFileTab <= visibleFileIndex && 
                (activeFileTab < visibleFileIndex || i < visibleLineIndex);
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: shouldShow ? 1 : 0,
                    height: shouldShow ? 'auto' : 0
                  }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${
                    line.type === 'add' ? 'bg-[#4d937520]' :
                    line.type === 'remove' ? 'bg-[#cb767620]' : ''
                  }`}
                >
                  <div className="w-12 shrink-0 text-right pr-4 py-0.5 text-[#758575] select-none">
                    {line.num}
                  </div>
                  <div className="w-6 shrink-0 text-center py-0.5 select-none">
                    {line.type === 'add' && <span className="text-[#4d9375]">+</span>}
                    {line.type === 'remove' && <span className="text-[#cb7676]">-</span>}
                  </div>
                  <div className="flex-1 py-0.5 pr-4 whitespace-pre">
                    {tokenize(line.code).map((token, j) => (
                      <span key={j} style={{ color: token.color }}>{token.text}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
      
      {/* Terminal Overlay - Outside main window to allow overflow - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: phase === 'coding' || phase === 'complete' ? 1 : 0,
          y: phase === 'coding' || phase === 'complete' ? 0 : 20,
          scale: phase === 'coding' || phase === 'complete' ? 1 : 0.95
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block absolute -bottom-6 -right-4 w-[440px] z-30 rounded-lg overflow-hidden border border-[#1a1a1a]"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          pointerEvents: phase === 'coding' || phase === 'complete' ? 'auto' : 'none'
        }}
      >
        {/* Terminal Chrome - Vitesse themed */}
        <div className="h-7 bg-[#1e1e1e] flex items-center px-3 gap-2 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#cb7676]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#e6cc77]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#4d9375]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] text-[#758575]">triage — security — zsh</span>
          </div>
        </div>
        
        {/* Terminal Content - Vitesse dark background */}
        <div 
          ref={terminalRef}
          className="h-[240px] bg-[#121212] overflow-y-auto p-3 font-mono text-[11px] leading-[1.7]"
        >
          {terminalLines.length === 0 ? (
            <div className="text-[#758575]">
              <span className="text-[#4d9375]">(venv)</span>
              <span className="text-[#dbd7caee]"> triage@dev</span>
              <span className="text-[#758575]"> ~/security</span>
              <span className="text-[#dbd7caee]"> % </span>
              <span className="animate-pulse text-[#dbd7caee]">█</span>
            </div>
          ) : (
            terminalLines.map((line, i) => {
              const l = line || '';
              return (
                <div 
                  key={i}
                  className={`whitespace-pre ${
                    l.includes('PASS') || l.includes('passed') || l.includes('✓') 
                      ? 'text-[#4d9375]' 
                      : l.includes('FAIL') || l.includes('failed') || l.includes('✗')
                      ? 'text-[#cb7676]'
                      : l.includes('(venv)') || l.includes(' % ')
                      ? 'text-[#dbd7caee]'
                      : l.startsWith('>') || l.includes('triage@')
                      ? 'text-[#dbd7caee]'
                      : 'text-[#758575]'
                  }`}
                >
                  {l || '\u00A0'}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
