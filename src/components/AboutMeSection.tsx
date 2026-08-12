import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";

/**
 * Editorial about: a real bio in prose, backed by a quiet CV-style ledger.
 */

const FACTS: { term: string; detail: string }[] = [
    { term: "Currently", detail: "Associate Software Engineer, Cognizant — First Citizens Bank" },
    { term: "Previously", detail: "FIS Global — Software Engineer → Senior Software Engineer" },
    { term: "Focus", detail: "Banking microservices · payment security · AI integration" },
    { term: "Recognition", detail: "Above & Beyond Individual Award, FIS Global (Q1 2024)" },
    { term: "Education", detail: "B.E. Computer Science, Sri Siddhartha Institute of Technology" },
    { term: "Based in", detail: "Bengaluru, India — 12.9716°N / 77.5946°E" },
];

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
};

const AboutMeSection = () => {
    return (
        <section id="about" className="relative py-20 lg:py-24 px-6 md:px-12 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader
                    label="About"
                    titleMain="The Mind Behind"
                    titleAccent="the Machine"
                    align="left"
                />

                <div className="grid lg:grid-cols-5 gap-14 lg:gap-24 items-start">
                    {/* Bio — written like a person, not a template */}
                    <div className="lg:col-span-3 space-y-7">
                        <motion.p {...fadeUp} transition={{ duration: 0.5 }}
                            className="text-xl md:text-2xl font-body font-light text-white/85 leading-relaxed">
                            I've spent five years inside the systems that move money —
                            the microservices behind retail, mobile, and corporate banking
                            for hundreds of corporate clients.
                        </motion.p>
                        <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }}
                            className="text-base md:text-lg font-body font-light text-white/55 leading-relaxed max-w-2xl">
                            That means work where correctness isn't negotiable: dual-approval
                            controls on financial transactions, card tokenization for Mastercard
                            and Visa, TOTP authentication, and the observability that keeps a
                            30+ service estate debuggable at 2 AM. I started at FIS Global,
                            was promoted to Senior Software Engineer, and moved with the same
                            platform and client to Cognizant.
                        </motion.p>
                        <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.16 }}
                            className="text-base md:text-lg font-body font-light text-white/55 leading-relaxed max-w-2xl">
                            Lately the interesting problems sit where banking meets AI —
                            LLM-powered chatbots that verify who they're talking to, and
                            real-time Video KYC over WebRTC. This site is my sketchbook
                            for the rest.
                        </motion.p>

                        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.24 }}>
                            <button
                                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                className="group inline-flex items-center gap-3 mt-4 text-sm font-body font-medium text-white hover:text-emerald-400 transition-colors"
                            >
                                Get in touch
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Fact ledger */}
                    <motion.dl {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-2 border-t border-white/10">
                        {FACTS.map((fact) => (
                            <div key={fact.term} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 border-b border-white/10 items-baseline">
                                <dt className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/40">{fact.term}</dt>
                                <dd className="text-sm font-body font-light text-white/75 leading-relaxed">{fact.detail}</dd>
                            </div>
                        ))}
                    </motion.dl>
                </div>
            </div>
        </section>
    );
};

export default AboutMeSection;
