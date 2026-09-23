import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import MakerCheckerDemo from "./case-studies/MakerCheckerDemo";
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
interface WorkCardProps {
  study: Project;
  index: number;
  isLast: boolean;
  onActive: (index: number) => void;
}

const WorkCard = ({ study, index, isLast, onActive }: WorkCardProps) => {
  // Parallax: the artwork drifts a little slower than the card as it passes through the viewport
  const tile = useRef<HTMLDivElement>(null);
  // The card whose top crosses the reading line becomes the one the left column describes
  useEffect(() => {
    const el = tile.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActive(index);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);
  const { scrollYProgress } = useScroll({ target: tile, offset: ["start end", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const artScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);
  return (
    <div
      className={
        isLast ? "relative" : "sticky top-[calc(5rem+var(--stack-offset))] md:top-[calc(6rem+var(--stack-offset))]"
      }
      style={{ "--stack-offset": `${index * 0.75}rem`, zIndex: index + 1 } as CSSProperties}
    >
      <motion.article
        {...reveal()}
        id={`case-${study.slug}`}
        className={`flex flex-col rounded-lg border border-line bg-night shadow-[0_-24px_60px_rgba(0,0,0,0.85)] p-5 md:p-7 scroll-mt-28 ${isLast ? "" : "mb-6"}`}
      >
        <div
          ref={tile}
          className="relative rounded-md bg-tile text-snow overflow-hidden min-h-[240px] md:min-h-[400px] lg:[@media(min-height:900px)]:min-h-[440px] flex items-center justify-center p-5 md:p-12"
        >
          {/* Depth without colour: a soft top highlight, a faint vignette, and grain */}
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,hsl(0_0%_100%/0.07),transparent_70%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,hsl(0_0%_0%/0.35)_100%)]"
            aria-hidden="true"
          />
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none mix-blend-screen"
          >
            <filter id={`grain-${study.slug}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#grain-${study.slug})`} />
          </svg>
          <motion.div
            style={{ y: artY, scale: artScale }}
            data-reveal-skip
            className={`relative w-full flex items-center justify-center will-change-transform ${INTERACTIVE.has(study.slug) ? "pt-8 md:pt-0" : ""}`}
          >
            {DIAGRAMS[study.slug]}
          </motion.div>
          {INTERACTIVE.has(study.slug) && (
            <span className="absolute top-4 left-4 md:top-6 md:left-6 rounded-pill bg-snow text-night px-3 py-1 text-[12px] font-medium uppercase tracking-[0.04em]">
              Try it
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-4 pb-4 lg:hidden order-first">
          <div className="min-w-0">
            <h3 className="t-heading text-2xl md:text-4xl text-snow text-balance">
              {HEADLINES[study.slug] ?? study.title}
            </h3>
            <p className="t-caps text-muted text-[12px] mt-1.5">{study.title}</p>
          </div>
          <Chip className="shrink-0">{study.category ?? "Backend"}</Chip>
        </div>
        <dl className="mt-5 grid md:grid-cols-3 gap-4 md:gap-8 lg:hidden">
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

/** The story for one case study, shown in the sticky left column on large screens. */
const Story = ({ study, index }: { study: Project; index: number }) => (
  <motion.div
    key={study.slug}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: DUR.base, ease: EASE }}
    className="absolute inset-x-0 top-0"
  >
    <div className="flex items-center gap-3">
      <span className="t-figure text-xs text-emerald-300">
        {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
      </span>
      <Chip>{study.category ?? "Backend"}</Chip>
    </div>
    <h3 className="t-heading text-4xl xl:text-5xl text-snow mt-5 text-balance">
      {HEADLINES[study.slug] ?? study.title}
    </h3>
    <p className="t-caps text-muted mt-3">{study.title}</p>
    <dl className="mt-7 space-y-4">
      {[
        ["Problem", study.problem],
        ["Approach", study.solution],
        ["Outcome", study.outcome],
      ].map(([term, detail]) => (
        <div key={term}>
          <dt className="t-label mb-1">{term}</dt>
          <dd className="t-body text-snow/80">{detail}.</dd>
        </div>
      ))}
    </dl>
    <ul className="mt-6 flex flex-wrap gap-2">
      {study.tags.map((tag) => (
        <li key={tag} className="rounded-pill border border-line px-3 py-1 text-[12px] text-snow/80">
          {tag}
        </li>
      ))}
    </ul>
  </motion.div>
);

/**
 * (Selected work): split screen. The left column is static framing plus the story of
 * whichever card is under the reading line; the right is the stack of pinning cards,
 * artwork only on large screens (after niallmcdermott.webflow.io and laplaya.studio).
 * Below lg each card carries its own story.
 */
const WorkSection = () => {
  const [active, setActive] = useState(0);
  return (
    <section id="work" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-12 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="t-label mb-5">Selected work</p>
          <h2 className="t-statement text-6xl md:text-7xl lg:text-[4.5rem]">My work</h2>
          <FillText
            text="Seven systems from a regulated banking platform. Client specifics are generalised and no metrics are invented. Two are interactive."
            className="t-caps text-snow mt-5 max-w-sm"
            offset={["start 0.9", "start 0.4"]}
          />
          <div className="mt-6">
            <PillLink tone="outline" size="sm" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">
              All code on GitHub
            </PillLink>
          </div>

          {/* The current card's story, large screens only */}
          <div className="hidden lg:block relative mt-10 pt-8 border-t border-line min-h-[26rem]">
            <AnimatePresence mode="wait">
              <Story key={projects[active].slug} study={projects[active]} index={active} />
            </AnimatePresence>
          </div>
        </div>

        <div className="min-w-0">
          <div className="relative">
            {projects.map((study, index) => (
              <WorkCard
                key={study.slug}
                study={study}
                index={index}
                isLast={index === projects.length - 1}
                onActive={setActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
