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
 * Recognition + education as a compact card band: emerald-sage field,
 * two near-black cards sized to their content.
 */
const AwardSection = () => (
    <section
        id="awards"
        className="py-20 lg:py-24 px-6 md:px-12 relative bg-[radial-gradient(ellipse_90%_55%_at_50%_30%,rgba(16,185,129,0.09),transparent_75%),linear-gradient(180deg,#000000_0%,#07100b_20%,#0b1711_50%,#07100b_80%,#000000_100%)]"
    >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {CREDENTIALS.map((item, i) => (
                <motion.article
                    key={item.id}
                    id={item.id === "education" ? "education" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-7 md:p-9 flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-white/60">{item.label}</span>
                        <span className="w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/[0.07] flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                        </span>
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white tracking-tight mb-3">{item.title}</h3>
                    <p className="font-body font-light text-white/65 leading-relaxed mb-6">{item.detail}</p>
                    <p className="mt-auto pt-5 border-t border-white/10 font-mono text-sm text-emerald-300/90">{item.meta}</p>
                </motion.article>
            ))}
        </div>
    </section>
);

export default AwardSection;
