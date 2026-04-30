import { motion } from "framer-motion";
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
    <div className={`mb-24 flex flex-col ${isCenter ? "items-center text-center" : "md:flex-row md:items-end justify-between border-b border-white/5 pb-12"} gap-6`}>
      <div className={isCenter ? "" : "flex-1"}>
        <TextReveal type="fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400 border border-emerald-500/20 mb-6 bg-emerald-500/5">
            {label}
          </span>
        </TextReveal>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter uppercase leading-none">
          <TextReveal type="blur-reveal" delay={0.2} as="span">{titleMain}</TextReveal>
          {isCenter ? <br/> : " "}
          <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">{titleAccent}</TextReveal>
        </h2>
      </div>
      {description && (
        <div className={`max-w-xs ${isCenter ? "mt-6" : "text-right"}`}>
          <TextReveal type="fade-up" delay={0.6} className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] leading-relaxed">
            {description}
          </TextReveal>
        </div>
      )}
    </div>
  );
};