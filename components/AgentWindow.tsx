'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AgentWindow(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);

  const issues = [
    { title: "Implement atomic increment operations", severity: "CRITICAL", line: "93-123" },
    { 
      title: "This creates a TOCTOU vulnerability", 
      severity: "CRITICAL", 
      line: "126-150", 
      active: true,
      description: "The quota check and update happen in separate transactions. Concurrent requests can pass the check before any updates occur."
    },
    { title: "No authentication/authorization", severity: "HIGH", line: "153-171" },
    { title: "js/missing-rate-limiting", severity: "MEDIUM", line: "65" },
  ];

  const codeLines = [
    { num: 126, content: "// Check if user has remaining quota" },
    { num: 127, content: "export const hasRemainingQuota = async (userId: string) => {" },
    { num: 128, content: "  const usage = await getOrCreateUsage(userId)", highlighted: true },
    { num: 129, content: "  if (usage.total_queries >= usage.limit) {", highlighted: true },
    { num: 130, content: "    return false", highlighted: true },
    { num: 131, content: "  }", highlighted: true },
    { num: 132, content: "  return true" },
    { num: 133, content: "}" },
  ];

  return (
    <div className="agent-window shadow-2xl overflow-hidden flex h-[480px] w-full">
      {/* Sidebar */}
      <div className="w-[180px] border-r border-[#d4d3cf] bg-[#ebeae6] hidden md:flex flex-col">
        <div className="p-4 border-b border-[#d4d3cf]">
          <div className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-4">In Progress 3</div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#888] animate-pulse" />
                <div className="h-2 w-20 bg-[#d4d3cf] rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-4">Ready 3</div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-[10px] text-[#4d9375]">✓</div>
                <div className="h-2 w-24 bg-[#d4d3cf] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-[#f5f4f0] flex flex-col min-w-0">
        <div className="h-10 border-b border-[#d4d3cf] flex items-center px-4 bg-[#e8e7e3]">
          <span className="text-[11px] font-medium text-[#222]">usage.routes.ts</span>
        </div>
        <div className="p-6 font-mono text-[12px] leading-relaxed overflow-hidden">
          {codeLines.map((line, i) => (
            <div key={i} className={`flex gap-4 ${line.highlighted ? 'bg-[#cb7676]/10 -mx-6 px-6 border-l-2 border-[#cb7676]' : ''}`}>
              <span className="w-8 text-right text-[#999] select-none">{line.num}</span>
              <span className="text-[#333] whitespace-nowrap">{line.content}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assistant Panel */}
      <div className="w-[280px] border-l border-[#d4d3cf] bg-[#f5f4f0] flex flex-col">
        <div className="p-4 border-b border-[#d4d3cf] bg-[#e8e7e3] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#222] uppercase tracking-tight">Triage Assistant</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
        </div>

        <div className="p-4 border-b border-[#d4d3cf] flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#666]">0/6 RESOLVED</span>
          <div className="flex gap-2">
            <span className="text-[#999]">‹</span>
            <span className="text-[#999]">›</span>
          </div>
        </div>

        <div className="p-4 bg-[#e8e7e3]/50 border-b border-[#d4d3cf]">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-[#cb7676] text-[12px] mt-0.5">⚠</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-bold text-[#222] truncate">{issues[1].title}</span>
                <span className="badge badge-critical border-[#cb7676]/20 scale-90">Critical</span>
              </div>
              <div className="text-[10px] text-[#888] mb-2">Lines 126-150</div>
              <p className="text-[10px] leading-relaxed text-[#444] mb-4">
                {issues[1].description}
              </p>
              <button className="w-full py-2 bg-[#222] text-[#f5f4f0] text-[10px] font-bold rounded hover:bg-[#333] transition-colors">
                Apply Fix
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="p-4 py-2 text-[9px] font-bold text-[#999] uppercase tracking-widest">Security Checklist</div>
          {issues.map((issue, i) => (
            <div key={i} className={`p-4 py-2 border-b border-[#d4d3cf]/50 flex items-center justify-between gap-2 ${issue.active ? 'bg-[#e8e7e3]/30' : ''}`}>
              <span className="text-[10px] text-[#555] truncate">{issue.title}</span>
              <span className={`badge ${issue.severity === 'CRITICAL' ? 'badge-critical' : issue.severity === 'HIGH' ? 'badge-high' : 'badge-medium'} scale-75 origin-right`}>{issue.severity}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .agent-window {
          background: #f5f4f0;
          border-radius: 12px;
          border: 1px solid #d4d3cf;
        }
        .badge {
          font-size: 9px;
          padding: 1px 4px;
          border-radius: 3px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge-critical { background: rgba(248, 113, 113, 0.1); color: #cb7676; border: 1px solid rgba(248, 113, 113, 0.2); }
        .badge-high { background: rgba(251, 146, 60, 0.1); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.2); }
        .badge-medium { background: rgba(250, 204, 21, 0.1); color: #facc15; border: 1px solid rgba(250, 204, 21, 0.2); }
      `}</style>
    </div>
  );
}
