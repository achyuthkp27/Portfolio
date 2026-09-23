import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

/**
 * A glass award plaque on a dark stone base, drawn in CSS: a bevelled slab with one cut
 * corner, a bright edge, the award text and the FIS mark inside. It tilts a few degrees
 * as the section scrolls, as if catching the light.
 */
const Trophy = ({ target }: { target: React.RefObject<HTMLElement> }) => {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const tilt = useSpring(useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-7, 7]), {
    stiffness: 60,
    damping: 18,
  });
  return (
    <motion.div
      initial={reduceMotion ? false : { y: -340, rotate: -5, opacity: 0 }}
      whileInView={{ y: 0, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-35% 0px -35% 0px" }}
      transition={{
        y: { type: "spring", stiffness: 150, damping: 11, mass: 1.2 },
        rotate: { type: "spring", stiffness: 90, damping: 7, mass: 1 },
        opacity: { duration: 0.2 },
      }}
      className="relative w-[230px] md:w-[260px] [perspective:1200px] origin-bottom"
      aria-hidden="true"
    >
      <motion.div
        style={{ rotateY: tilt, transformStyle: "preserve-3d" }}
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
      {/* Floor reflection */}
      <div className="absolute inset-x-6 -bottom-3 h-6 rounded-[50%] bg-emerald-400/20 blur-xl" />
    </motion.div>
  );
};

/**
 * (On the record): the award as a deep-green card with a glass trophy, beside dated rows.
 */
const RecordSection = () => {
  const scrollTo = useSectionScroll();
  const awardRef = useRef<HTMLDivElement>(null);
  const rows = PROFILE.record.filter((r) => !r.title.includes("Award"));
  return (
    <section className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader label="On the record" title="Highlights" align="center" />

        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-3 md:gap-4 items-stretch">
          {/* Award card */}
          <motion.div
            {...reveal()}
            data-reveal-skip
            ref={awardRef}
            className="relative rounded-lg overflow-hidden border border-emerald-300/15 p-7 md:p-10 grid md:grid-cols-[minmax(0,1fr)_260px] gap-x-10 text-snow"
            style={{
              background:
                "radial-gradient(70% 90% at 85% 10%, hsl(153 45% 30% / 0.9), transparent 60%), radial-gradient(60% 70% at 10% 90%, hsl(153 35% 14% / 0.8), transparent 65%), linear-gradient(160deg, hsl(153 30% 10%), hsl(150 20% 5%))",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-screen"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
            <div className="relative flex flex-col min-w-0">
              <p className="t-figure text-[11px] uppercase tracking-[0.2em] text-emerald-200/70">
                Individual recognition · Q1 2024
              </p>
              <h3 className="t-heading text-4xl md:text-5xl mt-5">
                Above &amp; Beyond
                <br />
                <span className="text-emerald-400">Award</span>
              </h3>
              <p className="mt-6 t-body text-snow/75 max-w-sm">
                Given by FIS Global for critical project delivery on the First Citizens Bank platform. One of the
                individual awards for the quarter, not a team credit.
              </p>
              <div className="mt-10 md:mt-auto md:pt-12">
                <button
                  type="button"
                  onClick={() => scrollTo("experience")}
                  className="group inline-flex items-center gap-3 rounded-pill bg-snow text-night px-6 py-3 text-[14px] font-medium whitespace-nowrap hover:bg-stone transition-colors duration-fast"
                >
                  See the role{" "}
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <div className="relative mt-12 md:mt-0 flex justify-center md:justify-end items-end md:pb-2">
              <Trophy target={awardRef} />
            </div>
          </motion.div>

          {/* Other rows */}
          <motion.div {...reveal(0.05)} className="rounded-lg bg-tile border border-line p-7 md:p-10 flex flex-col">
            <p className="t-label mb-6">Timeline</p>
            <ol className="divide-y divide-line flex-1 flex flex-col justify-between">
              {rows.map((r) => (
                <li key={r.title} className="py-5 md:py-6 first:pt-0 last:pb-0 flex-1 flex flex-col justify-center">
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="t-heading text-2xl md:text-3xl">{r.org}</span>
                    <ScrambleNumber value={r.year} className="t-figure text-sm text-emerald-300 shrink-0" />
                  </div>
                  <p className="mt-2 t-body text-snow/70">{r.title}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RecordSection;
