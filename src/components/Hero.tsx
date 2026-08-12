import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useSmoothScroll } from "./ui/SmoothScroll";
import ExperienceTimer from "./ui/ExperienceTimer";

import { lazy, Suspense } from "react";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { useMobile } from "@/hooks/useMobile";
import { useIdleMount } from "@/hooks/useIdleMount";


import { useLoading } from "@/context/LoadingContext";
import MagneticButton from "@/components/ui/MagneticButton";

const SpaceScene = lazy(() => import("@/components/3d/SpaceScene"));

const CAREER_START = new Date("2021-07-01");

const Hero = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const isLowEnd = useLowEndDevice();
  const { lenis } = useSmoothScroll();
  const ref = useRef<HTMLElement>(null);

  const shouldRenderDesktopScene = isLowEnd === false && !isMobile;
  const showSpaceScene = shouldRenderDesktopScene && !isLoading;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 md:px-12 selection:bg-white/20">
      {/* 3D Space Background (Adaptive) */}
      {shouldRenderDesktopScene ? (
        showSpaceScene ? (
          <Suspense fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/25 via-black to-black opacity-50" />
            </div>
          }>
            <SpaceScene />
          </Suspense>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/25 via-black to-black opacity-50" />
          </div>
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/25 via-black to-black opacity-50" />
        </div>
      )}

      <motion.div style={{ opacity, scale, y: springY }} className="relative z-10 max-w-[1600px] w-full mx-auto pt-20 pointer-events-none">
        <div>
          <div className="flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-8 pointer-events-auto"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/10 bg-white/5 backdrop-blur-sm rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
                  Open to opportunities
                </span>
              </div>
            </motion.div>

            <div className="mb-2 pointer-events-auto">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={!isLoading ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-base md:text-lg font-body font-medium tracking-[0.35em] uppercase text-white/70"
              >
                ACHYUTH KP
              </motion.h1>
            </div>

            <motion.div
              role="text"
              aria-label="Software Engineer"
              className="leading-none mb-8 select-none cursor-default pointer-events-auto"
              whileHover="hover"
            >
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="font-condensed uppercase text-[15vw] md:text-[10.5vw] lg:text-[9vw] leading-[0.92] tracking-wide bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent"
                >
                  SOFTWARE
                </motion.div>
              </div>
              <div className="overflow-hidden ml-0 sm:ml-12">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                  className="font-condensed uppercase text-[15vw] md:text-[10.5vw] lg:text-[9vw] leading-[0.92] tracking-wide bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent"
                  style={{ animationDelay: "0.5s" }}
                >
                  ENGINEER
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.46 }}
              className="text-base md:text-lg font-body font-light text-gray-400 max-w-lg mb-12 leading-relaxed pointer-events-auto"
            >
              Building secure banking microservices — Java, Spring Boot, Kafka — for platforms that move real money.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={!isLoading ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.54 }}
              className="flex flex-wrap items-center gap-6 pointer-events-auto"
            >
              <MagneticButton>
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById('projects');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group relative inline-flex items-center justify-center gap-4 px-8 py-3 w-full sm:w-auto bg-white text-black font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  {/* White glow pulse on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2 text-black">
                    View Projects <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById('contact');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group relative inline-flex items-center justify-center gap-4 px-8 py-3 w-full sm:w-auto border border-white/20 text-white font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5"
                >
                  {/* Gradient border shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <span className="relative z-10">Contact Me</span>
                </a>
              </MagneticButton>
            </motion.div>

          </div>

          {/* Stat bar — live experience counter anchors three quiet facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 lg:mt-20 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pointer-events-auto"
          >
            <ExperienceTimer startDate={CAREER_START} />
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">30<span className="text-emerald-400">+</span></div>
              <div className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/40 mt-2">Services in estate</div>
              <div className="font-mono text-xs text-white/30 mt-1.5">Spring Boot · Kafka</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">3</div>
              <div className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/40 mt-2">Banking channels</div>
              <div className="font-mono text-xs text-white/30 mt-1.5">Retail · Mobile · Corporate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">PCI</div>
              <div className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/40 mt-2">Compliance-first</div>
              <div className="font-mono text-xs text-white/30 mt-1.5">PCI-DSS · SOX audited</div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Simple Line Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent to-white/20"
      />
    </section>
  );
};

export default Hero;
