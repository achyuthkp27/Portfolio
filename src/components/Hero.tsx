import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import { useSmoothScroll } from "./ui/SmoothScroll";
import ExperienceTimer from "./ui/ExperienceTimer";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { useMobile } from "@/hooks/useMobile";
import { useLoading } from "@/context/LoadingContext";

const SpaceScene = lazy(() => import("@/components/3d/SpaceScene"));

const CAREER_START = new Date("2021-07-26");

const HERO_EASE = [0.16, 1, 0.3, 1] as const;

const StaticBackdrop = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/25 via-black to-black opacity-50" />
  </div>
);

const STATS = [
  { value: "30", suffix: "+", label: "Services in estate", detail: "Spring Boot · Kafka" },
  { value: "3", label: "Banking channels", detail: "Retail · Mobile · Corporate" },
  { value: "PCI", label: "Compliance-first", detail: "PCI-DSS · SOX audited" },
];

const Hero = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const isLowEnd = useLowEndDevice();
  const { lenis } = useSmoothScroll();
  const ref = useRef<HTMLElement>(null);

  const showSpaceScene = isLowEnd === false && !isMobile && !isLoading;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: !isLoading ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.45, delay },
  });

  // Buttons, not hash anchors — a real "#projects" href is a route under HashRouter.
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 md:px-12 selection:bg-white/20">
      {showSpaceScene ? (
        <Suspense fallback={<StaticBackdrop />}>
          <SpaceScene />
        </Suspense>
      ) : (
        <StaticBackdrop />
      )}

      {/* Emerald aura grounding the headline */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_45%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" aria-hidden="true" />

      {/* Drifting light — transform-only so it never triggers layout */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 z-[1] w-[55vw] h-[55vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none mix-blend-screen motion-reduce:hidden"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.16) 0%, rgba(16,185,129,0.07) 35%, transparent 65%)" }}
        animate={{
          x: ["-15vw", "45vw", "75vw", "30vw", "-15vw"],
          y: ["-10vh", "-20vh", "35vh", "55vh", "-10vh"],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ opacity, scale, y: springY }} className="relative z-10 max-w-[1600px] w-full mx-auto pt-20 pointer-events-none">
        <div className="flex flex-col items-center text-center">
          <motion.div {...reveal(0.1)} className="mb-8 pointer-events-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-white/10 bg-white/[0.04] rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="text-xs font-body text-white/75">Open to opportunities</span>
            </div>
          </motion.div>

          <h1 className="mb-8 pointer-events-auto">
            <motion.span {...reveal(0.16)} className="block mb-4 text-sm md:text-base font-body font-medium tracking-[0.2em] uppercase text-white/75">
              Achyuth KP <span className="text-emerald-400" aria-hidden="true">·</span> Software Engineer
            </motion.span>
            {["Systems that", "move money."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: 0 } : {}}
                  transition={{ duration: 0.7, ease: HERO_EASE, delay: 0.2 + i * 0.08 }}
                  className="block font-condensed uppercase text-[13vw] md:text-[9vw] lg:text-[7.6vw] leading-[0.92] tracking-wide bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...reveal(0.46)}
            className="text-base md:text-lg font-body font-light text-white/70 max-w-xl mx-auto mb-12 leading-relaxed pointer-events-auto"
          >
            Five years building secure banking microservices in Java, Spring Boot, and Kafka —
            maker-checker controls, card tokenization, and MFA for retail, mobile, and corporate channels.
          </motion.p>

          <motion.div {...reveal(0.54)} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pointer-events-auto">
            <button
              type="button"
              onClick={() => scrollToSection("projects")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto bg-white text-black font-semibold text-sm transition-colors hover:bg-emerald-100"
            >
              See the work <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center justify-center px-8 py-3 w-full sm:w-auto border border-white/25 text-white font-semibold text-sm transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/5"
            >
              Get in touch
            </button>
          </motion.div>
        </div>

        {/* Stat bar — live experience counter anchors three quiet facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={!isLoading ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 lg:mt-20 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 text-center pointer-events-auto"
        >
          <ExperienceTimer startDate={CAREER_START} />
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
                {stat.value}
                {stat.suffix && <span className="text-emerald-400">{stat.suffix}</span>}
              </div>
              <div className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/60 mt-2">{stat.label}</div>
              <div className="font-mono text-xs text-white/50 mt-1.5">{stat.detail}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent to-white/20"
        aria-hidden="true"
      />
    </section>
  );
};

export default Hero;
