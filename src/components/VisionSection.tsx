import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotionConfig,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "@/data/profile";
import { clamp01, pad2 as pad } from "@/lib/format";

const PRINCIPLES = PROFILE.principles;
const N = PRINCIPLES.length;
/** At most this many principles per second, however fast the page is scrolled */
const MAX_UNITS_PER_SECOND = 1.1;
/** How far, in principles, the scene may trail the scroll during a fast flick */
const MAX_LAG = 0.45;

/**
 * (How I think): a fly-through. Each principle starts as a speck in the distance, rushes
 * toward you, holds at reading size while its note fades in, then blows past and the next
 * one appears far away. Only the words move; the ground stays still. The shown position
 * chases the scroll at a capped speed, so a fast flick can't skip a principle before it has
 * fully appeared. Reduced motion gets the principles as a plain list.
 */
const VisionSection = () => {
  const reduceMotion = useReducedMotionConfig();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // One unit per principle, with a little lead-in and run-out
  const target = useTransform(p, (v) => v * (N + 0.2) - 0.1);
  // What is shown follows the scroll at a capped speed, so a fast flick still plays each
  // principle through (approach, hold, pass) at a readable pace instead of skipping it
  const units = useMotionValue(target.get());
  useAnimationFrame((_, delta) => {
    const want = target.get();
    const have = units.get();
    if (reduceMotion || Math.abs(want - have) < 0.0005) {
      if (have !== want) units.set(want);
      return;
    }
    const maxStep = (Math.min(delta, 64) / 1000) * MAX_UNITS_PER_SECOND;
    const next = have + Math.max(-maxStep, Math.min(maxStep, want - have));
    // Never trail the scroll by more than MAX_LAG, so the scene is finished by the time the
    // section unpins and nothing slides away with the page half-played
    units.set(Math.max(want - MAX_LAG, Math.min(want + MAX_LAG, next)));
  });
  const counter = useTransform(units, (u) => pad(Math.min(N, Math.max(1, Math.floor(u) + 1))));

  if (reduceMotion) {
    return (
      <section id="vision" className="theme-dark text-snow py-24 px-6 md:px-10 lg:px-12">
        <p className="t-label text-center mb-12">How I think</p>
        <ul className="max-w-4xl mx-auto space-y-12 text-center">
          {PRINCIPLES.map((pr) => (
            <li key={pr.title}>
              <p className="font-display font-semibold uppercase leading-[0.95] text-5xl md:text-7xl">{pr.title}</p>
              <p className="t-body text-muted mt-4 max-w-xl mx-auto">{pr.note}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      id="vision"
      ref={ref}
      data-reveal-skip
      data-glass-off
      aria-label="How I think"
      className="theme-dark text-snow relative"
      style={{ height: `${N * 160 + 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Crosshair: two faint hairlines through the centre, the stage the principles fly through */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-snow/[0.08]" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-snow/[0.08]" />
        </div>
        <p className="t-label absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-10">How I think</p>

        {PRINCIPLES.map((pr, i) => (
          <Principle key={pr.title} index={i} title={pr.title} note={pr.note} units={units} />
        ))}

        <div
          aria-hidden="true"
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono text-[13px] tracking-[0.2em]"
        >
          <motion.span className="text-emerald-400 tabular-nums">{counter}</motion.span>
          <span className="w-10 h-px bg-snow/25" />
          <span className="text-snow/60">{pad(N)}</span>
        </div>
      </div>
    </section>
  );
};

/** One principle on its own stretch of the timeline: far, near, through */
const Principle = ({
  index,
  title,
  note,
  units,
}: {
  index: number;
  title: string;
  note: string;
  units: MotionValue<number>;
}) => {
  // t runs 0 → 1 across this principle's unit: approach 0–0.3, a long hold 0.3–0.75, pass 0.75–1
  const t = useTransform(units, (u) => u - index);
  const scale = useTransform(t, (v) => {
    if (v <= 0.3) return 0.08 + 0.92 * Math.pow(clamp01(v / 0.3), 2.2);
    if (v <= 0.75) return 1;
    return 1 + Math.pow(clamp01((v - 0.75) / 0.25), 2) * 7;
  });
  const opacity = useTransform(t, (v) => {
    if (v < 0) return 0;
    if (v <= 0.12) return clamp01(v / 0.12);
    if (v <= 0.82) return 1;
    return 1 - clamp01((v - 0.82) / 0.12);
  });
  const blur = useTransform(t, (v) => (v > 0.8 ? `blur(${clamp01((v - 0.8) / 0.16) * 10}px)` : "blur(0px)"));
  const noteOpacity = useTransform(t, (v) =>
    v < 0.28 || v > 0.8 ? 0 : Math.min(clamp01((v - 0.28) / 0.08), clamp01((0.8 - v) / 0.06)),
  );
  const noteY = useTransform(noteOpacity, (o) => (1 - o) * 16);
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));
  return (
    <motion.div
      style={{ opacity, visibility }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <motion.p
        style={{ scale, filter: blur }}
        className="font-display font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-[17vw] md:text-[8vw] lg:text-[min(8rem,15vh)] max-w-[14ch] text-balance will-change-transform"
      >
        {title}
      </motion.p>
      <motion.p style={{ opacity: noteOpacity, y: noteY }} className="t-body text-snow/70 mt-6 md:mt-8 max-w-xl">
        {note}
      </motion.p>
    </motion.div>
  );
};

export default VisionSection;
