import { useInView } from "react-intersection-observer";
import { Suspense, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Wraps a lazy-loaded component and only renders it (triggering the network request)
 * once it is near the viewport. This prevents "network storms" where 10+ chunks 
 * are requested simultaneously on page load.
 */
export const LazySection = ({ 
  children, 
  fallback, 
  className = "", 
  threshold = 0.01,
  rootMargin = "400px 0px" // Start loading 400px before it enters the screen
}: LazySectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
  });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <Suspense fallback={fallback || <div className="h-96 w-full animate-pulse bg-white/5 rounded-xl" />}>
          {children}
        </Suspense>
      ) : (
        fallback || <div className="h-96 w-full" />
      )}
    </div>
  );
};
