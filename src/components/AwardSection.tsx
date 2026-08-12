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
          titleMain="Honors &" 
          titleAccent="Awards" 
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
              <div className="p-1 md:p-1 relative overflow-hidden bg-black/40 border border-white/10 hover:border-white/20 transition-all duration-700 group/award rounded-2xl">
                {/* Tactical Scanning Grid */}
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                

                <div className="relative flex flex-col items-center text-center gap-10 p-10 md:p-16 rounded-xl">

                  {/* Badge */}
                  <div className="w-20 h-20 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center">
                    <TextReveal type="fade-up" delay={0.3}>
                      <span className="inline-flex items-center px-4 py-1.5 text-[11px] font-body font-medium border border-white/15 text-white/50 rounded-full mb-8 uppercase tracking-[0.2em]">
                        FIS Global · Q1 2024
                      </span>
                    </TextReveal>
                    
                    <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-white tracking-tight leading-tight">
                      <TextReveal type="blur-reveal" delay={0.4} as="span">
                        Above and Beyond
                      </TextReveal>
                      <br />
                      <TextReveal type="blur-reveal" delay={0.5} as="span">
                        Individual Award
                      </TextReveal>
                    </h3>

                    <div className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-8 mt-2 relative">
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
