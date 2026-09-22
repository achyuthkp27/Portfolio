import { motion } from "framer-motion";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

/** (On the record): dated rows, year, what, where, as the reference lists its awards. */
const RecordSection = () => (
  <section className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
    <div className="max-w-[1400px] mx-auto">
      <SectionHeader label="On the record" title="Highlights" align="center" />
      <ol className="border-t border-line">
        {PROFILE.record.map((r, i) => (
          <motion.li
            key={r.title}
            {...reveal(0.04 * i)}
            className="grid grid-cols-[4rem_1fr] md:grid-cols-[8rem_1fr_16rem] items-baseline gap-4 md:gap-8 py-6 md:py-7 border-b border-line"
          >
            <ScrambleNumber value={r.year} className="t-figure text-sm text-muted" />
            <span className="font-body text-xl md:text-2xl font-medium tracking-[-0.02em] md:text-center">
              {r.title}
            </span>
            <span className="col-start-2 md:col-start-3 t-caps text-muted md:text-right">{r.org}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default RecordSection;
