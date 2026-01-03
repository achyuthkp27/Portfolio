import { motion } from "framer-motion";
import TextReveal from "./ui/TextReveal";

const PhilosophySection = () => {
    return (
        <section className="py-32 px-6 md:px-12 relative overflow-hidden bg-black flex flex-col justify-center items-center min-h-[60vh]">
            {/* Top Status Bar - Centered */}
            <div className="absolute top-20 left-0 w-full flex justify-center">
                <TextReveal type="fade-up" delay={0.2}>
                    <div className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/40 flex items-center gap-4">
                        <span>ACCESS</span>
                        <span className="text-white/20">{'>>'}</span>
                        <span>INTO</span>
                        <span className="text-white/20">_</span>
                        <span className="text-white">AKP</span>
                        <span className="text-white/20">[25]</span>
                        <span>IS</span>
                        <span className="text-white/20">_</span>
                        <span>PENDING</span>
                        <span className="text-white/20">[!]</span>
                        <span>VALIDATION</span>
                    </div>
                </TextReveal>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center md:text-left">
                <TextReveal type="scrub" className="font-display text-2xl md:text-3xl lg:text-5xl font-light leading-tight text-white/40">
                    Every line of code is <span className="text-white">cultivated with intention</span>. Each architecture is personal, each experience designed as if it were singular. I seek <span className="text-white">no comfort in numbers</span>, only in the <span className="text-white">precision of quality</span>.
                </TextReveal>

                <div className="mt-12 text-center md:text-left">
                    <TextReveal type="fade-up" delay={0.4} className="text-sm md:text-base font-mono text-gray-500 tracking-wide">
                        One mind aligned with purpose surpasses any algorithm without direction.
                    </TextReveal>
                </div>
            </div>

            {/* Two-Column Manifesto Section */}
            <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-2 gap-16 items-start w-full">
                {/* Left Column */}
                <TextReveal type="fade-up" delay={0.2}>
                    <h3 className="font-display text-5xl md:text-7xl font-bold leading-tight text-white/40">
                        Unseen <br />
                        <span className="text-white">Complexity.</span>
                    </h3>
                </TextReveal>

                {/* Right Column */}
                <div className="space-y-8">
                    <TextReveal type="fade-up" delay={0.4}>
                        <h3 className="font-display text-5xl md:text-7xl font-bold leading-tight text-white">
                            Institutional-<br />
                            Grade Systems.
                        </h3>
                    </TextReveal>

                    <TextReveal type="fade-up" delay={0.6} className="text-lg md:text-xl text-white/60 leading-relaxed max-w-lg">
                        <span className="block mb-6 border-l-2 border-white/20 pl-6">
                            Standard solutions were designed to suffice, even those widely adopted. Downtime, latency & security gaps were once the norm.
                        </span>
                        <span>
                            I <span className="line-through text-white/30 decoration-white/30">maintain</span> <span className="text-white font-bold">rewrite</span> the standards once taken for granted.
                        </span>
                    </TextReveal>

                    <TextReveal type="fade-up" delay={0.8} className="pt-12 border-t border-white/10">
                        <p className="text-[10px] md:text-xs font-mono tracking-[0.1em] text-white/40 uppercase leading-loose">
                            THROUGH DISTRIBUTED SYSTEMS, SECURE KAFKA PIPELINES, AND THE POWER OF SPRING BOOT, EVERY TRANSACTION IS FAST, SECURE, AND BUILT FOR SCALE.
                        </p>
                    </TextReveal>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-32 relative z-10 text-center md:text-left">
                <TextReveal
                    type="scrub"
                    className="font-display text-2xl md:text-3xl lg:text-5xl font-light leading-tight text-white/40"
                    scrollOffset={["start 0.6", "start 0.2"]}
                >
                    Every line of code I write reflects a future I believe in.
                    Each architecture is a statement of intent—shaped, not rushed.
                    I don't measure impact by volume, but by clarity, precision,
                    and the intelligence that guides the system forward.
                    I build for a world where human vision and Gen AI evolve together.
                </TextReveal>
            </div>
        </section>
    );
};

export default PhilosophySection;
