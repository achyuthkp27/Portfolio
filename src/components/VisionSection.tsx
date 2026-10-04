import { motion, useInView, useReducedMotionConfig } from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "@/data/profile";
import { pad2 as pad } from "@/lib/format";

const PRINCIPLES = PROFILE.principles;
const N = PRINCIPLES.length;
const OUT = [0.16, 1, 0.3, 1] as const;

/**
 * (How I think): three principles, one per screen-height row. Each flies in once from the
 * distance (small, blurred, faded) to reading size the moment it reaches the screen, its
 * note following a beat later, and then stays. Nothing is tied to scroll position, so a
 * fast scroll still lands on three readable lines. Reduced motion shows them in place.
 */
const VisionSection = () => (
  <section id="vision" data-reveal-skip aria-label="How I think" className="theme-dark text-snow relative">
    <p className="t-label relative text-center pt-24 md:pt-32">How I think</p>
    <ol className="relative">
      {PRINCIPLES.map((pr, i) => (
        <Principle key={pr.title} index={i} title={pr.title} note={pr.note} />
      ))}
    </ol>
  </section>
);

const Principle = ({ index, title, note }: { index: number; title: string; note: string }) => {
  const still = useReducedMotionConfig();
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const on = still || seen;
  return (
    <li
      ref={ref}
      className="min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <p className="font-mono text-[13px] tracking-[0.2em] text-emerald-400 mb-6">
        {pad(index + 1)} / {pad(N)}
      </p>
      <motion.p
        initial={still ? false : { opacity: 0, scale: 0.2, filter: "blur(14px)" }}
        animate={on ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 1.1, ease: OUT }}
        className="font-display font-semibold uppercase leading-[0.95] tracking-[-0.005em] text-[13vw] md:text-[8vw] lg:text-[min(8rem,15vh)] max-w-[14ch] text-balance will-change-transform"
      >
        {title}
      </motion.p>
      <motion.p
        initial={still ? false : { opacity: 0, y: 16 }}
        animate={on ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: OUT, delay: 0.45 }}
        className="t-body text-snow/70 mt-6 md:mt-8 max-w-xl"
      >
        {note}
      </motion.p>
    </li>
  );
};

export default VisionSection;
