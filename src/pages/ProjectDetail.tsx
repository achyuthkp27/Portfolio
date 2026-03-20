import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Code2, FolderOpen } from "lucide-react";
import * as Icons from "lucide-react";
import { projects as fallbackProjects, Project } from "@/data/projects";
import { client, urlFor } from "@/lib/sanity";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import TextReveal from "@/components/ui/TextReveal";

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

    useEffect(() => {
        client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug })
            .then((data) => {
                if (data) {
                    setProject({
                        ...data,
                        slug: data.slug.current,
                        icon: (Icons as any)[data.iconName] || Icons.FolderOpen,
                        image: data.mainImage ? urlFor(data.mainImage).url() : undefined
                    });
                } else {
                    setProject(fallbackProjects.find((p) => p.slug === slug) || null);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setProject(fallbackProjects.find((p) => p.slug === slug) || null);
                setIsLoading(false);
            });
    }, [slug]);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="min-h-screen flex items-center justify-center font-mono text-white/50 bg-background"
            >
                DECRYPTING_FILE...
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
                <h1 className="text-4xl font-bold mb-4 font-display">Project Not Found</h1>
                <Link to="/" className="text-emerald-500 hover:underline inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return Home
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <SEO
                title={project.title}
                description={project.description}
                url={`https://achyuthkp27.github.io/Portfolio/#/project/${slug}`}
            />

            <div className="min-h-screen bg-background relative overflow-x-hidden">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <Link to="/" className="pointer-events-auto flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full border border-white/10 bg-black/40 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest hidden md:inline-block">Back to Portfolio</span>
                    </Link>
                </nav>

                {/* Hero Section */}
                <motion.section
                    style={{ opacity: heroOpacity }}
                    className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 px-6"
                >
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
                        <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    </div>

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                        >
                            {project.icon ? <project.icon className={`w-12 h-12 text-${project.color}`} /> : <FolderOpen className={`w-12 h-12 text-${project.color}`} />}
                        </motion.div>

                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                            <TextReveal type="blur-reveal">{project.title}</TextReveal>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-12">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://github.com/achyuthkp27"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                                View Code
                            </motion.a>
                            {/* Demo Link Placeholder - modify if you have live demos */}
                            {/* <motion.a 
                                className="..."
                             > 
                                Live Demo 
                             </motion.a> */}
                        </div>
                    </div>
                </motion.section>

                {/* Detailed Content */}
                <section className="relative z-10 px-6 pb-32">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-[1fr_300px] gap-12">

                            {/* Main Content */}
                            <div className="space-y-16">
                                {/* Overview */}
                                <div>
                                    <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <span className="w-8 h-1 bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-full" />
                                        Project Overview
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                        {project.fullDescription || project.description}
                                    </p>

                                    {/* Key Challenges */}
                                    {project.challenges && (
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                            <h3 className="font-display text-lg font-bold text-white mb-4">Key Challenges</h3>
                                            <ul className="space-y-3">
                                                {project.challenges.map((challenge, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-400">
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                        {challenge}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Problem / Solution / Outcome Grid */}
                                <div className="grid gap-8">
                                    <div className="border-l-2 border-white/10 pl-6 py-2">
                                        <h3 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-2">The Problem</h3>
                                        <p className="text-gray-300">{project.problem}</p>
                                    </div>
                                    <div className="border-l-2 border-emerald-500/50 pl-6 py-2">
                                        <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-500 mb-2">The Solution</h3>
                                        <p className="text-gray-300">{project.solution}</p>
                                    </div>
                                    <div className="border-l-2 border-purple-500/50 pl-6 py-2">
                                        <h3 className="text-sm font-mono uppercase tracking-widest text-purple-500 mb-2">The Outcome</h3>
                                        <p className="text-gray-300">{project.outcome}</p>
                                    </div>
                                </div>

                                {/* Architecture / Technical Details */}
                                {project.architecture && (
                                    <div>
                                        <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                            <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-900 rounded-full" />
                                            Technical Architecture
                                        </h2>
                                        <div className="space-y-8">
                                            {project.architecture.map((item, index) => (
                                                <div key={index}>
                                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                                    {item.imageUrl && (
                                                        <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
                                                            <img src={item.imageUrl} alt={item.title} className="w-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-8">
                                {/* Tech Stack */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 text-xs font-mono bg-white/5 text-white/80 border border-white/10 rounded-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Meta Info (Static for now, can be dynamic) */}
                                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-white/40 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-mono uppercase tracking-widest">Year</span>
                                        </div>
                                        <p className="text-white">2024</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-white/40 mb-1">
                                            <User className="w-4 h-4" />
                                            <span className="text-xs font-mono uppercase tracking-widest">Role</span>
                                        </div>
                                        <p className="text-white">Lead Engineer</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default ProjectDetail;
