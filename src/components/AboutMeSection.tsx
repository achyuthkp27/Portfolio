import { motion, useScroll, useSpring, useMotionTemplate, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import TextReveal from "./ui/TextReveal";
import { ArrowRight, Code, Cpu, Palette, Server, Cloud, Zap, Shield, Globe, Award, TrendingUp, Sparkles } from "lucide-react";

const AboutMeSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null); // Ref for scrolling on mobile
    const shouldReduceMotion = useReducedMotion();
    
    const [activePersona, setActivePersona] = useState<"operator" | "creator" | "human">("human");

    // Mouse tracking for magnetic effect
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const handlePersonaClick = (id: string) => {
        setActivePersona(id as any);
        // On mobile, scroll content into view if controls are below
        if (window.innerWidth < 1024 && imageContainerRef.current) {
            imageContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const maskImage = shouldReduceMotion ? undefined : useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = shouldReduceMotion ? {} : { maskImage, WebkitMaskImage: maskImage };

    const personas = [
        {
            id: "human",
            title: "THE HUMAN_ENTITY",
            subtitle: "Simply, Achyuth",
            description: "A curious mind exploring the intersection of technology, art, and human connection. Driven by empathy and the pursuit of meaningful digital interactions.",
            icon: Code,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            gradientVia: "via-emerald-400",
            glowBg: "bg-emerald-400",
            ringBorder: "border-emerald-400",
            keywords: ['EMPATHY', 'CURIOSITY', 'COLLABORATION', 'LEARNING']
        },
        {
            id: "operator",
            title: "THE OPERATOR_CORE",
            subtitle: "Architect of Systems",
            description: "Executing precise, scalable solutions for enterprise-grade infrastructure. Zero tolerance for inefficiency or architectural fragility.",
            icon: Cpu,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            gradientVia: "via-blue-400",
            glowBg: "bg-blue-400",
            ringBorder: "border-blue-400",
            keywords: ['ARCHITECTURE', 'SCALABILITY', 'INFRASTRUCTURE', 'SECURITY']
        },
        {
            id: "creator",
            title: "THE CREATOR_NODE",
            subtitle: "Visionary Artist",
            description: "Pushing boundaries of visual design and interactive experiences. Crafting cinematic interfaces where motion defines meaning.",
            icon: Palette,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            gradientVia: "via-orange-400",
            glowBg: "bg-orange-400",
            ringBorder: "border-orange-400",
            keywords: ['UI/UX_DESIGN', 'INTERACTIVE', 'AESTHETICS', 'MOTION']
        }
    ];

    const stats = [
        { value: "5+", label: "YEARS_ACTIVE", icon: TrendingUp },
        { value: "50+", label: "DEPLOYED_NODES", icon: Globe },
        { value: "30+", label: "SATISFIED_CLIENTS", icon: Award },
    ];

    const highlights = [
        { icon: Code, label: "ARCHITECTURE", value: "CLEAN_PROSE" },
        { icon: Server, label: "25+ SERVICES", value: "DISTRIBUTED" },
        { icon: Cloud, label: "AWS_CERTIFIED", value: "CLOUD_NATIVE" },
        { icon: Zap, label: "LATENCY_MIN", value: "PERFORMANCE" },
    ];

    return (
        <section ref={containerRef} id="about" className="relative py-20 lg:py-24 px-6 md:px-12 bg-transparent overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="mb-16 lg:mb-24 md:flex justify-between items-end">
                    <div className="max-w-2xl">
                        <TextReveal type="fade-up">
                            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 border border-white/10 mb-6 bg-white/5">
                                [ IDENTITY_MATRIX_V4.0 ]
                            </span>
                        </TextReveal>
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tighter uppercase">
                            <TextReveal type="blur-reveal" delay={0.2}>The Mind Behind</TextReveal><br />
                            <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">the Machine</TextReveal>
                        </h2>
                    </div>
                    <div className="hidden md:block mb-4">
                        <div className="flex gap-4 text-white/40 text-[10px] font-mono font-bold tracking-widest">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                SYS_STATUS: ONLINE
                            </span>
                            <span className="opacity-20">|</span>
                            <span>ENCRYPT: AES-256</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-start mb-32">

                    {/* Left Column - Navigation/Selector */}
                    <div className="space-y-4 sticky top-32 order-2 lg:order-1">
                        {personas.map((persona, index) => (
                            <motion.div
                                key={persona.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handlePersonaClick(persona.id)}
                                className={`group relative p-6 cursor-pointer border transition-all duration-500 rounded-xl overflow-hidden ${activePersona === persona.id
                                    ? `${persona.bg} ${persona.border}`
                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                    }`}
                            >
                                <div className="relative z-10 flex items-start justify-between">
                                    <div>
                                        <h3 className={`font-display text-lg font-bold mb-1 transition-colors duration-300 ${activePersona === persona.id ? "text-white" : "text-white/60 group-hover:text-white"
                                            }`}>
                                            {persona.title}
                                        </h3>
                                        <p className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${activePersona === persona.id ? persona.color : "text-white/30"
                                            }`}>
                                            {persona.subtitle}
                                        </p>
                                    </div>
                                    <persona.icon className={`w-5 h-5 transition-colors duration-300 ${activePersona === persona.id ? persona.color : "text-white/20 group-hover:text-white/40"
                                        }`} />
                                </div>

                                {/* Progress Bar for Active State */}
                                {activePersona === persona.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent ${persona.gradientVia} to-transparent opacity-50`}
                                    />
                                )}
                            </motion.div>
                        ))}

                        <div className="pt-8 border-t border-white/5 mt-8 space-y-6">
                            <p className="text-white/40 text-sm leading-relaxed font-light italic">
                                "I operate at the intersection of rigid logic and fluid creativity. One discipline informs the other, creating a feedback loop of continuous optimization."
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                    className="inline-flex items-center gap-2 text-white text-[10px] font-mono font-bold tracking-[0.2em] hover:text-emerald-400 transition-colors group border border-white/10 px-6 py-3 bg-white/5 hover:bg-emerald-500/10"
                                >
                                    <span>[ INITIATE_CONTACT ]</span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Visual Showcase */}
                    <div
                        ref={imageContainerRef}
                        className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-3xl overflow-hidden border border-white/10 bg-black/40 order-1 lg:order-2 flex items-center justify-center p-6 shadow-2xl"
                        onMouseMove={onMouseMove}
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 grid-pattern opacity-10" />

                        {/* Content Stack */}
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            {personas.map((persona) => (
                                <motion.div
                                    key={persona.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: activePersona === persona.id ? 1 : 0,
                                        scale: activePersona === persona.id ? 1 : 0.95,
                                        zIndex: activePersona === persona.id ? 10 : 0
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none"
                                >
                                    {/* Glowing Background Effect */}
                                    <div className={`absolute inset-0 opacity-10 blur-[120px] transition-opacity duration-1000 ${persona.glowBg}`} />

                                    {/* Persona Icon */}
                                    <motion.div 
                                        initial={{ y: 20 }}
                                        animate={{ y: activePersona === persona.id ? 0 : 20 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="relative w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mb-10 bg-black/80 backdrop-blur-md overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 border ${persona.ringBorder} rounded-full opacity-10 animate-[ping_4s_linear_infinite]`} />
                                        <div className={`absolute inset-4 border ${persona.ringBorder} rounded-full opacity-20 animate-[spin_15s_linear_infinite] border-dashed`} />
                                        
                                        <persona.icon className={`w-14 h-14 ${persona.color}`} />
                                    </motion.div>

                                    {/* Persona Content */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: activePersona === persona.id ? 0 : 20, opacity: activePersona === persona.id ? 1 : 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="relative z-10 w-full"
                                    >
                                        <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                                            {persona.title}
                                        </h2>
                                        <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-[300px] mx-auto font-light">
                                            {persona.description}
                                        </p>

                                        {/* Capabilities / Keywords grid */}
                                        <div className="grid grid-cols-2 gap-3 w-full max-w-[300px] mx-auto">
                                            {persona.keywords.map((keyword) => (
                                                <div key={keyword} className="border border-white/5 bg-white/[0.02] rounded-lg px-2 py-3 text-[9px] font-mono text-white/40 tracking-[0.2em] group-hover:text-white transition-colors uppercase">
                                                    {keyword}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Flashlight Layer */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none bg-white/5 opacity-0 group-hover:opacity-100 mix-blend-overlay"
                            style={style}
                        />

                        {/* Diagnostic UI */}
                        <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="font-mono text-[9px] text-emerald-500/60 uppercase tracking-widest">TRACE_LINK_STABLE</span>
                        </div>

                        <div className="absolute bottom-8 right-8 z-30 font-mono text-[9px] text-white/20">
                            COORD: {Math.random().toFixed(4)} // {Math.random().toFixed(4)}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Mission Metrics & Engineering Directives */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden mt-20">
                    
                    {/* Stats Blocks (LHS) */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3">
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="p-6 md:p-8 bg-black/40 border-b md:border-b-0 border-r border-white/5 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors relative">
                                <stat.icon className="w-5 h-5 text-white/10 group-hover:text-emerald-500 transition-colors mb-6 md:mb-8" />
                                <div>
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 tracking-tighter">
                                        {stat.value}
                                    </div>
                                    <div className="text-[8px] md:text-[9px] font-mono text-white/20 group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Technical Highlights (RHS) */}
                    <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4">
                        {highlights.map((item, i) => (
                            <div key={item.label} className="p-6 md:p-8 bg-black/60 border-l border-white/5 hover:bg-white/[0.02] transition-colors group flex flex-col items-center text-center justify-center">
                                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white/20 group-hover:text-emerald-400 transition-colors mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-[9px] md:text-[10px] font-display font-bold text-white mb-1 uppercase tracking-tight">
                                    {item.value}
                                </div>
                                <div className="text-[7px] md:text-[8px] font-mono text-white/20 uppercase tracking-widest leading-none">
                                    {item.label}
                                </div>
                                
                                {/* Hover line effect */}
                                <div className="mt-4 w-3 md:w-4 h-px bg-white/10 group-hover:w-8 group-hover:bg-emerald-500 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMeSection;
