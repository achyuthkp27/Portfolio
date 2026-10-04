import { useEffect, useState } from "react";

/**
 * A frosted band fixed to the bottom of the viewport, after neiden.framer.media: whatever
 * scrolls under it softens and fades, so the page always ends in glass rather than a
 * hard edge. It steps aside while the work cards or any `data-glass-off` section (the
 * belief, vision and contact scenes) are under it, since those must read unblurred.
 * Pointer events pass through; nothing sits inside it.
 */
export const GlassEdge = () => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // Which opted-out sections overlap the bottom band. An IntersectionObserver does the
    // geometry off the scroll path; no per-frame queries or rect reads.
    const under = new Set<Element>();
    const watched = new Set<Element>();
    let io: IntersectionObserver | null = null;

    const targets = () => [document.getElementById("work"), ...document.querySelectorAll("[data-glass-off]")];
    const observeNew = () => {
      targets().forEach((el) => {
        if (el && io && !watched.has(el)) {
          watched.add(el);
          io.observe(el);
        }
      });
    };
    const build = () => {
      io?.disconnect();
      under.clear();
      watched.clear();
      // The root is shrunk to the band the glass covers: the bottom 140px of the viewport
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
          setHidden(under.size > 0);
        },
        { rootMargin: `-${Math.max(0, innerHeight - 140)}px 0px 0px 0px` },
      );
      observeNew();
    };

    build();
    // Lazy sections mount after load; pick up their opt-outs as they appear
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (!pending) pending = window.setTimeout(() => ((pending = 0), observeNew()), 200);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    addEventListener("resize", build);
    return () => {
      io?.disconnect();
      mo.disconnect();
      window.clearTimeout(pending);
      removeEventListener("resize", build);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 md:h-32 backdrop-blur-sm md:backdrop-blur-xl [mask-image:linear-gradient(to_top,black_25%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_25%,transparent)] transition-opacity duration-slow ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
    </div>
  );
};

export default GlassEdge;
