'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let animationFrameId: number;
    let nodes: Node[] = [];
    let frameCount = 0;
    
    // Configuration
    const INITIAL_NODES = 8;
    const MAX_NODES = 150;
    const CONNECTION_DISTANCE = 120;
    
    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize nodes
    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < INITIAL_NODES; i++) {
        // Spawn along the right edge, vertically distributed
        nodes.push({
          x: width - Math.random() * 150 - 50,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 2 + 1.5,
        });
      }
    };

    initNodes();

    // Animation loop
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);
      
      // Spawn new nodes logic (accelerating)
      // Starts slow, gets faster
      // Frame count increases, threshold decreases
      const spawnThreshold = Math.max(5, 60 - frameCount * 0.05); 
      
      if (frameCount % Math.floor(spawnThreshold) === 0 && nodes.length < MAX_NODES) {
        // Spawn logic: tend to extend the shape
        // Pick a random node and spawn near it, but bias towards unoccupied space or verticality
        const parent = nodes[Math.floor(Math.random() * nodes.length)];
        if (parent) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 60;
            const newX = parent.x + Math.cos(angle) * dist;
            const newY = parent.y + Math.sin(angle) * dist;
            
            // Keep within bounds of "right side" roughly
            // Say right 40% of screen
            if (newX > width * 0.6 && newX < width && newY > 0 && newY < height) {
                nodes.push({
                    x: newX,
                    y: newY,
                    vx: (Math.random() - 0.5) * 0.1,
                    vy: (Math.random() - 0.5) * 0.1,
                    radius: Math.random() * 2 + 1,
                });
            }
        }
      }

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Soft bounds for the cluster
        if (node.x > width) node.vx = -Math.abs(node.vx);
        if (node.x < width * 0.5) node.vx = Math.abs(node.vx); // Push back right
        if (node.y < 0) node.vy = Math.abs(node.vy);
        if (node.y > height) node.vy = -Math.abs(node.vy);

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 244, 240, 0.4)`; // #f5f4f0 with lower opacity
        ctx.fill();

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            // Opacity based on distance, but kept subtle
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            ctx.strokeStyle = `rgba(245, 244, 240, ${opacity})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasStarted]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

