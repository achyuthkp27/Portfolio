import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useSmoothScroll } from "./ui/SmoothScroll";
import MagneticButton from "./ui/MagneticButton";
import ExperienceTimer from "./ui/ExperienceTimer";

import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { useMobile } from "@/hooks/useMobile";

import DecryptText from "@/components/ui/DecryptText";

import { useLoading } from "@/context/LoadingContext";

const SpaceScene = lazy(() => import("@/components/3d/SpaceScene"));

const Hero = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const isLowEnd = useLowEndDevice();
  const { lenis } = useSmoothScroll();
  const ref = useRef<HTMLElement>(null);

  const shouldRenderDesktopScene = isLowEnd === false && !isMobile;
  const [showSpaceScene, setShowSpaceScene] = useState(false);

  useEffect(() => {
    if (!shouldRenderDesktopScene) return;

    let idleId: number | undefined;
    const mountScene = () => setShowSpaceScene(true);

    const win = typeof window !== "undefined" ? window as any : null;
    if (!win) return;

    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(mountScene, { timeout: 1500 });
    } else {
      idleId = setTimeout(mountScene, 1500);
    }

    return () => {
      if (idleId !== undefined) {
        if (win.cancelIdleCallback) {
          win.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
    };
  }, [shouldRenderDesktopScene]);

  // Dynamic Experience Calculation (Start: July 2021)
  const startDate = new Date("2021-07-01");
  const today = new Date();
  let exp = today.getFullYear() - startDate.getFullYear();
  const m = today.getMonth() - startDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < startDate.getDate())) {
    exp--;
  }

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
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-50" />
            </div>
          }>
            <SpaceScene />
          </Suspense>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-50" />
          </div>
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-50" />
        </div>
      )}

      {/* Technical Corner Labels - Social Links */}
      <a href="https://github.com/achyuthkp27" target="_blank" rel="noopener noreferrer" className="absolute top-24 left-6 md:left-12 font-mono text-[10px] text-muted-foreground tracking-widest opacity-90 hover:opacity-100 transition-opacity hidden md:block z-50 pointer-events-auto cursor-pointer">
        [ GITHUB: ACHYUTHKP27 ]
      </a>
      <a href="https://linkedin.com/in/kpachyuth" target="_blank" rel="noopener noreferrer" className="absolute top-24 right-6 md:right-12 font-mono text-[10px] text-muted-foreground tracking-widest opacity-90 hover:opacity-100 transition-opacity hidden md:block z-50 pointer-events-auto cursor-pointer">
        [ LINKEDIN: KPACHYUTH ]
      </a>
      <a href="mailto:kpachyuthz@gmail.com" className="absolute bottom-12 left-6 md:left-12 font-mono text-[10px] text-muted-foreground tracking-widest opacity-90 hover:opacity-100 transition-opacity hidden md:block z-50 pointer-events-auto cursor-pointer">
        [ EMAIL: KPACHYUTHZ@GMAIL.COM ]
      </a>

      <motion.div style={{ opacity, scale, y: springY }} className="relative z-10 max-w-[1600px] w-full mx-auto pt-20 pointer-events-none">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                  AVAILABLE_FOR_WORK
                </span>
              </div>
            </motion.div>

            <div className="mb-2 pointer-events-auto">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={!isLoading ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight"
              >
                ACHYUTH KP
              </motion.h2>
            </div>

            <motion.h1
              className="font-display font-bold tracking-tighter leading-none mb-8 select-none cursor-default pointer-events-auto"
              whileHover="hover"
            >
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="text-[12vw] md:text-[8vw] lg:text-[7vw] tracking-tight text-iridescent"
                >
                  CREATIVE
                </motion.div>
              </div>
              <div className="overflow-hidden ml-12">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                  className="text-[12vw] md:text-[8vw] lg:text-[7vw] tracking-tight text-iridescent"
                  style={{ animationDelay: "0.5s" }}
                >
                  DEVELOPER
                </motion.div>
              </div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.38 }}
              className="flex flex-wrap gap-3 mb-8 pointer-events-auto"
            >
              {["Software Developer", "React Js", "Spring Boot", "Microservices", "AWS"].map((tag, i) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-mono bg-white/5 text-white/80 border border-white/10 uppercase tracking-wider group hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 rounded-md relative overflow-hidden"
                >
                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative z-10"><DecryptText text={tag} /></span>
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.46 }}
              className="text-sm md:text-lg font-mono text-gray-400 max-w-lg mb-12 leading-relaxed tracking-wide uppercase pointer-events-auto"
            >
              Engineering scalable systems with precision, performance, and a product mindset.
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
                  className="group relative inline-flex items-center gap-4 px-8 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  {/* White glow pulse on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
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
                  className="group relative inline-flex items-center gap-4 px-8 py-3 border border-white/20 text-white font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5"
                >
                  {/* Gradient border shine */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  <span className="relative z-10">Contact Me</span>
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right side Experience Card — improved corner animations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={!isLoading ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="flex justify-center pointer-events-auto mt-12 lg:mt-0"
          >
            <motion.div className="relative w-80 h-80" whileHover="hover" initial="initial">
              {/* Ambient glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <motion.div
                variants={{
                  hover: { borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" }
                }}
                className="absolute inset-0 border border-white/10 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center transition-colors duration-500"
              >
                <ExperienceTimer startDate={startDate} />
              </motion.div>
              {/* Decorative corners — smoother spring */}
              <motion.div
                variants={{ hover: { scaleX: 1, scaleY: 1, borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 left-0 w-full h-full origin-top-left scale-x-[0.05] scale-y-[0.05] border-t border-l border-white/40 pointer-events-none"
              />
              <motion.div
                variants={{ hover: { scaleX: 1, scaleY: 1, borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-0 right-0 w-full h-full origin-top-right scale-x-[0.05] scale-y-[0.05] border-t border-r border-white/40 pointer-events-none"
              />
              <motion.div
                variants={{ hover: { scaleX: 1, scaleY: 1, borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-0 w-full h-full origin-bottom-left scale-x-[0.05] scale-y-[0.05] border-b border-l border-white/40 pointer-events-none"
              />
              <motion.div
                variants={{ hover: { scaleX: 1, scaleY: 1, borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 right-0 w-full h-full origin-bottom-right scale-x-[0.05] scale-y-[0.05] border-b border-r border-white/40 pointer-events-none"
              />
            </motion.div>
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
