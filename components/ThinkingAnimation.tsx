'use client';

import { motion } from 'framer-motion';

interface ThinkingAnimationProps {
  text?: string;
  variant?: 'inline' | 'block' | 'minimal';
  className?: string;
}

export function ThinkingAnimation({ 
  text = 'Analyzing...', 
  variant = 'inline',
  className = ''
}: ThinkingAnimationProps): JSX.Element {
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg ${className}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-5 h-5 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-text-secondary">{text}</span>
        </div>
        
        {/* Shimmer progress bar */}
        <div className="h-1.5 bg-[#2d2d2d] rounded-full overflow-hidden">
          <div className="h-full w-full thinking-shimmer rounded-full" />
        </div>

        {/* Wipe effect line */}
        <div className="mt-4 h-px bg-[#2d2d2d] relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-text-primary/30 to-transparent"
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Typing dots */}
        <div className="flex items-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-text-muted"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Default inline variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Spinner */}
      <div className="relative">
        <div className="w-5 h-5 border-2 border-[#2d2d2d] rounded-full" />
        <motion.div
          className="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-text-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Text with shimmer */}
      <div className="relative overflow-hidden">
        <span className="text-[12px] text-text-secondary">{text}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Progress indicator */}
      <div className="w-16 h-1 bg-[#2d2d2d] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-text-primary/50 rounded-full"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

// Standalone shimmer bar component
export function ShimmerBar({ className = '' }: { className?: string }): JSX.Element {
  return (
    <div className={`h-2 bg-[#2d2d2d] rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-1/3 bg-gradient-to-r from-[#2d2d2d] via-[#2d2d2d] to-[#2d2d2d] rounded-full"
        animate={{ x: ['-100%', '400%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Pulsing dot indicator
export function PulsingDot({ 
  color = '#4d9375',
  size = 'sm' 
}: { 
  color?: string; 
  size?: 'sm' | 'md' | 'lg';
}): JSX.Element {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full`}
      style={{ backgroundColor: color }}
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

// Typing indicator
export function TypingIndicator({ className = '' }: { className?: string }): JSX.Element {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-text-muted"
          animate={{ 
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            delay: i * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

