import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motionPreference";
import { PROFILE } from "@/data/profile";
import { StepHeadline } from "./ui/StepHeadline";

const TYPE = "t-heading text-4xl md:text-5xl lg:text-6xl whitespace-nowrap";
const GAP = 56;

interface Glyph {
  ch: string;
  /** Position along the strip of all names, in px */
  pos: number;
}

/**
 * (The stack): names wrapped around a small drum that turns about its vertical axis. All
 * names are laid end to end with a fixed gap on a strip, and the strip is bent onto the
 * cylinder letter by letter, so words curve and there are no empty slots. Letters at the
 * front are sharp; they blur and dim as they turn away, and the back half shows through as
 * faint reversed ghosts, the way a real drum would.
 */
const StackMarquee = () => {
  const items = PROFILE.stack;
  const ref = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLUListElement>(null);
  const drum = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<{ radius: number; glyphs: Glyph[]; length: number }>({
    radius: 400,
    glyphs: [],
    length: 1,
  });
  const geomRef = useRef(geom);
  geomRef.current = geom;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const size = () => {
      const w = el.clientWidth;
      const glyphs: Glyph[] = [];
      let cursor = 0;
      Array.from(measure.current?.children ?? []).forEach((li) => {
        const spans = Array.from(li.children) as HTMLElement[];
        spans.forEach((s) => glyphs.push({ ch: s.textContent ?? "", pos: cursor + s.offsetLeft + s.offsetWidth / 2 }));
        cursor += (li as HTMLElement).offsetWidth + GAP;
      });
      // A small drum: its radius sets how tight the curve looks, not how many names fit
      setGeom({ radius: Math.max(190, Math.min(420, w * 0.28)), glyphs, length: cursor || 1 });
    };
    size();
    document.fonts?.ready.then(size);
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  // The turn is written straight to each glyph's style every frame: no React re-render
  // for ~400 spans at 60fps. Geometry changes (resize, font load) re-render the spans.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let offset = 0;
    const paint = () => {
      const { radius, glyphs, length } = geomRef.current;
      const spans = drum.current?.children;
      if (!spans) return;
      const degPerPx = 180 / (Math.PI * radius);
      const head = offset % length;
      for (let j = 0; j < glyphs.length && j < spans.length; j++) {
        const span = spans[j] as HTMLElement;
        let d = (glyphs[j].pos - head) % length;
        if (d > length / 2) d -= length;
        if (d < -length / 2) d += length;
        const deg = d * degPerPx;
        const a = Math.abs(deg);
        if (a > 180) {
          span.style.display = "none";
          continue;
        }
        const front = a <= 90;
        const t = Math.min(1, Math.max(0, (a - 12) / 78));
        const opacity = front ? 1 - t * 0.65 : 0.32;
        const blur = front ? t * 6 : 9;
        span.style.display = "";
        span.style.transform = `rotateY(${deg}deg) translateZ(${radius}px) translate(-50%, -50%)`;
        span.style.opacity = String(opacity);
        span.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
      }
    };
    paint();
    if (prefersReducedMotion()) return;
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      if (visible) {
        offset += dt * 0.09;
        paint();
      }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [geom]);

  const { radius, glyphs } = geom;

  return (
    <section className="theme-dark bg-night text-snow pt-20 lg:pt-24 pb-6 lg:pb-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 mb-4 lg:mb-6">
        <div className="flex items-start justify-between gap-6 mb-8">
          <p className="t-label">The stack</p>
          <p className="t-caps text-muted text-right hidden sm:block">
            Every tool here has carried production traffic.
          </p>
        </div>
        <StepHeadline lines={["Tools", "I have shipped with.", "Every one of them", "in production."]} />
      </div>

      {/* Off-screen copies of every name, letter by letter, used only for measuring */}
      <ul ref={measure} aria-hidden="true" className="absolute -left-[9999px] top-0 invisible">
        {items.map((item) => (
          <li key={item} className={`${TYPE} inline-block mr-10`}>
            {[...item].map((ch, i) => (
              <span key={i} className="inline-block">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </li>
        ))}
      </ul>

      <div
        ref={ref}
        data-reveal-skip
        className="relative h-[120px] md:h-[150px] [perspective:900px]"
        aria-label={`Technologies: ${items.join(", ")}`}
      >
        <div
          ref={drum}
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: `translateZ(-${radius}px)` }}
        >
          {glyphs.map((g, j) => (
            <span
              key={j}
              aria-hidden="true"
              className={`absolute left-1/2 top-1/2 text-snow will-change-transform ${TYPE}`}
            >
              {g.ch}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackMarquee;
