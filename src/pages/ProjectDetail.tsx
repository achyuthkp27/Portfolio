import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Code2, Star, GitFork } from "lucide-react";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import TextReveal from "@/components/ui/TextReveal";
import { fetchRepositoryDetails, GitHubRepo } from "@/lib/github";

const ProjectDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<GitHubRepo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        if (!slug) return;

        const controller = new AbortController();
        fetchRepositoryDetails(slug, controller.signal).then((repoData) => {
            if (controller.signal.aborted) return;
            setProject(repoData);
            setIsLoading(false);
        }).catch(() => {
            if (!controller.signal.aborted) setIsLoading(false);
        });
        return () => controller.abort();
    }, [slug]);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="min-h-screen flex items-center justify-center font-mono text-white/50 bg-background"
            >
                Loading repository…
            </motion.div>
        );
    }

    if (!project) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="min-h-screen flex items-center justify-center text-white bg-background flex-col"
            >
                <h1 className="text-4xl font-bold mb-4 font-display">Repository Not Found</h1>
                <Link to="/" className="text-emerald-500 hover:underline inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return Home
                </Link>
            </motion.div>
        );
    }

    const formattedTitle = project.name.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <SEO
                title={project.name}
                description={project.description || "GitHub Repository"}
                url={`https://achyuthkp27.github.io/Portfolio/#/project/${slug}`}
            />

            <div className="min-h-screen bg-background relative overflow-x-hidden">
                {/* Navigation */}
                <nav className="fixed top-20 md:top-24 left-0 z-40 px-6 pointer-events-none">
                    <button 
                      onClick={() => navigate(`/?scrollTo=${slug}`)} 
                      aria-label="Back to projects"
                      className="pointer-events-auto flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                    >
                        <div className="p-2 rounded-full border border-white/10 bg-black/40 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest hidden md:inline-block">Back to projects</span>
                    </button>
                </nav>

                {/* Hero Section */}
                <motion.section
                    style={{ opacity: heroOpacity }}
                    className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 px-6"
                >
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-black opacity-40`} />
                        <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    </div>

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <span className="flex items-center justify-center gap-3 mb-8">
                            <span className="w-8 h-px bg-emerald-500/60" aria-hidden="true" />
                            <span className="text-[11px] font-body font-medium tracking-[0.25em] uppercase text-white/40">Open source</span>
                            <span className="w-8 h-px bg-emerald-500/60" aria-hidden="true" />
                        </span>

                        <h1 className="font-condensed uppercase text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-8 tracking-wide break-words max-w-full leading-[0.95] pb-[0.08em]">
                            <TextReveal type="blur-reveal">{formattedTitle}</TextReveal>
                        </h1>

                        <p className="text-lg md:text-xl font-body font-light text-white/55 max-w-2xl mx-auto leading-relaxed mb-12">
                            {project.description || "No description yet."}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={project.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View Source on GitHub"
                                className="px-8 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase flex items-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all"
                            >
                                <Github className="w-5 h-5" />
                                View Source
                            </motion.a>
                            {project.homepage && (
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={project.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="View Live Demo"
                                    className="px-8 py-3 border border-white/20 text-white font-bold text-xs tracking-widest uppercase flex items-center gap-3 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Live Demo
                                </motion.a>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Detailed Content */}
                <section className="relative z-10 px-6 pb-32">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

                            {/* Sticky Left Sidebar (Meta Data) */}
                            <div className="w-full lg:w-[350px] shrink-0 order-2 lg:order-1">
                                <div className="lg:sticky lg:top-32 space-y-12">
                                    
                                    {/* Tech Stack / Topics */}
                                    <div>
                                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6 flex items-center gap-3">
                                            <span className="w-4 h-px bg-white/30" /> Topics
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.topics && project.topics.length > 0 ? (
                                                project.topics.map(tag => (
                                                    <span key={tag} className="px-4 py-2 text-[11px] font-mono uppercase bg-white/5 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 rounded-full transition-all duration-300 backdrop-blur-sm cursor-default">
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-white/30 text-xs font-mono italic">No topics specified.</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meta Details */}
                                    <div>
                                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6 flex items-center gap-3">
                                            <span className="w-4 h-px bg-white/30" /> Repository Metrics
                                        </h3>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/70 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <Code2 className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Language</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{project.language || "N/A"}</p>
                                            </div>
                                            
                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/70 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Last Commit</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{new Date(project.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                            
                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <Star className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Stargazers</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{project.stargazers_count}</p>
                                            </div>

                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <GitFork className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Forks</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{project.forks_count}</p>
                                            </div>

                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Author</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">@achyuthkp27</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                            {/* Main content: clean overview, README lives on GitHub */}
                            <div className="flex-1 min-w-0 order-1 lg:order-2 space-y-8">
                                <div className="rounded-2xl border border-white/10 bg-[#0a0a0c] p-8 md:p-10">
                                    <h2 className="text-[11px] font-body font-medium tracking-[0.25em] uppercase text-white/40 mb-6">About this repository</h2>
                                    <p className="text-lg md:text-xl font-body font-light text-white/75 leading-relaxed">
                                        {project.description || "No description yet — the code speaks for itself."}
                                    </p>
                                </div>

                                {/* Clone panel in the site's terminal voice */}
                                <div className="rounded-2xl border border-white/10 bg-[#101013] overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                                        <span className="ml-3 font-mono text-[11px] text-white/40">terminal</span>
                                    </div>
                                    <div className="p-5 font-mono text-[13px] text-emerald-100/90">
                                        <span className="text-emerald-400">$ </span>git clone {project.html_url}.git
                                    </div>
                                </div>

                                <a
                                    href={project.html_url + "#readme"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0a0a0c] p-8 md:p-10 hover:border-emerald-500/30 transition-colors"
                                >
                                    <div>
                                        <div className="font-display font-bold text-white text-xl md:text-2xl tracking-tight mb-1">Read the full README</div>
                                        <div className="text-sm font-body font-light text-white/45">Docs, setup, and screenshots — rendered properly on GitHub.</div>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
                                </a>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default ProjectDetail;
