import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotionConfig, useScroll } from "framer-motion";
import { experiences } from "@/data/experience";
import { SectionHeader } from "./ui/SectionHeader";
import { DUR, EASE, reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { IdBadge } from "./ui/IdBadge";
import { AwardCard } from "./ui/AwardCard";
import { PROFILE } from "@/data/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const VISIBLE = 3;

/** (Experience): one row per role on the dark ground beside the ID badge, expandable, as the reference lists its news. */
const ExperienceSection = () => {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const still = useReducedMotionConfig();
  // Education lights its stop once it reaches the upper half of the viewport
  const eduRef = useRef<HTMLLIElement>(null);
  const eduLit = useInView(eduRef, { margin: "0px 0px -45% 0px" });
  // The rail beside the roles fills as the list passes the reading line
  const { scrollYProgress: railFill } = useScroll({ target: listRef, offset: ["start 0.6", "end 0.6"] });

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
    <section id="experience" ref={sectionRef} className="theme-dark text-snow relative scroll-mt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-24 lg:py-32">
        <SectionHeader
          label="Experience"
          title="Experience"
          description="Hired at FIS Global, recognised with an individual award, promoted to Senior Software Engineer, then moved with the same platform and team to Cognizant."
        />
        <div className="lg:grid lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)] lg:gap-12">
          {/* The ID, hanging beside the roles, pinned while they scroll past */}
          <div className="mb-14 lg:mb-0 flex justify-center lg:block">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:flex lg:items-start lg:justify-center lg:overflow-hidden lg:pt-0">
              <IdBadge face={face} target={sectionRef} />
            </div>
          </div>
          <div className="relative lg:pl-10">
            {/* Progress rail: desktop only, where the badge follows the active role */}
            <span className="hidden lg:block absolute left-3 top-0 bottom-0 w-px bg-line" aria-hidden="true" />
            <motion.span
              className="hidden lg:block absolute left-3 top-0 bottom-0 w-px bg-emerald-400 origin-top"
              style={{ scaleY: still ? 1 : railFill }}
              aria-hidden="true"
            />
            <ol ref={listRef} className="border-t border-line">
              {experiences.map((exp, i) => {
                const isOpen = open.includes(i);
                const shown = isOpen ? exp.achievements : exp.achievements.slice(0, VISIBLE);
                const hidden = exp.achievements.length - VISIBLE;
                const panel = `exp-${i}`;
                const isActive = i === active;
                return (
                  <motion.li
                    key={exp.company}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    data-index={i}
                    {...reveal()}
                    className="relative border-b border-line py-8 md:py-10 grid md:grid-cols-[10rem_1fr] lg:grid-cols-[11rem_1fr] gap-4 md:gap-10"
                  >
                    {/* This role's stop on the rail: lit once reached, glowing while it is the badge's role */}
                    <span
                      aria-hidden="true"
                      className={`hidden lg:block absolute -left-[33px] top-[2.85rem] h-[9px] w-[9px] rounded-full border transition-all duration-500 ${
                        i <= active ? "bg-emerald-400 border-emerald-400" : "bg-night border-line"
                      } ${isActive ? "scale-125 shadow-[0_0_14px_hsl(158_64%_52%/0.8)]" : ""}`}
                    />
                    <div>
                      <p className="t-figure text-xs text-muted">
                        <ScrambleNumber value={exp.period} />
                      </p>
                      {exp.platform && (
                        <p className="t-caps text-muted mt-2 hidden md:block text-[12px]">Same platform</p>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`t-heading text-3xl md:text-4xl transition-colors duration-500 ${isActive ? "" : "lg:text-snow/45"}`}
                      >
                        {exp.company}
                      </h3>
                      <p className="t-caps text-muted mt-2">{exp.role}</p>
                      {/* The award sits in the role that earned it */}
                      {exp.award && (
                        <div className="mt-8 max-w-3xl">
                          <AwardCard />
                        </div>
                      )}
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
                                className={`mt-[0.75em] w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500 bg-snow ${isActive ? "lg:bg-emerald-400" : ""}`}
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
                        {exp.technologies.map((t, k) => (
                          <motion.li
                            key={t}
                            initial={{ opacity: 0, y: 6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: DUR.base, ease: EASE, delay: 0.15 + k * 0.04 }}
                            className="rounded-pill border border-line px-3 py-1 text-[12px] text-snow/80"
                          >
                            {t}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.li>
                );
              })}
              {/* Education closes the line with its own stop; the badge stays on the last role */}
              <motion.li
                ref={eduRef}
                {...reveal()}
                className="relative py-8 md:py-10 grid md:grid-cols-[10rem_1fr] lg:grid-cols-[11rem_1fr] gap-4 md:gap-10"
              >
                <span
                  aria-hidden="true"
                  className={`hidden lg:block absolute -left-[33px] top-[2.85rem] h-[9px] w-[9px] rounded-full border transition-all duration-500 ${
                    eduLit
                      ? "bg-emerald-400 border-emerald-400 scale-125 shadow-[0_0_14px_hsl(158_64%_52%/0.8)]"
                      : "bg-night border-line"
                  }`}
                />
                <p className="t-figure text-xs text-muted">{PROFILE.education.year}</p>
                <div className="min-w-0">
                  <h3
                    className={`t-heading text-3xl md:text-4xl transition-colors duration-500 ${eduLit ? "" : "lg:text-snow/45"}`}
                  >
                    Education
                  </h3>
                  <p className="t-caps text-muted mt-2">{PROFILE.education.title}</p>
                  <p className="mt-6 t-body text-snow/85">{PROFILE.education.org}</p>
                </div>
              </motion.li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
