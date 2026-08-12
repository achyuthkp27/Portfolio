import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2, Server, Database, Cloud, ShieldCheck,
  GitBranch, type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import SpotlightCard from "./ui/SpotlightCard";

interface SkillCategory {
  title: string;
  icon: LucideIcon;
  accent: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  { title: "Core Java & Languages", icon: Code2, accent: "text-emerald-400", skills: ["Java", "Concurrency & Multithreading", "Design Patterns", "Python", "JavaScript"] },
  { title: "Frameworks & AI", icon: Server, accent: "text-blue-400", skills: ["Spring Boot", "Spring Security", "Spring Data JPA", "Spring AI", "LangChain4j", "gRPC", "ReactJS"] },
  { title: "Data & Messaging", icon: Database, accent: "text-purple-400", skills: ["PostgreSQL", "Redis", "Apache Kafka", "NATS JetStream", "MinIO"] },
  { title: "Security & Resilience", icon: ShieldCheck, accent: "text-amber-400", skills: ["JWT / JWE / JWS", "OAuth2", "TOTP / MFA", "Circuit Breakers & Retries", "PCI-DSS / SOX"] },
  { title: "Cloud & DevOps", icon: Cloud, accent: "text-cyan-400", skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Git"] },
  { title: "Testing & Observability", icon: GitBranch, accent: "text-rose-400", skills: ["JUnit", "Mockito", "ELK Stack", "Prometheus", "Grafana", "Swagger / OpenAPI"] },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Capabilities"
          titleMain="What I"
          titleAccent="Work With"
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-full"
            >
              <SpotlightCard
                className="h-full glass-card p-8 border border-white/10 bg-black/40 rounded-xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500"
                spotlightColor="rgba(255, 255, 255, 0.04)"
              >
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors duration-500">
                    <category.icon className={`w-5 h-5 ${category.accent} opacity-80`} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2 relative z-10">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-body font-light text-white/70 bg-white/[0.04] border border-white/10 rounded-full hover:border-white/25 hover:text-white transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
