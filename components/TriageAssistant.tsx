'use client';

import { motion } from 'framer-motion';

export function TriageAssistant(): JSX.Element {
  const issues = [
    { title: "Implement atomic increment operations", severity: "CRITICAL", line: "93-123" },
    { title: "This creates a TOCTOU vulnerability", severity: "CRITICAL", line: "126-150", active: true },
    { title: "No authentication/authorization", severity: "HIGH", line: "153-171" },
    { title: "js/missing-rate-limiting", severity: "MEDIUM", line: "65" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#121212] font-sans">
      {/* Header */}
      <div className="p-4 border-b border-[#2d2d2d] flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-tight text-text-primary uppercase">Triage Assistant</span>
        <span className="text-[9px] text-text-muted font-mono truncate ml-2">backend/src/routes/usage.routes.ts</span>
      </div>

      {/* Progress */}
      <div className="p-4 flex items-center justify-between border-b border-[#2d2d2d]">
        <span className="text-[10px] font-bold text-text-secondary">0/6 RESOLVED</span>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-[#2d2d2d] rounded text-text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button className="p-1 hover:bg-[#2d2d2d] rounded text-text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Active Finding */}
      <div className="p-4 border-b border-[#2d2d2d] bg-[#2d2d2d]/30">
        <div className="flex items-start gap-2 mb-3">
          <div className="mt-1 flex-shrink-0 text-text-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold text-text-primary truncate">This creates a TOCTOU vulnerability</span>
              <span className="badge badge-critical flex-shrink-0">Critical</span>
            </div>
            <div className="text-[10px] text-text-muted mb-3">Lines 126-150</div>
            <p className="text-[11px] leading-relaxed text-text-secondary mb-4">
              The quota check and update happen in separate transactions. Concurrent requests can pass the check before any updates occur.
            </p>
            <button className="w-full py-2 px-4 bg-text-primary text-bg-primary text-[11px] font-bold rounded-md hover:bg-white transition-colors flex items-center justify-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              Apply Fix
            </button>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">Security Checklist</div>
        {issues.map((issue, i) => (
          <div 
            key={i} 
            className={`p-4 py-3 border-b border-[#2d2d2d] hover:bg-[#2d2d2d]/50 cursor-pointer transition-colors ${issue.active ? 'bg-[#2d2d2d]/30' : ''}`}
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-[11px] font-medium text-text-secondary truncate">{issue.title}</span>
              <span className={`badge ${
                issue.severity === 'CRITICAL' ? 'badge-critical' : 
                issue.severity === 'HIGH' ? 'badge-high' : 'badge-medium'
              } flex-shrink-0`}>{issue.severity}</span>
            </div>
            <div className="text-[10px] text-text-muted">Line {issue.line}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

