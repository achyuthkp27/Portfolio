import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { PROFILE } from "@/data/profile";

/**
 * (How I think): a continuous stream of letters scrubbed by scroll, as the reference's
 * vision section moves. Every letter of every line sits on one global timeline: it rises
 * in from below, holds, then leaves upward, one letter after another, so the tail of one
 * line is still fading while the head of the next arrives. All lines stack in the same
 * spot. No rotation, no blur, only travel and opacity. With reduced motion the lines
 * simply stack as a list.
 */
const LINES = PROFILE.principles.map((p) => p.title);

/**
 * Timeline units: one per letter. A line enters letter by letter, holds whole, then exits
 * letter by letter, and the next line begins only after it has fully gone, so lines never
 * overlap on the stage.
 */
const ENTER = 10;
const HOLD = 14;
const EXIT = 8;
/** Vertical travel in and out, in px */
const TRAVEL = 125;
/** Scroll distance per timeline unit, in px */
const PX_PER_UNIT = 40;

interface LetterTiming {
  ch: string;
  enter: number;
  exit: number;
}

interface LetterProps extends LetterTiming {
  progress: MotionValue<number>;
}

const Letter = ({ ch, enter, exit, progress }: LetterProps) => {
  const inEnd = enter + ENTER;
  const outEnd = exit + EXIT;
  const y = useTransform(progress, [enter, inEnd, exit, outEnd], [TRAVEL, 0, 0, -TRAVEL]);
  const opacity = useTransform(progress, [enter, inEnd, exit, outEnd], [0, 1, 1, 0]);
  return (
    <motion.span style={{ y, opacity }} className="inline-block will-change-transform" aria-hidden="true">
      {ch}
    </motion.span>
  );
};

const VisionSection = () => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Per-line schedule on one scroll timeline
  const plan = useMemo(() => {
    let base = 0;
    return LINES.map((text) => {
      const letters = [...text.replace(/\s/g, "")].length;
      // Every letter is in by base + letters + ENTER; the line then holds; then letters leave in order
      const exitBase = base + letters + ENTER + HOLD;
      let i = 0;
      const words = text.split(" ").map((word) =>
        [...word].map((ch) => {
          const t = { ch, enter: base + i, exit: exitBase + i };
          i += 1;
          return t;
        }),
      );
      const end = exitBase + letters + EXIT;
      const line = { text, words, from: base, to: end };
      // The next line starts only once every letter of this one has left
      base = end;
      return line;
    });
  }, []);
  const total = plan[plan.length - 1].to;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const units = useTransform(scrollYProgress, [0, 1], [-ENTER, total]);
  const markerX = useTransform(scrollYProgress, [0, 1], ["8%", "92%"]);

  const [index, setIndex] = useState(0);
  useMotionValueEvent(units, "change", (u) => {
    const next = plan.findIndex((l) => u < l.to - EXIT - ENTER);
    const clamped = next < 0 ? plan.length - 1 : next;
    if (clamped !== index) setIndex(clamped);
  });

  if (reduceMotion) {
    return (
      <section id="vision" className="theme-dark bg-night text-snow py-24 px-6 md:px-10 lg:px-12">
        <p className="t-label text-center mb-10">How I think</p>
        <ul className="max-w-4xl mx-auto space-y-6 text-center">
          {LINES.map((l) => (
            <li key={l} className="font-body font-semibold tracking-[-0.03em] text-4xl md:text-6xl">
              {l}
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
      className="theme-dark bg-night text-snow relative"
      style={{ height: `calc(${total * PX_PER_UNIT}px + 100vh)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-between px-6 md:px-10 lg:px-12 pt-24 md:pt-28 pb-10">
        {/* Crosshair */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-snow/[0.08]" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-snow/[0.08]" />
          <motion.span
            style={{ left: markerX }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-snow/80"
          />
        </div>

        <p className="t-label relative">How I think</p>

        {/* All lines stack in the same spot; the timeline decides what is visible */}
        <div className="relative w-full max-w-[1300px] h-[9rem] md:h-[12rem]">
          {plan.map((line) => (
            <p
              key={line.text}
              aria-label={line.text}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-body font-semibold tracking-[-0.035em] leading-[1.12] text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.6rem] text-snow text-center text-balance"
            >
              {line.words.map((letters, w) => (
                <span key={w} className="inline-block whitespace-nowrap">
                  {letters.map((l) => (
                    <Letter key={l.enter} ch={l.ch} enter={l.enter} exit={l.exit} progress={units} />
                  ))}
                  {w < line.words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
                </span>
              ))}
            </p>
          ))}
        </div>

        <div className="relative flex items-center gap-3 t-figure text-xs text-muted">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="w-8 h-px bg-line" aria-hidden="true" />
          <span>{String(LINES.length).padStart(2, "0")}</span>
          <span className="ml-4 font-body normal-case">(Scroll for more)</span>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
