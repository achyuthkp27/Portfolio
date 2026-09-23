import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";

/**
 * (The stack): tool names on two slowly counter-revolving cylinders, the way Spector spins
 * its client logos. Each name sits on a face of a 3D ring; faces turning away blur and fade
 * and the nearest ones are crisp. One requestAnimationFrame, paused off screen, still
 * under reduced motion.
 */

const Ring = ({
  items,
  angle,
  radius,
  className = "",
}: {
  items: readonly string[];
  angle: number;
  radius: number;
  className?: string;
}) => {
  const step = 360 / items.length;
  return (
    <ul
      className={`absolute inset-0 [transform-style:preserve-3d] ${className}`}
      style={{ transform: `translateZ(-${radius}px) rotateY(${angle}deg)` }}
    >
      {items.map((item, i) => {
        const rel = ((((i * step + angle) % 360) + 360) % 360) * (Math.PI / 180);
        const t = (Math.cos(rel) + 1) / 2; // 1 front, 0 back
        return (
          <li
            key={item}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap t-heading text-2xl md:text-3xl lg:text-4xl text-snow will-change-transform"
            style={{
              transform: `rotateY(${-i * step}deg) translateZ(${radius}px)`,
              opacity: 0.06 + t * 0.94,
              filter: `blur(${((1 - t) * 5).toFixed(1)}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
};

const StackMarquee = () => {
  const half = Math.ceil(PROFILE.stack.length / 2);
  const top = PROFILE.stack.slice(0, half);
  const bottom = PROFILE.stack.slice(half);
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(900);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const size = () => setRadius(Math.max(420, Math.min(1100, el.clientWidth * 0.75)));
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
      if (visible) setAngle((a) => (a + dt * 0.01) % 360);
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
          className="mb-4 lg:mb-6"
        />
      </div>

      <div
        ref={ref}
        data-reveal-skip
        className="relative h-[200px] md:h-[240px] [perspective:1200px]"
        aria-label="Technologies"
      >
        <div className="absolute inset-x-0 top-0 h-1/2 [transform-style:preserve-3d]">
          <Ring items={top} angle={angle} radius={radius} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 [transform-style:preserve-3d]">
          <Ring items={bottom} angle={-angle + 15} radius={radius} />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-night to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-night to-transparent pointer-events-none"
        />
      </div>
    </section>
  );
};

export default StackMarquee;
