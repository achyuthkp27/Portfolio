import { motion } from "framer-motion";
import { PROFILE } from "@/data/profile";
import { PillButton } from "./ui/Pill";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { reveal } from "@/lib/motion";
import ScrambleNumber from "./ui/ScrambleNumber";

/** (By the numbers): a few real counts at wordmark scale, and the invitation. */
const NumbersSection = () => {
  const scrollTo = useSectionScroll();
  return (
    <section id="numbers" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-12 lg:gap-20 items-start">
        <div>
          <motion.p {...reveal()} className="t-label mb-5">
            By the numbers
          </motion.p>
          <motion.p {...reveal(0.05)} className="t-caps text-snow/85 max-w-sm">
            Counts, not claims. Nothing here is a percentage I can't show you.
          </motion.p>
          <motion.div {...reveal(0.1)} className="mt-8">
            <PillButton onClick={() => scrollTo("contact")}>Let's talk</PillButton>
          </motion.div>
        </div>
        <dl className="grid sm:grid-cols-3 gap-8 border-t border-line pt-8">
          {PROFILE.numbers.map((n, i) => (
            <motion.div key={n.label} {...reveal(0.05 * i)}>
              <dd className="t-wordmark text-[5rem] md:text-[6rem]">
                <ScrambleNumber value={n.value.replace(/\D/g, "")} suffix={n.value.replace(/\d/g, "")} />
              </dd>
              <dt className="t-caps text-muted mt-2">{n.label}</dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default NumbersSection;
