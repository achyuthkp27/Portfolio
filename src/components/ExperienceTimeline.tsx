import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Building2, GraduationCap, ChevronDown } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";

const experiences = [
  {
    company: "FIS Global",
    role: "Software Engineer",
    period: "2021 – Present",
    type: "full-time",
    icon: Building2,
    color: "primary",
    achievements: [
      "Developed and maintained 25+ high-performance RESTful APIs using Spring Boot microservices for corporate, retail, and mobile banking platforms.",
      "Led end-to-end implementation of ELK stack with Apache Kafka, achieving a 25% reduction in issue resolution time.",
      "Enhanced API documentation using Swagger to improve developer collaboration and efficiency.",
      "Contributed to code reviews and technical documentation, promoting best practices and knowledge-sharing.",
      "Diagnosed and resolved complex technical issues through detailed debugging and analysis.",
      "Optimized deployment processes for SIT, UAT, and Production, ensuring maximum system reliability.",
      "Integrated frontend UI with ReactJS for seamless user experience across banking applications."
    ],
    technologies: ["Spring Boot", "Microservices", "Kafka", "ELK Stack", "ReactJS", "Docker", "AWS"],
  },
  {
    company: "Aniworks",
    role: "Intern",
    period: "2020",
    type: "internship",
    icon: GraduationCap,
    color: "accent",
    achievements: [
      "Worked across Web Development, AI, ML concepts",
      "Collaborated on intern-level projects",
      "Hands-on experience with real-world systems",
    ],
    technologies: ["Web Development", "AI/ML", "Python"],
  },
];

const ExperienceTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>

      <div className="max-w-5xl mx-auto relative z-10">
        <ParallaxSection speed={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <TextReveal type="fade-up">
              <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
                [ EXPERIENCE_LOG ]
              </span>
            </TextReveal>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tighter uppercase leading-none">
              <TextReveal type="blur-reveal" delay={0.2} as="span">Professional</TextReveal><br/>
              <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40 inline-block">History</TextReveal>
            </h2>
          </motion.div>
        </ParallaxSection>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent animate-scan-beam" />
          </div>

          {experiences.map((exp, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className={`relative mb-12 group/timeline ${index % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:pl-[50%] md:ml-auto"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-10 z-10 flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full border-2 z-20 transition-all duration-500 flex items-center justify-center ${isExpanded ? 'border-emerald-400 bg-emerald-950 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'border-white/30 bg-black group-hover/timeline:border-emerald-500/50 group-hover/timeline:shadow-[0_0_10px_rgba(52,211,153,0.2)]'}`}>
                    {isExpanded && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                  </div>
                </div>

                {/* Content card */}
                <motion.div
                  whileHover={{ x: index % 2 === 0 ? -8 : 8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`ml-20 md:ml-0 ${index % 2 === 0 ? "md:mr-16" : "md:ml-16"}`}
                >
                  <div
                    className={`group relative p-8 cursor-pointer overflow-hidden transition-all duration-500 border rounded-xl bg-black/60 backdrop-blur-md ${isExpanded ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5'}`}
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    {/* Cinematic Bloom Background */}
                    <div className={`absolute -inset-32 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-full blur-3xl opacity-0 transition-opacity duration-700 pointer-events-none ${isExpanded ? 'opacity-100' : 'group-hover:opacity-40'}`} />

                    {/* Header */}
                    <div className={`relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4 mb-2 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                      <div className={`flex flex-col ${index % 2 === 0 ? "md:items-end text-left md:text-right" : "text-left md:items-start"}`}>
                        <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-widest">{exp.company}</h3>
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

                    {/* Expanded content */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="pt-6 border-t border-white/10 mt-6">
                        <ul className={`space-y-4 mb-8 ${index % 2 === 0 ? "md:text-right" : "text-left"}`}>
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className={`text-sm md:text-[15px] font-light text-gray-300 leading-relaxed flex items-start gap-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                              <span className="text-emerald-500 mt-1.5 text-[10px]">▹</span>
                              <span className="flex-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>

                        <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "justify-start"}`}>
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-[9px] font-mono border border-emerald-500/20 bg-emerald-950/30 text-emerald-100 rounded tracking-widest hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.05)] cursor-crosshair break-words max-w-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
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
