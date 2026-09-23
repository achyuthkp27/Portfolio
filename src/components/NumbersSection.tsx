import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROFILE, SERVICES } from "@/data/profile";
import { fetchLatestRepositories, type GitHubRepo } from "@/lib/github";
import { useLocalTime } from "@/hooks/useLocalTime";
import ExperienceTimer from "./ui/ExperienceTimer";
import ScrambleNumber from "./ui/ScrambleNumber";
import { SectionHeader } from "./ui/SectionHeader";
import { reveal } from "@/lib/motion";

const Tile = ({
  label,
  className = "",
  delay = 0,
  children,
}: {
  label: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) => (
  <motion.div
    {...reveal(delay)}
    className={`relative rounded-md bg-tile border border-line p-6 md:p-7 flex flex-col min-h-[200px] ${className}`}
  >
    <p className="t-label mb-auto">{label}</p>
    {children}
  </motion.div>
);

const monthDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

/**
 * (At a glance): a bento of live tiles, the way plat-form and Mono lay out their studio
 * facts. Every value is real: the ticking counter, Bengaluru time, the five service areas,
 * the latest public push on GitHub, availability, and the counts.
 */
const NumbersSection = () => {
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
    <section id="numbers" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader
          label="At a glance"
          title="The facts"
          description="Live where they can be, counted where they can't. Nothing here is a percentage I can't show you."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Live counter: the anchor tile */}
          <Tile label="Time in engineering" className="col-span-2 lg:col-span-2 lg:row-span-2 justify-between">
            <ExperienceTimer startDate={PROFILE.careerStart} compact />
          </Tile>

          <Tile label="Local time" delay={0.05}>
            <p className="t-wordmark leading-none text-4xl md:text-5xl t-figure">{time}</p>
            <p className="t-caps text-muted text-[12px] mt-2">{PROFILE.city.split(",")[0]} · IST</p>
          </Tile>

          <Tile label="Status" delay={0.1}>
            <p className="flex items-center gap-2.5 t-heading text-2xl md:text-3xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Open
            </p>
            <p className="t-caps text-muted text-[12px] mt-2">To opportunities</p>
          </Tile>

          {/* Service areas as a bar row */}
          <Tile label="What I do" className="col-span-2 lg:col-span-2" delay={0.15}>
            <ul className="mt-6 grid grid-cols-5 gap-2">
              {SERVICES.map((s, i) => (
                <li key={s.title} className="flex flex-col">
                  <span className="flex items-end h-24">
                    <motion.span
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 }}
                      className={`block w-full rounded-sm origin-bottom ${i === 0 ? "bg-emerald-400" : "bg-snow/25"}`}
                      style={{ height: `${100 - i * 12}%` }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-2 t-figure text-[10px] leading-relaxed text-muted whitespace-nowrap">
                    {s.title.split(" ")[0]}
                  </span>
                </li>
              ))}
            </ul>
          </Tile>

          {PROFILE.numbers.map((n, i) => (
            <Tile key={n.label} label={n.label} delay={0.2 + i * 0.05}>
              <p className="t-wordmark leading-none text-5xl md:text-6xl">
                <ScrambleNumber value={n.value.replace(/\D/g, "")} suffix={n.value.replace(/\d/g, "")} />
              </p>
            </Tile>
          ))}

          {/* Latest public push */}
          <Tile label="Latest on GitHub" className="col-span-2 md:col-span-4 lg:col-span-6" delay={0.35}>
            {latest ? (
              <a
                href={latest.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 flex items-end justify-between gap-6"
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
          </Tile>
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
