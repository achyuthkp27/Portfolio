import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/** Section opener: a quiet label, one plain headline, optional supporting line. */
export const SectionHeader = ({ label, title, description, align = "left" }: SectionHeaderProps) => {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-14 lg:mb-20 flex flex-col gap-6 ${
        isCenter ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className={isCenter ? "max-w-3xl" : "max-w-3xl flex-1"}>
        <span className={`flex items-center gap-3 mb-6 ${isCenter ? "justify-center" : ""}`}>
          <span className="w-8 h-px bg-emerald-500/70" aria-hidden="true" />
          <span className="text-xs font-body font-medium tracking-[0.2em] uppercase text-white/65">{label}</span>
        </span>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.08] text-balance">
          {title}
        </h2>
      </motion.div>
      {description && (
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`max-w-sm text-sm md:text-base font-body font-light text-white/65 leading-relaxed ${
            isCenter ? "" : "md:text-right"
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
