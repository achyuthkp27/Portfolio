import type { ReactNode } from "react";
import { projects, type Project } from "@/data/projects";

/**
 * Sticky stacking case-study cards (Harrison Wheeler-style).
 * Pure CSS `position: sticky` — each card pins below the nav with a small
 * staggered offset so previous cards peek out above as the next slides over.
 * No scroll-jacking, no animation library; works on mobile untouched.
 */

// ── Diagram building blocks ──────────────────────────────────────────

const Node = ({ label, sub, wide = false }: { label: string; sub?: string; wide?: boolean }) => (
  <div className={`rounded-lg bg-white/[0.05] border border-white/15 px-3 py-2 text-center ${wide ? "flex-1" : ""}`}>
    <div className="font-mono text-[11px] md:text-xs text-white leading-tight whitespace-nowrap">{label}</div>
    {sub && <div className="font-mono text-[9px] md:text-[10px] text-white/50 leading-tight mt-0.5 whitespace-nowrap">{sub}</div>}
  </div>
);

const Arrow = ({ down = false }: { down?: boolean }) => (
  <div className={`text-emerald-500/70 font-mono text-sm shrink-0 ${down ? "rotate-90 my-0.5" : ""}`} aria-hidden="true">→</div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center gap-2 flex-wrap">{children}</div>
);

const Bus = ({ label }: { label: string }) => (
  <div className="w-full max-w-[280px] mx-auto rounded bg-emerald-500/[0.06] border border-emerald-500/35 border-dashed px-3 py-1.5 text-center">
    <span className="font-mono text-[10px] md:text-[11px] text-emerald-300/80 tracking-widest uppercase">{label}</span>
  </div>
);

const Stack = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5 w-full">{children}</div>
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
  "maker-checker-authorization": (
    <Stack>
      <Row><Node label="Maker" sub="initiates" /><Arrow /><Node label="Pending" sub="queued" /><Arrow /><Node label="Checker" sub="approves" /></Row>
      <Arrow down />
      <Node label="Dual-approval gate" sub="PCI-DSS / SOX" wide />
      <Arrow down />
      <Node label="Core banking" sub="transaction posted" />
    </Stack>
  ),
  "totp-authentication-system": (
    <Stack>
      <Row>
        {["4", "8", "2", "9", "1", "7"].map((d, i) => (
          <div key={i} className="w-8 h-10 md:w-9 md:h-11 rounded-md bg-white/[0.05] border border-white/20 flex items-center justify-center font-mono text-base md:text-lg text-emerald-100">{d}</div>
        ))}
      </Row>
      <Arrow down />
      <Row><Node label="Auth service" sub="RFC 6238" /><Arrow /><Node label="Redis" sub="replay check" /></Row>
      <Arrow down />
      <Node label="✓ Approved on device" sub="push notification" />
    </Stack>
  ),
  "card-tokenization": (
    <Stack>
      <div className="w-44 md:w-52 rounded-xl bg-white/[0.05] border border-white/20 p-3 text-left">
        <div className="font-mono text-[10px] text-white/40 line-through">5412 7534 9821 0067</div>
        <div className="font-mono text-xs md:text-sm text-emerald-300 mt-1">tok_9f3a…e71c</div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[9px] text-white/50">CARD ON FILE</span>
          <span className="font-mono text-[9px] text-white/50">MC · VISA</span>
        </div>
      </div>
      <Arrow down />
      <Row><Node label="Token vault" sub="JWE / JWS" /><Arrow /><Node label="Card networks" sub="Mastercard · Visa" /></Row>
    </Stack>
  ),
  "video-kyc-onboarding": (
    <Stack>
      <Row>
        <Node label="Customer" sub="camera" />
        <div className="font-mono text-[10px] text-emerald-300/80 border-t border-b border-dashed border-emerald-500/40 px-2 py-1">WebRTC ⇄</div>
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
      <div className="w-full max-w-[280px] space-y-1.5">
        <div className="rounded-lg rounded-bl-none bg-white/[0.06] border border-white/15 px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-white/90 w-fit">What's my account balance?</div>
        <div className="rounded-lg rounded-br-none bg-emerald-400/90 px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-black w-fit ml-auto">Verifying your identity first…</div>
      </div>
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
  gradient?: string; // deprecated — panels share one blueprint surface
}

const META: Record<string, StackMeta> = {
  "corporate-banking-microservices": { headline: "Three channels. One platform. Hundreds of corporates.", gradient: undefined },
  "maker-checker-authorization": { headline: "Four eyes on every transaction", gradient: undefined },
  "totp-authentication-system": { headline: "Proving it's really you, every time", gradient: undefined },
  "card-tokenization": { headline: "Card numbers that never touch disk", gradient: undefined },
  "video-kyc-onboarding": { headline: "KYC without the branch visit", gradient: undefined },
  "llm-banking-chatbot": { headline: "A banker that answers at 3 AM", gradient: undefined },
  "elk-observability-rollout": { headline: "Every log, one search bar", gradient: undefined },
};

// ── Card ─────────────────────────────────────────────────────────────

const StackCard = ({ study, index }: { study: Project; index: number }) => {
  const meta = META[study.slug];
  const diagram = DIAGRAMS[study.slug];
  const textFirst = index % 2 === 0;
  // Alternate headline tint like the reference alternates white/pink
  const headlineTint = index % 2 === 0
    ? "from-white to-white/70"
    : "from-white to-emerald-200/50";

  return (
    <div
      className="sticky"
      style={{ top: `calc(4.5rem + ${index * 0.75}rem)`, zIndex: index + 1 }}
    >
      <article className="rounded-[2rem] border border-white/10 bg-[#0a0a0c] shadow-[0_-24px_80px_rgba(0,0,0,0.8)] overflow-hidden mb-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center p-8 md:p-14 lg:p-20 lg:min-h-[70vh]">
          {/* Text side */}
          <div className={textFirst ? "" : "lg:order-2"}>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[11px] text-white/40">{String(index + 1).padStart(2, "0")}</span>
              <span className="w-6 h-px bg-white/20" aria-hidden="true" />
              <span className="text-[11px] font-body font-medium tracking-[0.25em] uppercase text-white/40">{study.category}</span>
            </div>
            <h3 className={`font-condensed text-4xl md:text-6xl lg:text-7xl uppercase leading-[0.95] tracking-wide bg-gradient-to-b ${headlineTint} bg-clip-text text-transparent mb-6`}>
              {meta?.headline ?? study.title}
            </h3>
            <p className="text-base md:text-lg font-body font-light text-white/60 leading-relaxed max-w-md mb-6">
              {study.description}
            </p>
            <p className="text-sm font-body font-light text-white/45 leading-relaxed max-w-md mb-8">
              <span className="text-emerald-400/80">Outcome — </span>{study.outcome}.
            </p>
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-[11px] font-body font-light text-white/60 border border-white/15 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visual side — architecture diagram on a color panel */}
          <div className={textFirst ? "" : "lg:order-1"}>
            <div className="relative rounded-2xl border border-white/10 bg-[#101013] p-6 md:p-10 flex items-center justify-center min-h-[300px] md:min-h-[380px] shadow-2xl overflow-hidden">
              {/* Faint emerald bloom + blueprint grid — same surface on every card */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)] pointer-events-none" aria-hidden="true" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" aria-hidden="true" />
              <div className="relative z-10 w-full flex items-center justify-center">{diagram}</div>
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
