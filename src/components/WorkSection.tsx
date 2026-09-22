import { type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import MakerCheckerDemo from "./case-studies/MakerCheckerDemo";
import TotpDemo from "./case-studies/TotpDemo";
import TraceWaterfall from "./case-studies/TraceWaterfall";
import { PillLink, Chip } from "./ui/Pill";
import { PROFILE } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";

// Diagram choreography: parent staggers, items rise in
const stackVariants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

const Node = ({ label, sub, wide = false }: { label: string; sub?: string; wide?: boolean }) => (
  <motion.div
    variants={itemVariants}
    className={`rounded-sm bg-snow/[0.06] border border-line px-3 py-2 text-center ${wide ? "flex-1" : ""}`}
  >
    <div className="font-mono text-[11px] md:text-xs text-snow leading-tight whitespace-nowrap">{label}</div>
    {sub && (
      <div className="font-mono text-[9px] md:text-[10px] text-muted leading-tight mt-0.5 whitespace-nowrap">{sub}</div>
    )}
  </motion.div>
);
const Arrow = ({ down = false }: { down?: boolean }) => (
  <motion.div variants={itemVariants} className={`shrink-0 ${down ? "my-0.5" : ""}`} aria-hidden="true">
    <span className="block text-emerald-400 font-mono text-sm">{down ? "↓" : "→"}</span>
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
    className="w-full max-w-[280px] mx-auto rounded-sm bg-emerald-500/[0.08] border border-emerald-400/50 border-dashed px-3 py-1.5 text-center"
  >
    <span className="font-mono text-[10px] md:text-[11px] text-emerald-300 tracking-widest uppercase">{label}</span>
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
        className="w-44 md:w-52 rounded-md bg-snow/[0.06] border border-line p-3 text-left"
      >
        <div className="font-mono text-[10px] text-muted line-through">5412 7534 9821 0067</div>
        <div className="font-mono text-xs md:text-sm text-emerald-300 mt-1">tok_9f3a…e71c</div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[9px] text-muted">CARD ON FILE</span>
          <span className="font-mono text-[9px] text-muted">MC · VISA</span>
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
          className="font-mono text-[10px] text-emerald-300 border-t border-b border-dashed border-emerald-400/50 px-2 py-1"
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
        <div className="rounded-md rounded-bl-none bg-snow/[0.08] border border-line px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-snow w-fit">
          What's my account balance?
        </div>
        <div className="rounded-md rounded-br-none bg-snow px-3 py-1.5 font-mono text-[10px] md:text-[11px] text-night w-fit ml-auto">
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

const HEADLINES: Record<string, string> = {
  "corporate-banking-microservices": "Three channels. One platform. Hundreds of corporates.",
  "maker-checker-authorization": "Four eyes on every transaction",
  "totp-authentication-system": "Proving it's really you, every time",
  "card-tokenization": "Card numbers that never touch disk",
  "video-kyc-onboarding": "KYC without the branch visit",
  "llm-banking-chatbot": "A banker that answers at 3 AM",
  "elk-observability-rollout": "Every log, one search bar",
};
const INTERACTIVE = new Set(["maker-checker-authorization", "totp-authentication-system"]);

/**
 * One case study as a sticky card: it pins below the nav with a small stagger per card, so
 * each earlier card peeks out above as the next one slides over it. Pure CSS sticky, every
 * screen size, no scroll-jacking. The last card never pins: nothing slides over it.
 */
const WorkCard = ({ study, index, isLast }: { study: Project; index: number; isLast: boolean }) => (
  <div
    className={
      isLast ? "relative" : "sticky top-[calc(5rem+var(--stack-offset))] md:top-[calc(6rem+var(--stack-offset))]"
    }
    style={{ "--stack-offset": `${index * 0.75}rem`, zIndex: index + 1 } as CSSProperties}
  >
    <motion.article
      {...reveal()}
      id={`case-${study.slug}`}
      className={`rounded-lg border border-line bg-night shadow-[0_-24px_60px_rgba(0,0,0,0.85)] p-5 md:p-7 scroll-mt-28 ${isLast ? "" : "mb-6"}`}
    >
      <div className="relative rounded-md bg-tile text-snow overflow-hidden min-h-[300px] md:min-h-[400px] lg:[@media(min-height:900px)]:min-h-[440px] flex items-center justify-center p-6 md:p-12">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%/0.06),transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />
        <div
          data-reveal-skip
          className={`relative w-full flex items-center justify-center ${INTERACTIVE.has(study.slug) ? "pt-8 md:pt-0" : ""}`}
        >
          {DIAGRAMS[study.slug]}
        </div>
        {INTERACTIVE.has(study.slug) && (
          <span className="absolute top-4 left-4 md:top-6 md:left-6 rounded-pill bg-snow text-night px-3 py-1 text-[12px] font-medium uppercase tracking-[0.04em]">
            Try it
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-6 pt-5">
        <div className="min-w-0">
          <h3 className="t-heading text-3xl md:text-4xl text-snow text-balance">
            {HEADLINES[study.slug] ?? study.title}
          </h3>
          <p className="t-caps text-muted mt-2">{study.title}</p>
        </div>
        <Chip className="shrink-0">{study.category ?? "Backend"}</Chip>
      </div>
      <dl className="mt-5 grid md:grid-cols-3 gap-4 md:gap-8">
        {[
          ["Problem", study.problem],
          ["Approach", study.solution],
          ["Outcome", study.outcome],
        ].map(([term, detail]) => (
          <div key={term}>
            <dt className="t-label mb-1.5">{term}</dt>
            <dd className="t-body text-snow/80">{detail}.</dd>
          </div>
        ))}
      </dl>
    </motion.article>
  </div>
);

/**
 * (Selected work): sticky heading on the left, a stack of pinning cards on the right.
 * The trace closes the section as the one request that ties them together.
 */
const WorkSection = () => (
  <section id="work" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] gap-12 lg:gap-16 items-start">
      <div className="lg:sticky lg:top-32">
        <p className="t-label mb-5">Selected work</p>
        <h2 className="t-statement text-6xl md:text-7xl lg:text-[5.5rem]">My work</h2>
        <p className="t-caps text-muted mt-6 max-w-sm">
          Seven systems from a regulated banking platform. Client specifics are generalised and no metrics are invented.
          Two are interactive.
        </p>
        <div className="mt-8">
          <PillLink tone="outline" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">
            All code on GitHub
          </PillLink>
        </div>
      </div>

      <div className="min-w-0">
        <div className="relative">
          {projects.map((study, index) => (
            <WorkCard key={study.slug} study={study} index={index} isLast={index === projects.length - 1} />
          ))}
        </div>

        {/* Above the stacked cards so nothing pinned can cover it */}
        <motion.div {...reveal()} id="trace" className="relative z-10 mt-16 lg:mt-20 scroll-mt-28">
          <p className="t-label mb-3">One wire transfer, end to end</p>
          <p className="t-caps text-muted mb-6 max-w-2xl">
            The same flow the case studies describe, drawn the way I read it in production. Pick a span.
          </p>
          <TraceWaterfall />
        </motion.div>
      </div>
    </div>
  </section>
);

export default WorkSection;
