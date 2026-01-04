import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client, urlFor, dummyPosts } from "@/lib/sanity";
import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import SEO from "@/components/SEO";
import { ArrowUpRight, Calendar } from "lucide-react";

interface Post {
    slug: { current: string };
    title: string;
    publishedAt: string;
    mainImage: any;
    excerpt: string;
}

const BlogList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Attempt to fetch from Sanity
        client.fetch(`*[_type == "post"] | order(publishedAt desc){
        slug,
        title,
        publishedAt,
        mainImage,
        excerpt
    }`)
            .then((data) => {
                if (data.length > 0) {
                    setPosts(data);
                } else {
                    console.warn("No posts found in Sanity, using dummy data.");
                    setPosts(dummyPosts);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Sanity fetch failed:", err);
                setPosts(dummyPosts);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            <SEO title="Blog | Achyuth KP" description="Thoughts on software engineering, architecture, and design." />

            <div className="min-h-screen pt-32 px-6 pb-20 bg-background relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 text-center"
                    >
                        <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
                            [ KNOWLEDGE_BASE ]
                        </span>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                            <TextReveal type="blur-reveal">Engineering Log</TextReveal>
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Insights into distributed systems, frontend performance, and my journey as a developer.
                        </p>
                    </motion.div>

                    <div className="grid gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.slug.current}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/blog/${post.slug.current}`}
                                    className="block p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-400 mb-4 line-clamp-2 max-w-2xl">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs font-mono text-white/40 uppercase tracking-widest">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(post.publishedAt).toLocaleDateString()}
                                                </span>
                                                <span>Read Article</span>
                                            </div>
                                        </div>

                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogList;
