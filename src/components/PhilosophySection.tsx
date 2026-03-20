import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef } from "react";
import TextReveal from "./ui/TextReveal";
import { Server, Shield, Zap, Sparkles, Terminal, Activity } from "lucide-react";

// Interactive Bento Card with Flashlight Effect
const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(400px at ${mouseX}px ${mouseY}px, white, transparent)`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            onMouseMove={onMouseMove}
            className={`group relative overflow-hidden rounded-2xl bg-black/40 border border-white/10 ${className}`}
        >
            {/* Flashlight Hover Layer */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-overlay bg-white/5"
                style={{ maskImage, WebkitMaskImage: maskImage }}
            />
            {/* Soft background bloom on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-900/10 group-hover:via-transparent transition-all duration-700 pointer-events-none" />
            
            <div className="relative h-full z-10 flex flex-col p-6 md:p-8">
                {children}
            </div>
        </motion.div>
    );
};

const PhilosophySection = () => {
    const dob = new Date("1999-11-27");
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return (
        <section id="philosophy" className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-emerald-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-16 md:mb-24">
                    <TextReveal type="fade-up">
                        <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 border border-white/10 mb-6 bg-white/5">
                            [ DIRECTIVE_LOGIC ]
                        </span>
                    </TextReveal>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight">
                        <TextReveal type="blur-reveal" delay={0.2} as="span">My Operational</TextReveal>{" "}
                        <TextReveal type="blur-reveal" delay={0.3} as="span" className="text-white/40 italic">Manifesto.</TextReveal>
                    </h2>
                </div>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 auto-rows-[auto]">
                    
                    {/* Bento Box 1: The Core Belief (Large Wide) */}
                    <BentoCard className="md:col-span-4 lg:col-span-4 row-span-1 min-h-[280px]" delay={0.1}>
                        <div className="flex-1 flex flex-col justify-center">
                            <Sparkles className="w-6 h-6 text-emerald-400 mb-6 opacity-80" />
                            <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-white/80">
                                Every line of code is <span className="text-white font-medium">cultivated with intention</span>. I seek no comfort in numbers, only in the <span className="text-white font-medium">precision of quality</span>.
                            </h3>
                            <div className="mt-8 flex items-center gap-3">
                                <div className="h-px w-12 bg-emerald-500/50" />
                                <span className="text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">Fundamental Axiom</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Bento Box 2: System Status (Small Square) */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 row-span-1 min-h-[280px] flex items-center justify-center text-center bg-black/60" delay={0.2}>
                        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                        <Activity className="w-12 h-12 text-blue-400 mb-6 mx-auto animate-pulse" />
                        <div className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/60 space-y-2">
                            <p>ACCESS {'>'} INTO_AKP</p>
                            <p className="text-blue-400 font-bold border border-blue-500/30 bg-blue-500/10 py-1 px-2 rounded inline-block my-2 w-full">V.{age}.0_ACTIVE</p>
                            <p>VALIDATION_PENDING</p>
                        </div>
                    </BentoCard>

                    {/* Bento Box 3: Institutional Grade (Tall Vertical) */}
                    <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2 min-h-[400px]" delay={0.3}>
                        <Server className="w-8 h-8 text-white/50 mb-6" />
                        <h3 className="font-display text-3xl font-bold leading-tight text-white mb-6">
                            Institutional-<br />Grade<br />Systems.
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-8 flex-1">
                            Standard solutions suffice. I rewrite the standards. Latency, downtime, and fragile pipelines used to be the norm. 
                        </p>
                        
                        <div className="mt-auto space-y-2">
                            <div className="w-full bg-white/5 border border-white/10 rounded overflow-hidden">
                                <div className="w-[95%] h-1 bg-gradient-to-r from-emerald-500 to-emerald-300" />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-white/40">
                                <span>SYSTEM UPTIME</span>
                                <span className="text-emerald-400">99.99%</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Bento Box 4: The Tech Stack Matrix (Wide) */}
                    <BentoCard className="md:col-span-4 lg:col-span-4 row-span-1 min-h-[220px] bg-gradient-to-br from-black/60 to-black/80" delay={0.4}>
                        <Terminal className="w-6 h-6 text-white/40 mb-4" />
                        <p className="text-[10px] md:text-xs font-mono tracking-[0.1em] text-emerald-400/80 uppercase leading-loose mb-6 max-w-2xl">
                            _ THROUGH DISTRIBUTED SYSTEMS, SECURE KAFKA PIPELINES, AND THE RAW POWER OF SPRING BOOT, EVERY TRANSACTION IS BUILT FOR SCALE.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {['DISTRIBUTED', 'MICROSERVICES', 'RESILIENT', 'KAFKA', 'AWS', 'REACT', 'OBSERVABILITY'].map(tag => (
                                <span key={tag} className="px-3 py-1 text-[10px] font-mono border border-white/10 text-white/40 rounded hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-crosshair bg-black/40 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </BentoCard>

                    {/* Bento Box 5: Long Quote (Wide Banner) */}
                    <BentoCard className="md:col-span-4 lg:col-span-4 row-span-1 min-h-[160px] flex justify-center items-center" delay={0.5}>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-24 h-24" />
                        </div>
                        <TextReveal type="scrub" className="font-display text-xl md:text-2xl font-light text-white/60 text-center relative z-10 w-full" scrollOffset={["start 0.8", "start 0.4"]}>
                            "One mind aligned with purpose surpasses any algorithm without direction."
                        </TextReveal>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
};

export default PhilosophySection;
