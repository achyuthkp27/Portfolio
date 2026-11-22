import { useEffect, useRef, useState } from "react";
import { useReducedMotionConfig } from "framer-motion";
import { pad2 } from "@/lib/format";
import { PROFILE } from "@/data/profile";

/** Hand-drawn people from Open Peeps (CC0, Pablo Stanley), rendered once to static SVGs */
const FIGURE_COUNT = 28;
const base = import.meta.env.BASE_URL;
const FIGURES = Array.from({ length: FIGURE_COUNT }, (_, i) => `${base}images/crowd/peep-${pad2(i + 1)}.svg`);
/** Me, standing still in the middle: my own ink portrait, cut out of its background (511 × 1492) */
const ME = `${base}images/crowd/me-standing.webp`;
/** The drawings face right; anyone walking left is mirrored so nobody walks backwards */
const FACING = 1;
/** The SVGs are 850 × 1200 */
const ASPECT = 850 / 1200;
/** Seconds a walker at speed 1 takes to cross the band */
const CROSSING = 10;

/** A fixed pseudo-random number in [0, 1) for each n: the same crowd on every visit */
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Walker = {
  /** 0 behind me, 1 in front of me */
  layer: 0 | 1;
  /** Height, and where the feet are, as shares of the band's height from its top */
  h: number;
  feet: number;
  /** Laps per CROSSING seconds; each walker has their own pace */
  speed: number;
  /** Where in the lap they start, so the row bunches up and thins out instead of marching in step */
  phase: number;
  /** 1 walks right, -1 walks left */
  dir: 1 | -1;
  /** The drawing they wear on their first lap; every lap after, they come back as someone else */
  look: number;
  /** A hand-drawn mark by their head: none, green sparks, a "…" speech bubble, or tick marks */
  mark: 0 | 1 | 2 | 3;
};

const ACCENT = "hsl(158 64% 52%)";

/** Short strokes fanning out from a point, like a doodled "!" of surprise */
const rays = (ctx: CanvasRenderingContext2D, x: number, y: number, angles: number[], len: number, gap: number) => {
  for (const a of angles) {
    const r = (a * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(r) * gap, y + Math.sin(r) * gap);
    ctx.lineTo(x + Math.cos(r) * (gap + len), y + Math.sin(r) * (gap + len));
    ctx.stroke();
  }
};

/**
 * A walker's mark, drawn in their own space (origin at the top centre of their drawing, mirrored
 * with them): green sparks off the back of the head, a "…" speech bubble, or black tick marks.
 */
const drawMark = (ctx: CanvasRenderingContext2D, mark: 1 | 2 | 3, w: number, h: number) => {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.5, h * 0.013);
  if (mark === 1) {
    ctx.strokeStyle = ACCENT;
    rays(ctx, -0.3 * w, 0.12 * h, [200, 225, 250], 0.08 * h, 0.03 * h);
  } else if (mark === 3) {
    ctx.strokeStyle = "#111";
    rays(ctx, 0.28 * w, 0.08 * h, [-70, -45, -20], 0.07 * h, 0.03 * h);
  } else {
    const bw = 0.3 * h;
    const bh = 0.17 * h;
    const x = 0.2 * w;
    const y = -0.14 * h;
    ctx.strokeStyle = "#111";
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(x, y, bw, bh, bh * 0.4);
    ctx.fill();
    ctx.stroke();
    // The tail, towards the speaker
    ctx.beginPath();
    ctx.moveTo(x + bw * 0.22, y + bh);
    ctx.lineTo(x + bw * 0.1, y + bh * 1.45);
    ctx.lineTo(x + bw * 0.42, y + bh);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#111";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + bw * (0.3 + 0.2 * i), y + bh / 2, h * 0.016, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

/**
 * The crowd: a slower back row walking right and a faster front row walking left. Inside a row
 * everyone keeps their own pace (±12%), size and depth, starts at an uneven spacing, bobs in
 * time with their own steps, and comes back as a different person each time they re-enter.
 * The back row passes behind me and the front row in front, so I always stand out.
 */
const makeCrowd = (W: number): Walker[] => {
  const k = Math.min(1, W / 1440);
  const counts = W >= 600 ? [25, 16] : [Math.max(9, Math.round(25 * k)), Math.max(6, Math.round(16 * k))];
  const total = counts[0] + counts[1];
  const walkers: Walker[] = [];
  for (let n = 0; n < total; n++) {
    const row = n < counts[0] ? 0 : 1;
    const i = row === 0 ? n : n - counts[0];
    walkers.push({
      // The back row always passes behind me, so I'm never hidden; the front row passes in front,
      // across my legs only
      layer: row === 1 ? 1 : 0,
      // Sized so their heads stay smaller than mine: the back row's heads level with my face, the
      // front row cut off a little below the band
      h: row === 0 ? 0.27 + 0.05 * rand(n + 8) : 0.34 + 0.05 * rand(n + 8),
      feet: row === 0 ? 0.6 + 0.05 * rand(n + 4) : 1.02 + 0.04 * rand(n + 4),
      speed: [0.7, 1.05][row] * (0.88 + 0.24 * rand(n + 97)),
      phase: (i + 0.85 * rand(n + 41)) / counts[row],
      dir: row === 0 ? 1 : -1,
      look: (Math.floor((FIGURE_COUNT * n) / total) * 11) % FIGURE_COUNT,
      // About one in five of the back row, whose heads stand clear of everyone else
      mark: row === 0 && rand(n + 200) < 0.22 ? ((1 + Math.floor(rand(n + 300) * 3)) as 1 | 2 | 3) : 0,
    });
  }
  // Nearer (lower) walkers drawn last, over the ones behind them
  return walkers.sort((a, b) => a.feet - b.feet);
};

/**
 * The footer's crowd band: the name in the back, then the crowd walking past me, drawn on two
 * canvases so the back row can pass behind me and the rest in front. A click (or Enter) pauses
 * and resumes; it walks only while the band is on screen and the tab is visible, and stands
 * still for reduced motion or the footer's animation switch.
 */
export const Crowd = ({ motionOff }: { motionOff: boolean }) => {
  const band = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotionConfig();
  const still = motionOff || !!reduceMotion;
  // Read by the running loop without restarting it
  const state = useRef({ paused, still, sync: () => {} });

  useEffect(() => {
    state.current.paused = paused;
    state.current.still = still;
    state.current.sync();
  }, [paused, still]);

  useEffect(() => {
    const el = band.current;
    const canvases = [back.current, front.current];
    const ctxs = canvases.map((c) => c?.getContext("2d") ?? null);
    if (!el || !canvases[0] || !canvases[1] || !ctxs[0] || !ctxs[1]) return;
    const layers = ctxs as CanvasRenderingContext2D[];
    const shared = state.current;

    let disposed = false;
    let ready = false;
    let visible = false;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let crowd: Walker[] = [];
    let widest = 0;
    // Each drawing rasterised once per size, so a frame only copies bitmaps
    let sprites: HTMLCanvasElement[] = [];
    // Walking time, kept across pauses so the crowd resumes where it stopped
    let t = 0;
    let last = 0;
    let raf = 0;
    const images = FIGURES.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });

    const rasterise = () => {
      const tallest = Math.ceil(0.4 * H * dpr);
      sprites = images.map((img) => {
        const c = document.createElement("canvas");
        c.height = tallest;
        c.width = Math.ceil(tallest * ASPECT);
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        return c;
      });
    };

    const draw = () => {
      layers.forEach((ctx) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
      });
      const loop = W + 2 * widest;
      for (const w of crowd) {
        const lapsDone = w.phase + (t * w.speed) / CROSSING;
        const lap = Math.floor(lapsDone);
        const along = lapsDone - lap;
        const sprite = sprites[(w.look + 11 * lap) % FIGURE_COUNT];
        if (!sprite) continue;
        const h = w.h * H;
        const width = h * ASPECT;
        const x = (w.dir === 1 ? along : 1 - along) * loop - widest;
        // Two small bounces per stride, in time with this walker's own pace
        const bob = shared.still ? 0 : (1 - Math.cos((t * w.speed + 10 * w.phase) * Math.PI * 4)) * H * 0.009;
        const ctx = layers[w.layer];
        ctx.save();
        ctx.translate(x + width / 2, w.feet * H - h - bob);
        ctx.scale(w.dir === FACING ? 1 : -1, 1);
        ctx.drawImage(sprite, -width / 2, 0, width, h);
        if (w.mark) drawMark(ctx, w.mark, width, h);
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      if (last) t += Math.min(0.05, (now - last) / 1000);
      last = now;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (!ready || disposed) return;
      draw();
      const s = shared;
      if (visible && !document.hidden && !s.paused && !s.still) raf = requestAnimationFrame(frame);
    };
    shared.sync = sync;

    const resize = () => {
      if (!ready || disposed) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === W && h === H) return;
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvases.forEach((c) => {
        if (!c) return;
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      });
      crowd = makeCrowd(W);
      widest = Math.max(...crowd.map((w) => w.h * H * ASPECT));
      rasterise();
      sync();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    document.addEventListener("visibilitychange", sync);
    Promise.all(images.map((img) => img.decode()))
      .then(() => {
        if (disposed) return;
        ready = true;
        resize();
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      shared.sync = () => {};
    };
  }, []);

  return (
    <button
      ref={band}
      type="button"
      onClick={() => setPaused((p) => !p)}
      aria-pressed={paused}
      aria-label={still ? `${PROFILE.first}, among the crowd` : paused ? "Let the crowd walk" : "Pause the crowd"}
      disabled={still}
      className="relative block w-full h-[clamp(320px,38vw,600px)] overflow-hidden bg-snow text-night cursor-pointer disabled:cursor-default select-none"
    >
      <span
        aria-hidden="true"
        className="grain absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
      />
      {/* The name, behind everything: the one clipped wordmark CLAUDE.md allows */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[3%] -translate-x-1/2 whitespace-nowrap font-body font-semibold uppercase tracking-[-0.05em] leading-none text-[17.5vw] text-night/[0.07]"
      >
        {PROFILE.first}.
      </span>
      <canvas ref={back} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* Me, standing still between the rows while everyone walks: the back row passes behind me,
          the front row across my legs */}
      <img
        src={ME}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[78%] aspect-[511/1492] max-w-none pointer-events-none"
      />
      <canvas ref={front} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />
    </button>
  );
};
