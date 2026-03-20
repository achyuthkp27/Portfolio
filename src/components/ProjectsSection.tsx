import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight, FolderOpen, Star, GitFork } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import { Link, useLocation } from "react-router-dom";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";
import { useSmoothScroll } from "@/components/ui/SmoothScroll";

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
          
          {/* Background Hover Bloom */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Scanning Line on Hover */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            
            {/* Left Side: Number & Title */}
            <div className="flex items-start lg:items-center gap-6 md:gap-12 w-full lg:w-3/4">
              <span className="font-mono text-2xl md:text-3xl text-white/10 font-light group-hover:text-emerald-500/40 transition-colors duration-500 mt-2 lg:mt-0 shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="relative w-full">
                <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white/70 group-hover:text-white tracking-tighter transition-all duration-700 group-hover:translate-x-4">
                  {formattedTitle}
                </h3>
                
                <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4 text-gray-500 text-sm md:text-base max-w-2xl group-hover:text-gray-300 transition-all duration-700 delay-100 group-hover:translate-x-4">
                  <p className="line-clamp-2 leading-relaxed">
                    {project.description || "Experimental architecture. Classified repository details."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Metrics & Arrow */}
            <div className="flex items-center justify-between lg:justify-end w-full lg:w-1/4 gap-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              
              {/* Tech / Language */}
              <div className="flex items-center gap-3">
                {project.language && (
                  <span className="px-3 py-1 font-mono text-[10px] md:text-xs uppercase tracking-widest border border-white/10 rounded-full text-white/60 group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-emerald-500/5 transition-all duration-500">
                    {project.language}
                  </span>
                )}
                {project.stargazers_count > 0 && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] md:text-xs uppercase tracking-widest border border-white/10 rounded-full px-3 py-1 text-white/60 group-hover:border-amber-500/30 group-hover:text-amber-400 group-hover:bg-amber-500/5 transition-all duration-500">
                    <Star className="w-3 h-3 md:w-4 md:h-4" /> {project.stargazers_count}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 overflow-hidden relative shrink-0">
                 <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white transform group-hover:translate-x-[150%] group-hover:translate-y-[-150%] transition-transform duration-500 ease-in-out" />
                 <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-black absolute top-[150%] left-[-150%] transform group-hover:top-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 transition-all duration-500 ease-in-out" />
              </div>
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    fetchLatestRepositories(6).then((repos) => {
      setProjects(repos);
      setIsLoading(false);
    });
  }, []);

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
    <section id="projects" className="relative bg-transparent py-24 lg:py-28 px-6 md:px-12" ref={ref}>
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12"
        >
          <div>
            <TextReveal type="fade-up">
              <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-emerald-500 border border-emerald-500/20 rounded-full mb-8 bg-emerald-500/10 transition-colors duration-300">
                [ LIVE_GITHUB_FEED ]
              </span>
            </TextReveal>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter">
              <TextReveal type="blur-reveal" delay={0.2} as="span">Selected</TextReveal><br/>
              <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">Case Files</TextReveal>
            </h2>
          </div>
          
          <TextReveal type="fade-up" delay={0.6} as="p" className="text-gray-400 max-w-sm text-sm md:text-base leading-relaxed">
            Continuously fetching the latest repository commits, architecture structures, and source codes from the public domains.
          </TextReveal>
        </motion.div>

        {/* Dynamic GitHub Repos List */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center font-mono text-white/50 gap-4">
              <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin" />
              <span>SYNCING_REPOSITORIES...</span>
            </div>
          ) : (
            projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
