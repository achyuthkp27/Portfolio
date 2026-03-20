import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client, urlFor, dummyPosts } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import SEO from "@/components/SEO";

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        client.fetch(
            `*[_type == "post" && slug.current == $slug][0]{
                title,
                publishedAt,
                mainImage,
                body,
                "name": author->name,
                "authorImage": author->image
            }`, { slug }
        )
            .then((data) => {
                if (data) {
                    setPost(data);
                } else {
                    setPost(dummyPosts.find(p => p.slug.current === slug));
                }
            })
            .catch(() => setPost(dummyPosts.find(p => p.slug.current === slug)));
    }, [slug]);

    if (!post) return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            className="text-center py-40 text-white min-h-screen bg-background"
        >
            Loading...
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <SEO title={post.title} description={`Read ${post.title} on Achyuth's blog.`} />

            <article className="min-h-screen bg-background relative pb-32">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <Link to="/blog" className="pointer-events-auto flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full border border-white/10 bg-black/40 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest hidden md:inline-block">Back to Blog</span>
                    </Link>
                </nav>

                <motion.header
                    style={{ opacity: heroOpacity }}
                    className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto relative z-10"
                >
                    <div className="mb-8 flex items-center justify-center gap-4 text-sm font-mono text-white/60 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.name || "Achyuth KP"}
                        </span>
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                        {post.title}
                    </h1>
                    {post.mainImage && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[500px]">
                            <img
                                src={urlFor(post.mainImage).width(1200).url()}
                                alt={post.title}
                                className="w-full object-cover"
                            />
                        </div>
                    )}
                </motion.header>

                <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-lg prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                    {post.body ? (
                        <PortableText value={post.body} />
                    ) : (
                        <p className="text-gray-400 italic text-center">[Content placeholder: Connect Sanity to view full article]</p>
                    )}
                </div>
            </article>
        </motion.div>
    );
};

export default BlogPost;
