import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import { DUR, EASE } from "@/lib/motion";

/**
 * (How I think): principles one at a time on a sticky graphite stage, scrubbed by scroll,
 * the way the reference's vision section moves. Each line's letters swing in from the
 * left with a stagger and fall away when the next line takes over. A crosshair with a
 * marker tracks progress. With reduced motion the lines simply stack.
 */
const lines = PROFILE.principles.map((p) => p.title);

const KineticLine = ({ text }: { text: string }) => (
  <motion.p
    key={text}
    initial="hidden"
    animate="show"
    exit="exit"
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.028 } },
      exit: { transition: { staggerChildren: 0.014 } },
    }}
    className="font-body font-semibold tracking-[-0.035em] leading-[1.05] text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] text-snow text-center text-balance"
    aria-label={text}
  >
    {text.split(" ").map((word, w) => (
      <span key={w} className="inline-block whitespace-nowrap">
        {word.split("").map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            variants={{
              hidden: { opacity: 0, y: 48, rotate: -8, filter: "blur(4px)" },
              show: { opacity: 1, y: 0, rotate: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
              exit: { opacity: 0, y: -40, rotate: 6, filter: "blur(3px)", transition: { duration: DUR.fast } },
            }}
            className="inline-block origin-bottom-left will-change-transform"
          >
            {ch}
          </motion.span>
        ))}
        {w < text.split(" ").length - 1 && <span aria-hidden="true">&nbsp;</span>}
      </span>
    ))}
  </motion.p>
);

const VisionSection = () => {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(lines.length - 1, Math.max(0, Math.floor(v * lines.length)));
    if (next !== index) setIndex(next);
  });
  // The crosshair marker travels along the horizontal line with progress
  const markerX = useTransform(scrollYProgress, [0, 1], ["8%", "92%"]);

  if (reduceMotion) {
    return (
      <section id="vision" className="theme-dark bg-night text-snow py-24 px-6 md:px-10 lg:px-12">
        <p className="t-label text-center mb-10">How I think</p>
        <ul className="max-w-4xl mx-auto space-y-6 text-center">
          {lines.map((l) => (
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
      style={{ height: `${lines.length * 90 + 40}vh` }}
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

        <div className="relative w-full max-w-6xl min-h-[9rem] flex items-center justify-center">
          <KineticLine key={index} text={lines[index]} />
        </div>

        <div className="relative flex items-center gap-3 t-figure text-xs text-muted">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="w-8 h-px bg-line" aria-hidden="true" />
          <span>{String(lines.length).padStart(2, "0")}</span>
          <span className="ml-4 font-body normal-case">(Scroll for more)</span>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
