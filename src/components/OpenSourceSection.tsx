import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { posts } from "@/data/writing";
import { PROFILE } from "@/data/profile";
import { PillButton } from "./ui/Pill";
import { ExternalLink, HoverArrow } from "./ui/ExternalLink";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { DUR, EASE, reveal } from "@/lib/motion";
import { monthYear } from "@/lib/format";

/** Rows rise in one after another; `from` keeps rows added by "Show more" starting at once */
const rowIn = (i: number, from = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: DUR.base, ease: EASE, delay: Math.max(0, i - from) * 0.06 },
});

const REPO_PAGE = 6;
const REPO_FETCH_LIMIT = 100;

const Row = ({
  href,
  to,
  title,
  meta,
  sub,
}: {
  href?: string;
  to?: string;
  title: string;
  meta: string;
  sub?: string;
}) => {
  const inner = (
    <>
      <span className="min-w-0">
        <span className="block t-heading text-4xl md:text-6xl lg:text-7xl text-snow break-words max-w-full">
          {title}
        </span>
        {sub && <span className="t-body text-muted mt-3 md:text-[19px] line-clamp-2 max-w-4xl">{sub}</span>}
      </span>
      <span className="flex items-center gap-4 shrink-0 t-figure text-xs text-muted">
        <ScrambleNumber value={meta} />
        <HoverArrow />
      </span>
    </>
  );
  const cls =
    "group relative flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 py-8 md:py-10 px-3 -ml-3 rounded-sm hover:bg-snow/[0.03] transition-colors duration-fast";
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <ExternalLink href={href} className={cls}>
      {inner}
    </ExternalLink>
  );
};

/** How many repos show before "Show more": one full-width row each */
const SHOWN = 6;

/** (Open source) and (Writing) as two row lists, the way the reference lists its news. */
const OpenSourceSection = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // The top repos show; the rest wait behind "Show more"
  const [visible, setVisible] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <section
      id="open-source"
      ref={ref}
      className="theme-dark text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16 overflow-x-clip"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <motion.p {...reveal()} className="t-label mb-5">
              Open source
            </motion.p>
            <motion.h2 {...reveal(0.05)} className="t-statement text-5xl md:text-7xl">
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
            <ol className="divide-y divide-line border-y border-line">
              {repos.slice(0, SHOWN + visible).map((r, i) => (
                <motion.li
                  key={r.name}
                  id={`project-card-${r.name}`}
                  {...rowIn(i, i >= SHOWN ? SHOWN + visible - REPO_PAGE : 0)}
                >
                  <Row
                    to={`/project/${r.name}`}
                    title={r.name}
                    meta={`${r.language ? r.language + " · " : ""}${monthYear(r.updated_at)}`}
                    sub={r.description || undefined}
                  />
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
                    <span className="flex items-center justify-between t-figure text-[11px] text-muted">
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
