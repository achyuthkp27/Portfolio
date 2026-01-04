import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2, Server, Database, Cloud, MessageSquare,
  GitBranch,
} from "lucide-react";
import TextReveal from "./ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const skillCategories = [
  { id: "01", title: "Languages", icon: Code2, color: "emerald", skills: [{ name: "Java", level: 95 }, { name: "Python", level: 75 }] },
  { id: "02", title: "Frameworks", icon: Server, color: "blue", skills: [{ name: "Spring Boot", level: 95 }, { name: "gRPC", level: 80 }, { name: "ReactJS", level: 70 }] },
  { id: "03", title: "Databases", icon: Database, color: "purple", skills: [{ name: "PostgreSQL", level: 90 }, { name: "MySQL", level: 85 }, { name: "Redis", level: 75 }] },
  { id: "04", title: "Messaging", icon: MessageSquare, color: "yellow", skills: [{ name: "Apache Kafka", level: 90 }, { name: "NATS JetStream", level: 80 }] },
  { id: "05", title: "AWS Cloud", icon: Cloud, color: "cyan", skills: [{ name: "EC2", level: 85 }, { name: "S3", level: 90 }, { name: "RDS", level: 85 }, { name: "ELB", level: 80 }, { name: "IAM", level: 85 }, { name: "Elastic Beanstalk", level: 75 }] },
  { id: "06", title: "DevOps & Tools", icon: GitBranch, color: "rose", skills: [{ name: "Git", level: 95 }, { name: "Docker", level: 80 }, { name: "ELK Stack", level: 85 }, { name: "JasperSoft Studio", level: 75 }, { name: "Minio", level: 80 }] },
];

const SkillBar = ({ name, level, delay, color }: { name: string; level: number; delay: number; color: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="group/skill">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-mono text-white/60 group-hover/skill:text-emerald-400 transition-colors duration-300">
          {">"} {name}
        </span>
        <span className="text-[10px] font-mono text-white/30 group-hover/skill:text-emerald-500/70 transition-colors duration-300">
          {level}%_EFF
        </span>
      </div>
      <div className="h-1 w-full bg-white/5 relative overflow-hidden">
        {/* Scanning Line Background */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] translate-x-[-100%] animate-[shimmer_2s_infinite] opacity-20 group-hover/skill:opacity-50 transition-opacity" />

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full bg-gradient-to-r from-white/10 to-white/40 group-hover/skill:from-emerald-900/50 group-hover/skill:to-emerald-400 relative transition-colors duration-300`}
        >
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 group-hover/skill:bg-emerald-300 shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover/skill:shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-300" />
        </motion.div>
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 border border-white/10 mb-6 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400 transition-colors duration-300">
              [ SYSTEM_DIAGNOSTICS ]
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            <TextReveal type="blur-reveal" delay={0.2} as="span">Operational</TextReveal>{" "}
            <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">Capabilities</TextReveal>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => (
            <ParallaxSection key={category.title} speed={0.1} className="h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <SpotlightCard
                  className="h-full glass-card p-6 border border-white/10 bg-black/40 relative overflow-hidden group hover:border-emerald-50/30 transition-colors duration-500"
                  spotlightColor="rgba(255, 255, 255, 0.05)"
                >
                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-emerald-500/50 transition-colors duration-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-emerald-500/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-emerald-500/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-emerald-500/50 transition-colors duration-500" />

                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-start mb-8 gap-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors duration-500">
                        <category.icon className="w-5 h-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-500" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-display text-lg font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors duration-500">{category.title}</h3>
                        <span className="text-[10px] font-mono text-white/30 group-hover:text-emerald-500/50 transition-colors duration-500">MODULE_0{i + 1}</span>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-white/5 border border-white/10 rounded flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 group-hover:bg-emerald-400 opacity-75 transition-colors duration-500"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/80 group-hover:bg-emerald-500 transition-colors duration-500"></span>
                      </span>
                      <span className="text-[9px] font-mono text-white/40 group-hover:text-emerald-500/70 transition-colors duration-500 tracking-wider">ACTIVE</span>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-6">
                    {category.skills.map((skill, j) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={0.2 + i * 0.1 + j * 0.05}
                        color={category.color}
                      />
                    ))}
                  </div>

                  {/* Bottom Scan Line */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </SpotlightCard>
              </motion.div>
            </ParallaxSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
