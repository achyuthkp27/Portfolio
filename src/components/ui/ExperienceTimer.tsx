import { useEffect, useRef, useState } from "react";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { pad2 } from "@/lib/format";
import { elapsedSince } from "@/lib/elapsed";

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
  const { years, months, days, hours: hh, minutes: mm, seconds: ss } = elapsedSince(startDate, new Date());
  const readout = `${years}y ${months}m ${days}d · ${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;

  if (inline) {
    return (
      <div ref={ref} className="text-[11px] lg:text-[10px] tracking-[0.4em] uppercase font-medium text-white/50">
        In production for <span className="font-mono tracking-[0.08em] text-white/70">{readout}</span>
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
          {readout}
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
        {readout}
      </p>
    </div>
  );
};

export default ExperienceTimer;
