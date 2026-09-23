import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { posts } from "@/data/writing";
import { PillButton } from "./ui/Pill";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

const REPO_PAGE = 6;
const REPO_FETCH_LIMIT = 100;
const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

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
        <span className="block t-heading text-2xl md:text-3xl text-snow group-hover:text-snow/80 transition-colors duration-fast break-words max-w-full">
          {title}
        </span>
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
    "group flex items-baseline justify-between gap-6 py-5 md:py-6 px-3 -ml-3 rounded-sm hover:bg-snow/[0.03] transition-colors duration-fast";
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

/** (Open source) and (Writing) as two row lists, the way the reference lists its news. */
const OpenSourceSection = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(REPO_PAGE);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!inView) return;
    const controller = new AbortController();
    fetchLatestRepositories(REPO_FETCH_LIMIT, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setRepos(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [inView]);

  // "Back to projects" points at a repo, possibly on a later page
  useEffect(() => {
    if (isLoading || repos.length === 0) return;
    const slug = new URLSearchParams(location.search).get("scrollTo");
    if (!slug) return;
    const target = repos.findIndex((r) => r.name === slug);
    if (target >= 0) setVisible((v) => Math.max(v, Math.ceil((target + 1) / REPO_PAGE) * REPO_PAGE));
    const id = window.setTimeout(() => {
      document.getElementById(`project-card-${slug}`)?.scrollIntoView({ behavior: "instant", block: "center" });
      // One jump only, and a refresh must not jump again
      navigate({ search: "" }, { replace: true });
    }, 100);
    return () => window.clearTimeout(id);
  }, [isLoading, repos, location.search, navigate]);

  const remaining = repos.length - visible;

  return (
    <section
      id="open-source"
      ref={ref}
      className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16"
    >
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 min-w-0">
        <div className="min-w-0">
          <p className="t-label mb-5">Open source</p>
          <h2 className="t-statement text-5xl md:text-6xl mb-10">Experiments</h2>
          {isLoading ? (
            <p className="t-figure text-xs text-muted border-t border-line pt-6">Loading repositories…</p>
          ) : (
            <>
              <ol className="border-t border-line divide-y divide-line">
                {repos.slice(0, visible).map((r) => (
                  <li key={r.name} id={`project-card-${r.name}`}>
                    <Row
                      to={`/project/${r.name}`}
                      title={r.name}
                      meta={`${r.language ? r.language + " · " : ""}${monthYear(r.updated_at)}`}
                      sub={r.description || undefined}
                    />
                  </li>
                ))}
              </ol>
              {remaining > 0 && (
                <div className="mt-8">
                  <PillButton tone="outline" size="sm" arrow={false} onClick={() => setVisible((v) => v + REPO_PAGE)}>
                    {`Show ${Math.min(REPO_PAGE, remaining)} more`}
                  </PillButton>
                </div>
              )}
            </>
          )}
        </div>
        <div className="min-w-0">
          <p className="t-label mb-5">Writing</p>
          <h2 className="t-statement text-5xl md:text-6xl mb-10">Writing</h2>
          <ol className="border-t border-line divide-y divide-line">
            {[...posts]
              .sort((a, b) => b.published.localeCompare(a.published))
              .map((p) => (
                <li key={p.url}>
                  <Row href={p.url} title={p.title} meta={monthYear(`${p.published}T00:00:00Z`)} sub={p.takeaway} />
                </li>
              ))}
          </ol>
          <p className="t-caps text-muted mt-6">Written in 2020, before my first engineering role. One idea each.</p>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
