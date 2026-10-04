import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { projectBySlug, WORK, type Project } from "@/data/projects";
import { ChatScreen, VoxScreen } from "./case-studies/Screens";
import { PillLink, Chip } from "./ui/Pill";
import { FillText } from "./ui/FillText";
import { PROFILE } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";

/** One line per AI build, in the order the card shows them */
const AI_LINES: Record<string, { origin: string; line: string }> = {
  "aegis-ai": {
    origin: "Own time · open source",
    line: "A compliance copilot that answers only from internal documents, with citations. Dispute agents that wait for a human to approve. Guardrails on every model call.",
  },
  "llm-banking-chatbot": {
    origin: "FIS Global · in production",
    line: "LLM-powered APIs that check who is asking before they answer account questions, handling routine banking queries in production.",
  },
  "kairo-offline-ai-bank": {
    origin: "Own time · open source",
    line: "Qwen runs on the phone: it answers account questions, finds transactions by meaning and flags odd charges, with nothing sent to a server.",
  },
};

const code = (i: number) => `(${String(i + 1).padStart(2, "0")})`;

/** The card's artwork stage: faint grid, a soft light, and the visual drifting a little slower than the page */
const Stage = ({ children, tall = false }: { children: ReactNode; tall?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <div
      ref={ref}
      className={`relative rounded-md bg-tile text-snow overflow-hidden ${tall ? "h-[340px] md:h-[440px]" : "h-[300px] md:h-[400px]"}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35] [background-image:linear-gradient(hsl(0_0%_100%/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.06)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,hsl(0_0%_100%/0.08),transparent_70%),radial-gradient(60%_50%_at_100%_100%,hsl(153_50%_35%/0.22),transparent_70%)]"
        aria-hidden="true"
      />
      <motion.div style={{ y }} data-reveal-skip className="absolute inset-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

const SourceLink = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-pill bg-emerald-400 text-night px-3 py-1 text-[12px] font-medium hover:bg-emerald-300 transition-colors duration-fast"
  >
    Source <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
  </a>
);

const Card = ({ children }: { children: ReactNode }) => (
  <motion.article
    {...reveal()}
    className="relative rounded-lg border border-emerald-400/40 bg-night p-5 md:p-7 shadow-[0_0_80px_-30px_hsl(153_60%_50%/0.5)]"
  >
    {children}
  </motion.article>
);

/** Applied AI as one card: the assistant on the stage, then the three builds side by side */
const AiCard = () => (
  <Card>
    <Stage tall>
      <ChatScreen />
    </Stage>
    <div className="flex items-start justify-between gap-6 pt-5">
      <div className="min-w-0">
        <h3 className="t-heading text-3xl md:text-4xl text-snow text-balance">AI a bank can trust</h3>
        <p className="t-caps text-muted mt-2">Applied AI · three builds</p>
      </div>
      <Chip className="shrink-0">AI</Chip>
    </div>
    <div className="mt-6 grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
      {WORK.ai.map((slug) => {
        const p = projectBySlug(slug);
        const { origin, line } = AI_LINES[slug];
        return (
          <section
            key={slug}
            id={`case-${slug}`}
            className="scroll-mt-28 md:border-l md:border-line md:pl-6 lg:pl-8 first:md:border-l-0 first:md:pl-0"
          >
            <p className="t-figure text-[11px] text-emerald-300">{origin}</p>
            <h4 className="mt-2 font-body font-semibold text-[19px] text-snow leading-snug">{p.title.split(",")[0]}</h4>
            <p className="mt-2 t-body text-snow/75">{line}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 4).map((t) => (
                <li key={t} className="rounded-pill border border-line px-2.5 py-0.5 text-[12px] text-snow/70">
                  {t}
                </li>
              ))}
            </ul>
            {p.repo && (
              <div className="mt-4">
                <SourceLink href={p.repo} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  </Card>
);

/** One own-time product in full: its visual, then problem, approach and outcome */
const SpotlightCard = ({ study }: { study: Project }) => (
  <Card>
    <div id={`case-${study.slug}`} className="scroll-mt-28">
      <Stage>
        <VoxScreen />
      </Stage>
      <div className="flex items-start justify-between gap-6 pt-5">
        <div className="min-w-0">
          <h3 className="t-heading text-3xl md:text-4xl text-snow text-balance">Say it. The Mac does it.</h3>
          <p className="t-caps text-muted mt-2">{study.title}</p>
          {study.origin && <p className="t-figure text-[11px] text-emerald-300 mt-2">{study.origin}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {study.repo && <SourceLink href={study.repo} />}
          <Chip>{study.category ?? "AI"}</Chip>
        </div>
      </div>
      <Story study={study} />
    </div>
  </Card>
);

const Story = ({ study }: { study: Project }) => {
  const parts = (
    [
      ["Problem", study.problem],
      ["Approach", study.solution],
      ["Outcome", study.outcome],
    ] as const
  ).filter(([, detail]) => detail);
  if (!parts.length) return null;
  return (
    <dl className="mt-5 grid md:grid-cols-3 gap-4 md:gap-8">
      {parts.map(([term, detail]) => (
        <div key={term}>
          <dt className="t-label mb-1.5">{term}</dt>
          <dd className="t-body text-snow/80">{detail}.</dd>
        </div>
      ))}
    </dl>
  );
};

/** A banking system as a numbered row; opening it shows the story and the stack. Hover lights the toggle, never the text. */
const MoreRow = ({
  study,
  index,
  isOpen,
  onToggle,
}: {
  study: Project;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const panel = `more-${study.slug}`;
  return (
    <motion.li
      id={`case-${study.slug}`}
      layout="position"
      transition={{ layout: { duration: DUR.base, ease: EASE } }}
      className="border-b border-line scroll-mt-28"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panel}
        className="group w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 md:gap-x-8 py-6 md:py-7 text-left"
      >
        <span className={`t-figure text-sm ${isOpen ? "text-snow" : "text-muted"}`}>{code(index)}</span>
        <span className="min-w-0">
          <span className="block font-body font-medium tracking-[-0.02em] text-[20px] md:text-[26px] leading-tight text-snow">
            {study.title}
          </span>
          <span className="block mt-1 text-[13px] text-muted md:hidden">{study.category}</span>
        </span>
        <span className="flex items-center gap-4">
          <span className="hidden md:inline-flex">
            <Chip>{study.category ?? "Backend"}</Chip>
          </span>
          <span
            aria-hidden="true"
            className={`grid place-items-center h-11 w-11 rounded-full border transition-colors duration-fast ${isOpen ? "bg-snow text-night border-snow" : "border-line text-snow group-hover:border-emerald-400 group-hover:text-emerald-300"}`}
          >
            <Plus className={`w-4 h-4 transition-transform duration-base ${isOpen ? "rotate-45" : ""}`} />
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panel}
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: DUR.fast } }}
            transition={{ duration: DUR.base, ease: EASE, delay: 0.08 }}
            className="pb-8 md:pl-[3.25rem]"
          >
            <p className="t-body text-snow/70 max-w-3xl">{study.description}</p>
            <Story study={study} />
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {study.tags.map((t) => (
                <li key={t} className="rounded-pill border border-line px-2.5 py-0.5 text-[12px] text-snow/70">
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

/** (Selected work): heading on the left; applied AI, then VoxOs, then the banking systems as an index. */
const WorkSection = () => {
  const [open, setOpen] = useState(-1);
  const more = WORK.more.map(projectBySlug);
  return (
    <section id="work" className="theme-dark text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] gap-12 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <h2 className="t-statement text-6xl md:text-7xl lg:text-[5.5rem]">My work</h2>
          <FillText
            text="AI I've shipped at a bank and built on my own time, then the banking systems underneath it. Client specifics are generalised and no metrics are invented."
            className="t-caps text-snow mt-6 max-w-sm"
            offset={["start 0.9", "start 0.4"]}
          />
          <div className="mt-8">
            <PillLink tone="outline" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">
              All code on GitHub
            </PillLink>
          </div>
        </div>

        <div className="min-w-0 flex flex-col gap-6">
          <AiCard />
          <SpotlightCard study={projectBySlug(WORK.spotlight)} />

          <div className="mt-10 md:mt-14">
            <motion.p {...reveal()} className="t-label mb-4">
              More from the banking platform
            </motion.p>
            <LayoutGroup>
              <ol className="border-t border-line">
                {more.map((study, i) => (
                  <MoreRow
                    key={study.slug}
                    study={study}
                    index={i}
                    isOpen={open === i}
                    onToggle={() => setOpen(open === i ? -1 : i)}
                  />
                ))}
              </ol>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
