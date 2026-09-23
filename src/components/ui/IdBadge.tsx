import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { PROFILE } from "@/data/profile";

export interface IdBadgeFace {
  key: string;
  company: string;
  role: string;
  period: string;
  logo?: { src: string; width: number; height: number };
}

/**
 * A staff ID on a lanyard, drawn in CSS: a strap, a clip, and a white card with the
 * employer's mark, the portrait, the name and role, and a barcode. It drops in from
 * above on a spring when its container scrolls into view and swings with its own
 * velocity. When `face` changes the card flips to the new employer.
 */
export const IdBadge = ({
  face,
  target,
  className = "",
}: {
  face: IdBadgeFace;
  target: React.RefObject<HTMLElement>;
  className?: string;
}) => {
  const reduceMotion = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.9", "start 0.3"] });
  const drop = useTransform(scrollYProgress, [0, 1], reduceMotion || !wide ? [0, 0] : [-520, 0]);
  const y = useSpring(drop, { stiffness: 100, damping: 9, mass: 1.1 });
  const velocity = useVelocity(y);
  const swing = useTransform(velocity, [-3000, 3000], [-10, 10]);
  const rotate = useSpring(swing, { stiffness: 80, damping: 8 });
  const id = `AKP-${face.period.match(/\d{4}/)?.[0] ?? "0000"}`;

  return (
    <motion.div
      style={{ y, rotate }}
      className={`relative w-[280px] xl:w-[320px] origin-top will-change-transform ${className}`}
    >
      {/* Strap */}
      <div className="mx-auto w-11 h-28 lg:h-[560px] lg:-mt-[440px] rounded-b-sm bg-[hsl(200_6%_10%)] shadow-[inset_0_0_0_1px_hsl(0_0%_100%/0.08)] relative">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-snow/10" />
      </div>
      {/* Clip */}
      <div className="relative mx-auto -mt-2 w-12 h-12">
        <div className="absolute inset-0 rounded-full border-[6px] border-[hsl(200_6%_14%)]" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-7px] w-3.5 h-5 bg-[hsl(200_6%_14%)] rounded-b-sm" />
      </div>
      {/* Card */}
      <div className="relative mt-1 [perspective:1200px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={face.key}
            initial={{ rotateY: reduceMotion ? 0 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: reduceMotion ? 0 : -90, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl bg-snow text-night p-6 xl:p-7 shadow-[0_40px_70px_-25px_rgba(0,0,0,0.9)] border border-snow/60 [backface-visibility:hidden]"
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-12 h-1.5 rounded-pill bg-night/15" />
            <div className="mt-5 flex items-center justify-between gap-4 min-h-[44px]">
              {face.logo ? (
                <img
                  src={`${import.meta.env.BASE_URL}${face.logo.src}`}
                  alt=""
                  width={face.logo.width}
                  height={face.logo.height}
                  loading="lazy"
                  decoding="async"
                  className="h-9 xl:h-10 w-auto"
                />
              ) : (
                <span className="t-heading text-2xl">{face.company}</span>
              )}
              <span className="t-figure text-[10px] text-night/50 tracking-[0.2em] uppercase">Staff</span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <picture className="shrink-0">
                <source srcSet={`${import.meta.env.BASE_URL}images/portrait.webp`} type="image/webp" />
                <img
                  src={`${import.meta.env.BASE_URL}images/portrait.jpg`}
                  alt=""
                  width={593}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="w-20 h-20 xl:w-24 xl:h-24 rounded-md object-cover object-top"
                />
              </picture>
              <div className="min-w-0">
                <p className="font-body text-[17px] font-semibold leading-tight">{PROFILE.name}</p>
                <p className="t-body text-[13px] text-night/70 mt-1 leading-snug">{face.role}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-night/10 flex items-end justify-between gap-4">
              <div>
                <p className="t-figure text-[10px] text-night/50 uppercase tracking-[0.2em]">Period</p>
                <p className="t-figure text-[12px] mt-1">{face.period}</p>
              </div>
              <div className="text-right">
                <p className="t-figure text-[10px] text-night/50 uppercase tracking-[0.2em]">ID</p>
                <p className="t-figure text-[12px] mt-1">{id}</p>
              </div>
            </div>
            {/* Barcode */}
            <div aria-hidden="true" className="mt-4 flex items-end gap-[2px] h-7">
              {Array.from({ length: 42 }, (_, i) => (
                <span
                  key={i}
                  className="block bg-night"
                  style={{ width: (i * 7) % 3 === 0 ? 3 : 1.5, height: `${60 + ((i * 13) % 40)}%` }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default IdBadge;
