import { motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";

/** The full inventory — quiet, scannable, and crawlable. */
const CATEGORIES: { title: string; skills: string[] }[] = [
  { title: "Core languages", skills: ["Java", "Concurrency & multithreading", "Design patterns", "Python", "JavaScript"] },
  { title: "Frameworks & AI", skills: ["Spring Boot", "Spring Security", "Spring Data JPA", "Spring AI", "LangChain4j", "gRPC", "ReactJS"] },
  { title: "Data & messaging", skills: ["PostgreSQL", "Redis", "Apache Kafka", "NATS JetStream", "MinIO"] },
  { title: "Security & resilience", skills: ["JWT / JWE / JWS", "OAuth2", "TOTP / MFA", "Circuit breakers & retries", "PCI-DSS / SOX"] },
  { title: "Cloud & DevOps", skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Git"] },
  { title: "Testing & observability", skills: ["JUnit", "Mockito", "ELK Stack", "Prometheus", "Grafana", "Swagger / OpenAPI"] },
];

const SkillsSection = () => (
  <section id="skills" className="py-20 lg:py-28 px-6 md:px-12 relative">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        label="Skills"
        title="Tools I ship production code with"
        description="Grouped by where they sit in a banking backend, from the language up to what watches it in production."
      />

      <dl className="grid md:grid-cols-2 gap-x-16 border-t border-white/10">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
            className="py-7 border-b border-white/10"
          >
            <dt className="text-xs font-body font-medium tracking-[0.18em] uppercase text-emerald-400/90 mb-4">{cat.title}</dt>
            <dd className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 text-sm font-body text-white/80 bg-white/[0.04] border border-white/10 rounded-md">
                  {skill}
                </span>
              ))}
            </dd>
          </motion.div>
        ))}
      </dl>
    </div>
  </section>
);

export default SkillsSection;
