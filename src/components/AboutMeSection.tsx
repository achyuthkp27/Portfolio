import { motion, useScroll, useSpring, useMotionTemplate, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import TextReveal from "./ui/TextReveal";
import { ArrowRight, Code, Cpu, Palette } from "lucide-react";

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
            title: "THE HUMAN",
            subtitle: "Simply, Achyuth",
            description: "A curious mind exploring the intersection of technology, art, and human connection.",
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
            title: "THE OPERATOR",
            subtitle: "Architect of Systems",
            description: "Executing precise, scalable solutions for enterprise-grade infrastructure. Zero tolerance for inefficiency.",
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
            title: "THE CREATOR",
            subtitle: "Visionary Artist",
            description: "Pushing boundaries of visual design and interactive experiences. Where code meets chaos.",
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

    return (
        <section ref={containerRef} className="relative py-20 lg:py-32 px-6 md:px-12 bg-transparent overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="mb-16 lg:mb-24 md:flex justify-between items-end">
                    <div className="max-w-2xl">
                        <TextReveal type="fade-up">
                            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 border border-white/10 mb-6 bg-white/5">
                                [ IDENTITY_MATRIX ]
                            </span>
                        </TextReveal>
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            <TextReveal type="blur-reveal" delay={0.2}>The Mind Behind</TextReveal>{" "}
                            <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">the Machine.</TextReveal>
                        </h2>
                    </div>
                    <div className="hidden md:block mb-4">
                        <div className="flex gap-2 text-white/40 text-xs font-mono">
                            <span>/// SYSTEM_STATUS:</span>
                            <span className="text-emerald-400">ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-start">

                    {/* Left Column - Navigation/Selector */}
                    <div className="space-y-4 sticky top-32 order-2 lg:order-1">
                        {personas.map((persona, index) => (
                            <motion.div
                                key={persona.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handlePersonaClick(persona.id)}
                                className={`group relative p-6 cursor-pointer border transition-all duration-500 rounded-lg overflow-hidden ${activePersona === persona.id
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
                                        <p className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${activePersona === persona.id ? persona.color : "text-white/30"
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

                        <div className="pt-8 border-t border-white/5 mt-8">
                            <p className="text-white/40 text-sm leading-relaxed mb-6 font-light">
                                "I operate at the intersection of rigid logic and fluid creativity. One discipline informs the other."
                            </p>
                            <button
                                onClick={() => {
                                    const contactSection = document.getElementById("contact");
                                    if (contactSection) {
                                        contactSection.scrollIntoView({ behavior: "smooth" });
                                    } else {
                                        // Fallback if lazy load hasn't finished or ID is missing
                                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                    }
                                }}
                                className="inline-flex items-center gap-2 text-white text-sm font-mono hover:text-emerald-400 transition-colors group"
                            >
                                <span>INITIATE_CONTACT</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Visual Showcase abstract replacement */}
                    <div
                        ref={imageContainerRef}
                        className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black/40 order-1 lg:order-2 flex items-center justify-center p-6"
                        onMouseMove={onMouseMove}
                    >
                        {/* Background Grid */}
                        <div className="absolute inset-0 grid-pattern opacity-20" />

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
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none group"
                                >
                                    {/* Glowing Background Effect */}
                                    <div className={`absolute inset-0 opacity-10 blur-[100px] transition-opacity duration-1000 ${persona.glowBg}`} />

                                    {/* Persona Icon */}
                                    <motion.div 
                                        initial={{ y: 20 }}
                                        animate={{ y: activePersona === persona.id ? 0 : 20 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="relative w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-black/50 backdrop-blur-md overflow-hidden"
                                    >
                                        {/* Radar/Pulse rings */}
                                        <div className={`absolute inset-0 border ${persona.ringBorder} rounded-full opacity-20 animate-[ping_3s_linear_infinite]`} />
                                        <div className={`absolute inset-4 border ${persona.ringBorder} rounded-full opacity-40 animate-[spin_10s_linear_infinite] border-dashed`} />
                                        
                                        <persona.icon className={`w-12 h-12 ${persona.color}`} />
                                    </motion.div>

                                    {/* Persona Content */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: activePersona === persona.id ? 0 : 20, opacity: activePersona === persona.id ? 1 : 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="relative z-10 w-full"
                                    >
                                        <h2 className="font-display text-3xl font-bold text-white mb-4 tracking-tight">
                                            {persona.title}
                                        </h2>
                                        <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-[280px] mx-auto">
                                            {persona.description}
                                        </p>

                                        {/* Capabilities / Keywords grid */}
                                        <div className="grid grid-cols-2 gap-2 w-full max-w-[280px] mx-auto">
                                            {persona.keywords.map((keyword) => (
                                                <div key={keyword} className="border border-white/5 bg-white/5 rounded px-2 py-2 text-[10px] font-mono text-white/50 tracking-wider">
                                                    {keyword}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Flashlight / Reveal Effect Layer */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none bg-white/5 opacity-0 group-hover:opacity-100 mix-blend-overlay"
                            style={style}
                        />

                        {/* Decorative UI Elements */}
                        <div className="absolute top-6 right-6 z-30 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>

                        <div className="absolute bottom-6 right-6 z-30 font-mono text-[10px] text-white/30 hidden md:block">
                            SYS.ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMeSection;
