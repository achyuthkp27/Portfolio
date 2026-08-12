import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import SpotlightCard from "./ui/SpotlightCard";
import ParallaxSection from "./ui/ParallaxSection";
import TextReveal from "./ui/TextReveal";

const AwardSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="awards" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader 
          label="Recognition" 
          titleMain="HONORS &" 
          titleAccent="AWARDS" 
          align="center"
        />

        {/* Award Card */}
        <ParallaxSection speed={0.3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
              <div className="p-1 md:p-1 relative overflow-hidden bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all duration-700 group/award rounded-2xl">
                {/* Tactical Scanning Grid */}
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                
                {/* Deep Amber Bloom Background */}
                <div className="absolute -inset-32 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 rounded-full blur-[100px] opacity-0 group-hover/award:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/20 opacity-0 group-hover/award:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/20 opacity-0 group-hover/award:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/20 opacity-0 group-hover/award:opacity-100 transition-opacity duration-700" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/20 opacity-0 group-hover/award:opacity-100 transition-opacity duration-700" />

                <div className="relative flex flex-col items-center text-center gap-10 p-10 md:p-16 bg-gradient-to-b from-transparent to-amber-950/10 rounded-xl">

                  {/* Holographic Badge Container */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Pulsing Outer Rings */}
                    <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-2 border border-amber-500/10 border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    
                    {/* Inner Glowing Core */}
                    <div className="relative w-24 h-24 border border-amber-500/30 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover/award:shadow-[0_0_50px_rgba(245,158,11,0.3)] group-hover/award:border-amber-400/50 transition-all duration-700">
                      <Trophy className="w-10 h-10 text-amber-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    </div>
                  </div>

                  <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center">
                    <TextReveal type="fade-up" delay={0.3}>
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] md:text-xs font-mono border border-amber-500/20 text-amber-500/80 rounded mb-8 bg-amber-500/5 uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Q1 2024 // FIS GLOBAL
                      </span>
                    </TextReveal>
                    
                    <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white uppercase tracking-widest leading-tight">
                      <TextReveal type="blur-reveal" delay={0.4} as="span">
                        Above and Beyond
                      </TextReveal>
                      <br />
                      <TextReveal type="blur-reveal" delay={0.5} as="span">
                        Individual Award
                      </TextReveal>
                    </h3>

                    <div className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-8 mt-2 relative">
                      {/* Laser Line separator */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                      
                      <TextReveal type="fade-up" delay={0.6}>
                        Recognized for exceptional contributions to the banking microservices platform,
                        demonstrating technical excellence, proactive problem-solving, and leadership
                        in delivering high-impact solutions.
                      </TextReveal>
                    </div>
                  </div>
                </div>
              </div>
          </motion.div>
        </ParallaxSection>
      </div>
    </section>
  );
};

export default AwardSection;
