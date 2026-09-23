import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";

/**
 * (The stack): tool names on one slowly revolving ring, the way Spector spins its client
 * logos. Only the names facing the viewer are sharp; as a name turns toward the edge it
 * stretches into a horizontal motion streak and fades, and anything past the edge is
 * hidden. One requestAnimationFrame, paused off screen, still under reduced motion.
 */
const StackMarquee = () => {
  const items = PROFILE.stack;
  const n = items.length;
  const step = 360 / n;
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(2200);
  const [cone, setCone] = useState(22);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Large radius so the front of the ring is nearly flat and only a few names are visible
    const size = () => {
      const w = el.clientWidth;
      // Neighbours sit 15° apart; a radius of ~1.5× width puts them ~0.39× width apart, so
      // three names fit on a desktop with clear air between them, and one on a phone
      setRadius(w * 1.85);
      setCone(w < 768 ? 10 : 22);
    };
    size();
    window.addEventListener("resize", size);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return () => window.removeEventListener("resize", size);
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      if (visible) setAngle((a) => (a + dt * 0.006) % 360);
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

      <div
        ref={ref}
        data-reveal-skip
        className="relative h-[220px] md:h-[260px] [perspective:3000px]"
        aria-label="Technologies"
      >
        <ul
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: `translateZ(-${radius}px) rotateY(${angle}deg)` }}
        >
          {items.map((item, i) => {
            // Signed angle from the front, -180..180
            // Item i is placed at -i·step on the ring and the ring turns by +angle
            let rel = (angle - i * step) % 360;
            if (rel > 180) rel -= 360;
            if (rel < -180) rel += 360;
            const a = Math.abs(rel);
            // Visible cone: sharp inside half the cone, streaking out to its edge, gone beyond
            const t = Math.min(1, Math.max(0, (a - cone / 2) / (cone / 2)));
            const hidden = a > cone;
            const opacity = hidden ? 0 : 1 - t * 0.9;
            const blur = t * 10;
            const stretch = 1 + t * 1.6;
            return (
              <li
                key={item}
                aria-hidden={hidden ? true : undefined}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap t-heading text-5xl md:text-6xl lg:text-7xl text-snow will-change-transform"
                style={{
                  transform: `rotateY(${-i * step}deg) translateZ(${radius}px) scaleX(${stretch.toFixed(3)})`,
                  opacity,
                  filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none",
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
