import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Star, Trophy } from "lucide-react";
import TextReveal from "./ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const AwardSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="awards" className="py-32 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>


      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
              [ RECOGNITION_LOG ]
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            <TextReveal type="blur-reveal" as="span">HONORS &</TextReveal>{" "}
            <TextReveal type="blur-reveal" as="span" className="text-white/40">AWARDS</TextReveal>
          </h2>
        </motion.div>

        {/* Award Card */}
        <ParallaxSection speed={0.3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="p-8 md:p-12 border border-white/10 bg-black/40 hover:border-white/30 transition-colors">
              <div className="relative flex flex-col items-center text-center gap-8">

                <div className="w-20 h-20 border border-white/20 flex items-center justify-center bg-white/5">
                  <Trophy className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <TextReveal type="fade-up" delay={0.3}>
                    <span className="inline-block px-3 py-1 text-[10px] font-mono border border-white/10 text-white/60 rounded-full mb-6 bg-white/5 uppercase tracking-wider">
                      Q1 2024 // FIS GLOBAL
                    </span>
                  </TextReveal>
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 text-white uppercase tracking-tight">
                    <TextReveal type="blur-reveal" delay={0.4}>
                      Above and Beyond Individual Award
                    </TextReveal>
                  </h3>
                  <div className="text-gray-400 leading-relaxed max-w-2xl mx-auto border-t border-white/10 pt-6 mt-2">
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
