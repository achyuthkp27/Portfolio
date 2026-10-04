import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { posts } from "@/data/writing";
import { PROFILE } from "@/data/profile";
import { PillButton } from "./ui/Pill";
import { DrawRule } from "./ui/DrawRule";
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
      {/* Hover: an emerald bar grows at the row's edge */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-emerald-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-base ease-out"
      />
      <span className="min-w-0">
        <span className="block t-heading text-2xl md:text-3xl text-snow break-words max-w-full">{title}</span>
        {sub && <span className="block t-body text-muted mt-1 line-clamp-2">{sub}</span>}
      </span>
      <span className="flex items-center gap-4 shrink-0 t-figure text-xs text-muted">
        <ScrambleNumber value={meta} />
        <ArrowUpRight
          className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </>
  );
  const cls =
    "group relative flex items-baseline justify-between gap-6 py-5 md:py-6 px-3 -ml-3 rounded-sm hover:bg-snow/[0.03] transition-colors duration-fast";
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
};

/** How many repos show before "Show more" */
const FAN = 4;

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
    if (target >= FAN) setVisible((v) => Math.max(v, Math.ceil((target - FAN + 1) / REPO_PAGE) * REPO_PAGE));
    const id = window.setTimeout(() => {
      document.getElementById(`project-card-${slug}`)?.scrollIntoView({ behavior: "instant", block: "center" });
      // One jump only, and a refresh must not jump again
      navigate({ search: "" }, { replace: true });
    }, 100);
    return () => window.clearTimeout(id);
  }, [isLoading, repos, location.search, navigate]);

  const remaining = repos.length - FAN - visible;

  return (
    <section
      id="open-source"
      ref={ref}
      className="theme-dark text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16"
    >
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 min-w-0">
        <div className="min-w-0">
          <motion.p {...reveal()} className="t-label mb-5">
            Open source
          </motion.p>
          <motion.h2 {...reveal(0.05)} className="t-statement text-5xl md:text-6xl mb-10">
            Experiments
          </motion.h2>
          {isLoading ? (
            <div className="border-t border-line" role="status">
              <span className="sr-only">Loading repositories…</span>
              {[0, 1, 2].map((k) => (
                <div key={k} className="py-6 border-b border-line" aria-hidden="true">
                  <span className="skeleton block h-6 w-1/2 rounded-sm" />
                  <span className="skeleton block h-3 w-4/5 rounded-sm mt-3" />
                </div>
              ))}
            </div>
          ) : repos.length === 0 ? (
            // GitHub rate-limited or offline, with no build snapshot to fall back on
            <p className="border-t border-line pt-6 t-body text-muted">
              GitHub isn&apos;t answering right now.{" "}
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-snow underline underline-offset-4 decoration-line"
              >
                See every repo on GitHub
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </p>
          ) : (
            <>
              <DrawRule delay={0} className="w-full bg-line" />
              <ol className="divide-y divide-line">
                {repos.slice(0, FAN + visible).map((r, i) => (
                  <motion.li
                    key={r.name}
                    id={`project-card-${r.name}`}
                    {...rowIn(i, i >= FAN ? FAN + visible - REPO_PAGE : 0)}
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
        </div>
        <div className="min-w-0">
          <motion.p {...reveal(0.1)} className="t-label mb-5">
            Writing
          </motion.p>
          <motion.h2 {...reveal(0.15)} className="t-statement text-5xl md:text-6xl mb-10">
            Writing
          </motion.h2>
          <DrawRule delay={0} className="w-full bg-line" />
          <ol className="divide-y divide-line">
            {[...posts]
              .sort((a, b) => b.published.localeCompare(a.published))
              .map((p, i) => (
                <motion.li key={p.url} {...rowIn(i)}>
                  <Row href={p.url} title={p.title} meta={monthYear(`${p.published}T00:00:00Z`)} sub={p.takeaway} />
                </motion.li>
              ))}
          </ol>
          <p className="t-caps text-muted mt-6">Written in 2020, before my first engineering role. One idea each.</p>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
