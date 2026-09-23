import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Value noise on a small lattice, smooth enough for a landscape. */
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const noise = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};
const height = (x: number, y: number) =>
  noise(x, y) * 0.6 + noise(x * 2.1, y * 2.1) * 0.28 + noise(x * 4.3, y * 4.3) * 0.12;

/**
 * A wireframe landscape in the accent colour, seen in perspective from low and close,
 * the way the belief section's mock shows it in the bottom corner. It drifts slowly
 * while on screen and holds still under reduced motion.
 */
export const Terrain = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let drift = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cols = 44;
      const rows = 26;
      const horizon = h * 0.22;
      const amp = h * 0.62;
      const points: { x: number; y: number }[][] = [];
      for (let r = 0; r <= rows; r++) {
        const depth = r / rows; // 0 far, 1 near
        const persp = 0.25 + depth * 0.75;
        const rowY = horizon + depth * depth * (h - horizon);
        const row: { x: number; y: number }[] = [];
        for (let c = 0; c <= cols; c++) {
          const u = c / cols - 0.5;
          const x = w * 0.5 + u * w * 1.5 * persp;
          const z = height(c * 0.11 + drift * 0.3, (rows - r) * 0.13 + drift);
          const ridge = Math.pow(Math.max(0, z - 0.2), 1.3);
          row.push({ x, y: rowY - ridge * amp * persp });
        }
        points.push(row);
      }
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      for (let r = 0; r <= rows; r++) {
        const a = 0.12 + (r / rows) * 0.55;
        ctx.strokeStyle = `hsl(153 60% 62% / ${a})`;
        ctx.beginPath();
        points[r].forEach((p, i) => {
          if (i) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
        });
        ctx.stroke();
      }
      for (let c = 0; c <= cols; c += 2) {
        ctx.strokeStyle = "hsl(153 60% 62% / 0.18)";
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const p = points[r][c];
          if (r) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
        }
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      drift += dt * 0.12;
      draw();
      if (visible && !reduceMotion) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else cancelAnimationFrame(raf);
    });
    resize();
    draw();
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduceMotion]);

  return <canvas ref={ref} aria-hidden="true" className={`block ${className}`} />;
};

export default Terrain;
