import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motionPreference";

/**
 * Drifting smoke for a dark card, rendered on a canvas: layered value noise, domain-warped
 * and advected over time, drawn at low resolution and upscaled with blur so wisps curl
 * and move like Spector's smoke video, with no asset. Pauses off screen and when the tab
 * is hidden; renders one still frame under reduced motion.
 */

// Small deterministic hash for value noise
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const noise = (x: number, y: number) => {
  const xi = Math.floor(x),
    yi = Math.floor(y);
  const xf = x - xi,
    yf = y - yi;
  const a = hash(xi, yi),
    b = hash(xi + 1, yi),
    c = hash(xi, yi + 1),
    d = hash(xi + 1, yi + 1);
  const u = smooth(xf),
    v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x: number, y: number) => {
  let v = 0,
    amp = 0.5,
    f = 1;
  for (let i = 0; i < 4; i++) {
    v += amp * noise(x * f, y * f);
    amp *= 0.5;
    f *= 2.1;
  }
  return v;
};

export const Smoke = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 96,
      H = 128;
    canvas.width = W;
    canvas.height = H;
    const img = ctx.createImageData(W, H);
    const data = img.data;
    const reduce = prefersReducedMotion();

    let raf = 0;
    let visible = true;
    let last = 0;

    const draw = (t: number) => {
      const time = t * 0.00012;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const nx = x / W,
            ny = y / H;
          // Domain warp: two noise fields bend the sampling coordinates, then advect upward
          const qx = fbm(nx * 3 + time * 0.7, ny * 3 - time * 0.9);
          const qy = fbm(nx * 3 + 5.2 + time * 0.5, ny * 3 + 1.3 - time * 0.6);
          const v = fbm(nx * 2.2 + qx * 1.6, ny * 2.2 + qy * 1.6 - time * 1.4);
          // Contrast so wisps read as strands, and a centre vignette so edges stay dark
          const dx = nx - 0.5,
            dy = ny - 0.5;
          const vignette = Math.max(0, 1 - (dx * dx * 2.2 + dy * dy * 1.3));
          const s = Math.max(0, v - 0.28) * 2.1 * vignette;
          const lum = Math.min(255, s * s * 255);
          const i = (y * W + x) * 4;
          data[i] = data[i + 1] = data[i + 2] = lum;
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = (t: number) => {
      if (visible && t - last > 40) {
        last = t;
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    draw(0);
    if (reduce) return;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && document.visibilityState === "visible";
    });
    io.observe(canvas);
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={ref} className="absolute inset-[-8%] w-[116%] h-[116%] opacity-50 blur-[7px] mix-blend-screen" />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-screen" />
    </div>
  );
};

export default Smoke;
