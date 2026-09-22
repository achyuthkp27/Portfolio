import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { fetchRepositoryDetails, type RepoDetailsResult } from "@/lib/github";
import { PillLink } from "@/components/ui/Pill";
import { DUR, EASE } from "@/lib/motion";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** One repository: name at statement scale, description once, actions, and a ledger of facts. */
const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<RepoDetailsResult | null>(null);
  const project = result?.status === "ok" ? result.repo : null;
  const isLoading = result === null;

  useEffect(() => {
    if (!slug) {
      setResult({ status: "not-found" });
      return;
    }
    setResult(null);
    const controller = new AbortController();
    fetchRepositoryDetails(slug, controller.signal).then((next) => {
      if (!controller.signal.aborted) setResult(next);
    });
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

  const facts: [string, string][] = [
    ["Language", project.language || "Mixed"],
    ["Last commit", formatDate(project.updated_at)],
    ["Stars", String(project.stargazers_count)],
    ["Forks", String(project.forks_count)],
  ];

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

        <div className="mt-10 grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-start">
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
          <div className="rounded-lg bg-tile p-6 md:p-8">
            <dl className="divide-y divide-line">
              {facts.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 py-3">
                  <dt className="t-label text-muted">{term}</dt>
                  <dd className="t-figure text-sm">{value}</dd>
                </div>
              ))}
            </dl>
            <pre className="mt-6 rounded-sm bg-night p-4 overflow-x-auto t-figure text-xs text-snow/80">
              <span className="text-emerald-400">$ </span>git clone {project.html_url}.git
            </pre>
            <a
              href={`${project.html_url}#readme`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block t-body hover:opacity-70 transition-opacity duration-fast"
            >
              Read the full README on GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
