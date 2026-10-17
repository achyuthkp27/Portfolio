import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotionConfig, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { posts } from "@/data/writing";
import { PROFILE } from "@/data/profile";
import { PillButton } from "./ui/Pill";
import { ExternalLink, HoverArrow } from "./ui/ExternalLink";
import { DUR, EASE, reveal } from "@/lib/motion";
import { monthYear, pad2 } from "@/lib/format";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ExperimentsBackdrop } from "./ui/ExperimentsBackdrop";

/** Rows rise in one after another; `from` keeps rows added by "Show more" starting at once */
const rowIn = (i: number, from = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: DUR.base, ease: EASE, delay: Math.max(0, i - from) * 0.06 },
});

const REPO_PAGE = 6;
const REPO_FETCH_LIMIT = 100;

/** What a repo is, in one line: its language, stars if it has any, and when it last moved */
const metaOf = (r: GitHubRepo) =>
  [
    r.language,
    r.stargazers_count > 0 ? `${r.stargazers_count} ${r.stargazers_count === 1 ? "star" : "stars"}` : null,
    `Updated ${monthYear(r.updated_at)}`,
  ]
    .filter(Boolean)
    .join(" · ");

/**
 * One repo in the index: its number and name, set large, with what it is and its meta under the
 * name. In the scroll-driven list only the active row shows that line and reads full white; the
 * others dim to their names. The line always keeps its space, so nothing moves when the active
 * row changes, and it is never clipped: it fades and settles in place.
 */
const IndexRow = ({ repo, index, active }: { repo: GitHubRepo; index: number; active: boolean }) => (
  <Link
    to={`/project/${repo.name}`}
    className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 py-7 md:py-9 px-[max(1.5rem,calc((100vw-1400px)/2))] md:px-[max(2.5rem,calc((100vw-1400px)/2))] lg:px-[max(3rem,calc((100vw-1400px)/2))] hover:bg-snow/[0.03] transition-colors duration-fast"
  >
    <span
      className={`t-figure text-[13px] tabular-nums pt-[0.55em] md:pt-[0.9em] transition-colors duration-500 ${
        // Dimmed rows still read: 50% clears AA contrast for small text on black
        active ? "text-emerald-300" : "text-snow/50"
      }`}
    >
      {pad2(index + 1)}
    </span>
    <span className="min-w-0">
      <span className="flex items-start justify-between gap-3 md:gap-6">
        <span
          className={`block t-heading text-[clamp(1.7rem,6.2vw,6.25rem)] leading-[0.95] break-words min-w-0 transition-colors duration-500 ${
            // 40% clears AA's 3:1 for large text on black, so a dimmed name stays legible
            active ? "text-snow" : "text-snow/40"
          }`}
        >
          {repo.name}
        </span>
        <span
          className={`shrink-0 mt-[0.6em] md:mt-[1.4em] transition-colors duration-500 ${active ? "text-snow/80" : "text-snow/25"}`}
        >
          <HoverArrow accent />
        </span>
      </span>
      <span
        className={`block mt-3 md:mt-4 transition-[opacity,transform] duration-500 ease-out ${
          active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
        }`}
      >
        {repo.description && (
          <span className="t-body md:text-[19px] text-snow/80 line-clamp-3 max-w-4xl">{repo.description}</span>
        )}
        <span className="block mt-2 t-figure text-[13px] text-snow/70">{metaOf(repo)}</span>
      </span>
    </span>
  </Link>
);

/** How many repos show before "Show more": one full-width row each */
const SHOWN = 6;

/**
 * (Open source) and (Writing). The repos are an index of large names: on wide screens the row
 * nearest the middle of the screen is the active one, full white with an emerald number and its
 * description and meta showing, while the rest dim; a focused row is active while it has focus.
 * Phones, tablets and reduced motion show every row in full. Writing is one compact row.
 */
const OpenSourceSection = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // The top repos show; the rest wait behind "Show more"
  const [visible, setVisible] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const location = useLocation();
  const navigate = useNavigate();

  // The scroll-driven index only where it reads well: wide screens with motion on
  const reduceMotion = useReducedMotionConfig();
  const wide = useMediaQuery("(min-width: 1024px)");
  const driven = wide && !reduceMotion;
  const list = useRef<HTMLOListElement>(null);
  const [scrollActive, setScrollActive] = useState(0);
  const [focusActive, setFocusActive] = useState<number | null>(null);
  const active = focusActive ?? scrollActive;
  const { scrollY } = useScroll();
  // Rows never change height, so the row whose centre is nearest the middle of the screen can be
  // measured on every scroll without the choice feeding back on itself
  const pick = useCallback(() => {
    const el = list.current;
    if (!el || !driven) return;
    // Only while the list is on screen; the list mounts after the repos load, so it is measured here
    const box = el.getBoundingClientRect();
    if (box.bottom < 0 || box.top > window.innerHeight) return;
    const mid = window.innerHeight * 0.5;
    let best = 0;
    let gap = Infinity;
    Array.from(el.children).forEach((row, i) => {
      const r = row.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < gap) {
        gap = d;
        best = i;
      }
    });
    setScrollActive(best);
  }, [driven]);
  useMotionValueEvent(scrollY, "change", pick);

  // Arriving from "Back to projects" needs the list now, not when it scrolls into view
  const [returning] = useState(() => new URLSearchParams(location.search).has("scrollTo"));
  useEffect(() => {
    if (!inView && !returning) return;
    const controller = new AbortController();
    fetchLatestRepositories(REPO_FETCH_LIMIT, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setRepos(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [inView, returning]);

  // "Back to projects" points at a repo, possibly on a later page
  useEffect(() => {
    if (isLoading || repos.length === 0) return;
    const slug = new URLSearchParams(location.search).get("scrollTo");
    if (!slug) return;
    const target = repos.findIndex((r) => r.name === slug);
    if (target >= SHOWN) setVisible((v) => Math.max(v, Math.ceil((target - SHOWN + 1) / REPO_PAGE) * REPO_PAGE));
    const id = window.setTimeout(() => {
      document.getElementById(`project-card-${slug}`)?.scrollIntoView({ behavior: "instant", block: "center" });
      // One jump only, and a refresh must not jump again
      navigate({ search: "" }, { replace: true });
    }, 100);
    return () => window.clearTimeout(id);
  }, [isLoading, repos, location.search, navigate]);

  const remaining = repos.length - SHOWN - visible;
  // Pick again when the list fills in or grows
  useEffect(pick, [pick, repos, visible]);

  return (
    <section
      id="open-source"
      ref={ref}
      className="theme-dark text-snow relative isolate pt-24 lg:pt-32 pb-24 lg:pb-32 px-6 md:px-10 lg:px-12 scroll-mt-16 overflow-x-clip"
    >
      <ExperimentsBackdrop />
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <motion.p {...reveal()} className="t-label mb-5">
              Open source
            </motion.p>
            <motion.h2 {...reveal(0.05)} className="t-statement text-[clamp(2.6rem,6.6vw,7.5rem)] leading-[1.02]">
              Experiments
            </motion.h2>
          </div>
          <ExternalLink
            href={PROFILE.links.github}
            className="py-3 -my-3 inline-flex items-center gap-1.5 t-figure text-xs uppercase tracking-[0.18em] text-snow/70 hover:text-snow transition-colors"
          >
            Every repo on GitHub <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </ExternalLink>
        </div>

        {isLoading ? (
          <div className="h-[360px] md:h-[420px] grid place-items-center" role="status">
            <span className="t-figure text-xs text-muted">Loading repositories…</span>
          </div>
        ) : repos.length === 0 ? (
          // GitHub rate-limited or offline, with no build snapshot to fall back on
          <p className="border-t border-line pt-6 t-body text-muted">
            GitHub isn&apos;t answering right now.{" "}
            <ExternalLink
              href={PROFILE.links.github}
              className="inline-flex items-center gap-1 text-snow underline underline-offset-4 decoration-line"
            >
              See every repo on GitHub
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </ExternalLink>
          </p>
        ) : (
          <>
            {/* Edge to edge: the list leaves the column, and each row pads its content back in line with the heading */}
            <ol
              ref={list}
              className="w-screen ml-[calc(50%-50vw)] divide-y divide-line border-y border-line"
              onBlur={(e) => {
                // Focus leaving the list hands the choice back to the scroll
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusActive(null);
              }}
            >
              {repos.slice(0, SHOWN + visible).map((r, i) => (
                <motion.li
                  key={r.name}
                  id={`project-card-${r.name}`}
                  onFocus={() => driven && setFocusActive(i)}
                  {...rowIn(i, i >= SHOWN ? SHOWN + visible - REPO_PAGE : 0)}
                >
                  <IndexRow repo={r} index={i} active={!driven || i === active} />
                </motion.li>
              ))}
            </ol>
            {remaining > 0 && (
              <div className="mt-8">
                <PillButton tone="outline" size="sm" arrow={false} onClick={() => setVisible((v) => v + REPO_PAGE)}>
                  Show more
                </PillButton>
              </div>
            )}
          </>
        )}

        {/* Writing: three early essays, one compact row */}
        <div className="mt-24 lg:mt-32 pt-10 border-t border-line grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-8 lg:gap-12">
          <div>
            <motion.p {...reveal()} className="t-label mb-4">
              Writing
            </motion.p>
            <p className="t-body text-muted text-[15px] max-w-xs">
              Early essays from 2020, before my first engineering role. One idea each.
            </p>
          </div>
          <ol className="grid md:grid-cols-3 gap-px bg-line border border-line rounded-lg overflow-hidden">
            {[...posts]
              .sort((a, b) => b.published.localeCompare(a.published))
              .map((p, i) => (
                <motion.li key={p.url} {...rowIn(i)} className="bg-night">
                  <ExternalLink
                    href={p.url}
                    className="group flex flex-col h-full p-5 md:p-6 hover:bg-snow/[0.03] transition-colors duration-fast"
                  >
                    <span className="flex items-center justify-between t-figure text-[13px] text-muted">
                      {monthYear(`${p.published}T00:00:00Z`)}
                      <HoverArrow accent />
                    </span>
                    <span className="mt-4 t-heading text-xl md:text-2xl text-snow">{p.title}</span>
                    <span className="mt-2 t-body text-[14px] text-muted line-clamp-3">{p.takeaway}</span>
                  </ExternalLink>
                </motion.li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
