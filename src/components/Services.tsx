import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TextReveal from "./ui/TextReveal";
import { ArrowUpRight, Code, Palette, Laptop } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

const services = [
    {
        title: "Web Engineering",
        description: "Building scalable, high-performance web applications with modern tech stacks.",
        icon: <Laptop className="w-8 h-8" />,
        tags: ["React/Next.js", "TypeScript", "Node.js"],
        number: "01",
        accentColor: "emerald",
    },
    {
        title: "UI/UX Design",
        description: "Crafting intuitive and visually stunning interfaces that users love.",
        icon: <Palette className="w-8 h-8" />,
        tags: ["Figma", "Design Systems", "Prototyping"],
        number: "02",
        accentColor: "blue",
    },
    {
        title: "Creative Development",
        description: "Adding life to the web with complex animations and immersive 3D experiences.",
        icon: <Code className="w-8 h-8" />,
        tags: ["GSAP/Framer", "Three.js", "WebGL"],
        number: "03",
        accentColor: "purple",
    }
];

const accentStyles: Record<string, { gradient: string; hoverBorder: string; hoverBg: string; hoverText: string; line: string }> = {
    emerald: {
        gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
        hoverBorder: "group-hover:border-emerald-500/30",
        hoverBg: "group-hover:bg-emerald-500/10",
        hoverText: "group-hover:text-emerald-400",
        line: "bg-emerald-500",
    },
    blue: {
        gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
        hoverBorder: "group-hover:border-blue-500/30",
        hoverBg: "group-hover:bg-blue-500/10",
        hoverText: "group-hover:text-blue-400",
        line: "bg-blue-500",
    },
    purple: {
        gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
        hoverBorder: "group-hover:border-purple-500/30",
        hoverBg: "group-hover:bg-purple-500/10",
        hoverText: "group-hover:text-purple-400",
        line: "bg-purple-500",
    },
};

const Services = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20">
                    <TextReveal type="fade-up">
                        <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
                            [ CREATIVE_ENGINEERING ]
                        </span>
                    </TextReveal>
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tighter uppercase leading-none">
                        <TextReveal type="blur-reveal" as="span">DESIGN</TextReveal><br />
                        <TextReveal type="blur-reveal" as="span" className="text-white/40">& CODE</TextReveal>
                    </h2>
                    <div className="max-w-2xl text-xl text-gray-400">
                        <TextReveal type="scrub" className="leading-relaxed font-light">
                            I combine technical expertise with design sensibilities to deliver comprehensive digital solutions. From concept to code, everything is crafted with precision.
                        </TextReveal>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const accent = accentStyles[service.accentColor];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                            >
                                <SpotlightCard
                                    className={`h-full group border border-white/10 bg-black/40 hover:border-white/20 transition-all duration-500 relative overflow-hidden`}
                                    spotlightColor="rgba(255, 255, 255, 0.05)"
                                >
                                    {/* Large watermark number */}
                                    <div className="absolute -top-6 -right-4 text-[180px] font-display font-bold text-white/[0.02] pointer-events-none select-none leading-none animate-watermark-float" style={{ animationDelay: `${index * 0.8}s` }}>
                                        {service.number}
                                    </div>

                                    {/* Animated left accent line — rises on hover */}
                                    <div className="absolute left-0 bottom-0 w-[2px] h-0 group-hover:h-full transition-all duration-700 ease-out">
                                        <div className={`w-full h-full ${accent.line} opacity-40 group-hover:opacity-80 transition-opacity`} />
                                    </div>

                                    {/* Hover gradient bloom */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                    <div className="p-8 h-full flex flex-col pt-12 relative z-10">
                                        {/* Icon with rotating border ring on hover */}
                                        <div className={`mb-6 w-14 h-14 flex items-center justify-center border border-white/10 bg-white/5 ${accent.hoverBg} ${accent.hoverBorder} transition-all duration-500 rounded-xl relative overflow-hidden`}>
                                            <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-xl group-hover:animate-[spin_4s_linear_infinite] pointer-events-none" />
                                            <div className={`text-white ${accent.hoverText} transition-colors duration-500`}>
                                                {service.icon}
                                            </div>
                                        </div>

                                        {/* Number badge */}
                                        <span className="text-[10px] font-mono text-white/20 tracking-widest mb-2">{service.number} //</span>

                                        <h3 className="text-xl font-display font-bold mb-4 text-white uppercase tracking-wide">
                                            {service.title}
                                        </h3>

                                        <p className="text-gray-400 mb-8 flex-grow leading-relaxed text-sm border-l border-white/10 pl-4 group-hover:border-white/20 transition-colors">
                                            {service.description}
                                        </p>

                                        {/* Tags with stagger */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {service.tags.map((tag, i) => (
                                                <motion.span
                                                    key={tag}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                                    transition={{ delay: index * 0.15 + i * 0.1 + 0.3, duration: 0.4 }}
                                                    className={`text-[10px] uppercase tracking-wider px-2.5 py-1 border border-white/10 text-white/60 font-mono rounded-md ${accent.hoverBorder} ${accent.hoverText} transition-all duration-300`}
                                                >
                                                    {tag}
                                                </motion.span>
                                            ))}
                                        </div>

                                        <div className={`flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest group-hover:text-white transition-colors`}>
                                            [ EXPLORE_DATA ] <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
