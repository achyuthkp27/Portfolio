import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences } from "@/data/experience";
import { SectionHeader } from "./ui/SectionHeader";
import { DUR, EASE, reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { IdBadge } from "./ui/IdBadge";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const VISIBLE = 3;

/** (Experience): one row per role on the light ground, expandable, as the reference lists its news. */
const ExperienceSection = () => {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // The badge shows whichever role crosses the middle band of the viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(Number((hit.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 },
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  // Below the desktop breakpoint the badge sits above the list, so it shows the current role
  const wide = useMediaQuery("(min-width: 1024px)");
  const current = experiences[wide ? active : 0];
  const face = {
    key: current.company,
    company: current.company.split(" ")[0],
    role: current.role.split(" · ")[0],
    period: current.period,
    logo: current.logo,
  };

  return (
    <section id="experience" ref={sectionRef} className="theme-dark bg-night text-snow relative scroll-mt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-24 lg:py-32">
        <SectionHeader
          label="Experience"
          title="Experience"
          description="Hired at FIS Global, promoted to Senior Software Engineer, then moved with the same platform and team to Cognizant."
        />
        <div className="lg:grid lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] lg:gap-12">
          {/* The ID, hanging beside the roles, pinned while they scroll past */}
          <div className="mb-14 lg:mb-0 flex justify-center lg:block">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:flex lg:items-start lg:justify-center lg:overflow-hidden lg:pt-0">
              <IdBadge face={face} target={sectionRef} />
            </div>
          </div>
          <ol className="border-t border-line">
            {experiences.map((exp, i) => {
              const isOpen = open.includes(i);
              const shown = isOpen ? exp.achievements : exp.achievements.slice(0, VISIBLE);
              const hidden = exp.achievements.length - VISIBLE;
              const panel = `exp-${i}`;
              return (
                <motion.li
                  key={exp.company}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  data-index={i}
                  {...reveal()}
                  className="border-b border-line py-8 md:py-10 grid md:grid-cols-[10rem_1fr] lg:grid-cols-[11rem_1fr] gap-4 md:gap-10"
                >
                  <div>
                    <p className="t-figure text-xs text-muted">
                      <ScrambleNumber value={exp.period} />
                    </p>
                    {exp.platform && (
                      <p className="t-caps text-muted mt-2 hidden md:block text-[12px]">Same platform</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="t-heading text-3xl md:text-4xl">{exp.company}</h3>
                    <p className="t-caps text-muted mt-2">{exp.role}</p>
                    <ul id={panel} className="mt-6 space-y-3 max-w-3xl">
                      <AnimatePresence initial={false}>
                        {shown.map((a, j) => (
                          <motion.li
                            key={a}
                            initial={j >= VISIBLE ? { opacity: 0, y: 6 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4, transition: { duration: DUR.fast } }}
                            transition={{ duration: DUR.base, ease: EASE, delay: (j - VISIBLE) * 0.03 }}
                            className="flex gap-3 t-body text-snow/85"
                          >
                            <span
                              className="mt-[0.75em] w-1.5 h-1.5 rounded-full bg-snow shrink-0"
                              aria-hidden="true"
                            />
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
      </div>
    </section>
  );
};

export default ExperienceSection;
