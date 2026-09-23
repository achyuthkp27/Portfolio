import { useReducedMotion } from "framer-motion";
import { FillText } from "./ui/FillText";

const LINE = "I build things that still work at 2 AM, when nobody is watching and everything is on the line.";

/**
 * A breath between Work and About: a full-height black screen holding one line that fills
 * in as you scroll through it. Nothing else on the stage (after Mono's vision and text-only heroes).
 */
const FocusSection = () => {
  const reduceMotion = useReducedMotion();
  return (
    <section
      aria-label="A line about how I work"
      className="theme-dark bg-night text-snow relative flex items-center justify-center px-6 md:px-10 lg:px-12"
      style={{ minHeight: reduceMotion ? "60vh" : "100vh" }}
    >
      <div aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 w-px bg-snow/[0.06]" />
      <FillText
        text={LINE}
        className="t-statement text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] text-center text-balance max-w-6xl"
        offset={["start 0.8", "end 0.55"]}
      />
    </section>
  );
};

export default FocusSection;
