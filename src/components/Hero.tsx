import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useRef, lazy, Suspense } from "react";
import { useSmoothScroll } from "./ui/SmoothScroll";
import MagneticButton from "./ui/MagneticButton";
import ExperienceTimer from "./ui/ExperienceTimer";

import { useMobile } from "@/hooks/useMobile";

import DecryptText from "@/components/ui/DecryptText";

import { useLoading } from "@/context/LoadingContext";

const SpaceScene = lazy(() => import("@/components/3d/SpaceScene"));
const MobileSpaceScene = lazy(() => import("@/components/3d/MobileSpaceScene"));

// Increased delays to sync with 1s curtain reveal
const Hero = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const { lenis } = useSmoothScroll();
  const ref = useRef<HTMLElement>(null);

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
      {isMobile ? (
        <Suspense fallback={
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-50" />
          </div>
        }>
          <MobileSpaceScene />
        </Suspense>
      ) : (
        <SpaceScene />
      )}

      {/* Technical Corner Labels - Social Links */}
      <a href="https://github.com/achyuthkp27" target="_blank" rel="noopener noreferrer" className="absolute top-24 left-6 md:left-12 font-mono text-[10px] text-muted-foreground tracking-widest opacity-50 hover:opacity-100 transition-opacity hidden md:block z-50 pointer-events-auto cursor-pointer">
        [ GITHUB: ACHYUTHKP27 ]
      </a>
      <a href="https://linkedin.com/in/kpachyuth" target="_blank" rel="noopener noreferrer" className="absolute top-24 right-6 md:right-12 font-mono text-[10px] text-muted-foreground tracking-widest opacity-50 hover:opacity-100 transition-opacity hidden md:block z-50 pointer-events-auto cursor-pointer">
        [ LINKEDIN: KPACHYUTH ]
      </a>
      <a href="mailto:kpachyuthz@gmail.com" className="absolute bottom-12 left-6 md:left-12 font-mono text-[10px] text-muted-foreground tracking-widest opacity-50 hover:opacity-100 transition-opacity hidden md:block z-50 pointer-events-auto cursor-pointer">
        [ EMAIL: KPACHYUTHZ@GMAIL.COM ]
      </a>

      <motion.div style={{ opacity, scale, y: springY }} className="relative z-10 max-w-[1600px] w-full mx-auto pt-20 pointer-events-none">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-8 pointer-events-auto"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/10 bg-white/5 backdrop-blur-sm">
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
                transition={{ duration: 0.8, delay: 0.6 }}
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
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                  className="text-[12vw] md:text-[8vw] lg:text-[7vw] tracking-tight text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(110deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5))",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "100% 0%"
                  }}
                  variants={{
                    hover: {
                      backgroundImage: "linear-gradient(110deg, rgba(255,255,255,0.5) 40%, #ffffff 50%, rgba(255,255,255,0.5) 60%)",
                      backgroundPosition: ["100% 0%", "-100% 0%"],
                      transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                    }
                  }}
                >
                  CREATIVE
                </motion.div>
              </div>
              <div className="overflow-hidden ml-12">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={!isLoading ? { y: 0 } : {}}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                  className="text-[12vw] md:text-[8vw] lg:text-[7vw] tracking-tight text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(110deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5))",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "100% 0%"
                  }}
                  variants={{
                    hover: {
                      backgroundImage: "linear-gradient(110deg, rgba(255,255,255,0.5) 40%, #ffffff 50%, rgba(255,255,255,0.5) 60%)",
                      backgroundPosition: ["100% 0%", "-100% 0%"],
                      transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                    }
                  }}
                >
                  DEVELOPER
                </motion.div>
              </div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-3 mb-8 pointer-events-auto"
            >
              {["Software Developer", "React Js", "Spring Boot", "Microservices", "AWS"].map((tag, i) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-mono bg-white/5 text-white/80 border border-white/10 uppercase tracking-wider group hover:bg-white/10 transition-colors"
                >
                  <DecryptText text={tag} />
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-sm md:text-lg font-mono text-gray-400 max-w-lg mb-12 leading-relaxed tracking-wide uppercase pointer-events-auto"
            >
              Engineering scalable systems with precision, performance, and a product mindset.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={!isLoading ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
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
                  className="group relative inline-flex items-center gap-4 px-8 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:bg-neutral-200"
                >
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
                  className="group relative inline-flex items-center gap-4 px-8 py-3 border border-white/20 text-white font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:bg-white/5"
                >
                  Contact Me
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right side Experience Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={!isLoading ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center pointer-events-auto mt-12 lg:mt-0"
          >
            <motion.div className="relative w-80 h-80" whileHover="hover" initial="initial">
              <motion.div
                variants={{
                  hover: { borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" }
                }}
                className="absolute inset-0 border border-white/10 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center transition-colors duration-500"
              >
                <ExperienceTimer startDate={startDate} />
              </motion.div>
              {/* Decorative corners */}
              <motion.div
                variants={{ hover: { width: "100%", height: "100%", borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40 pointer-events-none"
              />
              <motion.div
                variants={{ hover: { width: "100%", height: "100%", borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40 pointer-events-none"
              />
              <motion.div
                variants={{ hover: { width: "100%", height: "100%", borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/40 pointer-events-none"
              />
              <motion.div
                variants={{ hover: { width: "100%", height: "100%", borderColor: "rgba(255,255,255,0.8)" } }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/40 pointer-events-none"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Simple Line Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent to-white/20"
      />
    </section>
  );
};

export default Hero;
