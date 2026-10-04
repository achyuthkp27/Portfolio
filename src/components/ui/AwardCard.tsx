import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotionConfig,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * A glass award plaque on a dark stone base, drawn in CSS: a bevelled slab with one cut
 * corner, a bright edge, the award text and the FIS mark inside. It drops onto its base as it
 * scrolls into view, straightens as the card passes, and leans toward the pointer.
 */
/** Where the sparkles sit around the plaque, and when each one twinkles */
const SPARKLES = [
  { top: "6%", left: "-10%", size: 10, delay: 0 },
  { top: "28%", left: "104%", size: 7, delay: 0.9 },
  { top: "62%", left: "-14%", size: 6, delay: 1.7 },
  { top: "-6%", left: "78%", size: 8, delay: 2.4 },
  { top: "84%", left: "100%", size: 9, delay: 3.1 },
];

const Trophy = ({
  spin,
  pointer,
}: {
  spin: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
}) => {
  const reduceMotion = useReducedMotionConfig();
  // A slight lean, as if catching the light, that settles square at 2024; the drop does the rest
  const tilt = useSpring(
    useTransform(spin, (v) => (reduceMotion ? 0 : (1 - Math.min(1, v)) * -7)),
    { stiffness: 60, damping: 18 },
  );
  const px = useSpring(pointer.x, { stiffness: 120, damping: 16 });
  const py = useSpring(pointer.y, { stiffness: 120, damping: 16 });
  const rotateY = useTransform([tilt, px], ([t, x]: number[]) => t + x * 18);
  const rotateX = useTransform(py, (y) => -y * 12);
  // The gloss slides against the lean, like light staying put while the glass turns
  const glossX = useTransform(px, (x) => `${-x * 40}%`);
  return (
    <motion.div
      initial={reduceMotion ? false : { y: -340, rotate: -5, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
      transition={{
        y: { type: "spring", stiffness: 150, damping: 11, mass: 1.2 },
        rotate: { type: "spring", stiffness: 90, damping: 7, mass: 1 },
        opacity: { duration: 0.2 },
      }}
      className="relative w-[200px] md:w-[210px] [perspective:1200px] origin-bottom"
      aria-hidden="true"
    >
      <motion.div
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        className="relative origin-bottom will-change-transform"
      >
        {/* Slab */}
        <div
          className="relative rounded-md p-6 md:p-7 text-snow border border-snow/25 shadow-[0_40px_60px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_hsl(0_0%_100%/0.35),inset_0_-1px_0_hsl(0_0%_100%/0.08)]"
          style={{
            clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%, 0 9%)",
            background:
              "linear-gradient(160deg, hsl(153 25% 20% / 0.85), hsl(153 20% 8% / 0.9) 45%, hsl(153 30% 14% / 0.9))",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to right, hsl(0 0% 100% / 0.08), transparent 12%)" }}
          />
          {/* Sweeping gloss */}
          <div className="absolute inset-0 pointer-events-none trophy-gloss" />
          {/* Pointer gloss: a soft highlight that moves opposite the lean */}
          <motion.div
            className="absolute inset-y-0 -inset-x-1/2 pointer-events-none"
            style={{
              x: glossX,
              background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.12) 50%, transparent 60%)",
            }}
          />
          <p className="relative mt-6 font-body text-[16px] font-semibold leading-tight">
            Above &amp; Beyond
            <br />
            Individual Award
          </p>
          <p className="relative mt-2 text-[12px] font-medium text-emerald-300">FIS Global · Q1</p>
          <span className="relative block w-10 h-px bg-snow/50 mt-5 mb-6" />
          <img
            src={`${import.meta.env.BASE_URL}images/fis-logo-white.png`}
            alt=""
            width={422}
            height={178}
            loading="lazy"
            decoding="async"
            className="relative w-[84px] h-auto"
          />
          <p className="relative t-figure text-[10px] text-snow/60 mt-1 tracking-[0.2em]">Global</p>
          <p className="relative mt-7 text-[12px] font-medium text-snow/90">Critical project delivery</p>
          <p className="relative t-figure text-sm text-snow/60 mt-1 mb-1">2024</p>
        </div>
        {/* Base */}
        <div className="relative mx-[-14px] mt-[-2px] h-7 rounded-[4px] bg-gradient-to-b from-[hsl(200_6%_16%)] to-[hsl(200_8%_6%)] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.9),inset_0_1px_0_hsl(0_0%_100%/0.12)]" />
        <div className="relative mx-[-6px] h-2 rounded-b-[4px] bg-[hsl(200_8%_4%)]" />
      </motion.div>
      {/* Sparkles twinkle round the plaque once it has landed */}
      {!reduceMotion &&
        SPARKLES.map((sp) => (
          <span
            key={sp.top + sp.left}
            className="sparkle absolute pointer-events-none text-emerald-300"
            style={{
              top: sp.top,
              left: sp.left,
              width: sp.size,
              height: sp.size,
              animationDelay: `${1.2 + sp.delay}s`,
            }}
          />
        ))}
      {/* Floor reflection */}
      <div className="absolute inset-x-6 -bottom-3 h-6 rounded-[50%] bg-emerald-400/20 blur-xl" />
    </motion.div>
  );
};

/**
 * The FIS award, told once, inside the role that earned it: the copy on the left, the glass
 * trophy on the right. Reduced motion shows the trophy landed and square.
 */
/** Inner width (px) at which copy and trophy sit side by side */
const SIDE_BY_SIDE_MIN = 500;

export const AwardCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = { x: useMotionValue(0), y: useMotionValue(0) };
  const reduceMotion = useReducedMotionConfig();
  // Side by side only when the card itself has room; the column it sits in is narrow on
  // tablets and small laptops even though the viewport is wide
  const [side, setSide] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSide(e.contentRect.width >= SIDE_BY_SIDE_MIN));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // The trophy leans while the card rises and is square by the time it reaches the middle
  const { scrollYProgress: spin } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.x.set((e.clientX - r.left) / r.width - 0.5);
    pointer.y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    pointer.x.set(0);
    pointer.y.set(0);
  };

  return (
    <div
      ref={ref}
      data-reveal-skip
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative rounded-lg overflow-hidden border border-emerald-300/15 p-6 md:p-8 grid gap-x-8 text-snow ${side ? "grid-cols-[minmax(0,1fr)_210px]" : ""}`}
      style={{
        background:
          "radial-gradient(70% 90% at 85% 10%, hsl(153 45% 30% / 0.9), transparent 60%), radial-gradient(60% 70% at 10% 90%, hsl(153 35% 14% / 0.8), transparent 65%), linear-gradient(160deg, hsl(153 30% 10%), hsl(150 20% 5%))",
      }}
    >
      <div aria-hidden="true" className="grain absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-screen" />
      <div className="relative flex flex-col justify-center min-w-0">
        <p className="t-figure text-[11px] uppercase tracking-[0.2em] text-emerald-200/70">
          Individual recognition · Q1 2024
        </p>
        <h4 className="t-heading text-3xl md:text-4xl mt-4">
          Above &amp; Beyond <span className="text-shine">Award</span>
        </h4>
        <p className="mt-4 t-body text-snow/75 max-w-sm">
          Given by FIS Global for critical project delivery on the First Citizens Bank platform. One of the individual
          awards for the quarter, not a team credit.
        </p>
      </div>
      {/* Stacked: the trophy at 70% in a shorter stage, so the card stays about one screen tall */}
      <div
        className={`relative flex items-end ${side ? "justify-end min-h-[330px]" : "mt-6 justify-center h-[260px]"}`}
      >
        <div className={`origin-bottom ${side ? "" : "scale-[0.7]"}`}>
          <Trophy spin={spin} pointer={pointer} />
        </div>
      </div>
    </div>
  );
};
