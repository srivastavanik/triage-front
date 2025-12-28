'use client';

import { useEffect, useRef } from 'react';

export function EconomicsGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let progress = 0;
    const duration = 180; // Total frames for the animation (~3 seconds at 60fps)
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Cubic easing out function
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const getPoint = (t: number, width: number, height: number) => {
      const x = t * width;
      
      // A smooth curve that goes up, down, up, and back down
      // Using sine waves with an envelope to make it smooth
      const centerY = height * 0.5;
      const amplitude = height * 0.25;
      
      // Main frequency components
      const curve = Math.sin(t * Math.PI * 2.5); // 1.25 full cycles
      
      // Fade out at the very edges
      const envelope = Math.sin(t * Math.PI);
      
      const y = centerY - (curve * amplitude * envelope);
      
      return { x, y };
    };

    const drawLine = (p: number, color: string, alpha: number, offset: number) => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const segments = 100;
      let first = true;

      // Only draw up to current progress p
      for (let i = 0; i <= segments * p; i++) {
        const t = i / segments;
        const { x, y } = getPoint(t, w, h);
        
        if (first) {
          ctx.moveTo(x, y + offset);
          first = false;
        } else {
          ctx.lineTo(x, y + offset);
        }
      }
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const p = easeOutCubic(Math.min(progress / duration, 1));

      // Draw ghost lines (staggered faded grays)
      const ghosts = 5;
      for (let i = ghosts; i > 0; i--) {
        const delay = i * 0.05;
        const ghostP = Math.max(0, p - delay);
        if (ghostP > 0) {
          const alpha = (ghosts - i + 1) * 0.05;
          const gray = 150 + i * 15;
          drawLine(ghostP, `rgb(${gray}, ${gray}, ${gray})`, alpha, i * 4);
        }
      }

      // Draw main line
      drawLine(p, '#ffffff', 0.6, 0);

      if (progress < duration) {
        progress++;
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
