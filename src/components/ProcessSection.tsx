import { motion } from "framer-motion";
import { Search, PenTool, Code, Rocket } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";

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
        <section className="py-24 px-6 md:px-12 relative bg-transparent border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        <TextReveal type="blur-reveal">How I Work</TextReveal>
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        A systematic approach to building scalable software, ensuring quality at every step.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, type: "spring", stiffness: 100 }}
                            className="relative z-10"
                        >
                            <div className="w-24 h-24 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 relative group hover:border-white/30 transition-colors">
                                <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                                <step.icon className="w-8 h-8 text-white relative z-10" />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-800 rounded-full border border-white/10 flex items-center justify-center text-xs text-white/50 font-mono">
                                    {i + 1}
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2 text-center md:text-left">{step.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed text-center md:text-left">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
