import { useEffect, useRef, useState } from "react";

interface ScrambleNumberProps {
  /** The final text. Only its digits scramble; letters and punctuation stay put. */
  value: string;
  /** Kept after the value, coloured once the digits lock, e.g. "+" */
  suffix?: string;
  durationMs?: number;
  className?: string;
  /** Element to render */
  as?: "span" | "dd" | "time";
  dateTime?: string;
}

const isDigit = (ch: string) => ch >= "0" && ch <= "9";

/**
 * Slot-machine figure: digits flicker through random values once the element scrolls into
 * view, then lock onto the real number from left to right. Non-digit characters never move,
 * so "Apr 2026 – Present" scrambles only its year. The final text is always exact.
 * With reduced motion the value renders immediately.
 */
const ScrambleNumber = ({
  value,
  suffix = "",
  durationMs = 1400,
  className = "",
  as: Tag = "span",
  dateTime,
}: ScrambleNumberProps) => {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(() => value.replace(/\d/g, "0"));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      setDone(true);
      return;
    }
    const digitPositions = [...value].map((ch, i) => (isDigit(ch) ? i : -1)).filter((i) => i >= 0);
    if (digitPositions.length === 0) {
      setDisplay(value);
      setDone(true);
      return;
    }
    let raf = 0;
    let started = false;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / durationMs);
        const locked = Math.floor(p * (digitPositions.length + 1));
        const chars = [...value];
        digitPositions.forEach((pos, n) => {
          if (n >= locked) chars[pos] = String(Math.floor(Math.random() * 10));
        });
        setDisplay(chars.join(""));
        if (p < 1) raf = requestAnimationFrame(tick);
        else {
          setDisplay(value);
          setDone(true);
        }
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        // Run on first sight, or settle at once if a fast scroll already jumped past it
        const passed = entry.boundingClientRect.bottom < 0;
        if ((entry.isIntersecting || passed) && !started) {
          started = true;
          io.disconnect();
          if (passed) {
            setDisplay(value);
            setDone(true);
          } else run();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={`${value}${suffix}`} dateTime={dateTime}>
      <span aria-hidden="true" className="tabular-nums">
        {display}
      </span>
      {suffix && (
        <span
          aria-hidden="true"
          className={`transition-colors duration-base ${done ? "text-emerald-400" : "text-emerald-400/60"}`}
        >
          {suffix}
        </span>
      )}
    </Tag>
  );
};

export default ScrambleNumber;
