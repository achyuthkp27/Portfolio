import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { useSmoothScroll } from "@/context/smoothScroll";
import { pad2 } from "@/lib/format";
import { ExternalLink } from "./ExternalLink";
import { PillButton } from "./Pill";
import { StackTags } from "./StackCard";

const storyOf = (study: Project) =>
  (
    [
      ["Problem", study.problem],
      ["Approach", study.solution],
      ["Outcome", study.outcome],
    ] as const
  ).filter(([, detail]) => detail);

const SourceLink = ({ href }: { href: string }) => (
  <ExternalLink
    href={href}
    className="relative inline-flex items-center gap-1.5 rounded-pill bg-emerald-400 text-night px-3.5 py-1.5 text-[13px] font-medium hover:bg-emerald-300 transition-colors duration-fast before:absolute before:content-[''] before:-inset-y-[7px] before:inset-x-0"
  >
    Source <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
  </ExternalLink>
);

/**
 * One project as a card, after the project frames on wodniack.dev: its number out of the
 * total, category, title, what it is, stack, and the ways in. With `inline`, the story is printed
 * in the card instead of behind "How it was built"; with `large`, it is set a size up for the
 * deck in the Work scene. The card fills the height it is given, its actions kept at the foot.
 */
export const WorkCard = ({
  study,
  index,
  total,
  onOpen,
  inline = false,
  large = false,
}: {
  study: Project;
  index: number;
  total: number;
  onOpen?: (study: Project) => void;
  inline?: boolean;
  large?: boolean;
}) => {
  const Icon = study.icon;
  const story = storyOf(study);
  return (
    <article
      data-tilt={large || undefined}
      className={`relative h-full flex flex-col rounded-2xl border border-snow/[0.12] bg-night bg-[linear-gradient(180deg,hsl(0_0%_100%/0.045),transparent_45%)] p-6 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.08),0_60px_100px_-40px_rgba(0,0,0,0.95)] ${large ? "md:p-11" : "md:p-8"}`}
    >
      <span
        aria-hidden="true"
        className="absolute right-5 top-5 md:right-7 md:top-7 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-emerald-400/30 bg-[radial-gradient(circle,hsl(var(--accent-500)/0.22),transparent_70%)]"
      >
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-emerald-300" strokeWidth={1.25} />
      </span>
      <p className="t-figure text-[13px] text-muted">
        <span className="text-emerald-300">{pad2(index + 1)}</span> / {pad2(total)} · {study.category ?? "Backend"}
      </p>
      <h3
        className={`mt-3 pr-16 t-heading text-3xl leading-[1.02] break-words ${large ? "md:text-[3.4rem]" : "md:text-[2.6rem]"}`}
      >
        {study.cardTitle ?? study.title}
      </h3>
      {study.origin && <p className="mt-2 t-figure text-[12px] text-emerald-300">{study.origin}</p>}
      <p className={`mt-4 text-[15px] leading-snug text-snow/80 ${large ? "md:text-[19px]" : "md:text-[17px]"}`}>
        {study.description}
      </p>
      {inline && story.length > 0 && (
        <dl className="mt-6 space-y-4">
          {story.map(([term, detail]) => (
            <div key={term}>
              <dt className="t-figure text-[13px] uppercase tracking-[0.16em] text-muted">{term}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-snow/75">{detail}.</dd>
            </div>
          ))}
        </dl>
      )}
      {/* On the deck the story is on the card itself, so every card carries the same parts: all
          three on wide screens, the outcome on phones with the rest behind the button */}
      {large && story.length > 0 && (
        <dl className="mt-7 pt-6 border-t border-snow/10 grid gap-5 md:grid-cols-3 md:gap-8">
          {story.map(([term, detail]) => (
            <div key={term} className={term === "Outcome" ? "" : "hidden md:block"}>
              <dt className="t-figure text-[13px] uppercase tracking-[0.16em] text-emerald-300">{term}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-snow/75">{detail}.</dd>
            </div>
          ))}
        </dl>
      )}
      {/* The stack and the ways in sit at the card's foot, whatever the card's height */}
      <div className="mt-auto">
        <StackTags items={study.tags} />
        {((!inline && story.length > 0 && onOpen) || study.repo) && (
          <div className={`pt-6 flex flex-wrap items-center gap-3 ${large && !study.repo ? "md:hidden" : ""}`}>
            {!inline && story.length > 0 && onOpen && (
              <PillButton
                tone="outline"
                size="sm"
                arrow={false}
                onClick={() => onOpen(study)}
                className={large ? "md:hidden" : ""}
              >
                How it was built
              </PillButton>
            )}
            {study.repo && <SourceLink href={study.repo} />}
          </div>
        )}
      </div>
    </article>
  );
};

/** Columns for a shared card, by how many projects it holds */
const COLUMNS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" };

/**
 * Related projects on one card of the deck, side by side on wide screens and stacked on phones
 * and tablets.
 * Each keeps its own title, what it is, outcome (and problem, two to a card), stack, and the
 * ways in; "How it was built" opens that project's story. Tablets leave out the stack; phones
 * show only the title, a shortened line and the button.
 */
export const WorkGroupCard = ({
  group,
  index,
  total,
  onOpen,
}: {
  group: Project[];
  index: number;
  total: number;
  onOpen: (study: Project) => void;
}) => {
  const categories = [...new Set(group.map((study) => study.category ?? "Backend"))].join(" · ");
  return (
    <article
      data-tilt
      className="relative h-full flex flex-col rounded-2xl border border-snow/[0.12] bg-night bg-[linear-gradient(180deg,hsl(0_0%_100%/0.045),transparent_45%)] p-6 md:p-11 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.08),0_60px_100px_-40px_rgba(0,0,0,0.95)]"
    >
      <p className="t-figure text-[13px] text-muted">
        <span className="text-emerald-300">{pad2(index + 1)}</span> / {pad2(total)} · {categories} · {group.length}{" "}
        projects
      </p>
      <div className={`mt-6 flex-1 grid gap-7 lg:gap-0 ${COLUMNS[group.length] ?? ""}`}>
        {group.map((study, i) => {
          const Icon = study.icon;
          return (
            <section
              key={study.slug}
              className={`min-w-0 flex flex-col ${i > 0 ? "pt-7 border-t lg:pt-0 lg:border-t-0 lg:border-l lg:pl-8" : ""} ${
                i < group.length - 1 ? "lg:pr-8" : ""
              } border-snow/10`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="t-heading text-[1.9rem] md:text-[2.3rem] leading-[1.02] break-words">
                  {study.cardTitle ?? study.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-emerald-400/30 bg-[radial-gradient(circle,hsl(var(--accent-500)/0.22),transparent_70%)]"
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-emerald-300" strokeWidth={1.25} />
                </span>
              </div>
              {study.origin && <p className="mt-2 t-figure text-[12px] text-emerald-300">{study.origin}</p>}
              <p className="mt-3 text-[15px] md:text-[16px] leading-snug text-snow/80 line-clamp-3 md:line-clamp-none">
                {study.description}
              </p>
              {/* Two to a card leaves room for the problem as well; three show the outcome alone */}
              {storyOf(study)
                .filter(([term]) => term === "Outcome" || (term === "Problem" && group.length === 2))
                .map(([term, detail]) => (
                  <div key={term} className="hidden md:block mt-5">
                    <p className="t-figure text-[13px] uppercase tracking-[0.16em] text-emerald-300">{term}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-snow/75">{detail}.</p>
                  </div>
                ))}
              <div className="mt-auto">
                <div className="hidden lg:block">
                  <StackTags items={study.tags} />
                </div>
                <div className="pt-5 flex flex-wrap items-center gap-3">
                  {storyOf(study).length > 0 && (
                    <PillButton tone="outline" size="sm" arrow={false} onClick={() => onOpen(study)}>
                      How it was built
                    </PillButton>
                  )}
                  {study.repo && <SourceLink href={study.repo} />}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
};

/** The full story of one project, over the page. Escape, the close button, or a click outside closes it. */
export const StoryDialog = ({ study, onClose }: { study: Project | null; onClose: () => void }) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { lenis } = useSmoothScroll();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (study && !dialog.open) {
      dialog.showModal();
      lenis?.stop();
    } else if (!study && dialog.open) dialog.close();
  }, [study, lenis]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onDialogClose = () => {
      lenis?.start();
      closeRef.current();
    };
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [lenis]);

  const story = study ? storyOf(study) : [];
  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      // Shown whole at once: the page's letter-by-letter reveal must not run inside it
      data-reveal-skip
      aria-labelledby="story-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      className="w-[min(640px,calc(100vw-32px))] max-h-[calc(100svh-48px)] rounded-2xl border border-emerald-400/30 bg-night p-0 text-snow backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      {study && (
        <div className="p-6 md:p-9">
          <div className="flex items-start justify-between gap-6">
            <p className="t-figure text-[12px] text-muted">{study.category ?? "Backend"}</p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="-m-2 p-2 text-snow/60 hover:text-snow transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <h3 id="story-title" className="mt-2 t-heading text-3xl md:text-4xl leading-[1.04] break-words">
            {study.title}
          </h3>
          <p className="mt-4 text-[16px] leading-snug text-snow/80">{study.description}</p>
          <dl className="mt-7 space-y-5">
            {story.map(([term, detail]) => (
              <div key={term}>
                <dt className="t-figure text-[13px] uppercase tracking-[0.16em] text-emerald-300">{term}</dt>
                <dd className="mt-1.5 text-[15px] md:text-[16px] leading-relaxed text-snow/80">{detail}.</dd>
              </div>
            ))}
          </dl>
          <StackTags items={study.tags} />
          {study.repo && (
            <div className="mt-6">
              <SourceLink href={study.repo} />
            </div>
          )}
        </div>
      )}
    </dialog>
  );
};
