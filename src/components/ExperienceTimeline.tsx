import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { SectionHeader } from "./ui/SectionHeader";
import { experiences } from "@/data/experience";

/** Highlights visible before "show more" — enough to judge a role without clicking. */
const VISIBLE_HIGHLIGHTS = 3;

/** Named once so the lane header and the roles it spans can never drift apart. */
const PLATFORM_LANE = experiences.find((e) => e.platform)?.platform ?? "";

const ExperienceTimeline = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [expanded, setExpanded] = useState<number[]>([]);

  const toggle = (index: number) =>
    setExpanded((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]));

  return (
    <section id="experience" ref={ref} className="py-20 lg:py-28 px-6 md:px-12 relative">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Experience"
          title="One banking platform, one client, since 2021"
          description="Hired at FIS Global, promoted to Senior Software Engineer, then moved with the same platform and team to Cognizant."
        />

        {/* The platform lane's own header, aligned to the emerald track below it */}
        <div className="relative pl-12 md:pl-16 mb-6">
          <span className="absolute left-[18px] top-1/2 w-[7px] h-[7px] -mt-[3.5px] rounded-full bg-emerald-400/80" aria-hidden="true" />
          <span className="font-mono text-[11px] md:text-xs tracking-wide text-emerald-300/80">
            {PLATFORM_LANE} · unbroken since Jul 2021
          </span>
        </div>

        <ol className="relative">
          {/* Employer track: fills as the section scrolls */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" aria-hidden="true">
            <motion.div className="w-full h-full bg-emerald-500/70 origin-top" style={{ scaleY }} />
          </div>

          {experiences.map((exp, index) => {
            const isOpen = expanded.includes(index);
            // The employer changes, the platform does not — that is the point of the second lane.
            const onPlatform = Boolean(exp.platform);
            const platformContinues = exp.platform && experiences[index + 1]?.platform === exp.platform;
            const shown = isOpen ? exp.achievements : exp.achievements.slice(0, VISIBLE_HIGHLIGHTS);
            const hiddenCount = exp.achievements.length - VISIBLE_HIGHLIGHTS;
            const panelId = `experience-more-${index}`;

            return (
              <motion.li
                key={exp.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="relative pl-12 md:pl-16 pb-16 last:pb-0"
              >
                <span
                  className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 bg-black ${
                    index === 0 ? "border-emerald-400" : "border-white/30"
                  }`}
                  aria-hidden="true"
                />

                {/* Platform track: one segment per role, stacking into a single unbroken line */}
                {onPlatform && (
                  <span
                    className="absolute left-[21px] border-l border-dashed border-emerald-400/45"
                    style={{ top: index === 0 ? "0.5rem" : 0, bottom: platformContinues ? 0 : "auto", height: platformContinues ? undefined : "calc(100% - 3.5rem)" }}
                    aria-hidden="true"
                  />
                )}

                <div className="grid md:grid-cols-[1fr_auto] gap-x-8 gap-y-2 items-baseline mb-6">
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight">{exp.company}</h3>
                  <span className="font-mono text-xs md:text-sm text-white/60 md:text-right whitespace-nowrap">{exp.period}</span>
                  <p className="md:col-span-2 text-sm md:text-base font-body text-emerald-300/85">{exp.role}</p>
                </div>

                <ul id={panelId} className="space-y-3.5 max-w-3xl">
                  <AnimatePresence initial={false}>
                    {shown.map((achievement, i) => (
                      <motion.li
                        key={achievement}
                        initial={i >= VISIBLE_HIGHLIGHTS ? { opacity: 0, height: 0 } : false}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3 text-[15px] md:text-base font-body font-light text-white/75 leading-relaxed overflow-hidden"
                      >
                        <span className="mt-[0.7em] h-px w-3 shrink-0 bg-emerald-500/70" aria-hidden="true" />
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="mt-5 text-sm font-body font-medium text-white/70 hover:text-emerald-300 underline underline-offset-4 decoration-white/20 hover:decoration-emerald-400/60 transition-colors"
                  >
                    {isOpen ? "Show less" : `Show ${hiddenCount} more`}
                  </button>
                )}

                <div className="flex flex-wrap gap-2 mt-6">
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 text-xs font-mono text-white/65 border border-white/10 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* What carried this role into the one below it */}
                {exp.handoff && platformContinues && (
                  <p className="mt-8 -ml-2 inline-flex items-center gap-2.5 rounded-full border border-dashed border-emerald-500/35 bg-emerald-500/[0.05] px-3.5 py-1.5 font-mono text-[10px] md:text-[11px] text-emerald-200/85">
                    <span aria-hidden="true">↕</span>
                    {exp.handoff}
                  </p>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
