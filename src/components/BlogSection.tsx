import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ExternalLink, BookOpen, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useState, useEffect } from "react";

interface BlogPost {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    description: string;
    thumbnail: string;
    categories: string[];
}

const BlogSection = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("./data/blog.json");
                const data = await response.json();
                // Take only first 4 for home page
                setPosts(data.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Format date from "2020-05-02 05:13:02" to "MAY 02, 2020"
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).toUpperCase();
    };

    return (
        <section id="blog" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
            {/* Background Signal Pulse */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            
            <div className="max-w-7xl mx-auto">
                {/* Header: Asymmetrical Intelligence Lead */}
                <SectionHeader 
                    label="SIGNAL_INTERCEPT // ARCHIVE.LOG"
                    titleMain="Technical"
                    titleAccent="Intelligence"
                    description="Captured transmission packets from Medium. Architectural evolution and system optimizations synchronized daily."
                    align="left"
                />

                {/* Transmission Feed */}
                <div className="relative flex flex-col gap-px bg-white/5 border-y border-white/5 overflow-hidden min-h-[800px]">
                    {/* Vertical Connecting Axis */}
                    <div className="absolute left-[20px] md:left-[16.66%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                    {isLoading ? (
                        <div className="h-full min-h-[800px] flex items-center justify-center font-mono text-white/20 text-xs animate-pulse">
                            RECEIVING_DATA_PACKETS...
                        </div>
                    ) : (
                        posts.map((post, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group block relative py-12 md:py-16 px-4 md:px-0 hover:bg-emerald-500/[0.02] transition-colors duration-700"
                            >
                                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 items-start gap-8 relative z-10">
                                    
                                    {/* INTERACTOR: The Signal Node */}
                                    <div className="hidden md:flex justify-end pr-10 pt-2">
                                        <div className="relative">
                                            <div className="w-3 h-3 border border-white/40 group-hover:border-emerald-500 transition-colors duration-300 rotate-45" />
                                            <div className="absolute inset-0 bg-white/20 group-hover:bg-emerald-500/50 blur-sm scale-0 group-hover:scale-150 transition-transform duration-500" />
                                        </div>
                                    </div>

                                    {/* TIMESTAMP */}
                                    <div className="font-mono text-[10px] md:text-xs text-white/30 tracking-[0.2em] pt-2 order-2 md:order-none">
                                        <span className="text-white/10 mr-2 md:hidden">DATE:</span>
                                        {formatDate(post.pubDate)}
                                    </div>

                                    {/* CONTENT BLOCK */}
                                    <div className="md:col-span-4 flex flex-col gap-4 border-l-2 border-transparent group-hover:border-emerald-500/30 pl-0 md:pl-8 transition-all duration-500">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <h3 className="font-display text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors cursor-pointer"
                                                onClick={() => setSelectedPost(post)}>
                                                {post.title}
                                            </h3>
                                            <div className="hidden md:block w-12 h-px bg-white/10 group-hover:w-24 group-hover:bg-emerald-500 transition-all duration-500" />
                                        </div>

                                        <div className="flex flex-wrap gap-2 md:gap-3 my-2 md:my-4">
                                            {post.categories.slice(0, 3).map(tag => (
                                                <span key={tag} className="text-[8px] md:text-[9px] font-mono py-1 md:py-1.5 px-2 md:px-3 border border-white/10 tracking-tighter text-white/40 group-hover:text-emerald-400/60 group-hover:border-emerald-500/10 transition-colors bg-white/5">
                                                    #{tag.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8 mt-4 md:mt-6">
                                            <button 
                                                onClick={() => setSelectedPost(post)}
                                                className="flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold text-white/50 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] group/link py-2"
                                            >
                                                <BookOpen className="w-4 h-4 md:w-3 md:h-3 group-hover/link:animate-pulse" /> FAST_PREVIEW
                                            </button>
                                            <a 
                                                href={post.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[10px] md:text-xs font-mono font-bold text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] group/ext py-2"
                                            >
                                                <ExternalLink className="w-4 h-4 md:w-3 md:h-3 group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5 transition-transform" /> FULL_TRANSMISSION
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Signal Burst Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer: Diagnostic End */}
                <div className="mt-12 flex justify-between items-center px-4 md:px-0">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    <div className="mx-8 font-mono text-[10px] text-white/10 uppercase tracking-[0.4em]">
                        [ END_OF_TRANSMISSION ]
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
            </div>

            {/* Fast Preview Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPost(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[80vh] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <Terminal className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-[0.3em]">PREVIEW_MODE</h4>
                                        <p className="text-[9px] font-mono text-white/20 uppercase font-bold tracking-widest mt-1">
                                            ESTABLISHING_LINK // {selectedPost.guid.slice(-8)}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedPost(null)}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                        <Clock className="w-3 h-3" /> {formatDate(selectedPost.pubDate)}
                                    </div>
                                    <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
                                        {selectedPost.title}
                                    </h2>
                                </div>

                                <div 
                                    className="prose prose-invert max-w-none text-white/60 font-light leading-relaxed text-lg
                                               prose-p:mb-6 prose-p:font-light prose-strong:text-emerald-400
                                               prose-img:rounded-xl prose-img:border prose-img:border-white/10
                                               prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.description }}
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                                    END_OF_PREVIEW // ACCESS_FULL_DATA_ON_MEDIUM
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button 
                                        onClick={() => setSelectedPost(null)}
                                        className="flex-1 md:flex-none px-6 py-3 border border-white/10 hover:bg-white/5 text-white/60 font-mono text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        RETURN
                                    </button>
                                    <a 
                                        href={selectedPost.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 group"
                                    >
                                        READ_ON_MEDIUM <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BlogSection;
