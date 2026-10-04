import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { experiences } from "@/data/experience";
import { DUR, EASE, reveal } from "@/lib/motion";
import { AwardCard } from "./ui/AwardCard";
import { PROFILE } from "@/data/profile";
import { DASH, StackCard, StackTile } from "./ui/StackCard";

const VISIBLE = 3;
const base = import.meta.env.BASE_URL;

/**
 * (Experience), in the same card stack as What I build: a short header, then one card per
 * role and one for education on a dashed three-column grid — period and company, the
 * company's mark (and the award, in the role that earned it), then the role, highlights and
 * stack. Each card pins under the nav and the next slides up over it. Pure CSS sticky:
 * nothing lags behind a fast scroll, and phones flow normally.
 */
const ExperienceSection = () => {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <section id="experience" className="theme-dark text-snow relative scroll-mt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-24 lg:pt-32 pb-16 lg:pb-20">
        <motion.p {...reveal()} className="t-label mb-10 lg:mb-14">
          Experience
        </motion.p>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-end">
          <motion.h2 {...reveal(0.05)} className="t-statement text-5xl md:text-7xl lg:text-[5.5rem]">
            Five years,
            <br />
            one platform.
          </motion.h2>
          <motion.p
            {...reveal(0.1)}
            className="t-body text-snow/60 text-[17px] md:text-[19px] max-w-md lg:justify-self-end"
          >
            Hired at FIS Global, recognised with an individual award, promoted to Senior Software Engineer, then{" "}
            <span className="text-snow">moved with the same platform and team to Cognizant</span>.
          </motion.p>
        </div>
      </div>

      <ol>
        {experiences.map((exp, i) => {
          const isOpen = open.includes(i);
          const shown = isOpen ? exp.achievements : exp.achievements.slice(0, VISIBLE);
          const hidden = exp.achievements.length - VISIBLE;
          const panel = `exp-${i}`;
          return (
            <StackCard key={exp.company} index={i}>
              {/* Period and company */}
              <div className={`p-6 md:p-10 lg:py-16 lg:border-r ${DASH}`}>
                <p className="t-figure text-[12px] text-muted">{exp.period}</p>
                <h3 className="mt-3 font-body font-medium tracking-[-0.03em] leading-[1.05] text-[2.25rem] md:text-[2.75rem]">
                  {exp.company}
                </h3>
                {exp.platform && <p className="mt-3 t-figure text-[12px] text-emerald-300">{exp.platform}</p>}
              </div>

              {/* The company's mark, or the award in the role that earned it */}
              <div className={`px-6 md:px-10 lg:px-0 lg:border-r ${DASH}`}>
                <div className="lg:mt-16">
                  {exp.award ? (
                    <AwardCard />
                  ) : (
                    <StackTile>
                      {exp.logo ? (
                        <img
                          src={`${base}${exp.logo.dark ?? exp.logo.src}`}
                          alt={`${exp.company} logo`}
                          width={exp.logo.width}
                          height={exp.logo.height}
                          loading="lazy"
                          decoding="async"
                          className={`relative w-[55%] max-w-[220px] h-auto ${exp.logo.dark ? "" : "brightness-0 invert"}`}
                        />
                      ) : (
                        <span className="relative t-heading text-4xl text-snow/80">{exp.company.split(" ")[0]}</span>
                      )}
                    </StackTile>
                  )}
                </div>
              </div>

              {/* Role, highlights and stack */}
              <div className="p-6 md:p-10 lg:py-16">
                <p className="t-figure text-[12px] text-muted">Role</p>
                <p className="mt-3 text-[19px] md:text-[21px] leading-snug text-snow">{exp.role}</p>
                <ul id={panel} className="mt-6 space-y-3">
                  <AnimatePresence initial={false}>
                    {shown.map((a, j) => (
                      <motion.li
                        key={a}
                        initial={j >= VISIBLE ? { opacity: 0, y: 6 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4, transition: { duration: DUR.fast } }}
                        transition={{ duration: DUR.base, ease: EASE, delay: (j - VISIBLE) * 0.03 }}
                        className="flex gap-3 text-[15px] leading-relaxed text-snow/75"
                      >
                        <span className="mt-[0.7em] w-1 h-1 rounded-full shrink-0 bg-emerald-400" aria-hidden="true" />
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
                    className="mt-1 py-3 text-[13px] font-medium uppercase tracking-[0.03em] text-muted hover:text-snow transition-colors duration-fast"
                  >
                    {isOpen ? "Show less" : `Show ${hidden} more`}
                  </button>
                )}
                <ul className="mt-6 flex flex-wrap gap-2">
                  {exp.technologies.map((t) => (
                    <li key={t} className="rounded-pill border border-line px-3 py-1 text-[12px] text-snow/75">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </StackCard>
          );
        })}

        {/* Education closes the stack */}
        <StackCard index={experiences.length}>
          <div className={`p-6 md:p-10 lg:py-16 lg:border-r ${DASH}`}>
            <p className="t-figure text-[12px] text-muted">{PROFILE.education.year}</p>
            <h3 className="mt-3 font-body font-medium tracking-[-0.03em] leading-[1.05] text-[2.25rem] md:text-[2.75rem]">
              Education
            </h3>
          </div>
          <div className={`px-6 md:px-10 lg:px-0 lg:border-r ${DASH}`}>
            <div className="lg:mt-16">
              <StackTile>
                <GraduationCap
                  className="relative w-20 h-20 md:w-24 md:h-24 text-emerald-300"
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </StackTile>
            </div>
          </div>
          <div className="p-6 md:p-10 lg:py-16">
            <p className="t-figure text-[12px] text-muted">Degree</p>
            <p className="mt-3 text-[19px] md:text-[21px] leading-snug text-snow">{PROFILE.education.title}</p>
            <p className="mt-4 text-[15px] text-snow/70">{PROFILE.education.org}</p>
          </div>
        </StackCard>
      </ol>
    </section>
  );
};

export default ExperienceSection;
