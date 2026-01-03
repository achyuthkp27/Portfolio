import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Server, Database, MessageSquare, HardDrive, LayoutDashboard } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const projects = [
  {
    title: "Banking API Platform",
    description: "High-volume microservices powering corporate, retail, and mobile banking transactions with 99.9% uptime.",
    problem: "Legacy monolithic banking system couldn't scale with growing user base",
    solution: "Decomposed into 25+ microservices with event-driven architecture",
    outcome: "3x improvement in transaction throughput, 40% reduction in latency",
    tags: ["Spring Boot", "PostgreSQL", "Kafka", "Redis", "AWS"],
    icon: Server,
    color: "white",
    gradient: "from-white/10 to-white/5",
  },
  {
    title: "Centralized Logging System",
    description: "Real-time monitoring toolkit with ELK Stack and Kafka for enterprise-wide observability.",
    problem: "Debugging production issues took hours due to scattered logs",
    solution: "Implemented centralized logging with Elasticsearch, Logstash, and Kibana",
    outcome: "25% faster issue resolution, improved system reliability",
    tags: ["ELK Stack", "Kafka", "Spring Boot", "Docker"],
    icon: Database,
    color: "white",
    gradient: "from-white/10 to-white/5",
  },
  {
    title: "Distributed Notification Engine",
    description: "Scalable event-driven notification system handling millions of messages daily.",
    problem: "Synchronous notifications causing bottlenecks and poor UX",
    solution: "Built async notification engine with Kafka consumers and retry mechanisms",
    outcome: "10x throughput improvement, zero message loss guarantee",
    tags: ["Kafka", "Spring Boot", "Redis", "PostgreSQL"],
    icon: MessageSquare,
    color: "white",
    gradient: "from-white/10 to-white/5",
  },
  {
    title: "Secure File Storage (MinIO)",
    description: "Enterprise file storage solution with granular access policies and AWS S3 compatibility.",
    problem: "Document management scattered across multiple systems",
    solution: "Unified storage layer with MinIO, access policies, and CDN integration",
    outcome: "Centralized document management, 50% cost reduction vs S3",
    tags: ["MinIO", "AWS S3", "Spring Boot", "IAM"],
    icon: HardDrive,
    color: "white",
    gradient: "from-white/10 to-white/5",
  },
  {
    title: "Microservice Monitoring Dashboard",
    description: "ReactJS dashboard for real-time monitoring of distributed microservices health and metrics.",
    problem: "No visibility into microservice health and performance",
    solution: "Built React dashboard with real-time metrics, alerts, and health checks",
    outcome: "Proactive issue detection, reduced MTTR by 60%",
    tags: ["ReactJS", "Spring Boot", "WebSocket", "Chart.js"],
    icon: LayoutDashboard,
    color: "white",
    gradient: "from-white/10 to-white/5",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-32 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-4 py-2 text-xs font-mono tracking-wider uppercase text-primary bg-primary/10 rounded-full border border-primary/30 mb-6">
              Portfolio
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <TextReveal type="blur-reveal" delay={0.2} as="span">Featured</TextReveal>{" "}
            <TextReveal type="blur-reveal" delay={0.3} shouldSplit={false} as="span" className="text-gradient inline-block">Projects</TextReveal>
          </h2>
          <TextReveal type="fade-up" delay={0.4} as="p" className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade solutions built with modern technologies and best practices
          </TextReveal>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ParallaxSection key={project.title} speed={0.1 + (index % 3) * 0.1} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -10 }}
                className="group h-full"
              >
                <SpotlightCard
                  className="h-full flex flex-col glass-card border border-white/10 bg-black/40"
                  spotlightColor="rgba(255, 255, 255, 0.1)"
                >
                  {/* Header with gradient */}
                  <div className={`p-6 bg-gradient-to-br ${project.gradient} relative`}>
                    <div className="absolute inset-0 bg-background/50" />
                    <div className="relative flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm bg-white/10 border border-white/10"
                      >
                        <project.icon className={`w-6 h-6 text-${project.color}`} />
                      </div>
                      <div className="flex gap-2">
                        <motion.a
                          href="https://github.com/achyuthkp27"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors border border-white/10 block"
                        >
                          <Github className="w-4 h-4 text-white" />
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors border border-white/10"
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-xl font-bold mb-2 text-white group-hover:text-white/90 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed border-b border-white/5 pb-4">{project.description}</p>

                    {/* Problem → Solution → Outcome */}
                    <div className="space-y-4 mb-6 flex-1">
                      <div className="text-sm">
                        <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider block mb-1">Problem</span>
                        <span className="text-gray-400 block">{project.problem}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider block mb-1">Solution</span>
                        <span className="text-gray-400 block">{project.solution}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider block mb-1">Outcome</span>
                        <span className="text-gray-400 block">{project.outcome}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-mono bg-secondary/80 text-secondary-foreground rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </ParallaxSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
