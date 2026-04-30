import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import { experiences } from "@/data/experience";

const ExperienceTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems((current) =>
      current.includes(index) ? current.filter((id) => id !== index) : [...current, index]
    );
  };

  return (
    <section id="experience" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader 
          label="[ EXPERIENCE_LOG ]" 
          titleMain="Professional" 
          titleAccent="History" 
          align="center"
        />

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 overflow-visible">
            <motion.div
              className="w-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-transparent origin-top"
              style={{ scaleY }}
            />
            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent animate-scan-beam" />
          </div>

          {experiences.map((exp, index) => {
            const isExpanded = expandedItems.includes(index);
            const Icon = exp.icon;

            return (
              <motion.div
                key={`${exp.company}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className={`relative mb-12 group/timeline ${index % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:pl-[50%] md:ml-auto"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-10 z-10 flex items-center justify-center">
                  <div className={`w-5 h-5 rounded-full border-2 z-20 transition-all duration-500 flex items-center justify-center ${isExpanded ? 'border-emerald-400 bg-emerald-950 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'border-white/30 bg-black group-hover/timeline:border-emerald-500/50 group-hover/timeline:shadow-[0_0_10px_rgba(52,211,153,0.2)]'}`}>
                    {isExpanded && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                  </div>
                  {/* Pulsing ring for first (current) role */}
                  {index === 0 && !isExpanded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border border-emerald-500/30 animate-ping" />
                    </div>
                  )}
                </div>

                {/* Content card */}
                <motion.div
                  layout
                  whileHover={{ x: index % 2 === 0 ? -8 : 8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`ml-20 md:ml-0 ${index % 2 === 0 ? "md:mr-16" : "md:ml-16"}`}
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`experience-panel-${index}`}
                    id={`experience-toggle-${index}`}
                    className={`group relative p-8 w-full text-left cursor-pointer overflow-hidden transition-all duration-500 border rounded-xl bg-black/60 backdrop-blur-md ${isExpanded ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5'}`}
                    onClick={() => toggleExpanded(index)}
                  >
                    {/* Cinematic Bloom Background */}
                    <div className={`absolute -inset-32 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-full blur-3xl opacity-0 transition-opacity duration-700 pointer-events-none ${isExpanded ? 'opacity-100' : 'group-hover:opacity-40'}`} />

                    {/* Header */}
                    <div className={`relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4 mb-2 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <div className={`flex flex-col ${index % 2 === 0 ? "md:items-end text-left md:text-right" : "text-left md:items-start"}`}>
                        <div className={`flex items-center gap-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 shrink-0" />
                          <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-widest">{exp.company}</h3>
                        </div>
                        <p className="text-emerald-400/90 font-mono text-xs md:text-sm tracking-widest uppercase mt-1">{exp.role}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center gap-3 self-end sm:self-auto">
                        <span className="text-[9px] md:text-[11px] text-white/50 font-mono border border-white/10 px-2 md:px-3 py-1 md:py-1.5 rounded bg-white/5 backdrop-blur-sm shadow-sm whitespace-nowrap">{exp.period}</span>
                        <motion.div 
                          animate={{ rotate: isExpanded ? 180 : 0 }} 
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${isExpanded ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-white/40 group-hover:border-emerald-500/30 group-hover:text-emerald-400'}`}
                        >
                          <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="expanded"
                          id={`experience-panel-${index}`}
                          aria-labelledby={`experience-toggle-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden relative z-10"
                        >
                          <div className="pt-6 border-t border-white/10 mt-6">
                            <ul className={`space-y-4 mb-8 ${index % 2 === 0 ? "md:text-right" : "text-left"}`}>
                              {exp.achievements.map((achievement, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                                  className={`text-sm md:text-[15px] font-light text-gray-300 leading-relaxed flex items-start gap-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                                >
                                  <span className="text-emerald-500 mt-1.5 text-[10px]">▹</span>
                                  <span className="flex-1">{achievement}</span>
                                </motion.li>
                              ))}
                            </ul>

                            <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "justify-start"}`}>
                              {exp.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 text-[9px] font-mono border border-emerald-500/20 bg-emerald-950/30 text-emerald-100 rounded tracking-widest hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.05)] cursor-crosshair break-words max-w-full relative overflow-hidden group/tech"
                                >
                                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full group-hover/tech:translate-x-full transition-transform duration-500 pointer-events-none" />
                                  <span className="relative z-10">{tech}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section >
  );
};

export default ExperienceTimeline;
