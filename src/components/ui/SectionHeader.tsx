import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  label: string;
  titleMain: string;
  titleAccent: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeader = ({ label, titleMain, titleAccent, description, align = "center" }: SectionHeaderProps) => {
  const isCenter = align === "center";

  return (
    <div className={`mb-20 lg:mb-24 flex flex-col ${isCenter ? "items-center text-center" : "md:flex-row md:items-end justify-between border-b border-white/5 pb-12"} gap-6`}>
      <div className={isCenter ? "" : "flex-1"}>
        <TextReveal type="fade-up">
          <span className={`flex items-center gap-3 mb-8 ${isCenter ? "justify-center" : ""}`}>
            <span className="w-8 h-px bg-emerald-500/60" aria-hidden="true" />
            <span className="text-[11px] font-body font-medium tracking-[0.25em] uppercase text-white/40">
              {label}
            </span>
          </span>
        </TextReveal>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.95]">
          <TextReveal type="blur-reveal" delay={0.2} as="span">{titleMain}</TextReveal>
          {isCenter ? <br/> : " "}
          <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/35">{titleAccent}</TextReveal>
        </h2>
      </div>
      {description && (
        <div className={`max-w-sm ${isCenter ? "mt-4" : ""}`}>
          <TextReveal type="fade-up" delay={0.6} className={`text-sm font-body font-light text-white/50 leading-relaxed ${isCenter ? "" : "text-right"}`}>
            {description}
          </TextReveal>
        </div>
      )}
    </div>
  );
};
