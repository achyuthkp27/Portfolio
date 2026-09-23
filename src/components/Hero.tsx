import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import { useLocalTime } from "@/hooks/useLocalTime";
import { PROFILE } from "@/data/profile";
import { DUR, EASE } from "@/lib/motion";
import ExperienceTimer from "./ui/ExperienceTimer";
import ScrambleNumber from "./ui/ScrambleNumber";
import { PillButton } from "./ui/Pill";
import { useSectionScroll } from "@/hooks/useSectionScroll";

/** Small fact tiles that drift in from the edges as the visitor scrolls, where the reference floats photographs. */
const TILES = [
  { label: "Based in", value: "Bengaluru", side: "left", top: "18%", depth: 1 },
  { label: "Since", value: "Jul 2021", side: "right", top: "26%", depth: 0.7 },
  { label: "Audited platform", value: "PCI-DSS · SOX", side: "left", top: "58%", depth: 0.55 },
  { label: "Now building", value: "AI products", side: "right", top: "62%", depth: 0.9 },
] as const;

/**
 * The introduction: name as the eyebrow, a two-line statement in Antonio over an emerald
 * aura, one line, two actions, and a proof row with the live counter. The stage shrinks
 * into a card as Work slides over it; facts drift in from the edges as the page moves.
 */
const Hero = () => {
  const { isLoading } = useLoading();
  const reduceMotion = useReducedMotion();
  const time = useLocalTime(PROFILE.timeZone);
  const scrollTo = useSectionScroll();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.6]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const tileIn = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  // The whole stage pulls away into a rounded, dimming card as the next section slides over it
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.9]);
  const stageRadius = useTransform(scrollYProgress, [0, 0.6], [0, reduceMotion ? 0 : 28]);
  const stageDim = useTransform(scrollYProgress, [0.2, 1], [0, reduceMotion ? 0 : 0.55]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: !isLoading ? { opacity: 1, y: 0 } : {},
    transition: { duration: DUR.base, ease: EASE, delay },
  });

  return (
    <section ref={ref} data-reveal-skip className="theme-dark relative min-h-screen bg-night text-snow">
      <motion.div
        style={{ scale: stageScale, borderRadius: stageRadius }}
        className="sticky top-0 min-h-screen overflow-hidden flex flex-col bg-night origin-center will-change-transform"
      >
        <motion.div
          style={{ opacity: stageDim }}
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-night pointer-events-none"
        />
        {/* Drifting facts */}
        {!reduceMotion && TILES.map((tile) => <FactTile key={tile.label} tile={tile} progress={tileIn} />)}

        {/* Emerald depth behind the statement */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_45%_at_50%_42%,hsl(var(--accent-500)/0.16),transparent_70%)]"
        />
        <motion.div
          aria-hidden="true"
          className="absolute z-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none mix-blend-screen motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent-400)/0.14) 0%, hsl(var(--accent-500)/0.05) 40%, transparent 65%)",
          }}
          animate={{ x: ["-20vw", "20vw", "-20vw"], y: ["-10vh", "15vh", "-10vh"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-6 text-center">
          <motion.div
            style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
            className="w-full origin-center will-change-transform"
          >
            <motion.p {...enter(0.05)} className="t-label mb-5 md:mb-7 inline-flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              {PROFILE.name} · {PROFILE.title}
            </motion.p>
            <h1 className="px-4">
              {PROFILE.headline.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 40 }}
                  animate={!isLoading ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: DUR.slow, ease: EASE, delay: 0.15 + i * 0.1 }}
                  className="t-wordmark block leading-[1.02] pb-[0.06em] text-[16vw] sm:text-[13vw] lg:text-[10.5vw] xl:text-[9.5vw] bg-gradient-to-b from-snow to-snow/60 bg-clip-text text-transparent"
                >
                  {line}
                </motion.span>
              ))}
            </h1>
            <motion.p {...enter(0.5)} className="t-caps text-snow/80 max-w-2xl mx-auto mt-6 md:mt-8">
              {PROFILE.tagline}
            </motion.p>
            <motion.div {...enter(0.6)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <PillButton onClick={() => scrollTo("work")}>See the work</PillButton>
              <PillButton tone="outline" onClick={() => scrollTo("contact")}>
                Get in touch
              </PillButton>
            </motion.div>
          </motion.div>

          {/* Proof row: the live counter and three figures */}
          <motion.dl
            {...enter(0.75)}
            className="relative w-full max-w-[1400px] mt-12 lg:mt-14 pt-7 border-t border-line grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 text-center lg:text-left"
          >
            <div className="lg:border-r border-line">
              <ExperienceTimer startDate={PROFILE.careerStart} compact />
            </div>
            {PROFILE.numbers.map((n, i) => (
              <div
                key={n.label}
                className={`flex flex-col ${i < PROFILE.numbers.length - 1 ? "lg:border-r border-line" : ""}`}
              >
                <dd className="t-wordmark leading-none text-5xl md:text-6xl order-1">
                  <ScrambleNumber value={n.value.replace(/\D/g, "")} suffix={n.value.replace(/\d/g, "")} />
                </dd>
                <dt className="t-caps text-muted text-[12px] md:text-[13px] mt-3 order-2">{n.label}</dt>
              </div>
            ))}
          </motion.dl>

          {/* Phase rail: four thin rules with a tick that advances through the hero scroll */}
          <motion.ol
            {...enter(0.85)}
            aria-label="How work moves"
            className="relative w-full max-w-[1400px] mt-8 grid grid-cols-4 gap-x-4 text-left"
          >
            {PROFILE.phases.map((phase, i) => (
              <PhaseRule key={phase} phase={phase} index={i} progress={scrollYProgress} />
            ))}
          </motion.ol>
        </div>

        <motion.div
          {...enter(0.8)}
          className="relative z-10 flex items-center justify-between px-6 md:px-10 lg:px-12 pb-6 text-[13px] md:text-[14px] font-medium uppercase tracking-[0.04em] text-muted"
        >
          <span className="hidden sm:inline">Open to opportunities</span>
          <span className="inline-flex items-center gap-2 mx-auto sm:mx-0">
            Scroll to explore <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline t-figure normal-case tracking-normal">
            {PROFILE.city.split(",")[0]} {time} IST
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

const PhaseRule = ({ phase, index, progress }: { phase: string; index: number; progress: MotionValue<number> }) => {
  // Each rule owns a quarter of the hero scroll; its fill grows as that quarter passes
  const from = index * 0.25;
  const fill = useTransform(progress, [from, from + 0.25], [0, 1]);
  const active = useTransform(progress, [from - 0.01, from, from + 0.25, from + 0.26], [0.35, 1, 1, 0.5]);
  return (
    <li className="relative pt-3 border-t border-line">
      <motion.span
        style={{ scaleX: fill }}
        className="absolute -top-px left-0 h-px w-full bg-snow origin-left"
        aria-hidden="true"
      />
      <motion.span style={{ opacity: active }} className="block t-figure text-[10px] md:text-[11px] text-snow">
        {String(index + 1).padStart(3, "0")}
      </motion.span>
      <motion.span style={{ opacity: active }} className="block mt-1 t-figure text-[10px] md:text-[11px] text-muted">
        phase/<span className="text-emerald-300">{phase.toLowerCase()}</span>
      </motion.span>
    </li>
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
