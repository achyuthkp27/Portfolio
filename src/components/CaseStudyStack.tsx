import { type CSSProperties, type ReactNode } from "react";
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
 * Pure CSS `position: sticky` — each card pins below the nav with a small
 * staggered offset so previous cards peek out above as the next slides over it.
 * Applies on every screen size. No scroll-jacking.
 */

// ── Diagram building blocks ──────────────────────────────────────────

const Node = ({ label, sub, wide = false }: { label: string; sub?: string; wide?: boolean }) => (
  <motion.div
    variants={itemVariants}
    className={`rounded-lg bg-white/[0.05] border border-white/15 px-3 py-2 text-center ${wide ? "flex-1" : ""}`}
  >
    <div className="font-mono text-[11px] md:text-xs text-white leading-tight whitespace-nowrap">{label}</div>
    {sub && (
      <div className="font-mono text-[9px] md:text-[10px] text-white/50 leading-tight mt-0.5 whitespace-nowrap">
        {sub}
      </div>
    )}
  </motion.div>
);

const Arrow = ({ down = false }: { down?: boolean }) => (
  <motion.div variants={itemVariants} className={`shrink-0 ${down ? "my-0.5" : ""}`} aria-hidden="true">
    <span className="block text-emerald-500/80 font-mono text-sm">{down ? "↓" : "→"}</span>
  </motion.div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 flex-wrap">
    {children}
  </motion.div>
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
      <Row>
        <Node label="Retail" />
        <Node label="Mobile" />
        <Node label="Corporate" />
      </Row>
      <Arrow down />
      <Node label="API Gateway" sub="Spring Boot" />
      <Arrow down />
      <Bus label="Kafka event bus" />
      <Arrow down />
      <Row>
        <Node label="30+ services" />
        <Node label="PostgreSQL" />
        <Node label="Redis" />
      </Row>
    </Stack>
  ),
  "maker-checker-authorization": <MakerCheckerDemo />,
  "totp-authentication-system": <TotpDemo />,
  "card-tokenization": (
    <Stack>
      <motion.div
        variants={itemVariants}
        className="w-44 md:w-52 rounded-xl bg-white/[0.05] border border-white/20 p-3 text-left"
      >
        <div className="font-mono text-[10px] text-white/40 line-through">5412 7534 9821 0067</div>
        <div className="font-mono text-xs md:text-sm text-emerald-300 mt-1">tok_9f3a…e71c</div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[9px] text-white/50">CARD ON FILE</span>
          <span className="font-mono text-[9px] text-white/50">MC · VISA</span>
        </div>
      </motion.div>
      <Arrow down />
      <Row>
        <Node label="Token vault" sub="JWE / JWS" />
        <Arrow />
        <Node label="Card networks" sub="Mastercard · Visa" />
      </Row>
    </Stack>
  ),
  "video-kyc-onboarding": (
    <Stack>
      <Row>
        <Node label="Customer" sub="camera" />
        <motion.div
          variants={itemVariants}
          className="font-mono text-[10px] text-emerald-300/80 border-t border-b border-dashed border-emerald-500/40 px-2 py-1"
        >
          WebRTC ⇄
        </motion.div>
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
        <div className="rounded-lg rounded-bl-none bg-white/[0.06] border border-white/15 px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-white/90 w-fit">
          What's my account balance?
        </div>
        <div className="rounded-lg rounded-br-none bg-emerald-400/90 px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-black w-fit ml-auto">
          Verifying your identity first…
        </div>
      </motion.div>
      <Arrow down />
      <Row>
        <Node label="Chat API" sub="Spring AI" />
        <Arrow />
        <Node label="LLM" sub="LangChain4j" />
        <Arrow />
        <Node label="Accounts" sub="identity-gated" />
      </Row>
    </Stack>
  ),
  voxos: (
    <Stack>
      <Row>
        <Node label="Voice" sub="on-device" />
        <Arrow />
        <Node label="Intent" sub="Swift" />
        <Arrow />
        <Node label="Action" sub="shell · app · cursor" />
      </Row>
      <Arrow down />
      <Bus label="nothing leaves the Mac" />
    </Stack>
  ),
  "kairo-offline-ai-bank": (
    <Stack>
      <Row>
        <Node label="Accounts" sub="SQLite" />
        <Arrow />
        <Node label="Qwen" sub="on-device LLM" />
        <Arrow />
        <Node label="Coach" sub="anomalies · plans" />
      </Row>
      <Arrow down />
      <Bus label="airplane mode works" />
    </Stack>
  ),
  "elk-observability-rollout": (
    <Stack>
      <Row>
        <Node label="svc-payments" />
        <Node label="svc-auth" />
        <Node label="svc-cards" />
      </Row>
      <Arrow down />
      <Bus label="Kafka transport" />
      <Arrow down />
      <Row>
        <Node label="Logstash" />
        <Arrow />
        <Node label="Elasticsearch" />
        <Arrow />
        <Node label="Kibana" sub="one search bar" />
      </Row>
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
  voxos: { headline: "Say it. The Mac does it." },
  "kairo-offline-ai-bank": { headline: "A bank that thinks on the phone" },
};

// ── Card ─────────────────────────────────────────────────────────────

const StackCard = ({ study, index, isLast }: { study: Project; index: number; isLast: boolean }) => {
  const meta = META[study.slug];
  const diagram = DIAGRAMS[study.slug];
  const textFirst = index % 2 === 0;

  return (
    // The last card never pins — nothing slides over it — so it takes no `top` offset either.
    // A `top` on a non-sticky box shifts it down over whatever follows; it still layers over
    // the card before it via z-index. The pin offset is a CSS var so the nav clearance can
    // shrink on small screens, where every pixel of visible card counts.
    <div
      className={isLast ? "relative" : "relative md:sticky md:top-[calc(5.75rem+var(--stack-offset))]"}
      style={{ "--stack-offset": `${index * 1.1}rem`, zIndex: index + 1 } as CSSProperties}
    >
      <article
        className={`rounded-[2rem] border border-white/15 shadow-[0_-24px_80px_rgba(0,0,0,0.8)] overflow-hidden ${isLast ? "" : "mb-8"}`}
        style={{ background: `rgb(${10 + index * 3} ${10 + index * 3} ${13 + index * 3})` }}
      >
        {/* Padding, gaps and the 70vh floor all shrink on short screens so a whole card fits
            between the nav and the fold — that is what keeps the next card from covering
            content you have not read yet. */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center p-5 md:p-10 lg:p-12 xl:p-16 [@media(max-height:820px)]:lg:p-8 [@media(max-height:820px)]:xl:p-10 lg:[@media(min-height:900px)]:min-h-[70vh]">
          {/* Text side. On one column it comes second: the next card slides up from the
              bottom, so the demo must not be the thing sitting down there. */}
          <div className={`order-2 ${textFirst ? "lg:order-1" : "lg:order-2"}`}>
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="font-mono text-xs text-white/60">{String(index + 1).padStart(2, "0")}</span>
              <span className="w-6 h-px bg-white/25" aria-hidden="true" />
              <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-white/60">
                {study.title}
              </span>
            </div>
            <h3 className="t-heading text-4xl md:text-5xl lg:text-6xl leading-[0.95] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-5 md:mb-8">
              {meta?.headline ?? study.title}
            </h3>
            <dl className="space-y-3 md:space-y-4 max-w-lg mb-5 md:mb-8">
              {[
                { term: "Problem", detail: study.problem },
                { term: "Approach", detail: study.solution },
                { term: "Outcome", detail: study.outcome },
              ].map(({ term, detail }) => (
                <div key={term} className="grid grid-cols-[5.5rem_1fr] gap-4 items-baseline">
                  <dt className="text-xs font-body font-medium tracking-[0.12em] uppercase text-emerald-400/90">
                    {term}
                  </dt>
                  <dd className="text-[15px] font-body font-light text-white/75 leading-relaxed">{detail}.</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] font-body font-light text-white/60 border border-white/15 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visual side — architecture diagram, or a hands-on demo. First on one column so the
              "Try it" controls stay in the pinned, always-visible part of the card. */}
          <div className={`order-1 ${textFirst ? "lg:order-2" : "lg:order-1"}`}>
            <div className="relative rounded-2xl border border-white/10 bg-[#101013] p-4 md:p-8 lg:p-10 flex items-center justify-center min-h-[230px] md:min-h-[320px] lg:[@media(min-height:900px)]:min-h-[380px] shadow-2xl overflow-hidden">
              {/* Faint emerald bloom + blueprint grid — same surface on every card */}
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)] pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
                aria-hidden="true"
              />
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
      <StackCard key={study.slug} study={study} index={index} isLast={index === projects.length - 1} />
    ))}
  </div>
);

export default CaseStudyStack;
