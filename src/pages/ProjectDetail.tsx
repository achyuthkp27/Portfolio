import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, GitCommitHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
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
import { ExternalLink } from "@/components/ui/ExternalLink";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { PROFILE } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";
import { monthDay } from "@/lib/format";
import { demoteReadmeHeadings } from "@/lib/readmeHtml";

/** The homepage's card: hairline border, a faint light from the top, an inset highlight */
const CARD =
  "relative rounded-2xl border border-snow/[0.12] bg-night bg-[linear-gradient(180deg,hsl(0_0%_100%/0.045),transparent_45%)] shadow-[inset_0_1px_0_hsl(0_0%_100%/0.08)]";

/** The slash label above each row's title, as the homepage labels its sections */
const Kicker = ({ children }: { children: ReactNode }) => <p className="t-label">{children}</p>;

/** What a GitHub-backed visual shows while it loads, or when GitHub sent nothing for it */
const VisualPending = ({ loaded }: { loaded: boolean }) => (
  <p className="t-figure text-[13px] text-muted text-center">{loaded ? "Not available right now." : "Loading…"}</p>
);

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * One row of the page, in the homepage's language: the label, an Antonio title and a short line
 * on the left, held in view on wide screens, and the visual in a card on the right. Phones and
 * tablets stack the two.
 */
const Row = ({
  meta,
  title,
  body,
  children,
  visual,
}: {
  meta: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  visual: ReactNode;
}) => (
  <motion.section
    {...reveal()}
    className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-8 py-16 lg:py-24 border-t border-line min-w-0"
  >
    <div className="min-w-0 lg:sticky lg:top-32 self-start">
      <Kicker>{meta}</Kicker>
      <h2 className="t-statement text-[clamp(2.2rem,4.4vw,4.25rem)] leading-[1.02] mt-6 break-words text-balance">
        {title}
      </h2>
      {body && <p className="t-body text-snow/70 mt-6 max-w-md">{body}</p>}
      {children}
    </div>
    <div className={`${CARD} min-w-0 min-h-[280px] flex items-center justify-center p-6 md:p-10`}>
      <div className="relative w-full min-w-0">{visual}</div>
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
            <span className="t-figure text-[13px] md:text-sm text-muted">{(l.share * 100).toFixed(1)}%</span>
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
        <ExternalLink href={c.url} className="group block">
          <span className="flex items-baseline justify-between gap-4">
            <span className="t-figure text-[13px] text-emerald-300/90">{c.sha}</span>
            <span className="t-figure text-[13px] text-muted">{monthDay(c.date)}</span>
          </span>
          <span className="block t-body text-snow/85 mt-1 break-words">{c.message}</span>
        </ExternalLink>
      </motion.li>
    ))}
  </ol>
);

/** A README's own "#section" links scroll within the page; under a hash router they would otherwise route to the 404 page. */
const slugify = (t: string) =>
  t
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
const onReadmeClick = (e: MouseEvent<HTMLDivElement>) => {
  const a = (e.target as HTMLElement).closest("a");
  const href = a?.getAttribute("href") ?? "";
  if (!a || !href.startsWith("#")) return;
  e.preventDefault();
  const want = decodeURIComponent(href.slice(1))
    .replace(/^user-content-/, "")
    .toLowerCase();
  const headings = e.currentTarget.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const hit = [...headings].find((h) => slugify(h.textContent ?? "") === want);
  hit?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<RepoDetailsResult | null>(null);
  const [extras, setExtras] = useState<RepoExtras | null>(null);
  const [more, setMore] = useState<GitHubRepo[]>([]);
  const project = result?.status === "ok" ? result.repo : null;
  const isLoading = result === null;
  // README headings sit under the page's h1 and the "As it reads on GitHub" h2
  const readmeHtml = useMemo(() => (extras?.readme ? demoteReadmeHeadings(extras.readme) : null), [extras?.readme]);

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
      <div className="theme-dark min-h-screen flex items-center justify-center px-6">
        <span role="status" className="t-figure text-[13px] text-muted">
          Loading repository…
        </span>
      </div>
    );
  }

  if (!project) {
    const unavailable = result?.status === "unavailable";
    return (
      <div className="theme-dark min-h-screen flex flex-col justify-center max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-28 pb-16">
        <p className="t-label mb-8">Open source</p>
        <h1 className="t-statement text-[clamp(2.6rem,6.6vw,7.5rem)] leading-[1.02] max-w-5xl break-words text-balance">
          {unavailable ? "GitHub isn't responding right now" : "Repository not found"}
        </h1>
        <p className="max-w-xl t-body text-snow/70 text-[17px] md:text-[19px] mt-8 mb-10">
          {unavailable
            ? "GitHub limits how often a browser can ask for repository details. Try again in a few minutes, or open it on GitHub directly."
            : "There's no public repository with that name."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {unavailable && slug && (
            <PillLink
              href={`${PROFILE.links.github}/${encodeURIComponent(slug)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on GitHub
            </PillLink>
          )}
          <Link
            to="/"
            className="group inline-flex items-center gap-2 h-11 px-6 rounded-pill border border-line text-[13px] font-medium uppercase tracking-[0.02em] hover:border-fg/60 transition-colors duration-base"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-fast group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to home
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
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-24 md:pt-28 pb-24 outline-none"
      >
        <div className="flex items-center justify-between gap-6 pb-12 md:pb-16">
          <button
            type="button"
            onClick={() => navigate(`/?scrollTo=${slug}`)}
            aria-label="Back to projects"
            data-magnetic
            className="group inline-flex items-center gap-2 h-11 px-5 rounded-pill border border-line text-[13px] font-medium uppercase tracking-[0.02em] hover:border-fg/60 transition-colors duration-base"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-fast group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to open source
          </button>
          <p className="t-figure text-[13px] text-muted hidden sm:block">Open source · {PROFILE.name}</p>
        </div>

        {/* The repository: its name at the scale of the screen, the facts beside it */}
        <motion.section {...reveal()} className="pb-16 lg:pb-24 min-w-0">
          <Kicker>Last commit {longDate(project.updated_at)}</Kicker>
          <h1 className="t-statement text-[clamp(2.8rem,8vw,8.5rem)] leading-[1.02] mt-6 break-words">
            {project.name}
          </h1>
          <div className="mt-10 lg:mt-14 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-16 gap-y-10 items-start">
            <div className="min-w-0">
              <p className="t-body text-snow/70 text-[17px] md:text-[19px] max-w-xl">
                {project.description || "No description on GitHub yet. The README has the details."}
              </p>
              <p className="t-figure text-[13px] text-muted mt-5">
                by <span className="text-snow">{PROFILE.name}</span>
              </p>
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
            </div>
            <div className={`${CARD} p-6 md:p-8 min-w-0`}>
              <p className="t-label">Stars</p>
              <p className="t-wordmark leading-none text-[5rem] md:text-[7rem] mt-4">
                <ScrambleNumber value={String(project.stargazers_count)} />
              </p>
              <dl className="mt-6 pt-5 border-t border-snow/10 grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="t-figure text-[13px] uppercase tracking-[0.16em] text-emerald-300">Forks</dt>
                  <dd className="t-heading text-2xl mt-1">{project.forks_count}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="t-figure text-[13px] uppercase tracking-[0.16em] text-emerald-300">Language</dt>
                  <dd className="t-heading text-2xl mt-1 break-words">{project.language || "Mixed"}</dd>
                </div>
              </dl>
              {!!project.topics?.length && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.topics.slice(0, 6).map((t) => (
                    <li
                      key={t}
                      className="rounded-pill border border-line px-3 py-1 text-[13px] text-snow/75 break-words"
                    >
                      #{t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.section>

        {/* Row 2: languages */}
        <Row
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
              <VisualPending loaded={!!extras} />
            )
          }
        />

        {/* Row 3: commits */}
        <Row
          meta="History"
          title="Recent commits"
          body="The last five commits on the default branch, newest first. Each links to its diff on GitHub."
          visual={
            extras?.commits.length ? <CommitTimeline commits={extras.commits} /> : <VisualPending loaded={!!extras} />
          }
        />

        {/* Row 4: README, full width */}
        <motion.section
          {...reveal()}
          className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-16 gap-y-8 py-16 lg:py-24 border-t border-line min-w-0"
        >
          <div className="lg:sticky lg:top-32 self-start min-w-0">
            <Kicker>Readme</Kicker>
            <h2 className="t-statement text-[clamp(2.2rem,4.4vw,4.25rem)] leading-[1.02] mt-6 break-words text-balance">
              As it reads on GitHub
            </h2>
            <ExternalLink
              href={`${project.html_url}#readme`}
              className="group mt-6 inline-flex items-center gap-2 py-2 t-figure text-[13px] uppercase tracking-[0.16em] text-snow/80"
            >
              Open on GitHub{" "}
              <ArrowUpRight
                className="w-4 h-4 text-emerald-300 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </ExternalLink>
          </div>
          <div className={`${CARD} readme min-w-0 p-6 md:p-10`} onClick={onReadmeClick}>
            {readmeHtml ? (
              <div dangerouslySetInnerHTML={{ __html: readmeHtml }} />
            ) : (
              <p className="t-figure text-[13px] text-muted">
                {extras ? "The README could not be loaded right now. It is on GitHub." : "Loading README…"}
              </p>
            )}
          </div>
        </motion.section>

        {/* Row 5: clone and more */}
        <Row
          meta="Next"
          title="More repositories"
          body="Other public work on the same account."
          visual={
            <div className="max-w-lg mx-auto w-full">
              <pre className="mb-6 rounded-lg border border-line p-4 overflow-x-auto max-w-full t-figure text-[13px] text-snow/80">
                <span className="text-emerald-400">$ </span>git clone {project.html_url}.git
              </pre>
              <ol className="divide-y divide-line">
                {more.map((r) => (
                  <li key={r.name}>
                    <Link
                      to={`/project/${r.name}`}
                      className="group flex items-baseline justify-between gap-4 py-3.5 -mx-2 px-2 rounded-md hover:bg-snow/[0.03] transition-colors duration-fast"
                    >
                      <span className="t-heading text-xl md:text-2xl break-words">{r.name}</span>
                      <span className="shrink-0 flex items-center gap-2 t-figure text-[13px] text-muted">
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
      </main>
    </motion.div>
  );
};

export default ProjectDetail;
