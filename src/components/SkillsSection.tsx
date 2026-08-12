import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2, Server, Database, Cloud, ShieldCheck,
  GitBranch,
} from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const skillCategories = [
  { id: "01", title: "Core Java & Languages", icon: Code2, color: "emerald", skills: [{ name: "Java", level: 95 }, { name: "Concurrency & Multithreading", level: 85 }, { name: "Design Patterns", level: 85 }, { name: "Python", level: 75 }, { name: "JavaScript", level: 70 }] },
  { id: "02", title: "Frameworks & AI", icon: Server, color: "blue", skills: [{ name: "Spring Boot", level: 95 }, { name: "Spring Security", level: 90 }, { name: "Spring Data JPA", level: 90 }, { name: "Spring AI", level: 80 }, { name: "LangChain4j", level: 75 }, { name: "gRPC", level: 80 }, { name: "ReactJS", level: 70 }] },
  { id: "03", title: "Data & Messaging", icon: Database, color: "purple", skills: [{ name: "PostgreSQL", level: 90 }, { name: "Redis", level: 85 }, { name: "Apache Kafka", level: 90 }, { name: "NATS JetStream", level: 80 }, { name: "MinIO", level: 80 }] },
  { id: "04", title: "Security & Resilience", icon: ShieldCheck, color: "yellow", skills: [{ name: "JWT / JWE / JWS", level: 90 }, { name: "OAuth2", level: 85 }, { name: "TOTP / MFA", level: 90 }, { name: "Circuit Breakers & Retries", level: 80 }, { name: "PCI-DSS / SOX", level: 85 }] },
  { id: "05", title: "Cloud & DevOps", icon: Cloud, color: "cyan", skills: [{ name: "AWS", level: 85 }, { name: "Docker", level: 80 }, { name: "Kubernetes", level: 75 }, { name: "Jenkins", level: 85 }, { name: "Git", level: 95 }] },
  { id: "06", title: "Testing & Observability", icon: GitBranch, color: "rose", skills: [{ name: "JUnit", level: 90 }, { name: "Mockito", level: 85 }, { name: "ELK Stack", level: 85 }, { name: "Prometheus", level: 75 }, { name: "Grafana", level: 75 }, { name: "Swagger / OpenAPI", level: 90 }] },
];

const colorMap: Record<string, { accent: string; accentBg: string; accentBorder: string; ring: string; arc: string }> = {
  emerald: { accent: "text-emerald-400", accentBg: "bg-emerald-500/10", accentBorder: "border-emerald-500/20", ring: "stroke-emerald-500", arc: "rgba(16,185,129," },
  blue: { accent: "text-blue-400", accentBg: "bg-blue-500/10", accentBorder: "border-blue-500/20", ring: "stroke-blue-500", arc: "rgba(59,130,246," },
  purple: { accent: "text-purple-400", accentBg: "bg-purple-500/10", accentBorder: "border-purple-500/20", ring: "stroke-purple-500", arc: "rgba(168,85,247," },
  yellow: { accent: "text-yellow-400", accentBg: "bg-yellow-500/10", accentBorder: "border-yellow-500/20", ring: "stroke-yellow-500", arc: "rgba(234,179,8," },
  cyan: { accent: "text-cyan-400", accentBg: "bg-cyan-500/10", accentBorder: "border-cyan-500/20", ring: "stroke-cyan-500", arc: "rgba(6,182,212," },
  rose: { accent: "text-rose-400", accentBg: "bg-rose-500/10", accentBorder: "border-rose-500/20", ring: "stroke-rose-500", arc: "rgba(244,63,94," },
};

// Circular progress arc component
const SkillArc = ({ name, level, delay, arcColor }: { name: string; level: number; delay: number; arcColor: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="group/token relative flex items-center gap-3 px-3 py-2.5 bg-black/40 border border-white/5 rounded-lg hover:border-white/15 hover:bg-white/[0.03] hover:-translate-y-0.5 transition-all duration-300 cursor-crosshair"
    >
      {/* Mini arc progress ring */}
      <div className="relative w-10 h-10 shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
          {/* Background ring */}
          <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          {/* Progress arc */}
          <motion.circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke={`${arcColor}0.6)`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-[9px] font-mono font-bold text-white/50 group-hover/token:text-white/80 transition-colors"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.5 }}
          >
            {level}
          </motion.span>
        </div>
      </div>

      <span className="font-mono text-[11px] font-bold tracking-wide text-white/50 group-hover/token:text-white/80 transition-colors z-10 whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          label="[ SYSTEM_DIAGNOSTICS ]" 
          titleMain="Operational" 
          titleAccent="Capabilities" 
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => {
            const colors = colorMap[category.color] || colorMap.emerald;
            return (
              <ParallaxSection key={category.title} speed={0.1} className="h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="h-full"
                >
                  <SpotlightCard
                    className={`h-full glass-card p-6 border border-white/10 bg-black/40 relative overflow-hidden group hover:${colors.accentBorder} transition-colors duration-500`}
                    spotlightColor="rgba(255, 255, 255, 0.05)"
                  >
                    {/* Color-coded gradient header accent */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${colors.ring.replace('stroke-', 'via-')}/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Background gradient bloom on hover */}
                    <div className={`absolute inset-0 ${colors.accentBg} opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`} />

                    {/* Decorative Corners */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:${colors.accentBorder} transition-colors duration-500`} />
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:${colors.accentBorder} transition-colors duration-500`} />
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:${colors.accentBorder} transition-colors duration-500`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:${colors.accentBorder} transition-colors duration-500`} />

                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start mb-8 gap-y-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:${colors.accentBg} group-hover:${colors.accentBorder} transition-colors duration-500`}>
                          <category.icon className={`w-5 h-5 text-white/70 group-hover:${colors.accent} transition-colors duration-500`} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className={`font-display text-lg font-bold text-white tracking-wide group-hover:${colors.accent} transition-colors duration-500`}>{category.title}</h3>
                          <span className={`text-[10px] font-mono text-white/30 group-hover:${colors.accent} opacity-50 transition-colors duration-500`}>MODULE_0{i + 1}</span>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 group-hover:${colors.accent.replace('text-', 'bg-')} opacity-75 transition-colors duration-500`}></span>
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-white/80 group-hover:${colors.accent.replace('text-', 'bg-')} transition-colors duration-500`}></span>
                        </span>
                        <span className={`text-[9px] font-mono text-white/40 group-hover:${colors.accent} opacity-70 transition-colors duration-500 tracking-wider`}>ACTIVE</span>
                      </div>
                    </div>

                    {/* Skills List with arc progress */}
                    <div className="flex flex-wrap gap-2 md:gap-3 relative z-10">
                      {category.skills.map((skill, j) => (
                        <SkillArc
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                          delay={0.2 + i * 0.1 + j * 0.05}
                          arcColor={colors.arc}
                        />
                      ))}
                    </div>

                    {/* Bottom Scan Line */}
                    <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${colors.ring.replace('stroke-', 'via-')}/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </SpotlightCard>
                </motion.div>
              </ParallaxSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
