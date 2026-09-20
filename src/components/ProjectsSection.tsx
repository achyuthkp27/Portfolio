import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { SectionHeader } from "./ui/SectionHeader";
import CaseStudyStack from "./CaseStudyStack";
import TraceWaterfall from "./case-studies/TraceWaterfall";

/** "3 days ago" from an ISO timestamp — repos read as activity, not as rows. */
const relativeTime = (iso: string) => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
};

/** Where the dot sits inside a row — rail, dot and connector all line up on it. */
const DOT_CENTER = "2.2rem";

/**
 * One repo as one commit on a graph: a dot on the rail, a connector into the row.
 * Newest at the top, the way `git log` prints it.
 */
const CommitRow = ({ project, index, isLast }: { project: GitHubRepo; index: number; isLast: boolean }) => {
  const formattedTitle = project.name.replace(/[-_]/g, " ").toUpperCase();

  return (
    <motion.div
      id={`project-card-${project.name}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative"
    >
      <Link to={`/project/${project.name}`} className="block relative">
        <div className="grid grid-cols-[2.25rem_1fr] md:grid-cols-[3rem_1fr] gap-x-3 md:gap-x-6">
          {/* Rail: line above and below, dot on this commit */}
          <div className="relative flex justify-center" aria-hidden="true">
            {/* The rail stops at the dot on the first and last commit, so the graph has ends */}
            <span
              className="absolute w-px bg-white/10"
              style={{ top: index === 0 ? DOT_CENTER : 0, bottom: isLast ? `calc(100% - ${DOT_CENTER})` : 0 }}
            />
            <span
              className="absolute w-2.5 h-2.5 -mt-[0.3125rem] rounded-full border border-white/25 bg-[#0a0a0a] group-hover:border-emerald-400 group-hover:bg-emerald-400/20 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-500"
              style={{ top: DOT_CENTER }}
            />
            <span
              className="absolute left-1/2 w-3 md:w-5 h-px bg-white/10 group-hover:bg-emerald-400/40 transition-colors duration-500"
              style={{ top: DOT_CENTER }}
            />
          </div>

          {/* Commit body */}
          <div className="py-6 md:py-8 pr-2 border-b border-white/5 transition-colors duration-500 group-hover:border-emerald-500/20">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h3 className="font-display text-xl md:text-3xl font-bold text-white/75 group-hover:text-white tracking-tight transition-all duration-500 group-hover:translate-x-1 truncate">
                  {formattedTitle}
                </h3>
                <p className="mt-2.5 text-sm md:text-base font-body font-light text-gray-500 group-hover:text-gray-300 leading-relaxed line-clamp-2 max-w-2xl transition-colors duration-500">
                  {project.description || "No description yet."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] md:text-[11px] text-white/40">
                  <span className="text-emerald-400/70">{project.default_branch || "main"}</span>
                  {project.updated_at && <span>updated {relativeTime(project.updated_at)}</span>}
                  {project.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40" aria-hidden="true" />
                      {project.language}
                    </span>
                  )}
                  {project.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" aria-hidden="true" /> {project.stargazers_count}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 overflow-hidden relative">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white transform group-hover:translate-x-[150%] group-hover:translate-y-[-150%] transition-transform duration-500 ease-in-out" />
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-black absolute top-[150%] left-[-150%] transform group-hover:top-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 transition-all duration-500 ease-in-out" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const location = useLocation();

  useEffect(() => {
    if (!isInView) return;
    const controller = new AbortController();
    fetchLatestRepositories(6, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setProjects(data);
        setFilteredProjects(data);
        const languages = new Set<string>();
        data.forEach((repo) => {
          if (repo.language) languages.add(repo.language.toUpperCase());
        });
        setAvailableLanguages(Array.from(languages).sort());
      })
      // Always clear the spinner, even when the request fails
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [isInView]);

  useEffect(() => {
    setFilteredProjects(activeFilter === "ALL" ? projects : projects.filter((p) => p.language?.toUpperCase() === activeFilter));
  }, [activeFilter, projects]);

  useEffect(() => {
    if (isLoading || projects.length === 0) return;
    const scrollToSlug = new URLSearchParams(location.search).get("scrollTo");
    if (!scrollToSlug) return;
    // Wait a tick for the DOM to paint the project cards
    const id = window.setTimeout(() => {
      document.getElementById(`project-card-${scrollToSlug}`)?.scrollIntoView({ behavior: "instant", block: "center" });
    }, 100);
    return () => window.clearTimeout(id);
  }, [isLoading, projects, location.search]);

  return (
    <section id="projects" className="relative py-24 lg:py-28 px-6 md:px-12 bg-[radial-gradient(ellipse_90%_55%_at_50%_20%,rgba(16,185,129,0.09),transparent_75%),linear-gradient(180deg,#000000_0%,#060e0a_14%,#0c1712_32%,#0a1a13_55%,#050d09_80%,#000000_100%)]" ref={ref}>
      <div className="max-w-screen-2xl mx-auto">
        <SectionHeader
          label="Selected work"
          title="Seven systems from a regulated banking platform"
          description="Client specifics are generalized. Two of them are interactive, so you can try the control instead of reading about it."
        />

        <div className="mb-24 lg:mb-32">
          <CaseStudyStack />
        </div>

        {/* One request across the whole estate — the trace ties the case studies together.
            `relative z-10` keeps everything below the stack above the sticky cards. */}
        <div className="relative z-10">
          <SectionHeader
            label="Trace"
            title="One wire transfer, end to end"
            description="The same flow the case studies describe, drawn the way I read it in production. Pick a span."
          />
          <div className="mb-24 lg:mb-32">
            <TraceWaterfall />
          </div>

        <SectionHeader
          label="Open source"
          title="Open source & experiments"
          description="Public repositories as a commit graph, newest first, fetched live from GitHub."
        />

        <div className="rounded-[1.75rem] bg-[#0a0a0a] border border-white/10 p-6 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        {/* Filter Bar */}
        {!isLoading && availableLanguages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-3 mb-12"
            role="group"
            aria-label="Filter repositories by language"
          >
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-2">
              Filter
            </div>
            
            <button
              onClick={() => setActiveFilter("ALL")}
              aria-pressed={activeFilter === "ALL"}
              className={`px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase transition-all duration-300 ${
                activeFilter === "ALL" 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-white/[0.03] text-white/50 border border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              ALL
            </button>
            
            {availableLanguages.map(lang => (
              <button
                key={lang}
                onClick={() => setActiveFilter(lang)}
                aria-pressed={activeFilter === lang}
                className={`px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase transition-all duration-300 ${
                  activeFilter === lang 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-white/[0.03] text-white/50 border border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {lang}
              </button>
            ))}
          </motion.div>
        )}

        {/* Dynamic GitHub Repos List */}
        <div className="flex flex-col min-h-[300px]">
          {isLoading ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center font-mono text-white/50 gap-4">
              <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin" />
              <span>Loading repositories…</span>
            </div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <CommitRow
                key={project.name}
                project={project}
                index={index}
                isLast={index === filteredProjects.length - 1}
              />
            ))
          ) : (
            <div className="h-[400px] flex items-center justify-center font-mono text-white/40 border border-white/5 bg-white/[0.02] rounded-xl">
              Nothing matches that filter.
            </div>
          )}
        </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
