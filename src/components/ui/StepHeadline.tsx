import { motion } from "framer-motion";

interface StepHeadlineProps {
  /** Lines in reading order; the last is the point and renders brightest */
  lines: string[];
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** A hairline that draws from left to right as it scrolls into view. */
const Rule = ({ delay }: { delay: number }) => (
  <motion.span
    aria-hidden="true"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-10% 0px" }}
    transition={{ duration: 0.9, ease: EASE, delay }}
    className="block h-px w-full bg-line origin-left"
  />
);

/**
 * A stepped headline the way Spector sets its section titles: one line per rule, each
 * line indented a little further than the last, the early lines grey and the final ones
 * full white, with hairlines between. Each rule draws left to right, then its line rises.
 */
export const StepHeadline = ({ lines, className = "" }: StepHeadlineProps) => {
  const n = lines.length;
  return (
    <div className={className}>
      {lines.map((line, i) => {
        const t = n === 1 ? 1 : i / (n - 1);
        const color = t < 0.34 ? "text-snow/35" : t < 0.67 ? "text-snow/60" : "text-snow";
        return (
          <div key={line}>
            <Rule delay={i * 0.12} />
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.12 }}
              className={`t-statement text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] py-1 md:py-2 ${color}`}
              style={{ paddingLeft: `${Math.min(i * 6, 24)}%` }}
            >
              {line}
            </motion.p>
          </div>
        );
      })}
      <Rule delay={n * 0.12} />
    </div>
  );
};

export default StepHeadline;
