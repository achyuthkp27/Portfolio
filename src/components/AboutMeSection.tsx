import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { useRef, useState } from "react";
import TextReveal from "./ui/TextReveal";
import { ArrowRight, Code, Cpu, Palette } from "lucide-react";

// Images Import
import creativeImg from "@/assets/images/persona/creative.jpg";
import portraitImg from "@/assets/images/persona/portrait.jpg";
import suitImg from "@/assets/images/projects/monitoring-dashboard.jpg"; // Using Suit as Operator
import bankingImg from "@/assets/images/projects/banking-platform.jpg";
import loggingImg from "@/assets/images/projects/logging-system.jpg";
import notificationImg from "@/assets/images/projects/notification-engine.jpg";
import storageImg from "@/assets/images/projects/secure-storage.jpg";

const AboutMeSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null); // Ref for scrolling on mobile
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

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
        // On mobile, scroll image into view if controls are below
        if (window.innerWidth < 1024 && imageContainerRef.current) {
            imageContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    const personas = [
        {
            id: "operator",
            title: "THE OPERATOR",
            subtitle: "Architect of Systems",
            description: "Executing precise, scalable solutions for enterprise-grade infrastructure. Zero tolerance for inefficiency.",
            image: suitImg,
            icon: Cpu,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            id: "creator",
            title: "THE CREATOR",
            subtitle: "Visionary Artist",
            description: "Pushing boundaries of visual design and interactive experiences. Where code meets chaos.",
            image: creativeImg,
            icon: Palette,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        },
        {
            id: "human",
            title: "THE HUMAN",
            subtitle: "Simply, Achyuth",
            description: "A curious mind exploring the intersection of technology, art, and human connection.",
            image: portraitImg,
            icon: Code,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
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
                                        className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-${persona.color.replace('text-', '')} to-transparent opacity-50`}
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

                    {/* Right Column - Visual Showcase */}
                    <div
                        ref={imageContainerRef}
                        className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black/40 order-1 lg:order-2"
                        onMouseMove={onMouseMove}
                    >

                        {/* Background Grid */}
                        <div className="absolute inset-0 grid-pattern opacity-20" />

                        {/* Images Stack */}
                        <div className="absolute inset-0 w-full h-full">
                            {personas.map((persona) => (
                                <motion.div
                                    key={persona.id}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: activePersona === persona.id ? 1 : 0,
                                        zIndex: activePersona === persona.id ? 10 : 0
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 w-full h-full group"
                                >
                                    <img
                                        src={persona.image}
                                        alt={persona.title}
                                        className="w-full h-full object-cover object-top transition-all duration-700 grayscale group-hover:grayscale-0"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: activePersona === persona.id ? 0 : 20, opacity: activePersona === persona.id ? 1 : 0 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                        >
                                            <h2 className="font-display text-4xl font-bold text-white mb-2 tracking-tight">
                                                {persona.subtitle}
                                            </h2>
                                            <p className="text-white/70 text-sm leading-relaxed border-l-2 border-white/20 pl-4">
                                                {persona.description}
                                            </p>
                                        </motion.div>
                                    </div>
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
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>

                        <div className="absolute bottom-6 right-6 z-30 font-mono text-[10px] text-white/30 hidden md:block">
                            COORD: {Math.random().toFixed(4)} . {Math.random().toFixed(4)}
                        </div>

                    </div>
                </div>
            </div>

            {/* Visual Manifest - Horizontal Scroll of other artistic shots */}
            <div className="mt-32 max-w-[1920px] mx-auto">
                <div className="flex items-center gap-4 mb-8 px-4 md:px-0 max-w-7xl mx-auto">
                    <div className="h-[1px] bg-white/10 flex-1" />
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">[ VISUAL_MANIFEST ]</span>
                    <div className="h-[1px] bg-white/10 flex-1" />
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar md:justify-center px-6">
                    {[
                        { src: bankingImg, label: "DEFENSE_HK" },
                        { src: loggingImg, label: "DATA_SKIN" },
                        { src: notificationImg, label: "HAZARD_LVL" },
                        { src: storageImg, label: "ORGANIC_SYS" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            whileHover={{ y: -10 }}
                            className="relative min-w-[200px] md:min-w-[250px] aspect-[3/4] rounded-lg overflow-hidden border border-white/5 group cursor-none"
                        >
                            <img src={item.src} alt={item.label} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-[10px] font-mono text-white/40 group-hover:text-emerald-400 transition-colors bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                                    {item.label}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutMeSection;
