import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import TextReveal from "./ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const EducationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="py-32 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>


      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
              [ ACADEMIC_RECORD ]
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            <TextReveal type="blur-reveal" delay={0.2} as="span">EDUCATION</TextReveal>{" "}
            <TextReveal type="blur-reveal" delay={0.3} as="span" className="text-white/40 inline-block">HISTORY</TextReveal>
          </h2>
        </motion.div>

        <ParallaxSection speed={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="p-8 md:p-10 border border-white/10 bg-black/40 hover:border-white/30 transition-colors">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Icon */}
                <div className="w-16 h-16 border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2 text-white uppercase tracking-wide">
                    Bachelor of Engineering
                  </h3>
                  <div className="text-sm font-mono text-white/60 uppercase tracking-widest mb-4 border-b border-white/10 pb-4 inline-block">
                    Computer Science & Engineering
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6 text-gray-400 text-xs font-mono uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>Sri Siddhartha Institute of Technology</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>2017 – 2021</span>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed text-sm">
                    Completed Bachelor's degree with focus on software engineering, data structures,
                    algorithms, and database management systems. Gained foundational knowledge in
                    programming, system design, and software development methodologies.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </ParallaxSection>
      </div>
    </section>
  );
};

export default EducationSection;
