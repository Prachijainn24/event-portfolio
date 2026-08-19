import { useEffect, useRef } from 'react';

// JavaScript/CSS adaptation of the supplied FluidFlowGrid component.
export default function FluidFlowGrid({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return undefined;
    let frame;
    let width = 0;
    let height = 0;
    let time = 0;
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    const move = (event) => { mouse.targetX = event.clientX; mouse.targetY = event.clientY; };
    const leave = () => { mouse.targetX = -1000; mouse.targetY = -1000; };
    const render = () => {
      time += 0.008;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      ctx.fillStyle = '#eff9ff';
      ctx.fillRect(0, 0, width, height);
      const spacing = 35;
      for (let col = 0; col <= Math.ceil(width / spacing); col += 1) {
        for (let row = 0; row <= Math.ceil(height / spacing); row += 1) {
          const x = col * spacing;
          const y = row * spacing;
          let angle = Math.sin(x * 0.003 + time) + Math.cos(y * 0.003 + time);
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.hypot(dx, dy);
          const near = distance < 220 && distance > 0;
          if (near) { const force = 1 - distance / 220; angle = angle * (1 - force) + (Math.atan2(dy, dx) + Math.PI) * force; }
          const length = near ? 22 : 14;
          ctx.strokeStyle = near ? 'rgba(29, 120, 190, .75)' : `rgba(34, 112, 174, ${.13 + Math.sin(x * .01 + y * .01 + time) * .08})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(render);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    render();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', move); window.removeEventListener('mouseleave', leave); };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
