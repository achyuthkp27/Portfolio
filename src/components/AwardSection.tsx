import { motion, useInView, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Trophy } from "lucide-react";

/** Card that bends toward the cursor with an emerald beam tracing its border on hover. */
const TiltCard = ({ children, id, delay = 0 }: { children: ReactNode; id?: string; delay?: number }) => {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
    const rotateY = useSpring(0, { stiffness: 180, damping: 22 });

    const handleMove = (e: React.MouseEvent) => {
        if (reduceMotion || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotateY.set(px * 7);   // bend toward the cursor
        rotateX.set(-py * 7);
    };
    const handleLeave = () => {
        setHovered(false);
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1200 }}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative rounded-[1.75rem] h-full"
            >
                {/* Border beam — a conic blade spinning behind a 1px gap */}
                <div className={`absolute -inset-px rounded-[1.75rem] overflow-hidden transition-opacity duration-500 ${hovered && !reduceMotion ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
                    <motion.div
                        className="absolute inset-[-100%]"
                        style={{ background: "conic-gradient(from 0deg, transparent 0%, rgba(16,185,129,0.9) 12%, transparent 26%)" }}
                        animate={hovered && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
                        transition={hovered && !reduceMotion ? { duration: 3.2, repeat: Infinity, ease: "linear" } : { duration: 0 }}
                    />
                </div>
                {children}
            </motion.div>
        </motion.div>
    );
};

/**
 * Recognition + Education as a Squarespace-style card band:
 * warm gradient field, two near-black cards, each with a code-built
 * animated media panel, a caption, and one big line.
 */

// ── Card A media: award wordmark with a periodic shine sweep ─────────

const AwardMedia = () => {
    const reduceMotion = useReducedMotion();
    return (
        <div className="relative h-56 md:h-64 rounded-xl bg-[#101013] border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-4">
            {/* Spotlight behind the plaque */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,rgba(16,185,129,0.16),transparent_70%)]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden="true" />

            <div className="relative w-12 h-12 rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-400" />
                {!reduceMotion && (
                    <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3.5s]" aria-hidden="true" />
                )}
            </div>

            <div className="relative overflow-hidden px-6">
                <div className="font-condensed uppercase text-4xl md:text-5xl tracking-wide text-white text-center leading-none">
                    Above &amp; Beyond
                </div>
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

            {/* One quiet subline; the card caption carries the rest */}
            <div className="w-16 h-px bg-emerald-500/40" aria-hidden="true" />
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

    const lines = text.split("\n");
    return (
        <div ref={ref} className="relative h-56 md:h-64 rounded-xl bg-[#101013] border border-white/10 overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.10),transparent_65%)]" aria-hidden="true" />
            <div className="relative z-10 flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="ml-3 font-mono text-[11px] text-white/40">education.ts</span>
            </div>
            <div className="relative z-10 flex-1 flex items-center px-4">
                <pre className="w-full font-mono text-[12px] md:text-[13px] leading-relaxed whitespace-pre-wrap">
                    {(lines.length ? lines : [""]).map((line, i) => (
                        <span key={i} className="block">
                            <span className="inline-block w-6 text-right mr-3 select-none text-white/20">{i + 1}</span>
                            <span className="text-emerald-100/90">{line}</span>
                            {i === lines.length - 1 && (
                                <span className="inline-block w-[7px] h-[14px] bg-emerald-400/80 align-middle ml-0.5 animate-pulse" aria-hidden="true" />
                            )}
                        </span>
                    ))}
                </pre>
            </div>
        </div>
    );
};

// ── Band ─────────────────────────────────────────────────────────────

const AwardSection = () => {
    return (
        <section
            id="awards"
            className="py-20 lg:py-28 px-6 md:px-12 relative overflow-hidden bg-[radial-gradient(ellipse_70%_50%_at_50%_38%,rgba(16,185,129,0.12),transparent_72%),linear-gradient(180deg,#000000_0%,#0c1712_22%,#0a1a13_55%,#050d09_82%,#000000_100%)]"
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Recognition card */}
                    <TiltCard delay={0}>
                    <article className="relative rounded-[1.75rem] bg-[#0a0a0a] border border-white/10 p-5 md:p-6 flex flex-col h-full shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                        <AwardMedia />
                        <div className="text-center px-4 pt-8 pb-6 flex-1 flex flex-col">
                            <h3 className="text-[11px] font-body font-medium tracking-[0.25em] uppercase text-white/40 mb-4">
                                Recognition
                            </h3>
                            <p className="font-body font-light text-white/60 text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-8">
                                Individual award for outstanding performance on
                                critical banking-platform delivery.
                            </p>
                            <div className="mt-auto font-display font-bold text-white text-2xl md:text-3xl tracking-tight">
                                FIS Global <span className="text-emerald-400">·</span> Q1 2024
                            </div>
                        </div>
                    </article>
                    </TiltCard>

                    {/* Education card — carries the nav anchor */}
                    <TiltCard delay={0.12} id="education">
                    <article className="relative rounded-[1.75rem] bg-[#0a0a0a] border border-white/10 p-5 md:p-6 flex flex-col h-full shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                        <EducationMedia />
                        <div className="text-center px-4 pt-8 pb-6 flex-1 flex flex-col">
                            <h3 className="text-[11px] font-body font-medium tracking-[0.25em] uppercase text-white/40 mb-4">
                                Education
                            </h3>
                            <p className="font-body font-light text-white/60 text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-8">
                                B.E. in Computer Science &amp; Engineering,
                                Sri Siddhartha Institute of Technology, Tumakuru.
                            </p>
                            <div className="mt-auto font-display font-bold text-white text-2xl md:text-3xl tracking-tight">
                                Class of <span className="text-emerald-400">2021</span>
                            </div>
                        </div>
                    </article>
                    </TiltCard>
                </div>

                <p className="text-center mt-12 font-body text-sm text-white/40">
                    Five years in production banking — recognized at FIS Global, built on SSIT fundamentals.
                </p>
            </div>
        </section>
    );
};

export default AwardSection;
