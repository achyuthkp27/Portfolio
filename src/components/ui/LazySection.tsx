import { useInView } from "react-intersection-observer";
import { Suspense, ReactNode, useEffect, useState } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  /** The id of the section inside (e.g. "about"). Used as a scroll anchor before the real section mounts. */
  sectionId?: string;
  /** Approximate rendered height of this section. Prevents CLS by reserving vertical space in the placeholder. */
  minHeight?: string;
}

/**
 * Wraps a lazy-loaded component and only renders it (triggering the network request)
 * once it is near the viewport. This prevents "network storms" where 10+ chunks
 * are requested simultaneously on page load.
 *
 * When `sectionId` is provided, the placeholder gets that id so that navigation
 * links (e.g. clicking "About" in the nav) can scroll here even before the real
 * <section id="about"> has mounted. Once the real section renders, the placeholder
 * id is removed to avoid duplicate ids.
 *
 * A few seconds after load, once the browser is idle, every section mounts anyway, so
 * crawlers that run JavaScript see the whole page and a fast scroll never meets a placeholder.
 */
export const LazySection = ({
  children,
  fallback,
  className = "",
  threshold = 0.01,
  rootMargin = "100% 0px",
  sectionId,
  minHeight = "600px",
}: LazySectionProps) => {
  const { ref, inView: near } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
  });
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const t = window.setTimeout(() => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      else setIdle(true);
    }, 4000);
    return () => window.clearTimeout(t);
  }, []);
  const inView = near || idle;

  return (
    <div ref={ref} className={`relative ${className}`} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView ? (
        <Suspense
          fallback={fallback || <div style={{ minHeight }} className="w-full animate-pulse bg-white/5 rounded-xl" />}
        >
          {children}
        </Suspense>
      ) : (
        fallback || <div id={sectionId} style={{ minHeight }} className="w-full" />
      )}
    </div>
  );
};
