import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";

const TYPE = "t-heading text-5xl md:text-7xl lg:text-8xl whitespace-nowrap";

/**
 * (The stack): a small drum turning about its vertical axis with big names on its faces.
 * Each face is exactly one chord wide, and the chord is measured from the widest name at
 * the current type size, so names never collide. Only the face at the front is sharp;
 * every other face blurs and dims in proportion to its angle away, and the back is hidden.
 * The full list cycles onto the faces as each passes through the back.
 */
const StackMarquee = () => {
  const items = PROFILE.stack;
  const ref = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLUListElement>(null);
  const [angle, setAngle] = useState(0);
  const [geom, setGeom] = useState({ faces: 6, radius: 640 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const size = () => {
      const w = el.clientWidth;
      const widest = Math.max(
        80,
        ...Array.from(measure.current?.children ?? []).map((c) => (c as HTMLElement).offsetWidth),
      );
      const chord = widest + (w < 640 ? 32 : 64);
      const faces = w < 640 ? 4 : w < 1024 ? 4 : 6;
      setGeom({ faces, radius: (chord * faces) / (2 * Math.PI) });
    };
    size();
    document.fonts?.ready.then(size);
    window.addEventListener("resize", size);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return () => window.removeEventListener("resize", size);
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      if (visible) setAngle((a) => a + dt * 0.012);
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
      window.removeEventListener("resize", size);
    };
  }, []);

  const { faces, radius } = geom;
  const step = 360 / faces;

  return (
    <section className="theme-dark bg-night text-snow py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <SectionHeader
          label="The stack"
          title="Tools I ship with"
          description="Every technology here has carried production banking traffic under my name."
          align="center"
          className="mb-2 lg:mb-4"
        />
      </div>

      {/* Off-screen copies of every name, used only to measure the widest one */}
      <ul ref={measure} aria-hidden="true" className="absolute -left-[9999px] top-0 flex gap-0 invisible">
        {items.map((item) => (
          <li key={item} className={TYPE}>
            {item}
          </li>
        ))}
      </ul>

      <div
        ref={ref}
        data-reveal-skip
        className="relative h-[220px] md:h-[280px] [perspective:1000px]"
        aria-label="Technologies"
      >
        <ul
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: `translateZ(-${radius}px) rotateY(${angle % 360}deg)` }}
        >
          {Array.from({ length: faces }, (_, k) => {
            const u = angle - k * step;
            let rel = u % 360;
            if (rel > 180) rel -= 360;
            if (rel < -180) rel += 360;
            const a = Math.abs(rel);
            const lap = Math.floor((u + 180) / 360);
            const item = items[(((k + faces * lap) % items.length) + items.length) % items.length];
            const hidden = a >= 90;
            // Sharp for the middle of a face's front pass, then blur and dim grow with the angle
            const sharp = step * 0.22;
            const t = Math.min(1, Math.max(0, (a - sharp) / (90 - sharp)));
            return (
              <li
                key={k}
                aria-hidden={hidden ? true : undefined}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-snow will-change-transform ${TYPE}`}
                style={{
                  transform: `rotateY(${-k * step}deg) translateZ(${radius}px)`,
                  opacity: hidden ? 0 : 1 - t * 0.75,
                  filter: t > 0 ? `blur(${(t * 9).toFixed(1)}px)` : "none",
                  visibility: hidden ? "hidden" : "visible",
                  backfaceVisibility: "hidden",
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default StackMarquee;
