import { motion, useSpring, useMotionTemplate, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import TextReveal from "./ui/TextReveal";
import { ArrowRight, Code, Cpu, Palette, Server, Cloud, Zap, Globe, Award, TrendingUp } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import type { LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type PersonaId = "human" | "operator" | "creator";

interface Persona {
    id: PersonaId;
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
    gradientVia: string;
    glowBg: string;
    ringBorder: string;
    keywords: string[];
}

interface Stat {
    value: string;
    label: string;
    icon: LucideIcon;
}

interface Highlight {
    icon: LucideIcon;
    label: string;
    value: string;
}

// ─────────────────────────────────────────────
// Static Data (extracted outside component to avoid re-creation on every render)
// ─────────────────────────────────────────────

const PERSONAS: Persona[] = [
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
        keywords: ["EMPATHY", "CURIOSITY", "COLLABORATION", "LEARNING"],
    },
    {
        id: "operator",
        title: "THE OPERATOR_CORE",
        subtitle: "Banking Systems Engineer",
        description: "Five years inside regulated banking platforms — microservices, Kafka event streams, payment security, and the production discipline that keeps money moving safely.",
        icon: Cpu,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        gradientVia: "via-blue-400",
        glowBg: "bg-blue-400",
        ringBorder: "border-blue-400",
        keywords: ["ARCHITECTURE", "SCALABILITY", "INFRASTRUCTURE", "SECURITY"],
    },
    {
        id: "creator",
        title: "THE BUILDER_NODE",
        subtitle: "Maker of Systems",
        description: "Building beyond the day job — LLM-powered banking chatbots, real-time Video KYC over WebRTC, and this site. Curiosity compiled into shipped things.",
        icon: Palette,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        gradientVia: "via-orange-400",
        glowBg: "bg-orange-400",
        ringBorder: "border-orange-400",
        keywords: ["AI_INTEGRATION", "REAL-TIME", "SIDE_PROJECTS", "SHIPPING"],
    },
];

const STATS: Stat[] = [
    { value: "5+", label: "YEARS_IN_BANKING", icon: TrendingUp },
    { value: "30+", label: "SERVICE_ESTATE", icon: Globe },
    { value: "3", label: "BANKING_CHANNELS", icon: Award },
];

const HIGHLIGHTS: Highlight[] = [
    { icon: Code, label: "ARCHITECTURE", value: "CLEAN_CODE" },
    { icon: Server, label: "EVENT_DRIVEN", value: "KAFKA" },
    { icon: Cloud, label: "AWS_&_DOCKER", value: "CLOUD_NATIVE" },
    { icon: Zap, label: "PCI-DSS_/_SOX", value: "COMPLIANCE" },
];

// ─────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────

/** Clickable persona selector card with active/inactive states and animated glow bar. */
const PersonaCard = ({
    persona,
    isActive,
    index,
    onClick,
}: {
    persona: Persona;
    isActive: boolean;
    index: number;
    onClick: () => void;
}) => {
    const Icon = persona.icon;

    return (
        <motion.button
            type="button"
            key={persona.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            aria-pressed={isActive}
            className={`group relative w-full text-left p-6 cursor-pointer border transition-all duration-500 rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/60 ${
                isActive
                    ? `${persona.bg} ${persona.border}`
                    : "bg-white/5 border-white/5 hover:border-white/10"
            }`}
        >
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <h3
                        className={`font-display text-lg font-bold mb-1 transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/60 group-hover:text-white"
                        }`}
                    >
                        {persona.title}
                    </h3>
                    <p
                        className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
                            isActive ? persona.color : "text-white/30"
                        }`}
                    >
                        {persona.subtitle}
                    </p>
                </div>
                <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                        isActive ? persona.color : "text-white/20 group-hover:text-white/40"
                    }`}
                />
            </div>

            {/* Animated glow bar for active state */}
            {isActive && (
                <motion.div
                    layoutId="activeGlow"
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent ${persona.gradientVia} to-transparent opacity-50`}
                />
            )}
        </motion.button>
    );
};

/** Animated persona display inside the visual showcase panel. */
const PersonaShowcase = ({
    persona,
    isActive,
}: {
    persona: Persona;
    isActive: boolean;
}) => {
    const Icon = persona.icon;

    return (
        <motion.div
            key={persona.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 0.95,
                zIndex: isActive ? 10 : 0,
            }}
            transition={{ duration: 0.5 }}
            aria-hidden={!isActive}
            style={{ visibility: isActive ? "visible" : "hidden" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none"
        >
            {/* Glowing background effect */}
            <div className={`absolute inset-0 opacity-10 blur-[120px] transition-opacity duration-1000 ${persona.glowBg}`} />

            {/* Persona icon with animated rings */}
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: isActive ? 0 : 20 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mb-10 bg-black/80 backdrop-blur-md overflow-hidden"
            >
                <div className={`absolute inset-0 border ${persona.ringBorder} rounded-full opacity-10 animate-[ping_4s_linear_infinite]`} />
                <div className={`absolute inset-4 border ${persona.ringBorder} rounded-full opacity-20 animate-[spin_15s_linear_infinite] border-dashed`} />
                <Icon className={`w-14 h-14 ${persona.color}`} />
            </motion.div>

            {/* Persona content */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative z-10 w-full"
            >
                <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
                    {persona.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-[300px] mx-auto font-light">
                    {persona.description}
                </p>

                {/* Keywords grid */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-[300px] mx-auto">
                    {persona.keywords.map((keyword) => (
                        <div
                            key={keyword}
                            className="border border-white/5 bg-white/[0.02] rounded-lg px-2 py-3 text-[10px] font-mono text-white/55 tracking-[0.2em] group-hover:text-white transition-colors uppercase"
                        >
                            {keyword}
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

/** Single stat cell for the bottom metrics grid. */
const StatBlock = ({ stat }: { stat: Stat }) => {
    const Icon = stat.icon;
    return (
        <div className="p-6 md:p-8 bg-black/40 border-b md:border-b-0 border-r border-white/5 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors relative">
            <Icon className="w-5 h-5 text-white/10 group-hover:text-emerald-500 transition-colors mb-6 md:mb-8" />
            <div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 tracking-tighter">
                    {stat.value}
                </div>
                <div className="text-[10px] md:text-[10px] font-mono text-white/50 group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                    {stat.label}
                </div>
            </div>
        </div>
    );
};

/** Single highlight cell for the bottom metrics grid. */
const HighlightBlock = ({ item }: { item: Highlight }) => {
    const Icon = item.icon;
    return (
        <div className="p-6 md:p-8 bg-black/60 border-l border-white/5 hover:bg-white/[0.02] transition-colors group flex flex-col items-center text-center justify-center">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white/20 group-hover:text-emerald-400 transition-colors mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
            <div className="text-[10px] md:text-[10px] font-display font-bold text-white mb-1 uppercase tracking-tight">
                {item.value}
            </div>
            <div className="text-[10px] md:text-[10px] font-mono text-white/50 uppercase tracking-widest leading-none">
                {item.label}
            </div>
            {/* Hover line effect */}
            <div className="mt-4 w-3 md:w-4 h-px bg-white/10 group-hover:w-8 group-hover:bg-emerald-500 transition-all" />
        </div>
    );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const AboutMeSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const showcaseRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const [activePersona, setActivePersona] = useState<PersonaId>("human");

    // Mouse tracking for flashlight / magnetic effect
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });
    const rectRef = useRef<DOMRect | null>(null);

    const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
        if (!showcaseRef.current) return;
        
        if (!rectRef.current) {
            rectRef.current = showcaseRef.current.getBoundingClientRect();
        }
        
        const { left, top } = rectRef.current;
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    useEffect(() => {
        const resetRect = () => { rectRef.current = null; };
        window.addEventListener("resize", resetRect);
        window.addEventListener("scroll", resetRect, { passive: true });
        return () => {
            window.removeEventListener("resize", resetRect);
            window.removeEventListener("scroll", resetRect);
        };
    }, []);

    const handlePersonaClick = (id: PersonaId) => {
        setActivePersona(id);
        if (window.innerWidth < 1024 && showcaseRef.current) {
            showcaseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const flashlightStyle = shouldReduceMotion ? {} : { maskImage, WebkitMaskImage: maskImage };


    return (
        <section ref={containerRef} id="about" className="relative py-20 lg:py-24 px-6 md:px-12 bg-transparent overflow-hidden">
            {/* Background gradient blob */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="mb-16 lg:mb-24 md:flex justify-between items-end">
                    <div className="max-w-2xl"> {/* Removed TextReveal from here */}
                        <SectionHeader 
                            label="[ IDENTITY_MATRIX_V4.0 ]" 
                            titleMain="The Mind Behind" 
                            titleAccent="the Machine" 
                            align="left"
                        />
                    </div>
                    <div className="hidden md:block mb-4">
                        <div className="flex gap-4 text-white/40 text-[10px] font-mono font-bold tracking-widest">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                SYS_STATUS: ONLINE
                            </span>
                            <span className="opacity-20">|</span>
                            <span>PCI-DSS // SOX</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-start mb-32">

                    {/* Left Column — Persona Selector */}
                    <div className="space-y-4 sticky top-32 order-2 lg:order-1">
                        {PERSONAS.map((persona, index) => (
                            <PersonaCard
                                key={persona.id}
                                persona={persona}
                                isActive={activePersona === persona.id}
                                index={index}
                                onClick={() => handlePersonaClick(persona.id)}
                            />
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

                    {/* Right Column — Visual Showcase */}
                    <div
                        ref={showcaseRef}
                        className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-3xl overflow-hidden border border-white/10 bg-black/40 order-1 lg:order-2 flex items-center justify-center p-6 shadow-2xl"
                        onMouseMove={handleMouseMove}
                    >
                        <div className="absolute inset-0 grid-pattern opacity-10" />

                        {/* Persona display stack */}
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            {PERSONAS.map((persona) => (
                                <PersonaShowcase
                                    key={persona.id}
                                    persona={persona}
                                    isActive={activePersona === persona.id}
                                />
                            ))}
                        </div>

                        {/* Flashlight layer */}
                        <motion.div
                            className="absolute inset-0 z-20 pointer-events-none bg-white/5 opacity-0 group-hover:opacity-100 mix-blend-overlay"
                            style={flashlightStyle}
                        />

                        {/* Location readout — real coordinates, Bengaluru */}
                        <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="font-mono text-[10px] text-emerald-500/70 uppercase tracking-widest">BENGALURU // IST</span>
                        </div>
                        <div className="absolute bottom-8 right-8 z-30 font-mono text-[10px] text-white/40">
                            12.9716°N // 77.5946°E
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Mission Metrics & Engineering Directives */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden mt-20">
                    {/* Stats (LHS) */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3">
                        {STATS.map((stat) => (
                            <StatBlock key={stat.label} stat={stat} />
                        ))}
                    </div>

                    {/* Technical Highlights (RHS) */}
                    <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 lg:grid-cols-4">
                        {HIGHLIGHTS.map((item) => (
                            <HighlightBlock key={item.label} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMeSection;
