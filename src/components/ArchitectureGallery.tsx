import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TextReveal from "./ui/TextReveal";

const ArchitectureGallery = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
            {/* Grid Background */}


            <motion.div style={{ opacity }} className="max-w-7xl mx-auto relative z-10 space-y-32">

                {/* Section 1: Unseen Possibilities vs Institutional Protection */}
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    <div>
                        <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
                            <TextReveal type="blur-reveal" delay={0.1}>
                                Unseen
                            </TextReveal>
                            <br />
                            <TextReveal type="blur-reveal" delay={0.3} className="text-white/50">
                                Reliability.
                            </TextReveal>
                        </h2>
                    </div>

                    <div className="space-y-12">
                        <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
                            <TextReveal type="blur-reveal" delay={0.4}>
                                Engineered-
                            </TextReveal>
                            <br />
                            <TextReveal type="blur-reveal" delay={0.6} className="text-white/50">
                                Precision.
                            </TextReveal>
                        </h2>

                        <div className="space-y-8">
                            <TextReveal type="fade-up" delay={0.5} className="text-xl text-gray-400 leading-relaxed font-light border-l border-white/20 pl-6">
                                Private systems fail when they aren't built to scale. Latency, downtime, and fragile pipelines used to be the norm.
                            </TextReveal>

                            <TextReveal type="fade-up" delay={0.6} className="text-xl text-white leading-relaxed font-light">
                                I <span className="text-white/40 line-through decoration-white/30">maintain</span> <span className="font-bold">engineer</span> backend systems built to endure.
                            </TextReveal>

                            <TextReveal type="fade-up" delay={0.7} className="text-sm font-mono text-gray-500 leading-relaxed uppercase tracking-wider">
                                From DISTRIBUTED MICROSERVICES TO REAL-TIME KAFKA PIPELINES, EVERY SYSTEM IS CRAFTED FOR STABILITY, OBSERVABILITY, AND LONG-TERM RELIABILITY.
                            </TextReveal>
                        </div>
                    </div>
                </div>

                {/* Section 2: Backing the Titans (Center alignment) */}
                <div className="flex flex-col items-center text-center py-20 border-y border-white/5 bg-white/[0.01]">
                    <TextReveal type="fade-up" className="mb-6">
                        <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 bg-white/5">
                            [ MY_FUTURE_VISION ]
                        </span>
                    </TextReveal>

                    <h2 className="font-display text-4xl md:text-8xl font-bold tracking-tighter text-white leading-none mb-8">
                        <TextReveal type="blur-reveal" delay={0.2}>I Build for a Future</TextReveal>
                        <br />
                        <TextReveal type="blur-reveal" delay={0.4} className="text-white/40">Where Intelligence</TextReveal>
                        <br />
                        <TextReveal type="blur-reveal" delay={0.6}>Becomes the New</TextReveal>
                        <br />
                        <TextReveal type="blur-reveal" delay={0.6}>Infrastructure</TextReveal>
                    </h2>

                    <TextReveal type="fade-up" delay={0.8}>
                        <p className="text-xs md:text-sm font-mono text-gray-500 uppercase tracking-[0.3em]">
                            I USE GEN AI TO DESIGN SYSTEMS THAT LEARN, ADAPT, AND SCALE BEYOND TRADITIONAL LIMITS
                        </p>
                    </TextReveal>
                </div>

            </motion.div>
        </section>
    );
};

export default ArchitectureGallery;
