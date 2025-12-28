'use client';

import { motion } from 'framer-motion';

export function TraceExplorer(): JSX.Element {
  const traces = [
    { time: '11:52:44 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '100ms', cost: '<$0.001', status: 'error' },
    { time: '11:52:42 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '845ms', cost: '<$0.001', status: 'error' },
    { time: '11:51:42 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '186ms', cost: '<$0.001', status: 'error' },
    { time: '11:51:40 PM', provider: 'Anthropic', model: 'claude-sonnet-4-5', tokens: '0 → 0', latency: '62.74s', cost: '<$0.001', status: 'timeout' },
    { time: '11:51:31 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '160ms', cost: '<$0.001', status: 'error' },
    { time: '11:51:18 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '188ms', cost: '<$0.001', status: 'error' },
    { time: '11:51:08 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '171ms', cost: '<$0.001', status: 'error' },
    { time: '11:50:42 PM', provider: 'OpenAI', model: 'gpt-5.1-codex', tokens: '0 → 0', latency: '619ms', cost: '<$0.001', status: 'error' },
    { time: '11:50:39 PM', provider: 'Anthropic', model: 'claude-sonnet-4-5', tokens: '0 → 0', latency: '63.75s', cost: '<$0.001', status: 'rate_limited' },
  ];

  return (
    <div className="bg-[#121212] border border-[#2d2d2d] rounded-xl overflow-hidden font-sans flex h-[540px] shadow-2xl">
      {/* Table Area */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#2d2d2d]">
        <div className="p-4 border-b border-[#2d2d2d] flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-4">
            <div className="text-[11px] font-bold text-text-muted uppercase">Observability</div>
            <div className="text-[11px] font-bold text-text-primary uppercase">Trace Explorer</div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-text-primary text-bg-primary rounded text-[10px] font-bold">Playground</div>
            <div className="px-3 py-1 bg-[#2d2d2d] rounded text-[10px] text-text-secondary border border-[#2d2d2d]">Filters</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-[10px] font-mono border-collapse">
            <thead className="sticky top-0 bg-[#121212] text-text-muted border-b border-[#2d2d2d] z-10">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Tokens</th>
                <th className="px-4 py-3 font-medium">Latency</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d2d]">
              {traces.map((trace, i) => (
                <tr key={i} className={`hover:bg-[#2d2d2d]/50 cursor-pointer ${i === 0 ? 'bg-[#2d2d2d]/30' : ''}`}>
                  <td className="px-4 py-2.5 text-text-tertiary whitespace-nowrap">{trace.time}</td>
                  <td className="px-4 py-2.5 text-text-primary">{trace.provider}</td>
                  <td className="px-4 py-2.5 text-text-secondary">{trace.model}</td>
                  <td className="px-4 py-2.5 text-text-tertiary">{trace.tokens}</td>
                  <td className="px-4 py-2.5 text-text-tertiary">{trace.latency}</td>
                  <td className="px-4 py-2.5 text-text-tertiary">{trace.cost}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded-[3px] text-[8px] uppercase font-bold ${
                      trace.status === 'error' ? 'bg-[#cb7676]/10 text-[#cb7676]' : 
                      trace.status === 'timeout' ? 'bg-yellow-500/10 text-yellow-500' : 
                      trace.status === 'rate_limited' ? 'bg-orange-500/10 text-orange-500' : 'bg-[#4d9375]/10 text-[#4d9375]'
                    }`}>
                      {trace.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-[300px] flex flex-col bg-[#121212] hidden lg:flex">
        <div className="p-4 border-b border-[#2d2d2d]">
          <div className="text-[11px] font-bold text-text-primary uppercase mb-1">Trace Details</div>
          <div className="text-[9px] text-text-muted font-mono uppercase">openai / gpt-5.1-codex</div>
        </div>

        <div className="flex border-b border-[#2d2d2d] bg-[#121212] px-2 overflow-x-auto no-scrollbar">
          {['Request', 'Response', 'Tools', 'Security', 'Meta'].map((tab, i) => (
            <div key={i} className={`px-3 py-2 text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${i === 0 ? 'text-text-primary border-b-2 border-text-primary' : 'text-text-muted hover:text-text-secondary'}`}>
              {tab}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[8px] uppercase font-bold text-text-muted mb-1">Status</div>
              <div className="text-[10px] text-[#cb7676] font-bold">error</div>
            </div>
            <div>
              <div className="text-[8px] uppercase font-bold text-text-muted mb-1">Tokens</div>
              <div className="text-[10px] text-text-primary font-bold">0</div>
            </div>
            <div>
              <div className="text-[8px] uppercase font-bold text-text-muted mb-1">Latency</div>
              <div className="text-[10px] text-text-primary font-bold">100ms</div>
            </div>
            <div>
              <div className="text-[8px] uppercase font-bold text-text-muted mb-1">Cost</div>
              <div className="text-[10px] text-text-primary font-bold">&lt;$0.001</div>
            </div>
          </div>

          <div>
            <div className="text-[9px] uppercase font-bold text-text-muted mb-3 tracking-widest">Parameters</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded">
                <div className="text-[8px] text-text-muted mb-1">Temperature</div>
                <div className="text-[10px] text-text-secondary">-</div>
              </div>
              <div className="p-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded">
                <div className="text-[8px] text-text-muted mb-1">Max Tokens</div>
                <div className="text-[10px] text-text-secondary">-</div>
              </div>
              <div className="p-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded">
                <div className="text-[8px] text-text-muted mb-1">Top P</div>
                <div className="text-[10px] text-text-secondary">-</div>
              </div>
              <div className="p-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded">
                <div className="text-[8px] text-text-muted mb-1">Operation</div>
                <div className="text-[10px] text-text-primary font-mono truncate">generate-fix-fallback</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-8 text-center px-4">
            <div className="text-[10px] text-text-muted italic leading-relaxed">
              No prompt content captured. Enable prompt capture in tracer config.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

