import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import MakerCheckerDemo from "./case-studies/MakerCheckerDemo";
import { ChatScreen, KairoScreen, KycScreen, LogScreen, TokenScreen, VoxScreen } from "./case-studies/Screens";
import TotpDemo from "./case-studies/TotpDemo";
import { PillLink, Chip } from "./ui/Pill";
import { FillText } from "./ui/FillText";
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
  "card-tokenization": <TokenScreen />,
  "video-kyc-onboarding": <KycScreen />,
  "llm-banking-chatbot": <ChatScreen />,
  voxos: <VoxScreen />,
  "kairo-offline-ai-bank": <KairoScreen />,
  "elk-observability-rollout": <LogScreen />,
};

const HEADLINES: Record<string, string> = {
  "corporate-banking-microservices": "Three channels. One platform. Hundreds of corporates.",
  "maker-checker-authorization": "Four eyes on every transaction",
  "totp-authentication-system": "Proving it's really you, every time",
  "card-tokenization": "Card numbers that never touch disk",
  "video-kyc-onboarding": "KYC without the branch visit",
  "llm-banking-chatbot": "A banker that answers at 3 AM",
  "elk-observability-rollout": "Every log, one search bar",
  voxos: "Say it. The Mac does it.",
  "kairo-offline-ai-bank": "A bank that thinks on the phone",
};
const INTERACTIVE = new Set(["maker-checker-authorization", "totp-authentication-system"]);

/**
 * One case study as a sticky card: it pins below the nav with a small stagger per card, so
 * each earlier card peeks out above as the next one slides over it. Pure CSS sticky from
 * the tablet breakpoint up; phones flow. The last card never pins: nothing slides over it.
 */
const WorkCard = ({ study, index, isLast }: { study: Project; index: number; isLast: boolean }) => {
  // Parallax: the artwork drifts a little slower than the card as it passes through the viewport
  const tile = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: tile, offset: ["start end", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const artScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);
  const interactive = INTERACTIVE.has(study.slug) || study.slug === "corporate-banking-microservices";
  return (
    <div
      className={isLast ? "relative" : "relative md:sticky md:top-[calc(6rem+var(--stack-offset))]"}
      style={{ "--stack-offset": `${index * 0.75}rem`, zIndex: index + 1 } as CSSProperties}
    >
      <motion.article
        {...reveal()}
        id={`case-${study.slug}`}
        className={`rounded-lg border border-line bg-night shadow-[0_-24px_60px_rgba(0,0,0,0.85)] p-5 md:p-7 scroll-mt-28 ${isLast ? "" : "mb-6"}`}
      >
        <div
          ref={tile}
          className={`relative rounded-md bg-tile text-snow overflow-hidden ${interactive ? "min-h-[300px] md:min-h-[400px] lg:[@media(min-height:900px)]:min-h-[440px] flex items-center justify-center p-6 md:p-12" : "h-[300px] md:h-[400px] lg:[@media(min-height:900px)]:h-[440px]"}`}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.35] [background-image:linear-gradient(hsl(0_0%_100%/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,hsl(0_0%_100%/0.08),transparent_70%),radial-gradient(60%_50%_at_100%_100%,hsl(153_50%_35%/0.22),transparent_70%)]"
            aria-hidden="true"
          />
          {interactive ? (
            <motion.div
              style={{ y: artY, scale: artScale }}
              data-reveal-skip
              className="relative w-full max-w-2xl flex items-center justify-center will-change-transform pt-8 md:pt-0"
            >
              {DIAGRAMS[study.slug]}
            </motion.div>
          ) : (
            <div data-reveal-skip className="absolute inset-0">
              {DIAGRAMS[study.slug]}
            </div>
          )}
          {interactive && (
            <span className="absolute top-4 left-4 md:top-6 md:left-6 inline-flex items-center gap-2 rounded-pill bg-snow text-night pl-2.5 pr-3 py-1 text-[12px] font-medium uppercase tracking-[0.04em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
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
};

/** (Selected work): sticky heading on the left, a stack of pinning cards on the right. */
const WorkSection = () => (
  <section id="work" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] gap-12 lg:gap-16 items-start">
      <div className="lg:sticky lg:top-32">
        <p className="t-label mb-5">Selected work</p>
        <h2 className="t-statement text-6xl md:text-7xl lg:text-[5.5rem]">My work</h2>
        <FillText
          text="Seven systems from a regulated banking platform, and two AI products built on my own time. Client specifics are generalised and no metrics are invented. Two are interactive."
          className="t-caps text-snow mt-6 max-w-sm"
          offset={["start 0.9", "start 0.4"]}
        />
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
      </div>
    </div>
  </section>
);

export default WorkSection;
