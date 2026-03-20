import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight, FolderOpen } from "lucide-react";
import * as Icons from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import SpotlightCard from "./ui/SpotlightCard";
import { projects as fallbackProjects, Project } from "@/data/projects";
import { client, urlFor } from "@/lib/sanity";
import { Link } from "react-router-dom";
import ProjectGallery3D from "./3d/ProjectGallery3D";

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SpotlightCard
        className="h-full flex flex-col glass-card border border-white/10 bg-black/40 relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30"
        spotlightColor="rgba(16, 185, 129, 0.1)" // Emerald spotlight
      >
        {/* Decorative Technical Corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-hover:border-emerald-500 transition-colors duration-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 group-hover:border-emerald-500 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 group-hover:border-emerald-500 transition-colors duration-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-hover:border-emerald-500 transition-colors duration-500" />

        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 -translate-y-full group-hover:animate-[scan-vertical_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />

        {/* Header Section with Metadata */}
        <div className="relative p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex flex-wrap justify-between items-start mb-4 gap-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-all duration-500">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/40 group-hover:text-emerald-500/70 transition-colors duration-500 tracking-widest uppercase">CASE_ID: 00{index + 1}</span>
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">CLEARANCE: LVL_5</span>
              </div>
            </div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded flex items-center gap-1.5 transition-colors duration-500 group-hover:border-emerald-500/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 group-hover:bg-emerald-400 opacity-75 transition-colors duration-500"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/80 group-hover:bg-emerald-500 transition-colors duration-500"></span>
              </span>
              <span className="text-[9px] font-mono text-white/40 group-hover:text-emerald-500/70 transition-colors duration-500 tracking-wider">ACTIVE</span>
            </div>
          </div>

          <Link to={`/project/${project.slug}`} className="block relative z-10">
            <h3 className="font-display text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors duration-500 flex items-center gap-2">
              {project.title}
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 transform" />
            </h3>
          </Link>
        </div>

        {/* Links Overlay (Absolute Positioned for cleaner layouts) */}
        <div className="absolute top-6 right-6 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <motion.a
            href="https://github.com/achyuthkp27"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-black/80 border border-white/10 text-white rounded-sm hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300"
          >
            <Github className="w-4 h-4" />
          </motion.a>
          <motion.a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-black/80 border border-white/10 text-white rounded-sm hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col space-y-6">
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-emerald-500/50 transition-colors duration-500">
            {project.description}
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-start gap-4">
              <span className="text-white/40 min-w-[60px] uppercase tracking-wider text-[10px] pt-0.5">Objective</span>
              <span className="text-white/80">{project.problem.substring(0, 50)}...</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-white/40 min-w-[60px] uppercase tracking-wider text-[10px] pt-0.5">Status</span>
              <span className="text-white/60 group-hover:text-emerald-400/80 transition-colors duration-500">Completed // Deployed</span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: any) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-[10px] font-mono uppercase bg-white/5 text-white/50 border border-white/10 rounded-sm group-hover:bg-emerald-500/5 group-hover:text-emerald-400/70 group-hover:border-emerald-500/10 transition-all duration-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client.fetch(`*[_type == "project"] | order(order asc)`)
      .then((data) => {
        if (data && data.length > 0) {
          const mapped = data.map((p: any) => ({
            ...p,
            slug: p.slug?.current || p.slug,
            icon: (Icons as any)[p.iconName] || Icons.FolderOpen,
            image: p.mainImage ? urlFor(p.mainImage).url() : undefined
          }));
          setProjects(mapped);
        } else {
          setProjects(fallbackProjects);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setProjects(fallbackProjects);
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="relative bg-transparent py-32 px-6 md:px-12" ref={ref}>
      {/* Background Decor */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 border border-white/10 mb-6 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 hover:text-emerald-400 transition-colors duration-300">
              [ MISSION_ARCHIVES ]
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            <TextReveal type="blur-reveal" delay={0.2} as="span">Selected</TextReveal>{" "}
            <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">Case Files</TextReveal>
          </h2>
          <TextReveal type="fade-up" delay={0.4} as="p" className="mt-4 text-gray-400 max-w-2xl mx-auto backdrop-blur-sm">
            Accessing classified records of enterprise-grade deployments.
          </TextReveal>
        </motion.div>

        {/* 3D Immersive Gallery (Desktop Only) */}
        {!isLoading && projects.length > 0 && (
          <div className="hidden xl:block mb-32 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10">
            <ProjectGallery3D projects={projects} />
          </div>
        )}

        {/* Projects Grid (Universal Fallback) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full h-40 flex items-center justify-center font-mono text-white/50 animate-pulse">
              LOADING_ARCHIVES...
            </div>
          ) : (
            projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
