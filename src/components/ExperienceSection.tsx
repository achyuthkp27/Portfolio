import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/experience";
import { SectionHeader } from "./ui/SectionHeader";
import { DUR, EASE, reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

const VISIBLE = 3;

/** (Experience): one row per role on the light ground, expandable, as the reference lists its news. */
const ExperienceSection = () => {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <section id="experience" className="theme-dark bg-night text-snow relative scroll-mt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-24 lg:py-32">
        <SectionHeader
          label="Experience"
          title="Experience"
          description="Hired at FIS Global, promoted to Senior Software Engineer, then moved with the same platform and team to Cognizant."
        />
        <ol className="border-t border-line">
          {experiences.map((exp, i) => {
            const isOpen = open.includes(i);
            const shown = isOpen ? exp.achievements : exp.achievements.slice(0, VISIBLE);
            const hidden = exp.achievements.length - VISIBLE;
            const panel = `exp-${i}`;
            return (
              <motion.li
                key={exp.company}
                {...reveal()}
                className="border-b border-line py-8 md:py-10 grid md:grid-cols-[10rem_1fr] lg:grid-cols-[14rem_1fr] gap-4 md:gap-10"
              >
                <div>
                  <p className="t-figure text-xs text-muted">
                    <ScrambleNumber value={exp.period} />
                  </p>
                  {exp.platform && <p className="t-caps text-muted mt-2 hidden md:block text-[12px]">Same platform</p>}
                </div>
                <div className="min-w-0">
                  <h3 className="t-heading text-3xl md:text-4xl">{exp.company}</h3>
                  <p className="t-caps text-muted mt-2">{exp.role}</p>
                  <ul id={panel} className="mt-6 space-y-3 max-w-3xl">
                    <AnimatePresence initial={false}>
                      {shown.map((a, j) => (
                        <motion.li
                          key={a}
                          initial={j >= VISIBLE ? { opacity: 0, height: 0 } : false}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: DUR.base, ease: EASE }}
                          className="flex gap-3 t-body text-snow/85 overflow-hidden"
                        >
                          <span className="mt-[0.75em] w-1.5 h-1.5 rounded-full bg-snow shrink-0" aria-hidden="true" />
                          <span>{a}</span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      className="mt-5 text-[13px] font-medium uppercase tracking-[0.03em] text-muted hover:text-snow transition-colors duration-fast"
                    >
                      {isOpen ? "Show less" : `Show ${hidden} more`}
                    </button>
                  )}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {exp.technologies.map((t) => (
                      <li key={t} className="rounded-pill border border-line px-3 py-1 text-[12px] text-snow/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSection;
