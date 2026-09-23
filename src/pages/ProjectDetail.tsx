import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import {
  fetchLatestRepositories,
  fetchRepositoryDetails,
  fetchRepositoryExtras,
  type GitHubRepo,
  type RepoDetailsResult,
  type RepoExtras,
} from "@/lib/github";
import { PillLink } from "@/components/ui/Pill";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { DUR, EASE, reveal } from "@/lib/motion";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const monthDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const card = "relative rounded-lg border border-line bg-tile p-6 md:p-8";

/**
 * One repository as a full page: the name and description, a facts card, the language
 * mix, recent commits, the README rendered in the site's type, and more repositories.
 */
const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<RepoDetailsResult | null>(null);
  const [extras, setExtras] = useState<RepoExtras | null>(null);
  const [more, setMore] = useState<GitHubRepo[]>([]);
  const project = result?.status === "ok" ? result.repo : null;
  const isLoading = result === null;

  useEffect(() => {
    if (!slug) {
      setResult({ status: "not-found" });
      return;
    }
    setResult(null);
    setExtras(null);
    const controller = new AbortController();
    fetchRepositoryDetails(slug, controller.signal).then((next) => {
      if (!controller.signal.aborted) setResult(next);
    });
    fetchRepositoryExtras(slug, controller.signal).then((next) => {
      if (!controller.signal.aborted) setExtras(next);
    });
    fetchLatestRepositories(12, controller.signal).then((list) => {
      if (!controller.signal.aborted)
        setMore(list.filter((r) => r.name.toLowerCase() !== slug.toLowerCase()).slice(0, 4));
    });
    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="theme-dark min-h-screen flex items-center justify-center">
        <span role="status" className="t-figure text-xs text-muted">
          Loading repository…
        </span>
      </div>
    );
  }

  if (!project) {
    const unavailable = result?.status === "unavailable";
    return (
      <div className="theme-dark min-h-screen flex items-center justify-center flex-col px-6 text-center">
        <h1 className="t-statement text-4xl md:text-6xl mb-4">
          {unavailable ? "GitHub isn't responding right now" : "Repository not found"}
        </h1>
        <p className="max-w-md t-body text-muted mb-8">
          {unavailable
            ? "GitHub limits how often a browser can ask for repository details. Try again in a few minutes, or open it on GitHub directly."
            : "There's no public repository with that name."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {unavailable && slug && (
            <PillLink
              href={`https://github.com/achyuthkp27/${encodeURIComponent(slug)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on GitHub
            </PillLink>
          )}
          <Link to="/" className="t-body hover:opacity-70 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  const readmeReady = extras !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base, ease: EASE }}
      className="theme-dark"
    >
      <SEO
        title={project.name}
        description={project.description || "GitHub repository"}
        url={`https://achyuthkp27.github.io/Portfolio/#/project/${slug}`}
      />
      <div className="min-h-screen px-6 md:px-10 lg:px-12 pt-28 md:pt-32 pb-24 max-w-[1400px] mx-auto">
        <button
          type="button"
          onClick={() => navigate(`/?scrollTo=${slug}`)}
          aria-label="Back to projects"
          className="group inline-flex items-center gap-2 t-label hover:opacity-70 transition-opacity duration-fast"
        >
          <ArrowLeft
            className="w-4 h-4 transition-transform duration-fast group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to open source
        </button>

        {/* Header */}
        <div className="mt-10 grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-end">
          <div>
            <p className="t-label text-muted mb-6">Open source</p>
            <h1 className="t-statement text-5xl sm:text-6xl md:text-7xl lg:text-8xl break-words mb-6">
              {project.name}
            </h1>
            <p className="t-body text-muted max-w-2xl mb-8">
              {project.description || "No description on GitHub yet. The README has the details."}
            </p>
            {project.topics && project.topics.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-8" aria-label="Topics">
                {project.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-pill border border-line px-3 py-1 text-[12px] font-semibold text-muted"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-3">
              <PillLink href={project.html_url} target="_blank" rel="noopener noreferrer">
                View source
              </PillLink>
              {project.homepage && (
                <PillLink tone="outline" href={project.homepage} target="_blank" rel="noopener noreferrer">
                  Live site
                </PillLink>
              )}
            </div>
          </div>

          {/* Facts bento */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { label: "Stars", value: String(project.stargazers_count) },
              { label: "Forks", value: String(project.forks_count) },
            ].map((f) => (
              <div key={f.label} className={`${card} flex flex-col`}>
                <p className="t-label text-muted">{f.label}</p>
                <p className="t-wordmark leading-none text-6xl md:text-7xl mt-6">
                  <ScrambleNumber value={f.value} />
                </p>
              </div>
            ))}
            <div className={`${card} col-span-2 flex flex-wrap items-baseline justify-between gap-4`}>
              <span>
                <p className="t-label text-muted">Last commit</p>
                <p className="t-heading text-2xl mt-2">{formatDate(project.updated_at)}</p>
              </span>
              <span>
                <p className="t-label text-muted">Primary language</p>
                <p className="t-heading text-2xl mt-2">{project.language || "Mixed"}</p>
              </span>
            </div>
          </div>
        </div>

        {/* Languages + commits */}
        <div className="mt-6 grid md:grid-cols-2 gap-3 md:gap-4">
          <motion.div {...reveal()} className={card}>
            <p className="t-label mb-6">Languages</p>
            {extras && extras.languages.length > 0 ? (
              <>
                <div className="flex h-2 rounded-pill overflow-hidden bg-snow/10">
                  {extras.languages.map((l, i) => (
                    <span
                      key={l.name}
                      style={{ width: `${l.share * 100}%` }}
                      className={
                        i === 0 ? "bg-emerald-400" : i === 1 ? "bg-snow/70" : i === 2 ? "bg-snow/40" : "bg-snow/20"
                      }
                    />
                  ))}
                </div>
                <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
                  {extras.languages.slice(0, 6).map((l, i) => (
                    <li key={l.name} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 t-body text-snow/85">
                        <span
                          className={`h-2 w-2 rounded-full ${i === 0 ? "bg-emerald-400" : i === 1 ? "bg-snow/70" : i === 2 ? "bg-snow/40" : "bg-snow/20"}`}
                          aria-hidden="true"
                        />
                        {l.name}
                      </span>
                      <span className="t-figure text-xs text-muted">{(l.share * 100).toFixed(1)}%</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="t-figure text-xs text-muted">{readmeReady ? "Not available right now." : "Loading…"}</p>
            )}
          </motion.div>

          <motion.div {...reveal(0.05)} className={card}>
            <p className="t-label mb-6">Recent commits</p>
            {extras && extras.commits.length > 0 ? (
              <ol className="divide-y divide-line">
                {extras.commits.map((c) => (
                  <li key={c.sha}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline gap-4 py-2.5 -mx-2 px-2 rounded-sm hover:bg-snow/[0.03] transition-colors duration-fast"
                    >
                      <GitCommitHorizontal className="w-4 h-4 shrink-0 self-center text-muted" aria-hidden="true" />
                      <span className="flex-1 min-w-0 t-body text-[15px] text-snow/85 break-words">{c.message}</span>
                      <span className="shrink-0 t-figure text-[11px] text-muted">{monthDay(c.date)}</span>
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="t-figure text-xs text-muted">{readmeReady ? "Not available right now." : "Loading…"}</p>
            )}
          </motion.div>
        </div>

        {/* README */}
        <motion.section
          {...reveal()}
          className="mt-6 md:mt-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-6 lg:gap-16 min-w-0"
        >
          <div className="lg:sticky lg:top-32 self-start">
            <p className="t-label">Readme</p>
            <p className="t-body text-muted mt-3 max-w-xs">The repository's own README, as it reads on GitHub.</p>
            <a
              href={`${project.html_url}#readme`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 t-label hover:opacity-70 transition-opacity duration-fast"
            >
              Open on GitHub <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
          <div className={`${card} readme min-w-0 overflow-hidden`}>
            {extras?.readme ? (
              <div dangerouslySetInnerHTML={{ __html: extras.readme }} />
            ) : (
              <p className="t-figure text-xs text-muted">
                {readmeReady ? "The README could not be loaded right now. It is on GitHub." : "Loading README…"}
              </p>
            )}
          </div>
        </motion.section>

        {/* Clone + more */}
        <div className="mt-6 md:mt-8 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 md:gap-4 min-w-0">
          <motion.div {...reveal()} className={`${card} min-w-0`}>
            <p className="t-label mb-4">Clone</p>
            <pre className="max-w-full rounded-sm bg-night p-4 overflow-x-auto t-figure text-xs text-snow/80">
              <span className="text-emerald-400">$ </span>git clone {project.html_url}.git
            </pre>
          </motion.div>
          <motion.div {...reveal(0.05)} className={`${card} min-w-0`}>
            <p className="t-label mb-4">More repositories</p>
            <ol className="divide-y divide-line">
              {more.map((r) => (
                <li key={r.name}>
                  <Link
                    to={`/project/${r.name}`}
                    className="group flex items-baseline justify-between gap-4 py-2.5 -mx-2 px-2 rounded-sm hover:bg-snow/[0.03] transition-colors duration-fast"
                  >
                    <span className="t-heading text-xl text-snow break-words">{r.name}</span>
                    <span className="shrink-0 flex items-center gap-2 t-figure text-[11px] text-muted">
                      {r.language}
                      <ArrowUpRight
                        className="w-3.5 h-3.5 group-hover:text-emerald-300 transition-colors duration-fast"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
