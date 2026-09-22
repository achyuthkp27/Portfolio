import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import { useLocalTime } from "@/hooks/useLocalTime";
import { PROFILE } from "@/data/profile";
import { DUR, EASE } from "@/lib/motion";

/** Small fact tiles that drift in from the edges as the visitor scrolls, where the reference floats photographs. */
const TILES = [
  { label: "Based in", value: "Bengaluru", side: "left", top: "18%", depth: 1 },
  { label: "Since", value: "Jul 2021", side: "right", top: "26%", depth: 0.7 },
  { label: "Audited platform", value: "PCI-DSS · SOX", side: "left", top: "66%", depth: 0.55 },
  { label: "Estate", value: "30+ services", side: "right", top: "70%", depth: 0.9 },
] as const;

/**
 * The introduction, the way the reference opens: the name at wordmark scale, one uppercase
 * line, and an invitation to scroll. Facts drift in from the edges as the page moves.
 */
const Hero = () => {
  const { isLoading } = useLoading();
  const reduceMotion = useReducedMotion();
  const time = useLocalTime(PROFILE.timeZone);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.6]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const tileIn = useTransform(scrollYProgress, [0, 0.45], [0, 1]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: !isLoading ? { opacity: 1, y: 0 } : {},
    transition: { duration: DUR.base, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      data-reveal-skip
      className="theme-dark relative min-h-screen bg-night text-snow overflow-hidden flex flex-col"
    >
      {/* Drifting facts */}
      {!reduceMotion && TILES.map((tile) => <FactTile key={tile.label} tile={tile} progress={tileIn} />)}

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-24 text-center">
        <motion.div
          style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
          className="w-full origin-center will-change-transform"
        >
          <h1 className="px-4 py-[0.12em]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: DUR.slow, ease: EASE, delay: 0.15 }}
              className="t-wordmark block leading-none text-[19vw] sm:text-[16vw] lg:text-[14vw] xl:text-[13vw] whitespace-nowrap"
            >
              {PROFILE.first} {PROFILE.last}
              <span
                aria-hidden="true"
                className="inline-block align-top t-figure text-[0.09em] text-muted ml-[0.15em] mt-[0.12em]"
              >
                ©
              </span>
            </motion.span>
          </h1>
          <motion.p {...enter(0.5)} className="t-caps text-snow/85 max-w-xl mx-auto mt-6 md:mt-8">
            {PROFILE.tagline}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        {...enter(0.8)}
        className="relative flex items-center justify-between px-6 md:px-10 lg:px-12 pb-8 text-[13px] md:text-[14px] font-medium uppercase tracking-[0.04em] text-muted"
      >
        <span className="hidden sm:inline">{PROFILE.title}</span>
        <span className="inline-flex items-center gap-2 mx-auto sm:mx-0">
          Scroll to explore <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline t-figure normal-case tracking-normal">
          {PROFILE.city.split(",")[0]} {time} IST
        </span>
      </motion.div>
    </section>
  );
};

const FactTile = ({
  tile,
  progress,
}: {
  tile: (typeof TILES)[number];
  progress: ReturnType<typeof useTransform<number, number>>;
}) => {
  const from = tile.side === "left" ? -160 * tile.depth : 160 * tile.depth;
  const x = useTransform(progress, [0, 1], [from, 0]);
  const opacity = useTransform(progress, [0, 0.35, 1], [0, 0.6, 1]);
  return (
    <motion.div
      style={{ x, opacity, top: tile.top, [tile.side]: "4%" }}
      aria-hidden="true"
      className="absolute hidden md:block rounded-md bg-tile/90 border border-line px-5 py-4 min-w-[170px] pointer-events-none"
    >
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted">{tile.label}</p>
      <p className="t-heading text-2xl mt-1.5">{tile.value}</p>
    </motion.div>
  );
};

export default Hero;
