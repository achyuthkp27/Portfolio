import { useEffect, useRef, useState } from "react";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

interface ExperienceTimerProps {
  startDate: Date;
  /** The big "5+" figure with its live count, for the About counter card */
  compact?: boolean;
  /** One quiet line of small caps, for the hero */
  inline?: boolean;
}

/** Live years-of-experience counter, calendar-correct, ticking once a second while on screen. */
const ExperienceTimer = ({ startDate, compact = false, inline = false }: ExperienceTimerProps) => {
  const [, setTick] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let onScreen = true;
    let interval: ReturnType<typeof setInterval> | null = null;
    const sync = () => {
      const shouldRun = onScreen && document.visibilityState === "visible";
      if (shouldRun && !interval) {
        setTick((t) => t + 1);
        interval = setInterval(() => setTick((t) => t + 1), 1000);
      } else if (!shouldRun && interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Count calendar years, months and days on the Bengaluru calendar, the same for every visitor
  const now = new Date();
  const IST_MS = 5.5 * 3600000;
  const n = new Date(now.getTime() + IST_MS);
  const s = new Date(startDate.getTime() + IST_MS);
  let years = n.getUTCFullYear() - s.getUTCFullYear();
  let months = n.getUTCMonth() - s.getUTCMonth();
  let days = n.getUTCDate() - s.getUTCDate();
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const diff = now.getTime() - startDate.getTime();
  const hh = Math.floor(diff / 3600000) % 24;
  const mm = Math.floor(diff / 60000) % 60;
  const ss = Math.floor(diff / 1000) % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (inline) {
    return (
      <div ref={ref} className="text-[10px] tracking-[0.4em] uppercase font-medium text-white/40">
        In production for{" "}
        <span className="font-mono tracking-[0.08em] text-white/70">
          {years}y {months}m {days}d · {pad(hh)}:{pad(mm)}:{pad(ss)}
        </span>
      </div>
    );
  }

  if (compact) {
    return (
      <div ref={ref} className="flex flex-col">
        {/* Plain paragraphs: dt/dd without a <dl> around them was invalid markup */}
        <p className="t-wordmark leading-none text-5xl md:text-6xl order-1">
          <ScrambleNumber value={String(years)} suffix="+" />
        </p>
        <p className="t-caps text-muted text-[12px] md:text-[13px] mt-3 order-2">Years in engineering</p>
        <p className="t-figure text-[11px] text-emerald-300/80 mt-1.5 order-3" aria-hidden="true">
          {years}y {months}m {days}d · {pad(hh)}:{pad(mm)}:{pad(ss)}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-4 flex-1 flex flex-col justify-end">
      <p className="t-wordmark leading-none text-[6rem] md:text-[8rem]">
        <ScrambleNumber value={String(years)} suffix="+" />
      </p>
      <p className="t-caps text-muted mt-6">Years building production systems</p>
      <p className="t-figure text-xs text-muted mt-2" aria-hidden="true">
        {years}y {months}m {days}d · {pad(hh)}:{pad(mm)}:{pad(ss)}
      </p>
    </div>
  );
};

export default ExperienceTimer;
