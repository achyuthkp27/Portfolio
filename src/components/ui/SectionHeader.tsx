import { motion } from "framer-motion";
import { reveal } from "@/lib/motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Section opener in the reference's voice: a slash label, a condensed uppercase title, an uppercase line. */
export const SectionHeader = ({ label, title, description, align = "left", className = "" }: SectionHeaderProps) => {
  const isCenter = align === "center";
  return (
    <div className={`mb-12 lg:mb-16 ${isCenter ? "flex flex-col items-center text-center" : ""} ${className}`}>
      <motion.p {...reveal()} className="t-label mb-5">
        {label}
      </motion.p>
      <motion.h2
        {...reveal(0.05)}
        className="t-statement text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] text-fg text-balance max-w-4xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p {...reveal(0.1)} className={`t-caps text-muted max-w-md mt-6 ${isCenter ? "text-center" : ""}`}>
          {description}
        </motion.p>
      )}
    </div>
  );
};
