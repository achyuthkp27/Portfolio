import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2, Server, Database, Cloud, MessageSquare,
  Activity, GitBranch, Palette, Container, KeyRound,
  Cpu, HardDrive
} from "lucide-react";
import TextReveal from "./ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";
import SpaceBackground from "./3d/SpaceBackground";

const skillCategories = [
  {
    title: "Languages",
    icon: Code2,
    color: "white",
    skills: [
      { name: "Java", level: 95 },
      { name: "Python", level: 75 },
    ],
  },
  {
    title: "Frameworks",
    icon: Server,
    color: "white",
    skills: [
      { name: "Spring Boot", level: 95 },
      { name: "gRPC", level: 80 },
      { name: "ReactJS", level: 70 },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    color: "white",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "MySQL", level: 85 },
      { name: "Redis", level: 75 },
    ],
  },
  {
    title: "Messaging",
    icon: MessageSquare,
    color: "white",
    skills: [
      { name: "Apache Kafka", level: 90 },
      { name: "NATS JetStream", level: 80 },
    ],
  },
  {
    title: "AWS Cloud",
    icon: Cloud,
    color: "white",
    skills: [
      { name: "EC2", level: 85 },
      { name: "S3", level: 90 },
      { name: "RDS", level: 85 },
      { name: "ELB", level: 80 },
      { name: "IAM", level: 85 },
      { name: "Elastic Beanstalk", level: 75 },
    ],
  },
  {
    title: "DevOps & Tools",
    icon: GitBranch,
    color: "white",
    skills: [
      { name: "Git", level: 95 },
      { name: "Docker", level: 80 },
      { name: "ELK Stack", level: 85 },
      { name: "JasperSoft Studio", level: 75 },
      { name: "Minio", level: 80 },
    ],
  },
];

const SkillBar = ({ name, level, delay, color }: { name: string; level: number; delay: number; color: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-white">{name}</span>
        <span className="text-xs font-mono text-gray-400">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-white"
          style={{
            boxShadow: `0 0 10px white`,
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <SpaceBackground />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-4 py-2 text-xs font-mono tracking-wider uppercase text-white bg-white/5 rounded-full border border-white/10 mb-6">
              Technical Arsenal
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            <TextReveal type="blur-reveal" delay={0.2} as="span">Skills &</TextReveal>{" "}
            <TextReveal type="blur-reveal" delay={0.3} shouldSplit={false} as="span" className="text-white/80 inline-block">Technologies</TextReveal>
          </h2>
          <TextReveal type="fade-up" delay={0.4} as="p" className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A comprehensive toolkit for building enterprise-grade backend systems
          </TextReveal>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <ParallaxSection key={category.title} speed={0.1 + (categoryIndex % 2) * 0.15} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <SpotlightCard
                  className="glass-card p-8 space-y-8 h-full border border-white/10 bg-black/40 flex flex-col"
                  spotlightColor="rgba(255, 255, 255, 0.1)"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/5`}
                    >
                      <category.icon
                        className={`w-5 h-5 text-${category.color}`}
                      />
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-white">{category.title}</h3>
                  </div>

                  {/* Skills */}
                  <div className="space-y-8 flex-grow">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={0.2 + categoryIndex * 0.1 + skillIndex * 0.05}
                        color={category.color}
                      />
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            </ParallaxSection>
          ))}
        </div>
      </div>
    </section >
  );
};

export default SkillsSection;
