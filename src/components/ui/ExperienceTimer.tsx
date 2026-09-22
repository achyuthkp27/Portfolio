import { useEffect, useRef, useState } from "react";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

interface ExperienceTimerProps {
  startDate: Date;
}

/** Live years-of-experience counter, calendar-correct, ticking once a second while on screen. */
const ExperienceTimer = ({ startDate }: ExperienceTimerProps) => {
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

  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
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

  return (
    <div ref={ref} className="mt-4">
      <p className="t-wordmark leading-none text-[6rem] md:text-[8rem]">
        <ScrambleNumber value={String(years)} suffix="+" />
      </p>
      <p className="t-caps text-muted mt-6">Years building banking systems</p>
      <p className="t-figure text-xs text-muted mt-2" aria-hidden="true">
        {years}y {months}m {days}d · {pad(hh)}:{pad(mm)}:{pad(ss)}
      </p>
    </div>
  );
};

export default ExperienceTimer;
