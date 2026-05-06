import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Search, PenTool, Code, Rocket, ChevronRight } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import { SectionHeader } from "./ui/SectionHeader";
import SpotlightCard from "./ui/SpotlightCard";

const steps = [
    {
        icon: Search,
        title: "Discovery",
        number: "01",
        desc: "Understanding requirements, architecture planning, and feasibility analysis.",
        details: [
            "Stakeholder interviews & requirement gathering",
            "Technical feasibility assessment",
            "Architecture decision records (ADRs)",
            "Risk analysis & mitigation planning"
        ],
        accentColor: "emerald",
    },
    {
        icon: PenTool,
        title: "Design",
        number: "02",
        desc: "System design, database schema, and UI/UX prototyping.",
        details: [
            "Entity-relationship modeling",
            "API contract design & documentation",
            "Wireframing & interactive prototypes",
            "Design system & component library"
        ],
        accentColor: "blue",
    },
    {
        icon: Code,
        title: "Development",
        number: "03",
        desc: "Agile implementation with TDD, code reviews, and continuous integration.",
        details: [
            "Test-driven development methodology",
            "Peer code reviews & pair programming",
            "CI/CD pipeline integration",
            "Performance profiling & optimization"
        ],
        accentColor: "purple",
    },
    {
        icon: Rocket,
        title: "Deployment",
        number: "04",
        desc: "Automated pipelines, cloud infrastructure setup, and monitoring.",
        details: [
            "Infrastructure as Code (Terraform/CDK)",
            "Blue-green deployment strategies",
            "Observability stack (logs, metrics, traces)",
            "Post-launch monitoring & alerting"
        ],
        accentColor: "amber",
    }
];

const accentMap: Record<string, { border: string; bg: string; text: string; glow: string; dot: string; line: string }> = {
    emerald: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
        dot: "bg-emerald-500",
        line: "from-emerald-500/50",
    },
    blue: {
        border: "border-blue-500/30",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        glow: "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
        dot: "bg-blue-500",
        line: "from-blue-500/50",
    },
    purple: {
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
        dot: "bg-purple-500",
        line: "from-purple-500/50",
    },
    amber: {
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
        dot: "bg-amber-500",
        line: "from-amber-500/50",
    },
};

const ProcessSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="process" className="py-24 px-6 md:px-12 relative bg-transparent" ref={ref}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-16"> {/* Removed TextReveal from here */}
                    <SectionHeader 
                        label="[ SYSTEM_WORKFLOW ]" 
                        titleMain="How I" 
                        titleAccent="Work" 
                        align="left"
                    />
                    <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
                        A systematic approach to building scalable software, ensuring quality at every step.
                    </p>
                </div>

                {/* Desktop: Interactive horizontal timeline */}
                <div className="hidden md:block">
                    {/* Timeline connector line */}
                    <div className="relative mb-8">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />
                        {/* Animated fill */}
                        <motion.div
                            className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-emerald-500/50 via-blue-500/50 to-purple-500/50 -translate-y-1/2"
                            initial={{ width: "0%" }}
                            animate={isInView ? { width: "100%" } : {}}
                            transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                        {/* Step dots on timeline */}
                        <div className="relative flex justify-between">
                            {steps.map((step, i) => {
                                const accent = accentMap[step.accentColor];
                                const isHovered = hoveredIndex === i;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ delay: 0.5 + i * 0.2, duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className={`relative w-5 h-5 rounded-full border-2 ${isHovered ? accent.border : 'border-white/20'} transition-all duration-500 flex items-center justify-center ${isHovered ? accent.glow : ''}`}>
                                            <div className={`w-2 h-2 rounded-full ${isHovered ? accent.dot : 'bg-white/30'} transition-colors duration-500`} />
                                            {isHovered && (
                                                <motion.div
                                                    className={`absolute inset-0 rounded-full ${accent.dot} opacity-30`}
                                                    initial={{ scale: 1 }}
                                                    animate={{ scale: 2.5, opacity: 0 }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cards grid */}
                    <div className="grid md:grid-cols-4 gap-6">
                        {steps.map((step, i) => {
                            const accent = accentMap[step.accentColor];
                            const isHovered = hoveredIndex === i;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                                    className="relative z-10 h-full"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <SpotlightCard className={`h-full bg-black/40 ${isHovered ? accent.border : 'border-white/10'} transition-all duration-500 group`}>
                                        <div className="h-full p-8 flex flex-col items-center text-center relative overflow-hidden">
                                            {/* Background gradient bloom */}
                                            <div className={`absolute inset-0 ${accent.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                                            {/* Step number watermark */}
                                            <div className="absolute -top-2 -right-2 text-[80px] font-display font-bold text-white/[0.03] pointer-events-none select-none leading-none">
                                                {step.number}
                                            </div>

                                            {/* Icon with glow halo */}
                                            <div className={`relative w-20 h-20 bg-black border ${isHovered ? accent.border : 'border-white/10'} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 z-20 ${isHovered ? accent.glow : ''}`}>
                                                <div className={`absolute inset-0 rounded-2xl ${accent.bg} scale-0 group-hover:scale-100 transition-transform duration-500`} />
                                                <step.icon className={`w-7 h-7 ${isHovered ? accent.text : 'text-white'} relative z-10 transition-colors duration-500`} />
                                                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 rounded-full border ${isHovered ? accent.border : 'border-white/10'} flex items-center justify-center text-[10px] ${isHovered ? accent.text : 'text-white/50'} font-mono transition-all duration-500`}>
                                                    {i + 1}
                                                </div>
                                            </div>

                                            <h3 className="text-white font-bold text-lg mb-2 relative z-10">{step.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed mb-4 relative z-10">
                                                {step.desc}
                                            </p>

                                            {/* Expandable details on hover */}
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: isHovered ? "auto" : 0,
                                                    opacity: isHovered ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden w-full relative z-10"
                                            >
                                                <div className="pt-4 border-t border-white/10 space-y-2">
                                                    {step.details.map((detail, j) => (
                                                        <motion.div
                                                            key={j}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                                            transition={{ delay: j * 0.05, duration: 0.3 }}
                                                            className="flex items-start gap-2 text-left"
                                                        >
                                                            <ChevronRight className={`w-3 h-3 mt-0.5 ${accent.text} shrink-0`} />
                                                            <span className="text-[11px] text-gray-400 leading-relaxed">{detail}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile: Vertical timeline */}
                <div className="md:hidden space-y-6 relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10">
                        <motion.div
                            className="w-full bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-purple-500/50"
                            initial={{ height: "0%" }}
                            animate={isInView ? { height: "100%" } : {}}
                            transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>

                    {steps.map((step, i) => {
                        const accent = accentMap[step.accentColor];
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                                className="relative pl-16"
                            >
                                {/* Timeline dot */}
                                <div className={`absolute left-[18px] top-8 w-4 h-4 rounded-full border-2 ${accent.border} flex items-center justify-center z-10`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                                </div>

                                <SpotlightCard className="bg-black/40 border-white/10 hover:border-white/20 transition-colors group">
                                    <div className="p-6 relative overflow-hidden">
                                        <div className={`absolute inset-0 ${accent.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                                        <div className="flex items-center gap-3 mb-3 relative z-10">
                                            <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.border} border flex items-center justify-center`}>
                                                <step.icon className={`w-5 h-5 ${accent.text}`} />
                                            </div>
                                            <div>
                                                <span className={`text-[10px] font-mono ${accent.text} tracking-widest`}>{step.number} //</span>
                                                <h3 className="text-white font-bold">{step.title}</h3>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed relative z-10">
                                            {step.desc}
                                        </p>
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

export default ProcessSection;
