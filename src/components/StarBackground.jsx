import { useEffect, useRef } from 'react';

/**
 * Canvas-based starfield background with slow parallax drift.
 */
export default function StarBackground() {
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

    // Generate stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      opacity: Math.random() * 0.6 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep gradient background
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 3, 0,
        canvas.width / 2, canvas.height / 3, canvas.width * 0.8
      );
      grad.addColorStop(0, 'rgba(6, 14, 30, 1)');
      grad.addColorStop(0.5, 'rgba(4, 8, 20, 1)');
      grad.addColorStop(1, 'rgba(2, 3, 8, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (const s of stars) {
        s.y += s.speed;
        if (s.y > canvas.height + 5) {
          s.y = -5;
          s.x = Math.random() * canvas.width;
        }
        s.twinkle += 0.01;
        const alpha = s.opacity + Math.sin(s.twinkle) * 0.2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,230,${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();

        // Glow for larger stars
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,200,240,${alpha * 0.08})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
