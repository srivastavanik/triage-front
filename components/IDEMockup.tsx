'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IDEMockupProps {
  children?: ReactNode;
}

export function IDEMockup({ children }: IDEMockupProps): JSX.Element {
  const codeLines = [
    { num: 93, content: "export const updateUsage = async (userId: string, type: 'total' | 'webSearch' | 'deepResearch' = 'total') => {" },
    { num: 94, content: "  try {" },
    { num: 95, content: "    const usage = await getOrCreateUsage(userId)" },
    { num: 96, content: "    const today = new Date().toISOString().split('T')[0]" },
    { num: 97, content: "" },
    { num: 98, content: "    // Increment counters" },
    { num: 99, content: "    const updates: any = {" },
    { num: 100, content: "      total_queries: (usage.total_queries || 0) + 1," },
    { num: 101, content: "      updated_at: new Date().toISOString()" },
    { num: 102, content: "    }" },
    { num: 103, content: "" },
    { num: 104, content: "    if (type === 'webSearch') {", highlighted: true, type: 'vulnerable' },
    { num: 105, content: "      updates.web_search_queries = (usage.web_search_queries || 0) + 1", highlighted: true, type: 'vulnerable' },
    { num: 106, content: "    } else if (type === 'deepResearch') {", highlighted: true, type: 'vulnerable' },
    { num: 107, content: "      updates.deep_research_queries = (usage.deep_research_queries || 0) + 1", highlighted: true, type: 'vulnerable' },
    { num: 108, content: "    }" },
    { num: 109, content: "" },
    { num: 110, content: "    // Update the database" },
    { num: 111, content: "    const { error } = await supabaseAdmin" },
    { num: 112, content: "      .from('daily_usage')" },
    { num: 113, content: "      .update(updates)" },
    { num: 114, content: "      .eq('user_id', userId)" },
    { num: 115, content: "      .eq('usage_date', today)" },
  ];

  return (
    <div className="mockup-container bg-[#121212] border-[#2d2d2d] shadow-2xl flex h-[540px] w-full overflow-hidden">
      {/* File Explorer */}
      <div className="w-[200px] border-r border-[#2d2d2d] flex-shrink-0 hidden md:flex flex-col bg-[#121212]">
        <div className="p-3 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Explorer</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2d2d2d]" />
            <div className="w-2 h-2 rounded-full bg-[#2d2d2d]" />
          </div>
        </div>
        <div className="px-2 overflow-y-auto flex-1 font-mono text-[11px] text-text-tertiary">
          <div className="py-1 px-2 hover:bg-[#2d2d2d] rounded cursor-pointer">.claude</div>
          <div className="py-1 px-2 text-text-secondary flex items-center gap-2">
            <span>▼</span> backend
          </div>
          <div className="pl-4">
            <div className="py-1 px-2 hover:bg-[#2d2d2d] rounded cursor-pointer">scripts</div>
            <div className="py-1 px-2 text-text-secondary flex items-center gap-2">
              <span>▼</span> src
            </div>
            <div className="pl-4">
              <div className="py-1 px-2 hover:bg-[#2d2d2d] rounded cursor-pointer">config</div>
              <div className="py-1 px-2 hover:bg-[#2d2d2d] rounded cursor-pointer">controllers</div>
              <div className="py-1 px-2 text-text-secondary flex items-center gap-2">
                <span>▼</span> routes
              </div>
              <div className="pl-4">
                <div className="py-1 px-2 hover:bg-[#2d2d2d] rounded cursor-pointer">auth.routes.ts</div>
                <div className="py-1 px-2 bg-[#2d2d2d] text-text-primary rounded cursor-pointer flex items-center justify-between">
                  <span>usage.routes.ts</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cb7676]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        {/* Tabs */}
        <div className="flex bg-[#121212] border-b border-[#2d2d2d]">
          <div className="px-4 py-2 bg-[#2d2d2d] border-r border-[#2d2d2d] flex items-center gap-2">
            <span className="text-[#3b82f6] text-[10px]">TS</span>
            <span className="text-[11px] text-text-primary">usage.routes.ts</span>
          </div>
        </div>

        {/* Code */}
        <div className="flex-1 overflow-hidden p-4 font-mono text-[12px] relative">
          {codeLines.map((line, i) => (
            <div key={i} className={`flex gap-4 relative group ${line.highlighted ? 'bg-[#2d1a1a] -mx-4 px-4' : ''}`}>
              <span className="w-8 text-right text-text-muted select-none flex-shrink-0">{line.num}</span>
              <span className="text-text-secondary whitespace-pre overflow-hidden text-ellipsis">
                {line.content}
              </span>
              {line.highlighted && i === 11 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-40 top-6 z-10 bg-[#2d2d2d] border border-[#cb7676]/30 p-2 rounded shadow-xl text-[10px] text-text-secondary w-48 pointer-events-none"
                >
                  <div className="font-semibold text-text-primary mb-1">Triage Assistant</div>
                  Code changed or highlighted by AI assistant
                  <div className="text-text-muted mt-1">Line 104</div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Assistant Panel */}
      <div className="w-[320px] border-l border-[#2d2d2d] flex-shrink-0 hidden lg:flex flex-col bg-[#121212]">
        {children}
      </div>
    </div>
  );
}

