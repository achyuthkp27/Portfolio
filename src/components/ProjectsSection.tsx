import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { SectionHeader } from "./ui/SectionHeader";
import CaseStudyStack from "./CaseStudyStack";

const ProjectCard = ({ project, index }: { project: GitHubRepo, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Parse repo name into readable title
  const formattedTitle = project.name.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase();

  return (
    <motion.div
      id={`project-card-${project.name}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/project/${project.name}`} className="block relative z-10 w-full overflow-hidden">
        <div className="relative border-b border-white/5 py-10 md:py-16 px-4 md:px-8 transition-colors duration-700 group-hover:bg-white/[0.02]">
          
          {/* Animated reveal line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
          />
          
          {/* Background Hover Bloom */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            
            {/* Left Side: Number & Title */}
            <div className="flex items-start lg:items-center gap-6 md:gap-12 w-full lg:w-3/4">
              <span className="font-mono text-2xl md:text-3xl text-white/10 font-light group-hover:text-emerald-500/40 transition-colors duration-500 mt-2 lg:mt-0 shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="relative w-full">
                <h3 className="font-display text-3xl md:text-5xl font-bold text-white/70 group-hover:text-white tracking-tight transition-all duration-700 group-hover:translate-x-4">
                  {formattedTitle}
                </h3>
                
                <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 text-gray-500 text-sm md:text-base max-w-2xl group-hover:text-gray-300 transition-all duration-700 delay-100 group-hover:translate-x-4">
                  <p className="line-clamp-2 leading-relaxed">
                    {project.description || "No description yet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Metrics & Arrow */}
            <div className="flex items-center justify-between lg:justify-end w-full lg:w-1/4 gap-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              
              {/* Tech / Language */}
              <div className="flex items-center gap-3">
                {project.language && (
                  <span className="px-3 py-1 font-mono text-[10px] md:text-xs uppercase tracking-widest border border-white/10 rounded-full text-white/60 group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/5 transition-all duration-500 relative overflow-hidden">
                    {/* Shimmer on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <span className="relative z-10">{project.language}</span>
                  </span>
                )}
                {project.stargazers_count > 0 && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] md:text-xs uppercase tracking-widest border border-white/10 rounded-full px-3 py-1 text-white/60 group-hover:border-amber-500/30 group-hover:text-amber-400 group-hover:bg-amber-500/5 transition-all duration-500">
                    <Star className="w-3 h-3 md:w-4 md:h-4" /> {project.stargazers_count}
                  </span>
                )}
              </div>

              {/* Arrow with spring animation */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 overflow-hidden relative shrink-0 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                 <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white transform group-hover:translate-x-[150%] group-hover:translate-y-[-150%] transition-transform duration-500 ease-in-out" />
                 <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-black absolute top-[150%] left-[-150%] transform group-hover:top-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 transition-all duration-500 ease-in-out" />
              </motion.div>
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
    if (isInView) {
      fetchLatestRepositories(6)
        .then((data) => {
          setProjects(data);
          setFilteredProjects(data);
          
          // Extract unique languages
          const languages = new Set<string>();
          data.forEach(repo => {
            if (repo.language) languages.add(repo.language.toUpperCase());
          });
          setAvailableLanguages(Array.from(languages).sort());
          
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [isInView]);

  useEffect(() => {
    if (activeFilter === "ALL") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.language?.toUpperCase() === activeFilter));
    }
  }, [activeFilter, projects]);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      const params = new URLSearchParams(location.search);
      const scrollToSlug = params.get('scrollTo');

      if (scrollToSlug) {
        // Wait a tick for the DOM to fully paint the mapped project cards
        setTimeout(() => {
          const el = document.getElementById(`project-card-${scrollToSlug}`);
          if (el) {
            // Force native browser instant scroll jump, overriding Lenis
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        }, 100);
      }
    }
  }, [isLoading, projects, location.search]);

  return (
    <section id="projects" className="relative py-24 lg:py-28 px-6 md:px-12 bg-[radial-gradient(ellipse_70%_50%_at_50%_38%,rgba(16,185,129,0.12),transparent_72%),linear-gradient(180deg,#000000_0%,#0c1712_22%,#0a1a13_55%,#050d09_82%,#000000_100%)]" ref={ref}>
      <div className="max-w-screen-2xl mx-auto">
        {/* Professional case studies — the real work */}
        <SectionHeader
          label="Selected work"
          titleMain="Banking Platform"
          titleAccent="Case Studies"
          description="Systems designed, built, and shipped to production across five years of regulated banking platforms. Client specifics generalized."
          align="left"
        />

        <div className="mb-24 lg:mb-32">
          <CaseStudyStack />
        </div>

        {/* Open-source / personal repos */}
        <SectionHeader
          label="Open source"
          titleMain="Open Source &"
          titleAccent="Experiments"
          description="Latest public repositories, fetched live from GitHub."
          align="left"
        />

        <div className="rounded-[1.75rem] bg-[#0a0a0a] border border-white/10 p-6 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        {/* Filter Bar */}
        {!isLoading && availableLanguages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-2">
              Filter
            </div>
            
            <button
              onClick={() => setActiveFilter("ALL")}
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
              <ProjectCard key={project.name} project={project} index={index} />
            ))
          ) : (
            <div className="h-[400px] flex items-center justify-center font-mono text-white/40 border border-white/5 bg-white/[0.02] rounded-xl">
              Nothing matches that filter.
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
