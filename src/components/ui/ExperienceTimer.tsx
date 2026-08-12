import { useEffect, useState } from "react";

interface ExperienceTimerProps {
    startDate: Date;
}

/**
 * Live years-of-experience counter — calendar-correct.
 * Big figure with a quietly ticking precise duration underneath.
 */
const ExperienceTimer = ({ startDate }: ExperienceTimerProps) => {
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const now = new Date();

    // Calendar-accurate years / months / days
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    if (days < 0) {
        months -= 1;
        // days in the previous month relative to `now`
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Sub-day remainder of the total elapsed time (start date is midnight-based)
    const diff = now.getTime() - startDate.getTime();
    const hh = Math.floor(diff / 3600000) % 24;
    const mm = Math.floor(diff / 60000) % 60;
    const ss = Math.floor(diff / 1000) % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <div className="text-center lg:text-inherit">
            <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
                {years}<span className="text-emerald-400">+</span>
            </div>
            <div className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-white/40 mt-2">
                Years in banking
            </div>
            <div className="font-mono text-xs text-emerald-400/70 mt-1.5 tabular-nums" aria-hidden="true">
                {years}y {months}m {days}d · {pad(hh)}:{pad(mm)}:{pad(ss)}
            </div>
        </div>
    );
};

export default ExperienceTimer;
