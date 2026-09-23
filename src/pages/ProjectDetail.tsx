import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
import { PROFILE } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const monthDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

/**
 * A split row, after Spector's lab: the story on the left in a tall card, a large visual
 * on the right, edge to edge. Rows stack with a thin gap between them.
 */
const SplitRow = ({
  meta,
  title,
  by,
  body,
  children,
  visual,
  flip = false,
}: {
  meta: ReactNode;
  title: ReactNode;
  by?: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  visual: ReactNode;
  flip?: boolean;
}) => (
  <motion.section {...reveal()} className="grid lg:grid-cols-2 gap-1.5 min-w-0">
    <div
      className={`rounded-lg bg-tile p-7 md:p-10 lg:p-12 flex flex-col min-h-[440px] lg:min-h-[560px] ${flip ? "lg:order-2" : ""}`}
    >
      <div className="flex items-center gap-2.5 t-figure text-xs text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
        {meta}
      </div>
      <h2 className="t-statement text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-6 break-words">{title}</h2>
      <span className="block w-14 h-px bg-emerald-400 mt-5" aria-hidden="true" />
      {by && <p className="t-body mt-5 text-muted">{by}</p>}
      {body && <p className="t-body text-snow/80 mt-auto pt-12 max-w-md">{body}</p>}
      {children}
    </div>
    <div
      className={`relative rounded-lg bg-night border border-line overflow-hidden min-h-[360px] lg:min-h-[560px] flex items-center justify-center p-6 md:p-10 ${flip ? "lg:order-1" : ""}`}
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(0_0%_100%/0.07),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative w-full">{visual}</div>
    </div>
  </motion.section>
);

/** Language mix as a big ring, the primary language in the middle */
const LanguageRing = ({ languages }: { languages: RepoExtras["languages"] }) => {
  const r = 84;
  const c = 2 * Math.PI * r;
  let acc = 0;
  const tones = ["hsl(var(--accent-400))", "hsl(0 0% 100% / 0.75)", "hsl(0 0% 100% / 0.4)", "hsl(0 0% 100% / 0.2)"];
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
      <svg viewBox="0 0 220 220" className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] -rotate-90">
        <circle cx="110" cy="110" r={r} fill="none" stroke="hsl(0 0% 100% / 0.08)" strokeWidth="18" />
        {languages.slice(0, 4).map((l, i) => {
          const len = l.share * c;
          const el = (
            <motion.circle
              key={l.name}
              cx="110"
              cy="110"
              r={r}
              fill="none"
              stroke={tones[i] ?? tones[3]}
              strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-acc}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 * i }}
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <ul className="space-y-3 min-w-[180px]">
        {languages.slice(0, 5).map((l, i) => (
          <li key={l.name} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-3 t-heading text-2xl">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: tones[i] ?? tones[3] }}
                aria-hidden="true"
              />
              {l.name}
            </span>
            <span className="t-figure text-sm text-muted">{(l.share * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Commits as a vertical timeline */
const CommitTimeline = ({ commits }: { commits: RepoExtras["commits"] }) => (
  <ol className="relative max-w-lg mx-auto pl-8">
    <span className="absolute left-[9px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
    {commits.map((c, i) => (
      <motion.li
        key={c.sha}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.08 * i }}
        className="relative py-3.5"
      >
        <span
          className={`absolute -left-8 top-[1.1rem] h-[19px] w-[19px] rounded-full border-2 ${i === 0 ? "border-emerald-400 bg-night" : "border-line bg-tile"}`}
          aria-hidden="true"
        >
          <GitCommitHorizontal className="w-3 h-3 m-[1.5px] text-muted" />
        </span>
        <a href={c.url} target="_blank" rel="noopener noreferrer" className="group block">
          <span className="flex items-baseline justify-between gap-4">
            <span className="t-figure text-[11px] text-muted">{c.sha}</span>
            <span className="t-figure text-[11px] text-muted">{monthDay(c.date)}</span>
          </span>
          <span className="block t-body text-snow/90 mt-1 group-hover:text-snow transition-colors duration-fast">
            {c.message}
          </span>
        </a>
      </motion.li>
    ))}
  </ol>
);

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
        setMore(list.filter((r) => r.name.toLowerCase() !== slug.toLowerCase()).slice(0, 5));
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
      <div className="min-h-screen px-3 md:px-4 pt-24 md:pt-28 pb-16 space-y-1.5">
        <div className="px-4 md:px-8 pb-6 flex items-center justify-between gap-6">
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
          <p className="t-caps text-muted hidden sm:block">Open source · {PROFILE.name}</p>
        </div>

        {/* Row 1: the repository */}
        <SplitRow
          meta={<>Last commit {longDate(project.updated_at)}</>}
          title={project.name}
          by={
            <>
              by <span className="text-snow">{PROFILE.name}</span>
            </>
          }
          body={project.description || "No description on GitHub yet. The README has the details."}
          visual={
            <div className="text-center">
              <p className="t-label text-muted">Stars</p>
              <p className="t-wordmark leading-none text-[6rem] md:text-[9rem]">
                <ScrambleNumber value={String(project.stargazers_count)} />
              </p>
              <div className="mt-6 flex items-center justify-center gap-8 t-figure text-xs text-muted">
                <span>{project.forks_count} forks</span>
                <span>{project.language || "Mixed"}</span>
                {project.topics?.slice(0, 3).map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            </div>
          }
        >
          <div className="mt-8 flex flex-wrap gap-3">
            <PillLink href={project.html_url} target="_blank" rel="noopener noreferrer">
              View source
            </PillLink>
            {project.homepage && (
              <PillLink tone="outline" href={project.homepage} target="_blank" rel="noopener noreferrer">
                Live site
              </PillLink>
            )}
          </div>
        </SplitRow>

        {/* Row 2: languages */}
        <SplitRow
          flip
          meta="Languages"
          title="What it's written in"
          body={
            extras?.languages.length
              ? `${extras.languages[0].name} carries ${(extras.languages[0].share * 100).toFixed(0)}% of the code, measured by bytes on the default branch.`
              : "Language mix from GitHub, measured by bytes on the default branch."
          }
          visual={
            extras?.languages.length ? (
              <LanguageRing languages={extras.languages} />
            ) : (
              <p className="t-figure text-xs text-muted text-center">
                {extras ? "Not available right now." : "Loading…"}
              </p>
            )
          }
        />

        {/* Row 3: commits */}
        <SplitRow
          meta="History"
          title="Recent commits"
          body="The last five commits on the default branch, newest first. Each links to its diff on GitHub."
          visual={
            extras?.commits.length ? (
              <CommitTimeline commits={extras.commits} />
            ) : (
              <p className="t-figure text-xs text-muted text-center">
                {extras ? "Not available right now." : "Loading…"}
              </p>
            )
          }
        />

        {/* Row 4: README, full width */}
        <motion.section
          {...reveal()}
          className="rounded-lg bg-tile p-7 md:p-10 lg:p-12 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-10 lg:gap-16 min-w-0"
        >
          <div className="lg:sticky lg:top-32 self-start">
            <div className="flex items-center gap-2.5 t-figure text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Readme
            </div>
            <h2 className="t-statement text-4xl md:text-6xl mt-6">As it reads on GitHub</h2>
            <span className="block w-14 h-px bg-emerald-400 mt-5" aria-hidden="true" />
            <a
              href={`${project.html_url}#readme`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 t-label hover:opacity-70 transition-opacity duration-fast"
            >
              Open on GitHub <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
          <div className="readme min-w-0 overflow-hidden">
            {extras?.readme ? (
              <div dangerouslySetInnerHTML={{ __html: extras.readme }} />
            ) : (
              <p className="t-figure text-xs text-muted">
                {extras ? "The README could not be loaded right now. It is on GitHub." : "Loading README…"}
              </p>
            )}
          </div>
        </motion.section>

        {/* Row 5: clone and more */}
        <SplitRow
          flip
          meta="Next"
          title="More repositories"
          body="Other public work on the same account."
          visual={
            <div className="max-w-lg mx-auto w-full">
              <pre className="mb-6 rounded-sm bg-tile border border-line p-4 overflow-x-auto max-w-full t-figure text-xs text-snow/80">
                <span className="text-emerald-400">$ </span>git clone {project.html_url}.git
              </pre>
              <ol className="divide-y divide-line">
                {more.map((r) => (
                  <li key={r.name}>
                    <Link
                      to={`/project/${r.name}`}
                      className="group flex items-baseline justify-between gap-4 py-3 -mx-2 px-2 rounded-sm hover:bg-snow/[0.03] transition-colors duration-fast"
                    >
                      <span className="t-heading text-xl md:text-2xl break-words">{r.name}</span>
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
            </div>
          }
        />
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
