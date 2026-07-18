import { useEffect } from 'react';

interface WaveOptions {
  color?: string;
  speed?: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * The animated horizon-line background from the original hero. Dropped
 * during the first pass of the React rewrite — only the 3D shirt got
 * ported, not this canvas-2D animation that sat behind it. Pure `<canvas>`
 * 2D drawing, no Three.js involved, so it doesn't share `usePrintScene`'s
 * WebGL-context concerns.
 */
export function useWaveCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, { color = '#FF5C38', speed = 1.9 }: WaveOptions = {}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let live = true;
    let raf = 0;
    const start = performance.now();
    const [cr, cg, cb] = hexToRgb(color);

    const draw = (now: number) => {
      if (!live) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const t = ((now - start) / 1000) * speed;
      const lines = 42;
      const horizon = h * 0.34;
      const segs = 60;

      ctx.lineWidth = 1;
      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1);
        const depth = Math.pow(p, 1.6);
        const baseY = horizon + depth * (h - horizon) * 1.05;
        const amp = 14 + depth * 120;
        const bright = 0.05 + Math.pow(p, 2.2) * 0.65;

        ctx.beginPath();
        for (let s = 0; s <= segs; s++) {
          const x = (s / segs) * w;
          const u = s / segs;
          const y =
            baseY +
            Math.sin(u * 4.4 + t * 0.7 + i * 0.055) * amp * 0.5 +
            Math.sin(u * 9.0 - t * 0.45 + i * 0.11) * amp * 0.24 +
            Math.sin(u * 2.0 + t * 0.28 + i * 0.03) * amp * 0.36;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${bright})`;
        ctx.stroke();
      }

      // растворение краёв — не заливкой цветом фона поверх линий (она держалась
      // только пока фон под канвой ровно #0B0B0C и на мобильном, где канва
      // всего лишь полоса внутри героя, читалась тёмной ступенью посреди
      // волны), а маской в CSS: см. .hero__wave в HomePage.css
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      live = false;
      cancelAnimationFrame(raf);
    };
  }, [canvasRef, color, speed]);
}
