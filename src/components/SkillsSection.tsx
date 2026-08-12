import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./ui/SectionHeader";

/**
 * Capabilities as a living pipeline: a terminal panel "runs" the stack —
 * each step completes with the tools that power it. Pure code, loops forever.
 */

interface PipelineStep {
  label: string;
  tools: string;
}

const COMMAND = "run release --service payments";

const STEPS: PipelineStep[] = [
  { label: "Running unit tests", tools: "JUnit · Mockito — 214 passed" },
  { label: "Building service", tools: "Java 21 · Spring Boot · Maven" },
  { label: "Wiring events", tools: "Kafka · exactly-once delivery" },
  { label: "Securing endpoints", tools: "JWT / JWE · OAuth2 · TOTP" },
  { label: "Deploying", tools: "Docker · Kubernetes · Jenkins" },
  { label: "Watching production", tools: "ELK · Prometheus · Grafana" },
];

// The full inventory, quiet and scannable (and crawlable) on the left
const CATEGORIES: { title: string; skills: string }[] = [
  { title: "Core Java", skills: "Java · Concurrency & Multithreading · Design Patterns · Python · JavaScript" },
  { title: "Frameworks & AI", skills: "Spring Boot · Spring Security · Spring Data JPA · Spring AI · LangChain4j · gRPC · ReactJS" },
  { title: "Data & Messaging", skills: "PostgreSQL · Redis · Apache Kafka · NATS JetStream · MinIO" },
  { title: "Security & Resilience", skills: "JWT / JWE / JWS · OAuth2 · TOTP / MFA · Circuit Breakers & Retries · PCI-DSS / SOX" },
  { title: "Cloud & DevOps", skills: "AWS · Docker · Kubernetes · Jenkins · Git" },
  { title: "Testing & Observability", skills: "JUnit · Mockito · ELK Stack · Prometheus · Grafana · Swagger / OpenAPI" },
];

const TYPE_SPEED = 45;      // ms per typed character
const STEP_INTERVAL = 1100; // ms between step completions
const LOOP_PAUSE = 2600;    // ms to rest before restarting

const StepRow = ({ step, state }: { step: PipelineStep; state: "pending" | "running" | "done" }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: state === "pending" ? 0 : 1, y: state === "pending" ? 12 : 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-4 rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3"
  >
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
      {state === "running" ? (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full border border-emerald-400/60 animate-ping" />
          <span className="inline-flex h-4 w-4 rounded-full border-2 border-emerald-400/80" />
        </>
      ) : (
        <svg viewBox="0 0 16 16" className="h-4 w-4">
          <circle cx="8" cy="8" r="7" fill="none" className="stroke-emerald-400" strokeWidth="1.5" />
          <path d="M4.5 8.2 7 10.6l4.5-5" fill="none" className="stroke-emerald-400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <div className="min-w-0">
      <div className="text-sm font-body text-white/90 leading-tight">{step.label}</div>
      <div className="font-mono text-[11px] text-white/40 leading-tight mt-0.5 truncate">
        {state === "done" ? step.tools : "…"}
      </div>
    </div>
  </motion.div>
);

const PipelinePanel = () => {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%" });

  const [typed, setTyped] = useState(reduceMotion ? COMMAND : "");
  const [completed, setCompleted] = useState(reduceMotion ? STEPS.length : 0);
  const [cycle, setCycle] = useState(0);

  // Type the command, then complete steps one by one, pause, restart
  useEffect(() => {
    if (reduceMotion || !inView) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    setTyped("");
    setCompleted(0);

    for (let c = 1; c <= COMMAND.length; c++) {
      timers.push(setTimeout(() => { if (!cancelled) setTyped(COMMAND.slice(0, c)); }, c * TYPE_SPEED));
    }
    const typeDone = COMMAND.length * TYPE_SPEED + 400;
    for (let i = 1; i <= STEPS.length; i++) {
      timers.push(setTimeout(() => { if (!cancelled) setCompleted(i); }, typeDone + i * STEP_INTERVAL));
    }
    timers.push(setTimeout(() => { if (!cancelled) setCycle((n) => n + 1); },
      typeDone + STEPS.length * STEP_INTERVAL + LOOP_PAUSE));

    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [cycle, inView, reduceMotion]);

  return (
    <div ref={ref} className="relative rounded-2xl border border-white/10 bg-[#101013] shadow-2xl overflow-hidden">
      {/* Same blueprint surface as the case-study panels */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" aria-hidden="true" />

      {/* Terminal chrome */}
      <div className="relative z-10 flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[11px] text-white/40">achyuth@banking-platform</span>
      </div>

      <div className="relative z-10 p-5 md:p-7">
        {/* Typed command */}
        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-[13px] md:text-sm mb-5">
          <span className="text-emerald-400">$ </span>
          <span className="text-white/90">{typed}</span>
          <span className="inline-block w-[7px] h-[15px] bg-emerald-400/80 align-middle ml-0.5 animate-pulse" aria-hidden="true" />
        </div>

        {/* Pipeline steps */}
        <div className="space-y-2.5 min-h-[372px]">
          <AnimatePresence>
            {STEPS.map((step, i) => (
              <StepRow
                key={`${cycle}-${step.label}`}
                step={step}
                state={i < completed ? "done" : i === completed && typed === COMMAND ? "running" : "pending"}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer status */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-white/35">
          <span>{completed === STEPS.length ? "release complete — all green" : `step ${Math.min(completed + 1, STEPS.length)}/${STEPS.length}`}</span>
          <span className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${completed === STEPS.length ? "bg-emerald-400" : "bg-emerald-400 animate-pulse"}`} />
            {completed === STEPS.length ? "prod stable" : "running"}
          </span>
        </div>
      </div>
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left — heading, thesis, full inventory */}
          <div>
            <SectionHeader
              label="Capabilities"
              titleMain="The stack,"
              titleAccent="running"
              align="left"
            />
            <p className="text-base md:text-lg font-body font-light text-white/60 leading-relaxed max-w-md -mt-10 mb-12">
              Tools matter when they ship. This is the pipeline every feature travels —
              from a failing test to a monitored production release.
            </p>

            <dl className="space-y-5">
              {CATEGORIES.map((cat) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.45 }}
                  className="grid grid-cols-[11rem_1fr] gap-4 items-baseline border-b border-white/5 pb-4"
                >
                  <dt className="text-[12px] font-body font-medium tracking-[0.15em] uppercase text-white/45">{cat.title}</dt>
                  <dd className="text-sm font-body font-light text-white/70 leading-relaxed">{cat.skills}</dd>
                </motion.div>
              ))}
            </dl>
          </div>

          {/* Right — the living pipeline */}
          <PipelinePanel />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
