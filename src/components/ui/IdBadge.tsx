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
  logo?: { src: string; dark?: string; width: number; height: number };
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
  const { scrollYProgress } = useScroll({ target, offset: ["start 0.55", "start 0.08"] });
  const drop = useTransform(scrollYProgress, [0, 1], reduceMotion || !wide ? [0, 0] : [-520, 0]);
  const y = useSpring(drop, { stiffness: 100, damping: 9, mass: 1.1 });
  const velocity = useVelocity(y);
  const swing = useTransform(velocity, [-3000, 3000], [-10, 10]);
  const rotate = useSpring(swing, { stiffness: 80, damping: 8 });
  const id = `AKP-${face.period.match(/\d{4}/)?.[0] ?? "0000"}`;

  return (
    <motion.div
      data-reveal-skip
      style={{ y, rotate }}
      className={`relative w-[264px] xl:w-[300px] origin-top will-change-transform ${className}`}
    >
      {/* Strap */}
      <div className="mx-auto w-11 h-28 lg:h-[600px] lg:-mt-[480px] rounded-b-sm bg-[hsl(200_6%_10%)] shadow-[inset_0_0_0_1px_hsl(0_0%_100%/0.08)] relative">
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
            className="relative rounded-xl text-snow p-5 xl:p-6 shadow-[0_40px_70px_-25px_rgba(0,0,0,0.9)] border border-snow/15 [backface-visibility:hidden] bg-[linear-gradient(160deg,hsl(200_6%_14%),hsl(200_8%_7%))]"
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-12 h-1.5 rounded-pill bg-snow/20" />
            {/* Employer */}
            <div className="mt-4 flex items-center justify-center min-h-[32px]">
              {face.logo ? (
                <img
                  src={`${import.meta.env.BASE_URL}${face.logo.dark ?? face.logo.src}`}
                  alt=""
                  width={face.logo.width}
                  height={face.logo.height}
                  loading="lazy"
                  decoding="async"
                  className="h-7 xl:h-8 w-auto"
                />
              ) : (
                <span className="t-heading text-2xl">{face.company}</span>
              )}
            </div>
            {/* Photo */}
            <picture className="block mt-4">
              <source srcSet={`${import.meta.env.BASE_URL}images/portrait.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}images/portrait.jpg`}
                alt=""
                width={593}
                height={640}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3.4] rounded-md object-cover object-top"
              />
            </picture>
            {/* Name and role */}
            <p className="mt-3.5 font-body text-[18px] font-semibold leading-tight">{PROFILE.name}</p>
            <p className="t-body text-[13px] text-snow/70 mt-1 leading-snug">{face.role}</p>
            <div className="mt-4 pt-3.5 border-t border-snow/10 flex items-end justify-between gap-4">
              <div>
                <p className="t-figure text-[10px] text-snow/50 uppercase tracking-[0.2em]">Period</p>
                <p className="t-figure text-[12px] mt-1">{face.period}</p>
              </div>
              <div className="text-right">
                <p className="t-figure text-[10px] text-snow/50 uppercase tracking-[0.2em]">ID</p>
                <p className="t-figure text-[12px] mt-1">{id}</p>
              </div>
            </div>
            {/* Barcode */}
            <div aria-hidden="true" className="mt-4 flex items-end justify-center gap-[2px] h-7">
              {Array.from({ length: 42 }, (_, i) => (
                <span
                  key={i}
                  className="block bg-snow/85"
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
