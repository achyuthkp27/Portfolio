import { useInView } from "react-intersection-observer";
import { Component, Suspense, ReactNode, useCallback, useEffect, useState, type CSSProperties } from "react";
import { isChunkLoadError, reloadOnce } from "@/components/ErrorBoundary";

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };

/**
 * Sections waiting to mount on idle, in page order. One mounts per idle callback, so the
 * page never takes them all in a single long task that would stall a slow laptop mid-scroll.
 */
const idleQueue: Array<() => void> = [];
let draining = false;
const drainIdleQueue = () => {
  const w = window as IdleWindow;
  const next = () => {
    const mount = idleQueue.shift();
    mount?.();
    if (idleQueue.length) schedule();
    else draining = false;
  };
  const schedule = () =>
    w.requestIdleCallback ? w.requestIdleCallback(next, { timeout: 2000 }) : window.setTimeout(next, 50);
  if (draining) return;
  draining = true;
  schedule();
};

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
  /** The same below 768px, where most sections stack and run much taller */
  minHeightMobile?: string;
}

/** Reserved height as CSS variables, so phones and desktops each get their own without a JS media query */
const RESERVE = "min-h-[var(--mh-sm)] md:min-h-[var(--mh)]";

/**
 * Keeps a failing section to itself: it renders as its empty placeholder, at the reserved height so
 * the page doesn't jump, and the rest of the page carries on. A chunk lost to a deploy reloads the
 * page once to fetch the new one, under the same 10-second guard as the root boundary.
 */
class SectionBoundary extends Component<{ children: ReactNode; sectionId?: string }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Section failed to render:", error);
    if (isChunkLoadError(error)) reloadOnce();
  }

  render() {
    if (this.state.failed) return <div id={this.props.sectionId} className={`w-full ${RESERVE}`} />;
    return this.props.children;
  }
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
  minHeightMobile = minHeight,
}: LazySectionProps) => {
  const vars = { "--mh": minHeight, "--mh-sm": minHeightMobile } as CSSProperties;
  const { ref, inView: near } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
  });
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const mount = () => setIdle(true);
    const t = window.setTimeout(() => {
      idleQueue.push(mount);
      drainIdleQueue();
    }, 4000);
    return () => {
      window.clearTimeout(t);
      const i = idleQueue.indexOf(mount);
      if (i >= 0) idleQueue.splice(i, 1);
    };
  }, []);
  const inView = near || idle;

  // Well off screen, the section's looping CSS animations pause (see [data-offscreen] in index.css),
  // so a visitor reading elsewhere isn't paying for sparkles and blinking lights they can't see
  const { ref: visibleRef, inView: visible } = useInView({ rootMargin: "50% 0px", initialInView: true });
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      ref(node);
      visibleRef(node);
    },
    [ref, visibleRef],
  );

  return (
    <div
      ref={setRefs}
      data-offscreen={visible ? undefined : ""}
      className={`relative ${inView ? "" : RESERVE} ${className}`}
      style={vars}
    >
      {inView ? (
        <SectionBoundary sectionId={sectionId}>
          <Suspense fallback={fallback || <div className={`w-full animate-pulse bg-white/5 rounded-xl ${RESERVE}`} />}>
            {children}
          </Suspense>
        </SectionBoundary>
      ) : (
        fallback || <div id={sectionId} className={`w-full ${RESERVE}`} />
      )}
    </div>
  );
};
