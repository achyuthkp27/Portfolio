import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSmoothScroll } from "@/components/ui/SmoothScroll";

const WAIT_FOR_TARGET_MS = 3000;
const TRACK_INTERVAL_MS = 200;
const TRACK_MAX_TICKS = 30;
const SHIFT_THRESHOLD_PX = 50;
/** How far from the viewport top still counts as "arrived" */
const ARRIVED_PX = 120;

const isHome = (pathname: string) => pathname === "/" || pathname === "";

/**
 * Scrolls to a home-page section by id, from any route.
 *
 * - From another page it navigates home first and waits for the section to exist,
 *   instead of guessing a fixed delay.
 * - Lazy sections above the target can change height after the scroll starts, so it
 *   re-aims while the target's position keeps shifting, and stops as soon as the
 *   visitor scrolls themselves.
 * - Every interval, frame, and listener is removed on the next call and on unmount.
 */
export function useSectionScroll() {
  const { lenis } = useSmoothScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const cleanupRef = useRef<(() => void) | null>(null);

  const cancel = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const scrollToElement = useCallback(
    (element: Element) => {
      if (lenis) {
        // After a route change Lenis still knows the previous page's height and would clamp the scroll
        lenis.resize();
        lenis.scrollTo(element as HTMLElement, { duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis],
  );

  const scrollToTop = useCallback(() => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lenis]);

  const trackAndScroll = useCallback(
    (id: string) => {
      const initial = document.getElementById(id);
      if (!initial) return;
      scrollToElement(initial);

      let lastY = initial.getBoundingClientRect().top + window.scrollY;
      let ticks = 0;
      const interval = window.setInterval(() => {
        const current = document.getElementById(id);
        if (current) {
          const viewportTop = current.getBoundingClientRect().top;
          const y = viewportTop + window.scrollY;
          const shifted = Math.abs(y - lastY) > SHIFT_THRESHOLD_PX;
          // Also re-aim if a scroll finished short of the target (e.g. clamped by a stale page height)
          const stalledShort = Math.abs(viewportTop) > ARRIVED_PX && !(lenis?.isScrolling ?? false);
          if (shifted || stalledShort) {
            lastY = y;
            scrollToElement(current);
          }
        }
        if (++ticks >= TRACK_MAX_TICKS) cancel();
      }, TRACK_INTERVAL_MS);

      // The visitor taking over the scroll ends the tracking
      const stop = () => cancel();
      window.addEventListener("wheel", stop, { passive: true });
      window.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("keydown", stop);

      cleanupRef.current = () => {
        window.clearInterval(interval);
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("keydown", stop);
      };
    },
    [cancel, lenis, scrollToElement],
  );

  return useCallback(
    (id: string) => {
      cancel();

      if (isHome(location.pathname)) {
        if (id === "top") scrollToTop();
        else trackAndScroll(id);
        return;
      }

      navigate("/");
      if (id === "top") return; // A fresh home page already starts at the top

      const started = performance.now();
      let frame = 0;
      const waitForTarget = () => {
        if (document.getElementById(id)) {
          cleanupRef.current = null;
          trackAndScroll(id);
        } else if (performance.now() - started < WAIT_FOR_TARGET_MS) {
          frame = requestAnimationFrame(waitForTarget);
        }
      };
      frame = requestAnimationFrame(waitForTarget);
      cleanupRef.current = () => cancelAnimationFrame(frame);
    },
    [cancel, location.pathname, navigate, scrollToTop, trackAndScroll],
  );
}
