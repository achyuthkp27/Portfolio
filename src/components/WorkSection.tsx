import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import MakerCheckerDemo from "./case-studies/MakerCheckerDemo";
import {
  ChatScreen,
  KairoScreen,
  KycScreen,
  LogScreen,
  PlatformScreen,
  TokenScreen,
  VoxScreen,
} from "./case-studies/Screens";
import TotpDemo from "./case-studies/TotpDemo";
import { PillLink, Chip } from "./ui/Pill";
import { FillText } from "./ui/FillText";
import { PROFILE } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";

const DIAGRAMS: Record<string, ReactNode> = {
  "corporate-banking-microservices": <PlatformScreen />,
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
 * each earlier card peeks out above as the next one slides over it. Pure CSS sticky, large
 * screens only: below that a card can be taller than the viewport, and a pinned card taller
 * than the viewport can never show its lower half. The last card never pins.
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
      className={isLast ? "relative" : "relative lg:sticky lg:top-[calc(6rem+var(--stack-offset))]"}
      style={{ "--stack-offset": `${index * 0.75}rem`, zIndex: index + 1 } as CSSProperties}
    >
      <motion.article
        {...reveal()}
        id={`case-${study.slug}`}
        className={`group flex flex-col rounded-lg border border-line bg-tile shadow-[0_-24px_60px_rgba(0,0,0,0.85)] scroll-mt-28 overflow-hidden transition-[transform,border-color] duration-slow ease-out lg:hover:-translate-y-1 lg:hover:border-snow/25 ${isLast ? "" : "mb-6"}`}
      >
        {/* Header: index, title, category */}
        <div className="flex items-center justify-between gap-4 px-4 md:px-5 h-11 border-b border-line bg-night/70">
          <div className="flex items-center gap-3 min-w-0">
            <span className="t-figure text-[11px] text-emerald-300 shrink-0">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="t-caps text-[11px] text-muted break-words">{study.title}</span>
          </div>
          <Chip className="hidden md:inline-flex shrink-0">{study.category ?? "Backend"}</Chip>
        </div>

        {/* Stage */}
        <div
          ref={tile}
          className={`relative text-snow overflow-hidden ${INTERACTIVE.has(study.slug) ? "min-h-[340px] md:min-h-[440px] lg:[@media(min-height:900px)]:min-h-[480px] flex items-center justify-center p-5 md:p-10 lg:p-12" : "h-[340px] md:h-[440px] lg:[@media(min-height:900px)]:h-[480px]"}`}
        >
          {/* A drafting grid, a highlight from above, a breath of the accent, and grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.35] [background-image:linear-gradient(hsl(0_0%_100%/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,hsl(0_0%_100%/0.08),transparent_70%),radial-gradient(60%_50%_at_100%_100%,hsl(153_50%_35%/0.22),transparent_70%)]"
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-slow group-hover:opacity-100 bg-[radial-gradient(60%_60%_at_50%_100%,hsl(153_60%_50%/0.18),transparent_70%)]"
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
          {INTERACTIVE.has(study.slug) ? (
            <motion.div
              style={{ y: artY, scale: artScale }}
              data-reveal-skip
              className="relative w-full max-w-2xl flex items-center justify-center will-change-transform pt-12 md:pt-0"
            >
              {DIAGRAMS[study.slug]}
            </motion.div>
          ) : (
            <div data-reveal-skip className="absolute inset-0">
              {DIAGRAMS[study.slug]}
            </div>
          )}
          {INTERACTIVE.has(study.slug) && (
            <span className="absolute top-4 left-4 md:top-5 md:left-5 inline-flex items-center gap-2 rounded-pill bg-snow text-night pl-2.5 pr-3 py-1 text-[12px] font-medium uppercase tracking-[0.04em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Try it
            </span>
          )}
        </div>

        {/* Footer: the stack behind it */}
        <div className="flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-t border-line bg-night/70">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 min-w-0">
            {study.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="t-figure text-[11px] text-snow/70">
                {tag}
              </li>
            ))}
          </ul>
          <span className="t-figure text-[11px] text-muted shrink-0">
            {INTERACTIVE.has(study.slug) ? "Interactive model" : "Architecture"}
          </span>
        </div>

        {/* Below lg the card carries its own story */}
        <div className="lg:hidden order-first px-5 md:px-7 pb-6 pt-5 border-b border-line">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="t-heading text-2xl md:text-4xl text-snow text-balance">
                {HEADLINES[study.slug] ?? study.title}
              </h3>
              <p className="t-caps text-muted text-[12px] mt-1.5">{study.title}</p>
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
        </div>
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
            text="Seven systems from a regulated banking platform, and two AI products built on my own time. Client specifics are generalised and no metrics are invented. Two are interactive."
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
