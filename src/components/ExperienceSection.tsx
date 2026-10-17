import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotionConfig, useScroll } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { experiences } from "@/data/experience";
import { reveal } from "@/lib/motion";
import { pad2 } from "@/lib/format";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AwardCard } from "./ui/AwardCard";
import { PROFILE } from "@/data/profile";
import { PlatformZoom, ShippingSince } from "./ui/ExperienceScenes";

/** Achievements shown per role on phones and tablets before "Show more" */
const VISIBLE = 3;
/** Where a pinned role header sits, as a share of the screen's height from the top */
const PIN = 0.15;

/** Reduced motion's header: the scenes' words, standing still */
const StaticHeader = () => (
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-24 lg:pt-32">
    <p className="t-label mb-10 lg:mb-14">Experience</p>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-end">
      <h2 className="t-statement text-5xl md:text-7xl lg:text-[5.5rem]">
        Five years,
        <br />
        one platform.
      </h2>
      <p className="t-body text-snow/60 text-[17px] md:text-[19px] max-w-md lg:justify-self-end">
        Hired at FIS Global, recognised with an individual award, promoted to Senior Software Engineer, then{" "}
        <span className="text-snow">moved with the same platform and team to Cognizant</span>.
      </p>
    </div>
  </div>
);

/** A stop on the rail: a ring on the line, level with the heading beside it */
const Stop = ({ refFn }: { refFn: (el: HTMLSpanElement | null) => void }) => (
  <span
    ref={refFn}
    aria-hidden="true"
    className="absolute -left-8 md:-left-14 top-1.5 w-[13px] h-[13px] md:w-[21px] md:h-[21px] rounded-full border-2 border-emerald-400 bg-night"
  />
);

/**
 * (Experience): "Shipping since 2021" stands up off a floor of lines, then the camera pulls back
 * from one service I own to the platform and the two employers around it. A line drops out of
 * that last view and becomes the rail the roles hang on. On wide screens each role is a scene:
 * its number, dates, company and title stay pinned on the left while its achievements scroll
 * past on the right, the one in the middle of the screen lit and the rest dimmed, with the award
 * after the achievements that earned it and the stack last. The rail fills down to the pinned
 * role as you read. Phones and tablets get the same content stacked, three achievements per role
 * with the rest behind "Show more". Education closes the rail.
 */
const ExperienceSection = () => {
  const reduceMotion = useReducedMotionConfig();
  const wide = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  const railBox = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const stops = useRef<(HTMLSpanElement | null)[]>([]);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const { scrollY } = useScroll();
  const scrub = wide && !reduceMotion;

  const update = useCallback(() => {
    const box = railBox.current;
    const marks = stops.current.filter((el): el is HTMLSpanElement => !!el);
    if (!box || !marks.length) return;
    const vh = window.innerHeight;
    const top = box.getBoundingClientRect().top;
    const centre = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - top;
    };
    // The rail runs from the top of the block, where the line from the zoom comes in, to the last stop
    const end = centre(marks[marks.length - 1]);
    if (track.current) track.current.style.height = `${end}px`;
    // It fills down to the role being read: the pinned header's stop on wide screens, the middle of
    // the screen on narrow ones; never short of the first stop, never past the last
    const first = marks[0];
    const line = (scrub ? vh * PIN + first.offsetTop + first.offsetHeight / 2 : vh * 0.55) - top;
    const tip = reduceMotion ? end : Math.min(Math.max(line, centre(first)), end);
    if (fill.current) fill.current.style.height = `${Math.max(0, tip)}px`;

    // The achievement nearest the middle of the screen is lit, the rest dimmed (wide screens only)
    const els = items.current.filter((el): el is HTMLLIElement => !!el);
    let lit: HTMLLIElement | null = null;
    if (scrub) {
      let best = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const d = Math.abs(r.top + r.height / 2 - vh / 2);
        if (d < best) {
          best = d;
          lit = el;
        }
      }
    }
    for (const el of els) {
      const on = !scrub || el === lit;
      el.dataset.lit = String(on);
      el.style.opacity = on ? "" : "0.38";
    }
  }, [scrub, reduceMotion]);

  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    const box = railBox.current;
    // The rail's length follows the roles' height, which changes with fonts, "Show more" and the award
    const ro = new ResizeObserver(update);
    if (box) ro.observe(box);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update, open]);

  let n = 0;
  const nextItem = () => n++;

  return (
    <section id="experience" className="theme-dark text-snow relative scroll-mt-16">
      {reduceMotion ? (
        <StaticHeader />
      ) : (
        <>
          <ShippingSince />
          <PlatformZoom />
        </>
      )}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pb-24 lg:pb-32">
        <div ref={railBox} className="relative pl-8 md:pl-14 pt-24 lg:pt-32">
          {/* The rail: a hairline from the top of the block, filled in emerald down to the role being read */}
          <span aria-hidden="true" ref={track} className="absolute left-[6px] md:left-[10px] top-0 w-px bg-line" />
          <span
            aria-hidden="true"
            ref={fill}
            className="absolute left-[6px] md:left-[10px] top-0 w-px bg-emerald-400"
            style={{ height: 0 }}
          />

          <motion.p {...reveal()} className="t-label mb-12 lg:mb-20">
            The roles
          </motion.p>

          <ol>
            {experiences.map((exp, i) => {
              const isOpen = open.includes(i);
              const hidden = exp.achievements.length - VISIBLE;
              const panel = `exp-${i}`;
              return (
                <li key={exp.company} className="relative pb-24 lg:pb-40">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-start">
                    {/* Pinned while this role's achievements scroll past */}
                    <header className="relative lg:sticky lg:top-[15vh]">
                      <Stop
                        refFn={(el) => {
                          stops.current[i] = el;
                        }}
                      />
                      <p className="t-figure text-[13px] text-muted">
                        <span className="text-emerald-300">{pad2(i + 1)}</span> / {pad2(experiences.length)} ·{" "}
                        {exp.period}
                      </p>
                      <h3 className="mt-4 t-heading text-[2.75rem] md:text-6xl lg:text-[4.25rem] xl:text-[5.25rem] leading-[0.95] break-words">
                        {exp.company}
                      </h3>
                      <p className="mt-5 text-[17px] md:text-[19px] leading-snug text-snow">{exp.role}</p>
                      {exp.platform && <p className="mt-3 t-figure text-[13px] text-emerald-300">{exp.platform}</p>}
                    </header>

                    <div className="min-w-0">
                      <ul id={panel} className="border-t border-line">
                        {exp.achievements.map((a, j) => {
                          const k = nextItem();
                          return (
                            <li
                              key={a}
                              ref={(el) => {
                                items.current[k] = el;
                              }}
                              data-lit="true"
                              className={`group gap-5 py-5 lg:py-7 border-b border-line transition-opacity duration-500 ${
                                j >= VISIBLE && !isOpen ? "hidden lg:flex" : "flex"
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className="shrink-0 w-7 pt-[0.2em] t-figure text-[13px] text-snow/45 transition-colors duration-500 group-data-[lit=true]:text-emerald-300"
                              >
                                {pad2(j + 1)}
                              </span>
                              <span className="text-[16px] md:text-[17px] lg:text-[19px] leading-relaxed text-snow/85">
                                {a}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {hidden > 0 && (
                        <button
                          type="button"
                          onClick={() => toggle(i)}
                          aria-expanded={isOpen}
                          aria-controls={panel}
                          className="lg:hidden mt-1 py-3 text-[13px] font-medium uppercase tracking-[0.03em] text-muted hover:text-snow transition-colors duration-fast"
                        >
                          {isOpen ? "Show less" : `Show ${hidden} more`}
                        </button>
                      )}
                      {/* The award, right after the achievements that earned it */}
                      {exp.award && (
                        <div className="mt-10 lg:mt-14">
                          <AwardCard />
                        </div>
                      )}
                      <p className="mt-10 lg:mt-14 t-figure text-[13px] uppercase tracking-[0.16em] text-muted">
                        Stack
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {exp.technologies.map((t) => (
                          <li key={t} className="rounded-pill border border-line px-3 py-1 text-[13px] text-snow/75">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}

            {/* Education closes the rail */}
            <li className="relative">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 items-start">
                <div className="relative">
                  <Stop
                    refFn={(el) => {
                      stops.current[experiences.length] = el;
                    }}
                  />
                  <p className="t-figure text-[13px] text-muted">{PROFILE.education.year}</p>
                  <h3 className="mt-4 t-heading text-[2.75rem] md:text-6xl lg:text-[4.25rem] xl:text-[5.25rem] leading-[0.95]">
                    Education
                  </h3>
                </div>
                <div className="flex items-start gap-4 lg:pt-10 border-t border-line pt-6">
                  <GraduationCap className="w-8 h-8 shrink-0 text-emerald-300" strokeWidth={1.25} aria-hidden="true" />
                  <div>
                    <p className="text-[17px] md:text-[19px] leading-snug text-snow">{PROFILE.education.title}</p>
                    <p className="mt-2 text-[15px] text-snow/70">{PROFILE.education.org}</p>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
