import { useEffect, useRef } from "react";
import { useInView, useReducedMotionConfig } from "framer-motion";
import { isTouchFirst } from "@/lib/viewport";

/** Brightness steps the dots are drawn in */
const LEVELS = 12;
/** A small fixed hash, so each dot keeps its own beat */
const seedOf = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * A field of fine emerald dots that lives a little: a soft band of light sweeps across it on a
 * slow loop, each dot twinkles on its own beat, and the field drifts with the page as you scroll.
 * Drawn on a canvas, only while on screen and the tab is visible; one still frame under reduced
 * motion.
 */
export const DotField = ({
  gap = 22,
  strength = 1,
  drift = 0.12,
  className = "",
}: {
  /** Distance between dots, in px */
  gap?: number;
  /** How bright the field is, 0 to 1 */
  strength?: number;
  /** How far the field moves per px of page scroll */
  drift?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotionConfig();
  const onScreen = useInView(ref);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-400").trim() || "158 64% 52%";
    let raf = 0;
    const touch = isTouchFirst();

    const paint = (now: number) => {
      const dpr = touch ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t = reduceMotion ? 0 : now / 1000;
      const shift = reduceMotion ? 0 : window.scrollY * drift;
      const first = Math.floor(shift / gap);
      const offset = shift - first * gap;
      // Dots are grouped by brightness into a few batches, one fill each, instead of a fill per dot
      const batches: Path2D[] = Array.from({ length: LEVELS }, () => new Path2D());
      for (let row = -1; row * gap - offset < h + gap; row++) {
        const y = row * gap - offset + gap / 2;
        const i = row + first;
        for (let col = 0; col * gap < w + gap; col++) {
          const x = col * gap + gap / 2;
          const seed = seedOf(i, col);
          // The band: a slow diagonal sweep, sharp at its crest
          const sweep = Math.pow(Math.max(0, Math.sin((x * 0.7 + i * gap * 0.45) / 140 - t * 0.8)), 7);
          const twinkle = 0.5 + 0.5 * Math.sin(t * (0.7 + seed * 1.5) + seed * 40);
          const level = Math.min(LEVELS - 1, Math.floor((0.22 + 0.18 * twinkle + 0.55 * sweep) * LEVELS));
          const r = 0.85 + 0.75 * sweep;
          batches[level].rect(x - r, y - r, r * 2, r * 2);
        }
      }
      batches.forEach((path, level) => {
        ctx.fillStyle = `hsl(${accent} / ${(((level + 0.5) / LEVELS) * strength).toFixed(3)})`;
        ctx.fill(path);
      });
    };

    // Phones redraw at half rate: the dots move slowly, and the frames go to scrolling instead
    let drawn = 0;
    const frame = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      if (!touch || now - drawn > 32) {
        drawn = now;
        paint(now);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      if (!document.hidden && onScreen && !reduceMotion) start();
    };

    paint(performance.now());
    if (onScreen && !reduceMotion) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [gap, strength, drift, onScreen, reduceMotion]);

  return <canvas ref={ref} aria-hidden="true" className={`block w-full h-full ${className}`} />;
};

export default DotField;
