import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import { ArrowUpRight, Terminal } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

const blogPosts = [
    {
        date: "2024.12.28",
        title: "Optimizing Three.js for Production",
        tags: ["WebGL", "Performance", "React Three Fiber"],
        excerpt: "Reducing bundle size by 60% through aggressive tree-shaking and manual chunking strategies.",
        link: "#"
    },
    {
        date: "2024.11.15",
        title: "Microservices with Spring Boot & Kafka",
        tags: ["Backend", "Java", "Architecture"],
        excerpt: "Building fault-tolerant event-driven systems that scale to millions of requests.",
        link: "#"
    },
    {
        date: "2024.10.02",
        title: "The Future of Gen AI in Engineering",
        tags: ["AI", "LLM", "DevOps"],
        excerpt: "How automated code generation is shifting the role of the senior engineer.",
        link: "#"
    }
];

const BlogSection = () => {
    return (
        <section id="blog" className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16">
                <TextReveal type="fade-up">
                    <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
                        [ TRANSMISSION_LOG ]
                    </span>
                </TextReveal>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                    <TextReveal type="blur-reveal" delay={0.2}>Technical</TextReveal>{" "}
                    <TextReveal type="blur-reveal" delay={0.4} className="text-white/40">Insights</TextReveal>
                </h2>
            </div>

            {/* Blog List - Terminal Style */}
            <div className="max-w-4xl mx-auto">
                <div className="border border-white/10 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        <div className="ml-2 font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-3 h-3" />
                            transmission_feed.log
                        </div>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-white/5">
                        {blogPosts.map((post, i) => (
                            <motion.a
                                key={i}
                                href={post.link}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group block p-6 md:p-8 hover:bg-white/[0.02] transition-colors relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                                <div className="flex flex-col md:flex-row gap-6 md:items-start text-left">
                                    {/* Date Column */}
                                    <div className="font-mono text-xs text-white/30 md:w-32 pt-1">
                                        {post.date}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                {post.title}
                                            </h3>
                                            <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-2xl">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex gap-2">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 border border-white/10 rounded text-white/40">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Terminal Footer */}
                    <div className="px-4 py-3 border-t border-white/10 bg-white/5 font-mono text-[10px] text-white/30 text-center uppercase tracking-widest group cursor-pointer hover:bg-white/10 transition-colors">
                        Load_More_Entries [ ... ]
                    </div>
                </div>
            </div>

        </section>
    );
};

export default BlogSection;
