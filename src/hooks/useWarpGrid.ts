import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { onLayoutResize } from "@/lib/viewport";

/** Seconds without scrolling before the grid starts to wave */
const IDLE_AFTER = 2.2;
/** Columns across the screen, like the reference's wall */
const COLUMNS = 12;
/** Points per line: enough for the wave to read as curves */
const SEGMENTS = 48;

type Spring = { x: number; v: number };
/** One step of a lightly damped spring toward `to`: it overshoots and settles, which is the bounce */
const stepSpring = (s: Spring, to: number, dt: number) => {
  const k = 60;
  const c = 7;
  s.v += (k * (to - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
};

/**
 * The grid behind Contact, after wodniack.dev's closing screen: square cells on the pale
 * ground, lying flat. When the visitor stops scrolling for a moment, the whole grid starts to
 * ripple outward from the middle on a bouncy spring; any scroll lets it settle back flat.
 * Draws only while the section is on screen and the tab is visible.
 */
export const useWarpGrid = ({
  canvas,
  progress,
  active,
  still,
}: {
  canvas: React.RefObject<HTMLCanvasElement | null>;
  /** The section's scroll progress: any change counts as the visitor moving */
  progress: MotionValue<number>;
  /** False while the section is off screen */
  active: boolean;
  /** Reduced motion: one flat frame, no wave */
  still: boolean;
}) => {
  const activeRef = useRef(active);
  activeRef.current = active;
  const startRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (active) startRef.current();
  }, [active]);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const amp: Spring = { x: 0, v: 0 };
    let lastMove = performance.now();
    let raf = 0;
    let last = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--pale-grid").trim() || "160 30% 20%";

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(c.clientWidth * dpr);
      const h = Math.round(c.clientHeight * dpr);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    };

    const paint = (now: number) => {
      const W = c.clientWidth;
      const H = c.clientHeight;
      const cx = W / 2;
      const cy = H / 2;
      const cell = W / COLUMNS;
      const t = now / 1000;
      const wave = amp.x;
      const lambda = cell * 2.6;

      // Where a point of the flat grid ends up while it ripples
      const warp = (x: number, y: number): [number, number] => {
        if (!wave) return [x, y];
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy) || 0.0001;
        const to = d + wave * cell * 0.34 * Math.sin((d / lambda) * Math.PI * 2 - t * 3.2);
        return [cx + (dx / d) * to, cy + (dy / d) * to];
      };

      const cols = Math.ceil(W / cell / 2) + 2;
      const rows = Math.ceil(H / cell / 2) + 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `hsl(${ink} / 0.38)`;
      ctx.beginPath();
      for (let i = -cols; i <= cols; i++) {
        const x = cx + i * cell;
        for (let j = 0; j <= SEGMENTS; j++) {
          const [px, py] = warp(x, -cell + ((H + 2 * cell) * j) / SEGMENTS);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      for (let i = -rows; i <= rows; i++) {
        const y = cy + i * cell;
        for (let j = 0; j <= SEGMENTS; j++) {
          const [px, py] = warp(-cell + ((W + 2 * cell) * j) / SEGMENTS, y);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    };

    const frame = (now: number) => {
      raf = 0;
      if (!activeRef.current || document.hidden) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const idle = !still && (now - lastMove) / 1000 > IDLE_AFTER;
      stepSpring(amp, idle ? 1 : 0, dt);
      paint(now);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && activeRef.current) {
        last = 0;
        size();
        raf = requestAnimationFrame(frame);
      }
    };
    startRef.current = start;

    const moved = () => {
      lastMove = performance.now();
    };
    const unsubscribe = progress.on("change", moved);
    const onResize = () => {
      size();
      paint(performance.now());
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    const offResize = onLayoutResize(onResize);
    document.addEventListener("visibilitychange", onVisibility);
    size();
    paint(performance.now());
    if (!still) start();

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      offResize();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // The canvas is stable for the section's life
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);
};
