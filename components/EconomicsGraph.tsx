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
    let phase = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const w = canvas.width;
      const h = canvas.height;
      const segments = 12;
      const segmentWidth = w / segments;
      const amplitude = h * 0.15;
      const centerY = h * 0.5;
      
      // Calculate how many segments to draw based on progress
      const totalLength = segments;
      const drawLength = (progress / 100) * totalLength;
      
      // Draw multiple zig-zag lines with different phases
      for (let line = 0; line < 3; line++) {
        const lineOffset = line * 80;
        const linePhase = phase + line * 0.5;
        const lineAlpha = 0.15 + (line * 0.1);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        for (let i = 0; i <= Math.min(drawLength, segments); i++) {
          const x = i * segmentWidth;
          const direction = (i + Math.floor(linePhase)) % 2 === 0 ? 1 : -1;
          const y = centerY + lineOffset + (direction * amplitude);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Partial segment
        if (drawLength > Math.floor(drawLength) && Math.floor(drawLength) < segments) {
          const partialProgress = drawLength - Math.floor(drawLength);
          const prevI = Math.floor(drawLength);
          const nextI = prevI + 1;
          
          const prevX = prevI * segmentWidth;
          const nextX = nextI * segmentWidth;
          const prevDirection = (prevI + Math.floor(linePhase)) % 2 === 0 ? 1 : -1;
          const nextDirection = (nextI + Math.floor(linePhase)) % 2 === 0 ? 1 : -1;
          const prevY = centerY + lineOffset + (prevDirection * amplitude);
          const nextY = centerY + lineOffset + (nextDirection * amplitude);
          
          const x = prevX + (nextX - prevX) * partialProgress;
          const y = prevY + (nextY - prevY) * partialProgress;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      // Animate
      if (progress < 100) {
        progress += 0.8;
      } else {
        phase += 0.02;
      }

      animationFrameId = requestAnimationFrame(draw);
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
