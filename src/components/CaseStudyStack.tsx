import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import MakerCheckerDemo from "./case-studies/MakerCheckerDemo";
import TotpDemo from "./case-studies/TotpDemo";

// Shared diagram choreography: parent staggers, items rise in
const stackVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * Sticky stacking case-study cards (Harrison Wheeler-style).
 * Pure CSS `position: sticky` on large, tall-enough screens — each card pins below the nav
 * with a small staggered offset so previous cards peek out above as the next slides over.
 * Elsewhere they are a plain vertical list. No scroll-jacking.
 */

// ── Diagram building blocks ──────────────────────────────────────────

const Node = ({ label, sub, wide = false }: { label: string; sub?: string; wide?: boolean }) => (
  <motion.div variants={itemVariants} className={`rounded-lg bg-white/[0.05] border border-white/15 px-3 py-2 text-center ${wide ? "flex-1" : ""}`}>
    <div className="font-mono text-[11px] md:text-xs text-white leading-tight whitespace-nowrap">{label}</div>
    {sub && <div className="font-mono text-[9px] md:text-[10px] text-white/50 leading-tight mt-0.5 whitespace-nowrap">{sub}</div>}
  </motion.div>
);

const Arrow = ({ down = false }: { down?: boolean }) => (
  <motion.div variants={itemVariants} className={`shrink-0 ${down ? "my-0.5" : ""}`} aria-hidden="true">
    <span className="block text-emerald-500/80 font-mono text-sm">{down ? "↓" : "→"}</span>
  </motion.div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 flex-wrap">{children}</motion.div>
);

const Bus = ({ label }: { label: string }) => (
  <motion.div
    variants={itemVariants}
    className="w-full max-w-[280px] mx-auto rounded bg-emerald-500/[0.06] border border-emerald-500/35 border-dashed px-3 py-1.5 text-center"
  >
    <span className="font-mono text-[10px] md:text-[11px] text-emerald-300/90 tracking-widest uppercase">{label}</span>
  </motion.div>
);

const Stack = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={stackVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-10%" }}
    className="flex flex-col items-center gap-1.5 w-full"
  >
    {children}
  </motion.div>
);

// ── Per-case-study diagrams ──────────────────────────────────────────

const DIAGRAMS: Record<string, ReactNode> = {
  "corporate-banking-microservices": (
    <Stack>
      <Row><Node label="Retail" /><Node label="Mobile" /><Node label="Corporate" /></Row>
      <Arrow down />
      <Node label="API Gateway" sub="Spring Boot" />
      <Arrow down />
      <Bus label="Kafka event bus" />
      <Arrow down />
      <Row><Node label="30+ services" /><Node label="PostgreSQL" /><Node label="Redis" /></Row>
    </Stack>
  ),
  "maker-checker-authorization": <MakerCheckerDemo />,
  "totp-authentication-system": <TotpDemo />,
  "card-tokenization": (
    <Stack>
      <motion.div variants={itemVariants} className="w-44 md:w-52 rounded-xl bg-white/[0.05] border border-white/20 p-3 text-left">
        <div className="font-mono text-[10px] text-white/40 line-through">5412 7534 9821 0067</div>
        <div className="font-mono text-xs md:text-sm text-emerald-300 mt-1">tok_9f3a…e71c</div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[9px] text-white/50">CARD ON FILE</span>
          <span className="font-mono text-[9px] text-white/50">MC · VISA</span>
        </div>
      </motion.div>
      <Arrow down />
      <Row><Node label="Token vault" sub="JWE / JWS" /><Arrow /><Node label="Card networks" sub="Mastercard · Visa" /></Row>
    </Stack>
  ),
  "video-kyc-onboarding": (
    <Stack>
      <Row>
        <Node label="Customer" sub="camera" />
        <motion.div variants={itemVariants} className="font-mono text-[10px] text-emerald-300/80 border-t border-b border-dashed border-emerald-500/40 px-2 py-1">WebRTC ⇄</motion.div>
        <Node label="Agent" sub="verifies" />
      </Row>
      <Arrow down />
      <Node label="Signaling" sub="WebSockets" wide />
      <Arrow down />
      <Node label="KYC complete" sub="account opened" />
    </Stack>
  ),
  "llm-banking-chatbot": (
    <Stack>
      <motion.div variants={itemVariants} className="w-full max-w-[280px] space-y-1.5">
        <div className="rounded-lg rounded-bl-none bg-white/[0.06] border border-white/15 px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-white/90 w-fit">What's my account balance?</div>
        <div className="rounded-lg rounded-br-none bg-emerald-400/90 px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-black w-fit ml-auto">Verifying your identity first…</div>
      </motion.div>
      <Arrow down />
      <Row><Node label="Chat API" sub="Spring AI" /><Arrow /><Node label="LLM" sub="LangChain4j" /><Arrow /><Node label="Accounts" sub="identity-gated" /></Row>
    </Stack>
  ),
  "elk-observability-rollout": (
    <Stack>
      <Row><Node label="svc-payments" /><Node label="svc-auth" /><Node label="svc-cards" /></Row>
      <Arrow down />
      <Bus label="Kafka transport" />
      <Arrow down />
      <Row><Node label="Logstash" /><Arrow /><Node label="Elasticsearch" /><Arrow /><Node label="Kibana" sub="one search bar" /></Row>
    </Stack>
  ),
};

// ── Per-case-study display copy & panel palette ─────────────────────

interface StackMeta {
  headline: string;
  /** Diagram is a hands-on demo rather than a static drawing */
  interactive?: boolean;
}

const META: Record<string, StackMeta> = {
  "corporate-banking-microservices": { headline: "Three channels. One platform. Hundreds of corporates." },
  "maker-checker-authorization": { headline: "Four eyes on every transaction", interactive: true },
  "totp-authentication-system": { headline: "Proving it's really you, every time", interactive: true },
  "card-tokenization": { headline: "Card numbers that never touch disk" },
  "video-kyc-onboarding": { headline: "KYC without the branch visit" },
  "llm-banking-chatbot": { headline: "A banker that answers at 3 AM" },
  "elk-observability-rollout": { headline: "Every log, one search bar" },
};

// ── Card ─────────────────────────────────────────────────────────────

const StackCard = ({ study, index }: { study: Project; index: number }) => {
  const meta = META[study.slug];
  const diagram = DIAGRAMS[study.slug];
  const textFirst = index % 2 === 0;

  return (
    // Stacking only where a whole card fits on screen. On phones and short laptop screens the
    // cards scroll normally, so the next card never covers the bottom (or the interactive demos).
    <div
      className="relative lg:[@media(min-height:820px)]:sticky"
      style={{ top: `calc(5.75rem + ${index * 1.1}rem)`, zIndex: index + 1 }}
    >
      <article
        className="rounded-[2rem] border border-white/15 shadow-[0_-24px_80px_rgba(0,0,0,0.8)] overflow-hidden mb-8"
        style={{ background: `rgb(${10 + index * 3} ${10 + index * 3} ${13 + index * 3})` }}
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center p-7 md:p-12 lg:p-16 lg:min-h-[70vh]">
          {/* Text side */}
          <div className={textFirst ? "" : "lg:order-2"}>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs text-white/60">{String(index + 1).padStart(2, "0")}</span>
              <span className="w-6 h-px bg-white/25" aria-hidden="true" />
              <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-white/60">{study.title}</span>
            </div>
            <h3 className="font-condensed text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.95] tracking-wide bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-8">
              {meta?.headline ?? study.title}
            </h3>
            <dl className="space-y-4 max-w-lg mb-8">
              {[
                { term: "Problem", detail: study.problem },
                { term: "Approach", detail: study.solution },
                { term: "Outcome", detail: study.outcome },
              ].map(({ term, detail }) => (
                <div key={term} className="grid grid-cols-[5.5rem_1fr] gap-4 items-baseline">
                  <dt className="text-xs font-body font-medium tracking-[0.12em] uppercase text-emerald-400/90">{term}</dt>
                  <dd className="text-[15px] font-body font-light text-white/75 leading-relaxed">{detail}.</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-[11px] font-body font-light text-white/60 border border-white/15 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visual side — architecture diagram, or a hands-on demo */}
          <div className={textFirst ? "" : "lg:order-1"}>
            <div className="relative rounded-2xl border border-white/10 bg-[#101013] p-6 md:p-10 flex items-center justify-center min-h-[300px] md:min-h-[380px] shadow-2xl overflow-hidden">
              {/* Faint emerald bloom + blueprint grid — same surface on every card */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)] pointer-events-none" aria-hidden="true" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" aria-hidden="true" />
              {meta?.interactive && (
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full border border-emerald-400/40 bg-emerald-400/[0.08] text-[11px] font-body font-medium text-emerald-200">
                  Try it
                </span>
              )}
              <div className="relative z-10 w-full flex items-center justify-center pt-6 md:pt-0">{diagram}</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

const CaseStudyStack = () => (
  <div className="relative">
    {projects.map((study, index) => (
      <StackCard key={study.slug} study={study} index={index} />
    ))}
  </div>
);

export default CaseStudyStack;
