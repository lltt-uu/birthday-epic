import { useEffect, useRef } from 'react';

/**
 * Floating particle field — activates during scanning.
 * Gold/blue particles drifting upward.
 */
export default function ParticleField({ active = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: active ? 60 : 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      life: Math.random(),
      color: Math.random() > 0.7
        ? 'rgba(240,216,120,'  // gold
        : 'rgba(74,158,255,',   // blue
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.001;

        if (p.life <= 0 || p.y < -10 || p.y > canvas.height + 10 || p.x < -10 || p.x > canvas.width + 10) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 1;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = -Math.random() * 0.5 - 0.1;
        }

        const alpha = Math.max(0, p.life * 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}
