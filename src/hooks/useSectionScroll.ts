import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSmoothScroll } from "@/context/smoothScroll";

const WAIT_FOR_TARGET_MS = 3000;
const TRACK_INTERVAL_MS = 200;
const TRACK_MAX_TICKS = 30;
const SHIFT_THRESHOLD_PX = 50;
/** How far from the viewport top still counts as "arrived" */
const ARRIVED_PX = 120;

const isHome = (pathname: string) => pathname === "/" || pathname === "";

/** Where a pinned card rests under the nav when its sticky top cannot be read */
const FALLBACK_PIN_PX = 76;

/**
 * The element's viewport top as if nothing in its chain were stuck. A sticky element (or one
 * inside one) reports where it is pinned, not where it sits in the flow, so every sticky box in
 * the chain is made static (which also drops its top offset) for one synchronous measurement and
 * restored before the browser paints.
 */
const inFlowTop = (element: Element) => {
  const stuck: { el: HTMLElement; value: string; priority: string }[] = [];
  for (let node: Element | null = element; node && node !== document.body; node = node.parentElement) {
    if (node instanceof HTMLElement && getComputedStyle(node).position === "sticky") {
      stuck.push({
        el: node,
        value: node.style.getPropertyValue("position"),
        priority: node.style.getPropertyPriority("position"),
      });
    }
  }
  if (stuck.length === 0) return element.getBoundingClientRect().top;
  for (const { el } of stuck) el.style.setProperty("position", "static", "important");
  const top = element.getBoundingClientRect().top;
  for (const { el, value, priority } of stuck) {
    if (value) el.style.setProperty("position", value, priority);
    else el.style.removeProperty("position");
  }
  return top;
};

/** How far below the viewport top a sticky element rests once pinned: its own sticky top */
const pinOffset = (element: Element) => {
  const top = parseFloat(getComputedStyle(element).top);
  // A card taller than the screen pins above the viewport top; land it with its head under the nav instead
  return Number.isFinite(top) && top >= 0 ? top : FALLBACK_PIN_PX;
};

/**
 * Distance from the viewport top to where a section should land: its top, or its last screen when
 * marked data-scroll-end. A sticky target (a stacked work card) lands where it pins, measured from
 * its place in the flow, so the card asked for is the one on top, not whichever card is stuck there.
 */
const aimOffset = (element: Element) => {
  const top = inFlowTop(element);
  if (getComputedStyle(element).position === "sticky") return top - pinOffset(element);
  if (element instanceof HTMLElement && element.dataset.scrollEnd !== undefined) {
    return top + Math.max(0, element.offsetHeight - window.innerHeight);
  }
  return top;
};

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
      // A pinned scroll sequence marked data-scroll-end lands on its finished state, not its start
      const y = window.scrollY + aimOffset(element);
      if (lenis) {
        // After a route change Lenis still knows the previous page's height and would clamp the scroll
        lenis.resize();
        lenis.scrollTo(y, { duration: 1.2 });
      } else {
        window.scrollTo({ top: y, behavior: "smooth" });
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

      let lastY = aimOffset(initial) + window.scrollY;
      let ticks = 0;
      // Without Lenis there is no isScrolling flag, so "still moving" is read from the page itself
      let prevScroll = window.scrollY;
      const interval = window.setInterval(() => {
        const current = document.getElementById(id);
        if (current) {
          const viewportTop = aimOffset(current);
          const y = viewportTop + window.scrollY;
          const shifted = Math.abs(y - lastY) > SHIFT_THRESHOLD_PX;
          // Also re-aim if a scroll finished short of the target (e.g. clamped by a stale page height)
          const moving = lenis ? lenis.isScrolling : Math.abs(window.scrollY - prevScroll) > 1;
          const stalledShort = Math.abs(viewportTop) > ARRIVED_PX && !moving;
          if (shifted || stalledShort) {
            lastY = y;
            scrollToElement(current);
          }
        }
        prevScroll = window.scrollY;
        if (++ticks >= TRACK_MAX_TICKS) cancel();
      }, TRACK_INTERVAL_MS);

      // The visitor taking over the scroll ends the tracking. The keypress or click that asked for
      // this scroll can still be dispatching while these listeners go on (Enter in the quick menu),
      // so anything that happened before tracking started is ignored.
      const startedAt = performance.now();
      const stop = (event: Event) => {
        if (event.timeStamp > startedAt) cancel();
      };
      window.addEventListener("wheel", stop, { passive: true });
      window.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("keydown", stop);
      // Grabbing the scrollbar fires none of the above
      window.addEventListener("pointerdown", stop, { passive: true });

      cleanupRef.current = () => {
        window.clearInterval(interval);
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("keydown", stop);
        window.removeEventListener("pointerdown", stop);
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
