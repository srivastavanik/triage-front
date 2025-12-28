import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        'bg-primary': '#222222',
        'bg-secondary': '#1a1a1a',
        'bg-tertiary': '#2a2a2a',
        'bg-elevated': '#333333',
        
        // Text colors
        'text-primary': '#f5f4f0',
        'text-secondary': 'rgba(245, 244, 240, 0.8)',
        'text-tertiary': 'rgba(245, 244, 240, 0.5)',
        'text-muted': 'rgba(245, 244, 240, 0.3)',
        
        // Accent colors - Semantic Only
        'accent': '#f5f4f0',
        'accent-hover': '#ffffff',
        // Removed teal to enforce strict palette
        
        // Borders
        'border': 'rgba(245, 244, 240, 0.08)',
        'border-subtle': 'rgba(245, 244, 240, 0.04)',
        'border-strong': 'rgba(245, 244, 240, 0.15)',
      },
      fontFamily: {
        sans: ['var(--font-akkurat)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Geist Mono', 'SF Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'roulette': 'roulette 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        roulette: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '20%': { opacity: '1', transform: 'translateY(0)' },
          '80%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
    },
  },
  plugins: [],
};

export default config;
