import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";

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
  const [offset, setOffset] = useState(0);
  const [geom, setGeom] = useState<{ radius: number; glyphs: Glyph[]; length: number }>({
    radius: 400,
    glyphs: [],
    length: 1,
  });

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return () => window.removeEventListener("resize", size);
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      if (visible) setOffset((o) => o + dt * 0.09);
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

  const { radius, glyphs, length } = geom;
  const degPerPx = 180 / (Math.PI * radius);
  const head = offset % length;

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
        className="relative h-[200px] md:h-[240px] [perspective:900px]"
        aria-label={`Technologies: ${items.join(", ")}`}
      >
        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ transform: `translateZ(-${radius}px)` }}
        >
          {glyphs.map((g, j) => {
            // Distance along the strip from the point currently at the front, wrapped to the nearest copy
            let d = (g.pos - head) % length;
            if (d > length / 2) d -= length;
            if (d < -length / 2) d += length;
            const deg = d * degPerPx;
            const a = Math.abs(deg);
            if (a > 180) return null;
            const front = a <= 90;
            // Front half: sharp near the centre, blurring and dimming with the angle. Back half: faint ghosts.
            const t = Math.min(1, Math.max(0, (a - 12) / 78));
            // Back ghosts read clearly through, like the reversed logos behind Spector's ring
            const opacity = front ? 1 - t * 0.65 : 0.32;
            const blur = front ? t * 6 : 9;
            return (
              <span
                key={j}
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 text-snow will-change-transform ${TYPE}`}
                style={{
                  // Centre the glyph on its anchor first, then push it out to the drum and turn it
                  transform: `rotateY(${deg}deg) translateZ(${radius}px) translate(-50%, -50%)`,
                  opacity,
                  filter: blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none",
                }}
              >
                {g.ch}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StackMarquee;
