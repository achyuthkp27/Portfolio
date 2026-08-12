import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  label: string;
  titleMain: string;
  titleAccent: string;
  description?: string;
  align?: "left" | "center";
  /** "light" flips type dark for warm gradient backgrounds */
  tone?: "dark" | "light";
}

export const SectionHeader = ({ label, titleMain, titleAccent, description, align = "center", tone = "dark" }: SectionHeaderProps) => {
  const isCenter = align === "center";
  const light = tone === "light";

  return (
    <div className={`mb-20 lg:mb-24 flex flex-col ${isCenter ? "items-center text-center" : `md:flex-row md:items-end justify-between border-b ${light ? "border-zinc-900/10" : "border-white/5"} pb-12`} gap-6`}>
      <div className={isCenter ? "" : "flex-1"}>
        <TextReveal type="fade-up">
          <span className={`flex items-center gap-3 mb-8 ${isCenter ? "justify-center" : ""}`}>
            <span className={`w-8 h-px ${light ? "bg-emerald-700/70" : "bg-emerald-500/60"}`} aria-hidden="true" />
            <span className={`text-[11px] font-body font-medium tracking-[0.25em] uppercase ${light ? "text-zinc-800/60" : "text-white/40"}`}>
              {label}
            </span>
          </span>
        </TextReveal>
        <h2 className={`font-display text-4xl md:text-6xl lg:text-7xl font-bold ${light ? "text-zinc-900" : "text-white"} tracking-tighter leading-[1.02]`}>
          <TextReveal type="blur-reveal" delay={0.2} as="span">{titleMain}</TextReveal>
          {" "}
          <TextReveal type="blur-reveal" delay={0.4} as="span" className={light ? "text-zinc-900/40" : "text-white/35"}>{titleAccent}</TextReveal>
        </h2>
      </div>
      {description && (
        <div className={`max-w-sm ${isCenter ? "mt-4" : ""}`}>
          <TextReveal type="fade-up" delay={0.6} className={`text-sm font-body font-light ${light ? "text-zinc-800/70" : "text-white/50"} leading-relaxed ${isCenter ? "" : "text-right"}`}>
            {description}
          </TextReveal>
        </div>
      )}
    </div>
  );
};
