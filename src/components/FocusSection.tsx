import { motion, useReducedMotionConfig, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "@/data/profile";

const base = import.meta.env.BASE_URL;

/** The card the full-screen panel shrinks into */
const CARD_W = "min(520px, 86vw)";
const CARD_H = "min(760px, 82vh)";

const years = Math.floor((Date.now() - PROFILE.careerStart.getTime()) / (365.25 * 24 * 3600 * 1000));

/** Real figures only, placed around the card: left column top-down, then right */
const STATS = [
  { value: `${years}+`, label: "Years building production systems", side: "left", top: "16%" },
  { value: "30+", label: "Services in the estate", side: "left", top: "46%" },
  // The same 30% step as the left pair (16% → 46%), measured up from 2024 below it
  {
    value: "3",
    label: "Banking channels on one platform",
    side: "right",
    bottom: `calc(50% - ${CARD_H} / 2 + 30%)`,
  },
  // Sits on the card's bottom edge: its last line lines up with the card's foot
  { value: "2024", label: "Above & Beyond award, FIS Global", side: "right", bottom: `calc(50% - ${CARD_H} / 2)` },
] as const;

/**
 * What I believe, after lesmana.framer.website's "Why us": a dark panel fills the screen
 * with the belief and the portrait inside it, then closes in around them as you scroll until it is a
 * card on a pale ground with a faint grid, and the figures surface around it one by one.
 */
const FocusSection = () => {
  const reduceMotion = useReducedMotionConfig();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // 0 = full screen, 1 = the card. Function transforms keep these on the JS path.
  const shrink = useTransform(p, (v) => (reduceMotion ? 1 : Math.min(1, Math.max(0, (v - 0.08) / 0.4))));
  const clipPath = useTransform(
    shrink,
    (k) => `inset(calc((100% - ${CARD_H}) / 2 * ${k}) calc((100% - ${CARD_W}) / 2 * ${k}))`,
  );

  return (
    <section
      ref={ref}
      aria-label="A line about how I work"
      data-reveal-skip
      data-glass-off
      className={`relative ${reduceMotion ? "" : "h-[320vh]"}`}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-pale">
        {/* Faint grid, strongest around the card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(hsl(var(--pale-grid)/0.07)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pale-grid)/0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(45%_55%_at_50%_50%,black,transparent)] [-webkit-mask-image:radial-gradient(45%_55%_at_50%_50%,black,transparent)]"
        />

        {/* The figures */}
        {STATS.map((stat, i) => (
          <Stat key={stat.label} stat={stat} progress={p} index={i} still={!!reduceMotion} />
        ))}

        {/* The panel that becomes the card */}
        <motion.div style={{ clipPath }} className="absolute inset-0 bg-night">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between p-8 md:p-11 text-snow"
            style={{ width: CARD_W, height: CARD_H }}
          >
            <div>
              <p className="flex items-center gap-2 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.16em] text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-400" aria-hidden="true" />
                What I believe
              </p>
              <h2 className="mt-5 t-statement text-[3rem] md:text-[4.4rem]">
                I build things that work when it matters.
              </h2>
            </div>
            {/* The portrait, in the open space between the belief and the signature */}
            <div className="relative flex-1 min-h-0 my-6 md:my-8 rounded-sm overflow-hidden" aria-hidden="true">
              <picture>
                <source srcSet={`${base}images/portrait-belief.webp`} type="image/webp" />
                <img
                  src={`${base}images/portrait-belief.jpg`}
                  alt=""
                  width={1024}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-[50%_22%] grayscale contrast-110"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
            </div>
            <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
              <p className="t-heading text-2xl md:text-3xl leading-none text-snow shrink-0">{PROFILE.first}</p>
              <p className="sm:text-right text-[14px] md:text-[15px] leading-[1.55] text-snow/85 sm:max-w-[230px]">
                Reliable systems are built through clear thinking, small verified steps, and decisions that still make
                sense at 2 AM.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/** One figure beside the card: rises and sharpens into place once the card has formed */
const Stat = ({
  stat,
  progress,
  index,
  still,
}: {
  stat: (typeof STATS)[number];
  progress: MotionValue<number>;
  index: number;
  still: boolean;
}) => {
  const start = 0.5 + index * 0.08;
  const t = useTransform(progress, (v) => (still ? 1 : Math.min(1, Math.max(0, (v - start) / 0.12))));
  const opacity = useTransform(t, (k) => k);
  const y = useTransform(t, (k) => (1 - k) * 40);
  const edge = `calc(50% + ${CARD_W} / 2 + clamp(16px, 3vw, 48px))`;
  return (
    <motion.div
      style={{
        opacity,
        y,
        ...("top" in stat ? { top: stat.top } : { bottom: stat.bottom }),
        ...(stat.side === "left" ? { right: edge } : { left: edge }),
      }}
      className={`absolute hidden lg:block ${stat.side === "left" ? "text-right" : "text-left"}`}
    >
      <p className="t-wordmark leading-none text-[clamp(3.4rem,6.5vw,6.5rem)] text-[hsl(160_45%_26%)]">{stat.value}</p>
      <p
        className={`mt-3 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-[hsl(160_15%_35%)] max-w-[260px] ${stat.side === "left" ? "ml-auto" : ""}`}
      >
        {stat.label}
      </p>
    </motion.div>
  );
};

export default FocusSection;
