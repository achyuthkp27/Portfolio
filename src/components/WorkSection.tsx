import { useCallback, useState } from "react";
import { useReducedMotionConfig } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ArrowUpRight } from "lucide-react";
import { projectBySlug, WORK, type Project } from "@/data/projects";
import { PROFILE } from "@/data/profile";
import { ExternalLink } from "./ui/ExternalLink";
import { StackIntro } from "./ui/StackCard";
import { StoryDialog, WorkCard } from "./ui/WorkCard";
import { WorkScene } from "./ui/WorkScene";

/** Every project, in order: the banking systems first, then applied AI, then VoxOs */
const ORDER = [...WORK.banking, ...WORK.ai, WORK.spotlight];
/** How the deck shares cards: related projects sit on one card, in the same order */
const GROUPS = [
  ["card-tokenization", "virtual-cards-google-pay"],
  ["duplicate-alerts-race-condition"],
  ["multi-region-apis", "corporate-banking-microservices"],
  ["totp-authentication-system", "elk-observability-rollout"],
  ["llm-banking-chatbot", "aegis-ai", "kairo-offline-ai-bank"],
  ["voxos"],
];

/**
 * (Selected work): a short header, then the WORK capsule that opens into a wall of letters,
 * with the projects stacking up over it as a deck, related ones sharing a card. Each project
 * carries its title, what it is, stack and source; "How it was built" opens its story.
 * Reduced motion, and screens too short for the deck, get the same cards as a plain grid with
 * the story printed in each.
 */
const WorkSection = () => {
  const reduceMotion = useReducedMotionConfig();
  // A phone on its side is too short for the pinned deck: it gets the plain list of cards
  const short = useMediaQuery("(max-height: 560px)");
  const [story, setStory] = useState<Project | null>(null);
  const closeStory = useCallback(() => setStory(null), []);
  const studies = ORDER.map(projectBySlug);
  const groups = GROUPS.map((slugs) => slugs.map(projectBySlug));

  return (
    <section id="work" className="theme-dark text-snow relative scroll-mt-16">
      <StackIntro
        label="My work"
        title={
          <>
            Systems that move money,
            <br className="hidden md:block" /> and the AI on top.
          </>
        }
      >
        <p>
          The card, payment, and alerting systems I have built at a bank, then AI I&apos;ve shipped there and built on
          my own time. <span className="text-snow">Client specifics are generalised and no metrics are invented.</span>
        </p>
        <ExternalLink
          href={PROFILE.links.github}
          className="mt-2 py-3 inline-flex items-center gap-1.5 t-figure text-xs uppercase tracking-[0.18em] text-snow/70 hover:text-snow transition-colors"
        >
          All code on GitHub <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </ExternalLink>
      </StackIntro>

      {reduceMotion || short ? (
        <ol className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pb-24 lg:pb-32 grid lg:grid-cols-2 gap-x-8 gap-y-12">
          {studies.map((study, i) => (
            <li key={study.slug} id={`case-${study.slug}`} className="scroll-mt-24">
              <WorkCard study={study} index={i} total={studies.length} inline />
            </li>
          ))}
        </ol>
      ) : (
        <WorkScene groups={groups} onOpen={setStory} />
      )}
      <StoryDialog study={story} onClose={closeStory} />
    </section>
  );
};

export default WorkSection;
