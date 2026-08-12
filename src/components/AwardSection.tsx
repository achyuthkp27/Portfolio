import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

/**
 * Recognition + Education as a Squarespace-style card band:
 * warm gradient field, two near-black cards, each with a code-built
 * animated media panel, a caption, and one big line.
 */

// ── Card A media: award wordmark with a periodic shine sweep ─────────

const AwardMedia = () => {
    const reduceMotion = useReducedMotion();
    return (
        <div className="relative h-64 md:h-72 rounded-xl bg-[#101013] border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px]" aria-hidden="true" />

            <div className="relative w-14 h-14 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-400" />
                {!reduceMotion && (
                    <span className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping [animation-duration:3s]" aria-hidden="true" />
                )}
            </div>

            <div className="relative overflow-hidden px-6">
                <div className="font-condensed uppercase text-3xl md:text-4xl tracking-wide text-white text-center leading-none">
                    Above &amp; Beyond
                </div>
                {/* Shine sweep across the wordmark */}
                {!reduceMotion && (
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        initial={{ x: "-120%" }}
                        animate={{ x: "120%" }}
                        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                    />
                )}
            </div>

            <div className="font-mono text-[11px] text-white/40 tracking-[0.25em] uppercase">
                Individual Award · Q1 2024
            </div>
        </div>
    );
};

// ── Card B media: a code editor typing the education story ───────────

const CODE_LINES = [
    'class Engineer extends Graduate {',
    '  foundation = ["DS", "OS", "DBMS"];',
    '  university = "SSIT, Tumakuru";',
    '}  // compiled 2021 · running since',
];
const TYPE_MS = 34;
const LINE_PAUSE = 350;
const LOOP_PAUSE = 3200;

const EducationMedia = () => {
    const reduceMotion = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { margin: "-15%" });
    const [text, setText] = useState(reduceMotion ? CODE_LINES.join("\n") : "");
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (reduceMotion || !inView) return;
        let cancelled = false;
        const timers: ReturnType<typeof setTimeout>[] = [];
        setText("");
        let t = 300;
        let acc = "";
        CODE_LINES.forEach((line) => {
            for (let c = 1; c <= line.length; c++) {
                const snapshot = acc + line.slice(0, c);
                timers.push(setTimeout(() => { if (!cancelled) setText(snapshot); }, t));
                t += TYPE_MS;
            }
            acc += line + "\n";
            t += LINE_PAUSE;
        });
        timers.push(setTimeout(() => { if (!cancelled) setCycle((n) => n + 1); }, t + LOOP_PAUSE));
        return () => { cancelled = true; timers.forEach(clearTimeout); };
    }, [cycle, inView, reduceMotion]);

    return (
        <div ref={ref} className="relative h-64 md:h-72 rounded-xl bg-[#101013] border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)]" aria-hidden="true" />
            <div className="relative z-10 flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-[11px] text-white/40">education.ts</span>
            </div>
            <pre className="relative z-10 p-5 font-mono text-[12px] md:text-[13px] leading-relaxed text-emerald-100/90 whitespace-pre-wrap">
                {text}
                <span className="inline-block w-[7px] h-[14px] bg-emerald-400/80 align-middle ml-0.5 animate-pulse" aria-hidden="true" />
            </pre>
        </div>
    );
};

// ── Band ─────────────────────────────────────────────────────────────

const cardIn = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const AwardSection = () => {
    return (
        <section
            id="awards"
            className="py-20 lg:py-28 px-6 md:px-12 relative overflow-hidden bg-[linear-gradient(165deg,#edf5f0_0%,#d2e5d9_38%,#8fae9e_75%,#42584d_100%)]"
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Recognition card */}
                    <motion.article {...cardIn(0)} className="rounded-[1.75rem] bg-[#0a0a0a] p-5 md:p-6 flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                        <AwardMedia />
                        <div className="text-center px-4 pt-8 pb-6 flex-1 flex flex-col">
                            <h3 className="font-body font-semibold text-white text-sm md:text-base mb-3">
                                Recognition
                            </h3>
                            <p className="font-body font-light text-white/55 text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-8">
                                Above and Beyond Individual Award for outstanding performance
                                on critical banking-platform delivery.
                            </p>
                            <div className="mt-auto font-display font-bold text-white text-xl md:text-2xl tracking-tight">
                                FIS Global · Q1 2024
                            </div>
                        </div>
                    </motion.article>

                    {/* Education card — carries the nav anchor */}
                    <motion.article {...cardIn(0.12)} id="education" className="rounded-[1.75rem] bg-[#0a0a0a] p-5 md:p-6 flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                        <EducationMedia />
                        <div className="text-center px-4 pt-8 pb-6 flex-1 flex flex-col">
                            <h3 className="font-body font-semibold text-white text-sm md:text-base mb-3">
                                Education
                            </h3>
                            <p className="font-body font-light text-white/55 text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-8">
                                B.E. in Computer Science &amp; Engineering,
                                Sri Siddhartha Institute of Technology, Tumakuru.
                            </p>
                            <div className="mt-auto font-display font-bold text-white text-xl md:text-2xl tracking-tight">
                                Class of 2021
                            </div>
                        </div>
                    </motion.article>
                </div>

                <p className="text-center mt-12 font-body text-sm text-emerald-950/70">
                    Five years in production banking — recognized at FIS Global, built on SSIT fundamentals.
                </p>
            </div>
        </section>
    );
};

export default AwardSection;
