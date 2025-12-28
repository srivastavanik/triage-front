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
    const duration = 140; // Faster animation
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const getPoint = (t: number, width: number, height: number) => {
      // Start from roughly 15% of the container width (to avoid text)
      // and 70% of the height.
      // Move towards 100% width and 10% height.
      const startX = width * 0.15;
      const endX = width * 1.1; // Go slightly off screen
      const startY = height * 0.75;
      const endY = height * 0.05;
      
      const x = startX + t * (endX - startX);
      
      // Base linear path
      let y = startY + t * (endY - startY);
      
      // Add a smooth "S" bend
      const curve = Math.sin(t * Math.PI);
      y -= curve * (height * 0.15);
      
      return { x, y };
    };

    const drawLine = (p: number, color: string, alpha: number, xOffset: number, yOffset: number) => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const segments = 100;
      let first = true;

      for (let i = 0; i <= segments * p; i++) {
        const t = i / segments;
        const { x, y } = getPoint(t, w, h);
        
        if (first) {
          ctx.moveTo(x + xOffset, y + yOffset);
          first = false;
        } else {
          ctx.lineTo(x + xOffset, y + yOffset);
        }
      }
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const p = easeOutCubic(Math.min(progress / duration, 1));

      // Draw ghost lines (staggered shadows)
      const ghosts = 6;
      for (let i = ghosts; i > 0; i--) {
        const delay = i * 0.04;
        const ghostP = Math.max(0, p - delay);
        if (ghostP > 0) {
          const alpha = (ghosts - i + 1) * 0.04;
          const gray = 180 + i * 10;
          // Stagger them both vertically and horizontally for a deep shadow feel
          drawLine(ghostP, `rgb(${gray}, ${gray}, ${gray})`, alpha, i * 3, i * 3);
        }
      }

      // Draw main line
      drawLine(p, '#ffffff', 0.5, 0, 0);

      if (progress < duration + 40) { // Allow ghosts to finish
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
