import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * A lanyard badge, drawn in CSS: strap, clip, and a dark card carrying the award, the
 * organisation's mark set in type, and the year. It drops in from the top edge of the
 * card as the section scrolls into view, on a spring so it overshoots and settles, and
 * swings with its own velocity.
 */
export const LanyardBadge = ({ target }: { target: React.RefObject<HTMLElement> }) => {
  const reduceMotion = useReducedMotion();
  // The strap hangs from the card's top edge only when the badge sits beside the copy
  const [beside, setBeside] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setBeside(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.95", "start 0.4"] });
  const drop = useTransform(scrollYProgress, [0, 1], reduceMotion || !beside ? [0, 0] : [-360, 0]);
  const y = useSpring(drop, { stiffness: 110, damping: 9, mass: 1.05 });
  const velocity = useVelocity(y);
  const swing = useTransform(velocity, [-3000, 3000], [-9, 9]);
  const rotate = useSpring(swing, { stiffness: 90, damping: 8 });

  return (
    <motion.div
      style={{ y, rotate }}
      className="relative w-[200px] md:w-[224px] origin-top will-change-transform"
      aria-hidden="true"
    >
      {/* Strap: tall enough to stay attached to the top edge while the card drops */}
      <div className="mx-auto w-9 h-24 md:h-[420px] md:-mt-[320px] bg-night rounded-b-sm shadow-[inset_0_0_0_1px_hsl(0_0%_100%/0.08)]" />
      {/* Clip */}
      <div className="relative mx-auto -mt-2 w-10 h-10">
        <div className="absolute inset-0 rounded-full border-[5px] border-night" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-4 bg-night rounded-b-sm" />
      </div>
      {/* Card */}
      <div className="relative mt-1 rounded-lg bg-night text-snow p-5 md:p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] border border-snow/10">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1.5 rounded-pill bg-snow/15" />
        <p className="mt-4 font-body text-[15px] font-semibold leading-tight text-snow/85">
          Above &amp; Beyond
          <br />
          Individual Award
        </p>
        <p className="mt-1 text-[11px] font-medium text-emerald-300">FIS Global · Q1</p>
        <p className="mt-10 t-heading text-4xl tracking-[0.12em] text-snow">FIS</p>
        <p className="t-figure text-[10px] text-muted mt-1">Global</p>
        <p className="mt-8 text-[12px] font-medium text-snow/85">Critical project delivery</p>
        <p className="t-figure text-sm text-muted mt-1">2024</p>
      </div>
    </motion.div>
  );
};

export default LanyardBadge;
