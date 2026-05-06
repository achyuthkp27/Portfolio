import { useInView } from "react-intersection-observer";
import { Suspense, ReactNode } from "react";

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
 * Listens for a `force-mount-sections` custom event on window — when fired (e.g.
 * by Navigation on nav-link click), all LazySection instances mount immediately
 * so the page reaches its true height before scrolling begins.
 */
export const LazySection = ({ 
  children, 
  fallback, 
  className = "", 
  threshold = 0.01,
  rootMargin = "400px 0px",
  sectionId,
  minHeight = "600px",
}: LazySectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
  });

  return (
    <div ref={ref} className={className} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView ? (
        <Suspense fallback={fallback || <div style={{ minHeight }} className="w-full animate-pulse bg-white/5 rounded-xl" />}>
          {children}
        </Suspense>
      ) : (
        fallback || <div id={sectionId} style={{ minHeight }} className="w-full" />
      )}
    </div>
  );
};
