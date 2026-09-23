import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

/**
 * A lanyard badge, drawn in CSS: strap, clip, and a dark card carrying the award, the
 * organisation's mark set in type, and the year. It sways gently once in view.
 */
const Badge = () => (
  <motion.div
    initial={{ rotate: -6, y: -12, opacity: 0 }}
    whileInView={{ rotate: 0, y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-20% 0px" }}
    transition={{ type: "spring", stiffness: 60, damping: 9, mass: 1.1, delay: 0.2 }}
    className="relative w-[210px] md:w-[230px] origin-top will-change-transform"
    aria-hidden="true"
  >
    {/* Strap */}
    <div className="mx-auto w-9 h-24 md:h-28 bg-night rounded-b-sm shadow-[inset_0_0_0_1px_hsl(0_0%_100%/0.08)]" />
    {/* Clip */}
    <div className="relative mx-auto -mt-2 w-10 h-10">
      <div className="absolute inset-0 rounded-full border-[5px] border-night" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-4 bg-night rounded-b-sm" />
    </div>
    {/* Card */}
    <div className="relative mt-1 rounded-lg bg-night text-snow p-5 md:p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] border border-snow/10">
      <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1.5 rounded-pill bg-snow/15" />
      <p className="mt-4 font-body text-[15px] font-semibold leading-tight text-snow/85">
        Above &amp; Beyond
        <br />
        Individual Award
      </p>
      <p className="mt-1 text-[11px] font-medium text-emerald-300">FIS Global · Q1</p>
      <p className="mt-10 t-heading text-4xl tracking-[0.12em] text-snow">FIS</p>
      <p className="t-figure text-[10px] text-muted mt-1">Global</p>
      <p className="mt-8 text-[12px] font-medium text-snow/85">Critical project delivery</p>
      <p className="t-figure text-sm text-muted mt-1">2024</p>
    </div>
  </motion.div>
);

/**
 * (On the record): the award as an emerald card with a hanging badge, beside dated rows,
 * after Spector's recognition block.
 */
const RecordSection = () => {
  const scrollTo = useSectionScroll();
  const rows = PROFILE.record.filter((r) => !r.title.includes("Award"));
  return (
    <section className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader label="On the record" title="Highlights" align="center" />

        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-3 md:gap-4">
          {/* Award card */}
          <motion.div
            {...reveal()}
            data-reveal-skip
            className="relative rounded-lg bg-emerald-400 text-night overflow-hidden md:min-h-[440px] p-7 md:p-10 flex flex-col"
          >
            <div className="md:pr-[250px]">
              <h3 className="t-heading text-4xl md:text-5xl text-night">Above &amp; Beyond Award</h3>
              <p className="mt-4 font-body text-lg md:text-xl font-medium text-night/90">
                Individual recognition, Q1 2024
              </p>
              <p className="mt-6 t-body text-night/75 max-w-sm">
                Given by FIS Global for critical project delivery on the First Citizens Bank platform. One of the
                individual awards for the quarter, not a team credit.
              </p>
              <button
                type="button"
                onClick={() => scrollTo("experience")}
                className="group mt-8 md:mt-auto md:pt-10 inline-flex items-center gap-3 rounded-pill bg-snow text-night px-6 py-3 text-[14px] font-medium self-start whitespace-nowrap hover:bg-stone transition-colors duration-fast"
              >
                See the role{" "}
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="mt-10 flex justify-center md:mt-0 md:block md:absolute md:top-0 md:right-10">
              <Badge />
            </div>
          </motion.div>

          {/* Other rows */}
          <motion.div {...reveal(0.05)} className="rounded-lg bg-tile border border-line p-7 md:p-10">
            <ol className="divide-y divide-line">
              {rows.map((r) => (
                <li key={r.title} className="py-5 md:py-6 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="t-heading text-2xl md:text-3xl">{r.org}</span>
                    <ScrambleNumber value={r.year} className="t-figure text-sm text-muted shrink-0" />
                  </div>
                  <p className="mt-2 t-body text-snow/80">{r.title}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RecordSection;
