import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FillText } from "./ui/FillText";
import { PROFILE, SERVICES } from "@/data/profile";
import ExperienceTimer from "./ui/ExperienceTimer";
import ScrambleNumber from "./ui/ScrambleNumber";
import { Smoke } from "./ui/Smoke";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useLocalTime } from "@/hooks/useLocalTime";
import { fetchLatestRepositories, type GitHubRepo } from "@/lib/github";
import { reveal } from "@/lib/motion";
import { Curve } from "./ui/Curve";

const STATEMENT =
  "I spent five years building the systems that move money. Now I build the AI that works on top of them, with the same standards.";

const card = "relative rounded-lg border border-line bg-tile overflow-hidden";

/**
 * (Who I am): a bento after spector.framer.website. A founder card with the portrait and
 * bio, a vertical label strip, a tall dark card with the live counter over drifting smoke,
 * a principle card, a phases card, and two counts.
 */
const monthDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const AboutSection = () => {
  const scrollTo = useSectionScroll();
  const time = useLocalTime(PROFILE.timeZone);
  const [latest, setLatest] = useState<GitHubRepo | null>(null);
  useEffect(() => {
    const c = new AbortController();
    fetchLatestRepositories(1, c.signal).then((r) => {
      if (!c.signal.aborted && r[0]) setLatest(r[0]);
    });
    return () => c.abort();
  }, []);

  return (
    <section id="about" className="theme-dark bg-night text-snow scroll-mt-16">
      <Curve className="-mb-px" />
      <motion.div
        initial={{ opacity: 0, scale: 0.965, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="bg-graphite px-6 md:px-10 lg:px-12 py-16 lg:py-24 origin-top"
      >
        <div className="max-w-[1400px] mx-auto">
          <motion.p {...reveal()} className="t-label mb-8">
            Who I am
          </motion.p>
          <FillText
            text={STATEMENT}
            className="t-statement text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl max-w-6xl"
          />

          <div className="mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4">
            {/* Founder card */}
            <motion.div {...reveal()} className={`${card} md:col-span-6 lg:col-span-5 p-6 md:p-8 flex flex-col`}>
              <span className="flex items-center gap-2 t-figure text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Open to opportunities
              </span>
              <h3 className="t-heading text-4xl md:text-5xl mt-6">From the engineer</h3>
              <span className="block w-10 h-px bg-line mt-5 mb-5" aria-hidden="true" />
              <p className="t-body text-snow/80 max-w-md">{PROFILE.intro}</p>
              <div className="mt-auto pt-8 flex items-center gap-5">
                <picture className="shrink-0">
                  <source srcSet={`${import.meta.env.BASE_URL}images/portrait.webp`} type="image/webp" />
                  <img
                    src={`${import.meta.env.BASE_URL}images/portrait.jpg`}
                    alt="Achyuth KP"
                    width={593}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-md object-cover object-top border border-line"
                  />
                </picture>
                <div>
                  <p className="font-body text-lg font-medium">{PROFILE.name}</p>
                  <p className="t-caps text-muted text-[12px] mt-1">
                    {PROFILE.title} · {PROFILE.city.split(",")[0]}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vertical label strip */}
            <motion.div
              {...reveal(0.05)}
              className={`${card} hidden lg:flex lg:col-span-1 flex-col items-center justify-between py-6`}
            >
              <span className="t-figure text-xs text-muted [writing-mode:vertical-rl] rotate-180">
                Software Engineer
              </span>
              <span className="t-heading text-xl [writing-mode:vertical-rl] rotate-180">Achyuth KP</span>
            </motion.div>

            {/* Tall dark card with the live counter over smoke */}
            <motion.div
              {...reveal(0.1)}
              className={`${card} md:col-span-3 lg:col-span-3 bg-night min-h-[420px] lg:min-h-0 flex flex-col items-center text-center p-6 md:p-8`}
            >
              <Smoke />
              <span className="relative t-figure text-[11px] tracking-[0.3em] uppercase text-snow/70">Achyuth KP</span>
              <div className="relative my-auto py-8">
                <ExperienceTimer startDate={PROFILE.careerStart} compact />
              </div>
              <div className="relative">
                <p className="t-heading text-3xl md:text-4xl">Production first</p>
                <span className="block w-10 h-px bg-snow/30 mx-auto my-4" aria-hidden="true" />
                <p className="t-body text-snow/70 text-[15px]">
                  Five years of backend systems, now applied to AI that ships.
                </p>
              </div>
            </motion.div>

            {/* Principle card */}
            <motion.div
              {...reveal(0.15)}
              className={`${card} md:col-span-3 lg:col-span-3 p-6 md:p-8 flex flex-col text-center`}
            >
              <h3 className="t-heading text-3xl md:text-4xl">
                Reliable systems.
                <br />
                <span className="text-emerald-400">Useful AI.</span>
              </h3>
              <span className="block w-10 h-px bg-line mx-auto my-5" aria-hidden="true" />
              <p className="t-body text-snow/70 text-[15px]">
                Correctness, security, and observability stay in scope from the first commit to the last.
              </p>
              <ul className="mt-auto pt-8 grid grid-cols-5 gap-1.5 items-end h-24">
                {SERVICES.map((s, i) => (
                  <li key={s.title} className="flex flex-col justify-end h-full">
                    <motion.span
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 }}
                      className={`block w-full rounded-sm origin-bottom ${i === 0 ? "bg-emerald-400" : "bg-snow/20"}`}
                      style={{ height: `${100 - i * 12}%` }}
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Phases */}
            <motion.div {...reveal(0.2)} className={`${card} md:col-span-3 lg:col-span-3 p-6 md:p-8`}>
              <p className="t-label mb-6">How work moves</p>
              <ol className="space-y-3">
                {PROFILE.phases.map((p, i) => (
                  <li key={p} className="flex items-baseline gap-4 border-t border-line pt-3">
                    <span className="t-figure text-xs text-emerald-300">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-heading text-2xl">{p}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Story + actions */}
            <motion.div {...reveal(0.25)} className={`${card} md:col-span-3 lg:col-span-5 p-6 md:p-8 flex flex-col`}>
              <h3 className="t-heading text-3xl md:text-4xl">Same platform, higher bar</h3>
              <span className="block w-10 h-px bg-line mt-5 mb-5" aria-hidden="true" />
              <p className="t-body text-snow/70">
                I started at FIS Global, was promoted to Senior Software Engineer, and moved with the same platform and
                client to Cognizant. The interesting problems now sit where reliable systems meet AI: models that are
                useful, gated, and observable in production, not just in a demo.
              </p>
              <button
                type="button"
                onClick={() => scrollTo("work")}
                className="group mt-auto pt-8 inline-flex items-center gap-3 t-heading text-2xl hover:text-emerald-300 transition-colors duration-fast self-start"
              >
                See the work{" "}
                <ArrowRight
                  className="w-6 h-6 transition-transform duration-fast group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </motion.div>

            {/* Accent count */}
            <motion.div
              {...reveal(0.3)}
              data-reveal-skip
              className="relative rounded-lg overflow-hidden md:col-span-6 lg:col-span-4 bg-snow p-6 md:p-8 flex flex-col"
            >
              <p className="relative t-heading text-3xl md:text-4xl text-night">Services in the estate</p>
              <p className="relative t-wordmark leading-none text-[6rem] md:text-[7.5rem] mt-auto pt-8 text-night">
                <ScrambleNumber value="30" suffix="+" suffixClassName="text-emerald-500 plus-pulse" />
              </p>
              <span className="relative block w-10 h-px bg-night/40 mt-4" aria-hidden="true" />
            </motion.div>

            {/* Local time and availability */}
            <motion.div {...reveal(0.35)} className={`${card} md:col-span-2 lg:col-span-4 p-6 md:p-8 flex flex-col`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-label">Local time</p>
                  <p className="t-wordmark leading-none text-5xl md:text-6xl t-figure mt-5">{time}</p>
                  <p className="t-caps text-muted text-[12px] mt-2">{PROFILE.city.split(",")[0]} · IST</p>
                </div>
                <div className="text-right">
                  <p className="t-label">Status</p>
                  <p className="flex items-center justify-end gap-2.5 t-heading text-2xl md:text-3xl mt-5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    Open
                  </p>
                  <p className="t-caps text-muted text-[12px] mt-2">To opportunities</p>
                </div>
              </div>
            </motion.div>

            {/* Latest public push */}
            <motion.div
              {...reveal(0.4)}
              className={`${card} md:col-span-4 lg:col-span-8 p-6 md:p-8 flex flex-col min-w-0`}
            >
              <p className="t-label mb-auto">Latest on GitHub</p>
              {latest ? (
                <a
                  href={latest.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 flex items-end justify-between gap-6 min-w-0"
                >
                  <span className="min-w-0">
                    <span className="block t-heading text-2xl md:text-3xl break-words group-hover:text-snow/80 transition-colors duration-fast">
                      {latest.name}
                    </span>
                    <span className="block t-body text-muted mt-1 line-clamp-2">{latest.description}</span>
                  </span>
                  <span className="shrink-0 flex items-center gap-3 t-figure text-xs text-muted">
                    {monthDay(latest.updated_at)}
                    <ArrowUpRight
                      className="w-4 h-4 group-hover:text-emerald-300 transition-colors duration-fast"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              ) : (
                <p className="mt-6 t-figure text-xs text-muted">Fetching…</p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Curve flip className="-mt-px" />
    </section>
  );
};

export default AboutSection;
