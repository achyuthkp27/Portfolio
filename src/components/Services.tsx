import { motion } from "framer-motion";
import TextReveal from "./ui/TextReveal";
import { ArrowUpRight, Code, Palette, Laptop } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

const services = [
    {
        title: "Web Engineering",
        description: "Building scalable, high-performance web applications with modern tech stacks.",
        icon: <Laptop className="w-8 h-8" />,
        tags: ["React/Next.js", "TypeScript", "Node.js"]
    },
    {
        title: "UI/UX Design",
        description: "Crafting intuitive and visually stunning interfaces that users love.",
        icon: <Palette className="w-8 h-8" />,
        tags: ["Figma", "Design Systems", "Prototyping"]
    },
    {
        title: "Creative Development",
        description: "Adding life to the web with complex animations and immersive 3D experiences.",
        icon: <Code className="w-8 h-8" />,
        tags: ["GSAP/Framer", "Three.js", "WebGL"]
    }
];

const Services = () => {
    return (
        <section className="py-32 px-6 md:px-12 relative overflow-hidden bg-transparent">

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20">
                    <TextReveal type="fade-up">
                        <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
                            [ CREATIVE_ENGINEERING ]
                        </span>
                    </TextReveal>
                    <TextReveal type="mask-up" as="h2" className="font-display text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                        DESIGN <span className="text-white/40">& CODE</span>
                    </TextReveal>
                    <div className="max-w-2xl text-xl text-gray-400">
                        <TextReveal type="scrub" className="leading-relaxed font-light">
                            I combine technical expertise with design sensibilities to deliver comprehensive digital solutions. From concept to code, everything is crafted with precision.
                        </TextReveal>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true }}
                        >
                            <SpotlightCard
                                className="h-full group border border-white/10 bg-black/40 hover:border-white/30 transition-colors duration-500"
                                spotlightColor="rgba(255, 255, 255, 0.05)"
                            >
                                <div className="p-8 h-full flex flex-col pt-12">
                                    <div className="mb-6 w-12 h-12 flex items-center justify-center border border-white/10 bg-white/5 group-hover:bg-white/10 transition-colors">
                                        <div className="text-white">
                                            {service.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-display font-bold mb-4 text-white uppercase tracking-wide">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-400 mb-8 flex-grow leading-relaxed text-sm border-l border-white/10 pl-4">
                                        {service.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {service.tags.map(tag => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 border border-white/10 text-white/60 font-mono">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                                        [ EXPLORE_DATA ] <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
