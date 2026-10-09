import { useEffect, useRef } from "react";

/** Sections the grain leaves clean, by id */
const CLEAR = ["about"];

/**
 * Film grain over the whole page, after patrickjane.framer.website. A mask cuts the grain away
 * wherever a CLEAR section is on screen, following it as the page scrolls, so the grain stops
 * exactly at that section's edges. Pages without those sections get grain everywhere.
 */
export const FilmGrain = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = "";
    const paint = () => {
      raf = 0;
      const vh = innerHeight;
      const holes = CLEAR.map((id) => document.getElementById(id)?.getBoundingClientRect())
        .filter((r): r is DOMRect => !!r && r.bottom > 0 && r.top < vh)
        .map((r) => [Math.max(0, Math.round(r.top)), Math.min(vh, Math.round(r.bottom))]);
      const stops = holes.flatMap(([t, b]) => [
        `#000 ${t}px`,
        `transparent ${t}px`,
        `transparent ${b}px`,
        `#000 ${b}px`,
      ]);
      const mask = stops.length ? `linear-gradient(to bottom, #000 0, ${stops.join(", ")}, #000 100%)` : "none";
      if (mask === last) return;
      last = mask;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    // The section mounts lazily and grows as it loads; keep the cut in step with it
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="film-grain"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/noise.webp)` }}
    />
  );
};
