import { motion } from "framer-motion";
import { Search, PenTool, Code, Rocket } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const steps = [
    {
        icon: Search,
        title: "Discovery",
        desc: "Understanding requirements, architecture planning, and feasibility analysis."
    },
    {
        icon: PenTool,
        title: "Design",
        desc: "System design, database schema, and UI/UX prototyping."
    },
    {
        icon: Code,
        title: "Development",
        desc: "Agile implementation with TDD, code reviews, and continuous integration."
    },
    {
        icon: Rocket,
        title: "Deployment",
        desc: "Automated pipelines, cloud infrastructure setup, and monitoring."
    }
];

const ProcessSection = () => {
    return (
        <section className="py-24 px-6 md:px-12 relative bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <TextReveal type="fade-up">
                        <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
                            [ SYSTEM_WORKFLOW ]
                        </span>
                    </TextReveal>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        <TextReveal type="blur-reveal" delay={0.2}>How I </TextReveal>
                        <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">Work</TextReveal>
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        A systematic approach to building scalable software, ensuring quality at every step.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Mobile) */}
                    <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/10 overflow-hidden z-0">
                        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-transparent via-white to-transparent animate-scan-beam-vertical opacity-100" />
                    </div>

                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-20 left-0 w-full h-px bg-white/10 overflow-hidden z-0">
                        <div className="absolute top-0 left-0 h-full w-[200px] bg-gradient-to-r from-transparent via-white to-transparent animate-scan-beam-horizontal opacity-100" />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            className="relative z-10 h-full"
                        >
                            <SpotlightCard className="h-full bg-black/40 border-white/10 hover:border-white/30 transition-colors group">
                                <div className="h-full p-8 flex flex-col items-center text-center">
                                    <div
                                        className="w-24 h-24 bg-black border border-white/10 rounded-full flex items-center justify-center mb-6 relative transition-all duration-500 z-20"
                                        style={{
                                            animation: "icon-glow 6s ease-in-out infinite",
                                            animationDelay: `${(i * 1.5) - 0.5}s`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                                        <step.icon className="w-8 h-8 text-white relative z-10" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 rounded-full border border-white/10 flex items-center justify-center text-xs text-white/50 font-mono">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
