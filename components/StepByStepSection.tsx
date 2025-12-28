'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: string;
  label: string;
  title: string;
  description: string;
}

interface StepByStepSectionProps {
  steps: Step[];
  children: (activeStepId: string) => ReactNode;
}

export function StepByStepSection({ steps, children }: StepByStepSectionProps): JSX.Element {
  const [activeStepId, setActiveStepId] = useState(steps[0].id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
      {/* Left Column: Steps */}
      <div className="lg:col-span-4 space-y-2 relative">
        {/* Vertical line decoration */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#2d2d2d] ml-[15px]" />
        
        {steps.map((step) => {
          const isActive = activeStepId === step.id;
          return (
            <div 
              key={step.id}
              className={`relative pl-12 py-6 cursor-pointer transition-all duration-300 group ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
              onClick={() => setActiveStepId(step.id)}
            >
              {/* Active step dot */}
              <div className={`absolute left-0 top-[28px] w-8 h-px transition-all duration-300 ${isActive ? 'bg-text-primary' : 'bg-transparent'}`} />
              <div className={`absolute left-[13px] top-[26px] w-[5px] h-[5px] rounded-full transition-all duration-300 ${isActive ? 'bg-text-primary' : 'bg-text-muted group-hover:bg-text-secondary'}`} />
              
              <div className="space-y-2">
                <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                  {step.label}
                </span>
                <h3 className="text-xl font-normal text-text-primary tracking-tight">{step.title}</h3>
                {isActive && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[14px] leading-relaxed text-text-tertiary"
                  >
                    {step.description}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Content/Mockup */}
      <div className="lg:col-span-8">
        <motion.div
          key={activeStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {children(activeStepId)}
        </motion.div>
      </div>
    </div>
  );
}

