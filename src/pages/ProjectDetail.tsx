import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Code2, FolderOpen, Star, GitFork, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import TextReveal from "@/components/ui/TextReveal";
import { fetchRepositoryDetails, fetchRepositoryReadme, GitHubRepo } from "@/lib/github";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ProjectDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<GitHubRepo | null>(null);
    const [readme, setReadme] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReadmeExpanded, setIsReadmeExpanded] = useState(false);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        if (!slug) return;
        
        Promise.all([
            fetchRepositoryDetails(slug),
            fetchRepositoryReadme(slug)
        ]).then(([repoData, readmeData]) => {
            setProject(repoData);
            setReadme(readmeData);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, [slug]);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="min-h-screen flex items-center justify-center font-mono text-white/50 bg-background"
            >
                DECRYPTING_REPOSITORY...
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
                <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <button onClick={() => navigate(`/?scrollTo=${slug}`)} className="pointer-events-auto flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full border border-white/10 bg-black/40 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest hidden md:inline-block">Back to Archives</span>
                    </button>
                </nav>

                {/* Hero Section */}
                <motion.section
                    style={{ opacity: heroOpacity }}
                    className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 px-6"
                >
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-emerald-900/20 opacity-20`} />
                        <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    </div>

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                        >
                            <Github className={`w-12 h-12 text-emerald-400`} />
                        </motion.div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight break-words max-w-full leading-[1.1]">
                            <TextReveal type="blur-reveal">{formattedTitle}</TextReveal>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-12">
                            {project.description || "Classified repository architecture. Source code analysis deployed."}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={project.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
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
                                    className="px-8 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded-full flex items-center gap-2 hover:bg-emerald-500/20 transition-colors"
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
                                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-3">
                                            <span className="w-4 h-px bg-white/20" /> Topics
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
                                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-3">
                                            <span className="w-4 h-px bg-white/20" /> Repository Metrics
                                        </h3>
                                        
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <Code2 className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Language</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{project.language || "N/A"}</p>
                                            </div>
                                            
                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-emerald-400 transition-colors duration-300">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Last Commit</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{new Date(project.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                            
                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-amber-400 transition-colors duration-300">
                                                    <Star className="w-4 h-4" />
                                                    <span className="text-[11px] font-mono uppercase tracking-widest">Stargazers</span>
                                                </div>
                                                <p className="text-white font-mono text-sm">{project.stargazers_count}</p>
                                            </div>

                                            <div className="w-full h-px bg-white/5" />

                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3 text-white/50 group-hover:text-blue-400 transition-colors duration-300">
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

                            {/* Main Content (README Flow) */}
                            <div className="flex-1 min-w-0 order-1 lg:order-2">
                                <div className={`relative transition-all duration-1000 ease-in-out overflow-hidden ${isReadmeExpanded ? 'max-h-none' : 'max-h-[800px]'}`}>
                                    <div className="prose prose-invert prose-emerald max-w-none 
                                         prose-p:leading-loose prose-p:text-gray-300 prose-p:text-lg lg:prose-p:text-xl
                                         prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-white
                                         prose-h1:text-4xl lg:prose-h1:text-6xl prose-h1:mb-12 prose-h1:pb-8 prose-h1:border-b prose-h1:border-white/10
                                         prose-h2:text-3xl lg:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
                                         prose-h3:text-2xl lg:prose-h3:text-3xl prose-h3:mt-12
                                         prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-a:underline-offset-4 prose-a:decoration-emerald-500/30 hover:prose-a:decoration-emerald-400
                                         prose-pre:bg-[#0a0a0a] prose-pre:border-white/10 prose-pre:border prose-pre:shadow-2xl prose-pre:p-6 lg:prose-pre:p-8 prose-pre:rounded-2xl
                                         prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/5 prose-img:my-16
                                         prose-blockquote:border-l-4 prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-gray-300
                                         prose-strong:text-white prose-strong:font-bold
                                         prose-code:text-emerald-300 prose-code:bg-emerald-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                                         marker:text-emerald-500 prose-li:my-2">
                                        {readme ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {readme}
                                            </ReactMarkdown>
                                        ) : (
                                            <div className="text-white/40 font-mono text-sm border border-white/10 p-16 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02] border-dashed gap-4">
                                                <FolderOpen className="w-8 h-8 opacity-50" />
                                                NO_README_FOUND
                                            </div>
                                        )}
                                    </div>
                                    
                                    {!isReadmeExpanded && readme && (
                                        <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none flex items-end justify-center pb-8" />
                                    )}
                                </div>
                                
                                {/* Expand Button */}
                                {!isReadmeExpanded && readme && (
                                    <div className="flex justify-center mt-[-40px] relative w-full mb-12">
                                        <button 
                                            onClick={() => setIsReadmeExpanded(true)}
                                            className="group relative z-20 flex items-center justify-center gap-3 text-emerald-400 hover:text-emerald-300 transition-all duration-300 bg-[#0a0a0a] px-8 py-4 rounded-full border border-white/10 hover:border-emerald-500/40 shadow-2xl hover:shadow-emerald-500/20"
                                        >
                                            <span className="font-mono text-[11px] tracking-[0.2em] font-bold uppercase cursor-pointer">Read Full Documentation</span>
                                            <ChevronDown className="w-4 h-4 animate-bounce" />
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default ProjectDetail;
