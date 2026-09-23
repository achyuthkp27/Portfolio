import { useEffect, useState } from "react";

/**
 * A frosted band fixed to the bottom of the viewport, after neiden.framer.media: whatever
 * scrolls under it softens and fades, so the page always ends in glass rather than a
 * hard edge. It steps aside while the work cards are under it, since the owner wants
 * those read unblurred. Pointer events pass through; nothing sits inside it.
 */
export const GlassEdge = () => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const work = document.getElementById("work");
      if (!work) return setHidden(false);
      const r = work.getBoundingClientRect();
      const band = innerHeight - 140;
      setHidden(r.top < innerHeight && r.bottom > band);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 md:h-32 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_25%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_25%,transparent)] transition-opacity duration-slow ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
    </div>
  );
};

export default GlassEdge;
