import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import MakerCheckerDemo from "./case-studies/MakerCheckerDemo";
import { ChatScreen, KairoScreen, LogScreen, VoxScreen } from "./case-studies/Screens";
import TotpDemo from "./case-studies/TotpDemo";
import { PillLink, Chip } from "./ui/Pill";
import { FillText } from "./ui/FillText";
import { PROFILE } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";
import { prefersReducedMotion, useMotionOff } from "@/lib/motionPreference";

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
/** Diagrams drawn in the node style sit centred in the tile like the demos */
const CENTRED = new Set(["corporate-banking-microservices", "card-tokenization", "video-kyc-onboarding"]);

/**
 * One case study as a sticky card. It pins below the nav, a step lower than the card before,
 * and useCardStack pulls its pin up when it is taller than the screen so its lower half is
 * read first; then the next card slides over and this one shrinks and dims behind it. The
 * last card never pins: nothing slides over it.
 */
const WorkCard = ({ study, index, isLast }: { study: Project; index: number; isLast: boolean }) => {
  // Parallax: the artwork drifts a little slower than the card as it passes through the viewport
  const tile = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: tile, offset: ["start end", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const artScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);
  const interactive = INTERACTIVE.has(study.slug);
  const centred = interactive || CENTRED.has(study.slug);
  // Own-time products carry the accent: a lit border, a taller stage, and a link to the source
  const own = Boolean(study.repo);
  return (
    <div
      data-stack-card
      className={isLast ? "relative" : "relative sticky"}
      style={{ top: STACK_TOP, zIndex: index + 1 }}
    >
      <div data-stack-scale className="relative origin-top will-change-transform">
        <motion.article
          {...reveal()}
          id={`case-${study.slug}`}
          className={`relative rounded-lg border bg-night shadow-[0_-24px_60px_rgba(0,0,0,0.85)] p-5 md:p-7 scroll-mt-28 ${own ? "border-emerald-400/40 shadow-[0_-24px_60px_rgba(0,0,0,0.85),0_0_80px_-30px_hsl(153_60%_50%/0.5)]" : "border-line"} ${isLast ? "" : "mb-6"}`}
        >
          <div
            ref={tile}
            data-stack-tile
            className={`relative rounded-md bg-tile text-snow overflow-hidden ${centred ? "min-h-[300px] md:min-h-[400px] lg:[@media(min-height:900px)]:min-h-[440px] flex items-center justify-center p-6 md:p-12" : own ? "h-[340px] md:h-[460px] lg:[@media(min-height:900px)]:h-[520px]" : "h-[300px] md:h-[400px] lg:[@media(min-height:900px)]:h-[440px]"}`}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.35] [background-image:linear-gradient(hsl(0_0%_100%/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,hsl(0_0%_100%/0.08),transparent_70%),radial-gradient(60%_50%_at_100%_100%,hsl(153_50%_35%/0.22),transparent_70%)]"
              aria-hidden="true"
            />
            {centred ? (
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
              {study.origin && <p className="t-figure text-[11px] text-emerald-300 mt-2">{study.origin}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {study.repo && (
                <a
                  href={study.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-pill bg-emerald-400 text-night px-3 py-1 text-[12px] font-medium hover:bg-emerald-300 transition-colors duration-fast"
                >
                  Source <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
              <Chip>{study.category ?? "Backend"}</Chip>
            </div>
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
          {/* Shade laid over the card as later cards pile on top of it */}
          <div
            data-stack-dim
            aria-hidden="true"
            className="absolute inset-0 rounded-lg bg-night pointer-events-none opacity-0"
          />
        </motion.article>
      </div>
    </div>
  );
};

/** How far each covered card steps up behind the one in front */
const STACK_STEP = 36;
/** How many covered cards stay visible behind the front one */
const STACK_DEPTH = 2;
/** Where every card pins: below the nav, with room above for the visible steps */
const STACK_TOP = 88 + STACK_STEP * STACK_DEPTH;
/** The smallest a card's picture may shrink to so the card fits the screen */
const TILE_MIN = 200;

/**
 * Drives the pile from scroll. Every card pins at the same line; as the next card covers
 * it, it steps up, shrinks from its top edge and dims, so the two cards behind the front
 * one always show as a ladder and older ones fade out. On desktop a card taller than the
 * space below the pin gets a shorter picture so the whole card, and the pile, stay in view.
 * On phones a tall card scrolls up until its bottom shows, then holds while the next one
 * slides over. Styles are written straight to the nodes: scrolling never re-renders React.
 */
const useCardStack = (container: React.RefObject<HTMLDivElement | null>) => {
  // Live, so the footer switch takes effect without a reload
  const motionOff = useMotionOff();
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-stack-card]")];
    const scales = cards.map((c) => c.querySelector<HTMLElement>("[data-stack-scale]"));
    const dims = cards.map((c) => c.querySelector<HTMLElement>("[data-stack-dim]"));
    const tiles = cards.map((c) => c.querySelector<HTMLElement>("[data-stack-tile]"));
    const still = prefersReducedMotion();
    let raf = 0;

    const fit = () => {
      const desktop = innerWidth >= 768;
      const top = desktop ? STACK_TOP : 76;
      cards.forEach((card, i) => {
        const tile = tiles[i];
        if (tile) {
          tile.style.height = "";
          tile.style.minHeight = "";
        }
        const room = innerHeight - top - 16;
        const over = card.offsetHeight - room;
        if (desktop && tile && over > 0) {
          const h = Math.max(TILE_MIN, tile.offsetHeight - over);
          tile.style.height = `${h}px`;
          tile.style.minHeight = `${h}px`;
        }
        if (i < cards.length - 1) card.style.top = `${Math.min(top, innerHeight - card.offsetHeight - 16)}px`;
      });
    };

    const paint = () => {
      raf = 0;
      const rects = cards.map((c) => c.getBoundingClientRect());
      const cover = rects.map((r, i) => {
        const next = rects[i + 1];
        if (!next) return 0;
        return Math.min(1, Math.max(0, (r.bottom - next.top) / Math.max(1, r.height - STACK_STEP)));
      });
      const depth = new Array(cards.length).fill(0);
      for (let i = cards.length - 2; i >= 0; i--) depth[i] = cover[i] + cover[i] * depth[i + 1];
      depth.forEach((d, i) => {
        const scale = scales[i];
        const dim = dims[i];
        if (scale) {
          const lift = Math.min(d, STACK_DEPTH + 1) * STACK_STEP;
          scale.style.transform = still
            ? ""
            : `translateY(${-lift}px) scale(${1 - Math.min(d, STACK_DEPTH + 1) * 0.05})`;
          // Past the visible steps a card fades away instead of stacking up under the nav
          scale.style.opacity = String(Math.max(0, Math.min(1, STACK_DEPTH + 1 - d)));
        }
        if (dim) dim.style.opacity = String(Math.min(0.45, d * 0.22));
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onResize = () => {
      fit();
      onScroll();
    };
    onResize();
    // Fonts and demos settle after first paint; fit again once they have
    const settle = [setTimeout(onResize, 600), setTimeout(onResize, 2000)];
    document.fonts?.ready.then(onResize);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      settle.forEach(clearTimeout);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, [container, motionOff]);
};

/** (Selected work): sticky heading on the left, a stack of pinning cards on the right. */
const WorkSection = () => {
  const stack = useRef<HTMLDivElement>(null);
  useCardStack(stack);
  return (
    <section id="work" className="theme-dark text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] gap-12 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-32">
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
          <div ref={stack} className="relative">
            {projects.map((study, index) => (
              <WorkCard key={study.slug} study={study} index={index} isLast={index === projects.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
