import { ArrowUpRight } from "lucide-react";
import { projectBySlug, WORK, type Project } from "@/data/projects";
import { PROFILE } from "@/data/profile";
import { StackBody, StackCard, StackHead, StackIntro, StackMiddle, StackTags, StackTile } from "./ui/StackCard";

/** Every project, in order: applied AI first, then the banking platform underneath it */
const ORDER = [...WORK.ai, WORK.spotlight, ...WORK.more];

const SourceLink = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-pill bg-emerald-400 text-night px-3.5 py-1.5 text-[13px] font-medium hover:bg-emerald-300 transition-colors duration-fast"
  >
    Source <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
  </a>
);

/** Problem, approach and outcome, where there is something specific and true to say */
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
    <dl className="mt-6 space-y-4">
      {parts.map(([term, detail]) => (
        <div key={term}>
          <dt className="t-figure text-[11px] uppercase tracking-[0.16em] text-muted">{term}</dt>
          <dd className="mt-1 text-[15px] leading-relaxed text-snow/75">{detail}.</dd>
        </div>
      ))}
    </dl>
  );
};

/**
 * (Selected work), in the same card stack as What I build and Experience: a short header,
 * then one card per project — number, category and title; the project's mark; then what it
 * is, its story, stack and source. Each card pins and the next slides over it.
 */
const WorkSection = () => (
  <section id="work" className="theme-dark text-snow relative scroll-mt-16">
    <StackIntro
      label="My work"
      title={
        <>
          AI on top of
          <br />
          systems that move money.
        </>
      }
    >
      <p>
        AI I&apos;ve shipped at a bank and built on my own time, then the banking systems underneath it.{" "}
        <span className="text-snow">Client specifics are generalised and no metrics are invented.</span>
      </p>
      <a
        href={PROFILE.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 t-figure text-xs uppercase tracking-[0.18em] text-snow/70 hover:text-snow transition-colors"
      >
        All code on GitHub <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
      </a>
    </StackIntro>

    <ol>
      {ORDER.map(projectBySlug).map((study, i) => (
        <StackCard key={study.slug} index={i} id={`case-${study.slug}`}>
          <StackHead
            kicker={`${String(i + 1).padStart(2, "0")} · ${study.category ?? "Backend"}`}
            title={study.title.split(",")[0]}
            foot={study.origin && <p className="mt-3 t-figure text-[12px] text-emerald-300">{study.origin}</p>}
          />
          <StackMiddle>
            <StackTile icon={study.icon} caption={study.tags.slice(0, 3).join(" · ")} />
          </StackMiddle>
          <StackBody>
            <p className="t-figure text-[12px] text-muted">What it is</p>
            <p className="mt-3 text-[18px] md:text-[20px] leading-snug text-snow">{study.description}</p>
            <Story study={study} />
            <StackTags items={study.tags} />
            {study.repo && (
              <div className="mt-6">
                <SourceLink href={study.repo} />
              </div>
            )}
          </StackBody>
        </StackCard>
      ))}
    </ol>
  </section>
);

export default WorkSection;
