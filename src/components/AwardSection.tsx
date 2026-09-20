import { motion } from "framer-motion";
import { Award, GraduationCap, type LucideIcon } from "lucide-react";

interface Credential {
    id: string;
    label: string;
    icon: LucideIcon;
    title: string;
    detail: string;
    meta: string;
}

const CREDENTIALS: Credential[] = [
    {
        id: "recognition",
        label: "Recognition",
        icon: Award,
        title: "Above & Beyond Individual Award",
        detail: "For outstanding performance on critical banking-platform delivery.",
        meta: "FIS Global · Q1 2024",
    },
    {
        id: "education",
        label: "Education",
        icon: GraduationCap,
        title: "B.E. Computer Science & Engineering",
        detail: "Sri Siddhartha Institute of Technology, Tumakuru.",
        meta: "Class of 2021",
    },
];

/**
 * Two facts that need stating once and then getting out of the way: a single record
 * with one row each, rather than two cards competing with the case studies above.
 */
const AwardSection = () => (
    <section
        id="awards"
        className="py-20 lg:py-24 px-6 md:px-12 relative bg-[radial-gradient(ellipse_90%_55%_at_50%_30%,rgba(16,185,129,0.09),transparent_75%),linear-gradient(180deg,#000000_0%,#07100b_20%,#0b1711_50%,#07100b_80%,#000000_100%)]"
    >
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#0a0a0a]/80 shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-hidden"
        >
            <p className="px-6 md:px-9 py-4 border-b border-white/10 font-mono text-[11px] tracking-[0.18em] uppercase text-white/45">
                On the record
            </p>

            <dl>
                {CREDENTIALS.map((item, i) => (
                    <div
                        key={item.id}
                        id={item.id === "education" ? "education" : undefined}
                        className={`group grid grid-cols-1 md:grid-cols-[10rem_1fr_auto] gap-x-8 gap-y-3 items-baseline px-6 md:px-9 py-7 md:py-8 scroll-mt-28 ${
                            i > 0 ? "border-t border-white/10" : ""
                        }`}
                    >
                        <dt className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-emerald-400/80 shrink-0" aria-hidden="true" />
                            <span className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/55">
                                {item.label}
                            </span>
                        </dt>

                        <dd className="min-w-0">
                            <span className="block font-display text-lg md:text-xl font-semibold text-white tracking-tight">
                                {item.title}
                            </span>
                            <span className="block mt-1.5 font-body font-light text-white/60 leading-relaxed">{item.detail}</span>
                        </dd>

                        <dd className="font-mono text-xs md:text-sm text-emerald-300/85 md:text-right whitespace-nowrap">
                            {item.meta}
                        </dd>
                    </div>
                ))}
            </dl>
        </motion.div>
    </section>
);

export default AwardSection;
