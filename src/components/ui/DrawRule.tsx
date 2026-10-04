import { motion } from "framer-motion";
import { DUR, EASE } from "@/lib/motion";

/**
 * A hairline that draws itself in from its origin the first time it comes into view: the
 * short dividers under headings (default, 40px) and the full-width rule above a list.
 */
export const DrawRule = ({
  className = "",
  center = false,
  delay = 0.25,
}: {
  /** Colour, width and spacing; defaults to a 40px hairline */
  className?: string;
  /** Grow from the middle instead of the left */
  center?: boolean;
  delay?: number;
}) => (
  <motion.span
    aria-hidden="true"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: DUR.slow, ease: EASE, delay }}
    className={`block h-px ${center ? "mx-auto origin-center" : "origin-left"} ${className}`}
  />
);

export default DrawRule;
