import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Building2, GraduationCap, ChevronDown, Award, Server, Database, Cloud, Code } from "lucide-react";
import TextReveal from "./ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import ShockwaveWrapper from "./ui/ShockwaveWrapper";

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="py-32 px-6 md:px-12 relative overflow-hidden bg-black" ref={ref}>
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

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
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              <TextReveal type="blur-reveal" delay={0.2} as="span">PROFESSIONAL</TextReveal>{" "}
              <TextReveal type="blur-reveal" delay={0.3} shouldSplit={false} as="span" className="text-white/40 inline-block">HISTORY</TextReveal>
            </h2>
          </motion.div>
        </ParallaxSection>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-white to-transparent animate-scan-beam" />
          </div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className={`relative mb-12 ${index % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:pl-[50%] md:ml-auto"
                }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-12 z-10 flex items-center justify-center">
                <div className="w-3 h-3 bg-black border border-white/50 rounded-full z-20" />
              </div>

              {/* Content card */}
              <motion.div
                whileHover={{ x: index % 2 === 0 ? -5 : 5 }}
                className={`ml-20 md:ml-0 ${index % 2 === 0 ? "md:mr-12" : "md:ml-12"}`}
              >
                <div
                  className="glass-card p-6 cursor-pointer relative overflow-hidden transition-all duration-300 border border-white/10 bg-black/40 hover:border-white/30"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  {/* Header */}
                  <div className={`flex items-start justify-between gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                    <div className={`flex flex-col ${index % 2 === 0 ? "md:items-end" : "md:items-start"}`}>
                      <h3 className="font-display text-xl font-bold text-white uppercase tracking-wide">{exp.company}</h3>
                      <p className="text-white/60 font-mono text-xs uppercase tracking-wider">{exp.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 font-mono border border-white/10 px-2 py-1 rounded-sm">{exp.period}</span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedIndex === index ? "auto" : 0,
                      opacity: expandedIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/10 mt-4">
                      <ul className={`space-y-3 mb-6 ${index % 2 === 0 ? "md:text-right" : "text-left"}`}>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-gray-400 leading-relaxed">
                            {achievement}
                          </li>
                        ))}
                      </ul>

                      <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "justify-start"}`}>
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-[10px] font-mono border border-white/10 text-white/60 uppercase tracking-wider hover:text-white hover:border-white/30 transition-colors"
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
          ))}
        </div>
      </div>
    </section >
  );
};

export default ExperienceTimeline;
