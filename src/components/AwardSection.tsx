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

const SPARKLES = [
    { x: "18%", y: "22%", d: 0.0 }, { x: "82%", y: "18%", d: 1.1 },
    { x: "12%", y: "68%", d: 2.2 }, { x: "88%", y: "62%", d: 0.6 },
    { x: "28%", y: "12%", d: 1.7 }, { x: "72%", y: "78%", d: 2.8 },
];

const AwardMedia = () => {
    const reduceMotion = useReducedMotion();
    return (
        <div className="relative h-56 md:h-64 rounded-xl bg-[#101013] border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-3">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_45%,rgba(16,185,129,0.16),transparent_70%)]" aria-hidden="true" />

            {/* Drifting sparkles */}
            {!reduceMotion && SPARKLES.map((sp, i) => (
                <motion.span
                    key={i}
                    aria-hidden="true"
                    className="absolute w-1 h-1 rounded-full bg-emerald-300/80"
                    style={{ left: sp.x, top: sp.y }}
                    animate={{ opacity: [0, 1, 0], scale: [0.4, 1.15, 0.4], y: [0, -6, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, delay: sp.d, ease: "easeInOut" }}
                />
            ))}

            {/* Self-drawing trophy */}
            <svg viewBox="0 0 100 80" className="w-20 h-16 md:w-24 md:h-20" aria-hidden="true">
                <motion.path
                    d="M32 10 H68 V28 C68 44 60 52 50 52 C40 52 32 44 32 28 Z
                       M32 14 C18 14 18 34 33 36
                       M68 14 C82 14 82 34 67 36
                       M50 52 V62 M38 68 H62 M44 62 H56"
                    fill="none"
                    stroke="rgb(52 211 153)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 1 }}
                    animate={reduceMotion ? {} : { pathLength: [0, 1, 1, 0], opacity: [1, 1, 1, 0.4] }}
                    transition={{ duration: 7, times: [0, 0.3, 0.86, 1], repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>

            {/* Wordmark: letters rise in sync with the trophy draw, then the shine passes */}
            <div className="relative overflow-hidden px-6" role="text" aria-label="Above and Beyond">
                <div className="font-condensed uppercase text-4xl md:text-5xl tracking-wide text-white text-center leading-none" aria-hidden="true">
                    {"ABOVE & BEYOND".split("").map((ch, i) => (
                        <motion.span
                            key={i}
                            className="inline-block"
                            initial={reduceMotion ? {} : { opacity: 0, y: 14 }}
                            animate={reduceMotion ? {} : { opacity: [0, 1, 1, 0.5], y: [14, 0, 0, 0] }}
                            transition={{
                                duration: 7,
                                times: [Math.min(0.1 + i * 0.014, 0.32), Math.min(0.16 + i * 0.014, 0.38), 0.86, 1],
                                repeat: Infinity,
                                ease: "easeOut",
                            }}
                        >
                            {ch === " " ? "\u00A0" : ch}
                        </motion.span>
                    ))}
                </div>
                {!reduceMotion && (
                    <motion.div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ["-120%", "-120%", "120%", "120%"] }}
                        transition={{ duration: 7, times: [0, 0.42, 0.6, 1], repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
            </div>

            {/* Underline draws after the letters land */}
            <motion.div
                className="w-16 h-px bg-emerald-500/60 origin-center"
                initial={reduceMotion ? {} : { scaleX: 0 }}
                animate={reduceMotion ? {} : { scaleX: [0, 0, 1, 1, 0] }}
                transition={{ duration: 7, times: [0, 0.36, 0.46, 0.9, 1], repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
            />
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

// Colorized rendering shown once "compilation" finishes
const COLORED_LINES = [
    (<><span className="text-emerald-400">class</span><span className="text-white/90"> Engineer </span><span className="text-emerald-400">extends</span><span className="text-white/90"> Graduate {'{'}</span></>),
    (<><span className="text-white/90">  foundation = [</span><span className="text-emerald-200/90">"DS"</span><span className="text-white/90">, </span><span className="text-emerald-200/90">"OS"</span><span className="text-white/90">, </span><span className="text-emerald-200/90">"DBMS"</span><span className="text-white/90">];</span></>),
    (<><span className="text-white/90">  university = </span><span className="text-emerald-200/90">"SSIT, Tumakuru"</span><span className="text-white/90">;</span></>),
    (<><span className="text-white/90">{'}'}  </span><span className="text-white/35">{'// compiled 2021 · running since'}</span></>),
];

const EducationMedia = () => {
    const reduceMotion = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { margin: "-15%" });
    const [text, setText] = useState(reduceMotion ? CODE_LINES.join("\n") : "");
    const [compiled, setCompiled] = useState(reduceMotion);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (reduceMotion || !inView) return;
        let cancelled = false;
        const timers: ReturnType<typeof setTimeout>[] = [];
        setText("");
        setCompiled(false);
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
        timers.push(setTimeout(() => { if (!cancelled) setCompiled(true); }, t + 500));
        timers.push(setTimeout(() => { if (!cancelled) setCycle((n) => n + 1); }, t + 500 + LOOP_PAUSE));
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
                    {compiled
                        ? COLORED_LINES.map((jsx, i) => (
                            <span key={i} className="block">
                                <span className="inline-block w-6 text-right mr-3 select-none text-white/20">{i + 1}</span>
                                {jsx}
                            </span>
                        ))
                        : (lines.length ? lines : [""]).map((line, i) => (
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
            {/* Status bar lights up when the "build" finishes */}
            <div className="relative z-10 flex items-center justify-between px-4 py-2 border-t border-white/10 font-mono text-[10px]">
                <span className="text-white/30">typescript</span>
                <motion.span
                    className="flex items-center gap-1.5 text-emerald-400"
                    animate={{ opacity: compiled ? 1 : 0.15 }}
                    transition={{ duration: 0.4 }}
                >
                    <span aria-hidden="true">✓</span> compiled · 0 errors
                </motion.span>
            </div>
        </div>
    );
};

// ── Band ─────────────────────────────────────────────────────────────

const AwardSection = () => {
    return (
        <section
            id="awards"
            className="py-20 lg:py-28 px-6 md:px-12 relative overflow-hidden bg-[radial-gradient(ellipse_90%_55%_at_50%_22%,rgba(16,185,129,0.09),transparent_75%),linear-gradient(180deg,#000000_0%,#060e0a_14%,#0c1712_32%,#0a1a13_55%,#050d09_80%,#000000_100%)]"
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
