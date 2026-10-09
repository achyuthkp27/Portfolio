import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useSmoothScroll } from "@/context/smoothScroll";

/** The dashed rule the stacked sections share */
export const DASH = "border-dashed border-snow/[0.12]";

/** The nav's height: where a card pins */
const PIN = 76;
/** Room left around a focused control when the page is moved to show it */
const FOCUS_GAP = 8;
/** Focus this soon after a pointer press came from that press, not from the keyboard */
const POINTER_FOCUS_MS = 500;

let lastPointerDown = 0;
if (typeof document !== "undefined") {
  document.addEventListener("pointerdown", () => (lastPointerDown = performance.now()), {
    capture: true,
    passive: true,
  });
}

/**
 * Where to scroll so a control inside a pinned card sits on screen, below the nav and clear of
 * the next card sliding over it. Every position is the in-flow document offset (as if nothing
 * were sticky). Returns the allowed scrollY nearest to `current`, or null if none fits.
 * Exported for its tests.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const uncoveredScroll = ({
  current,
  viewport,
  cardTop,
  pin,
  nextTop,
  focusTop,
  focusBottom,
}: {
  current: number;
  viewport: number;
  /** The card's in-flow top, and the offset it pins at */
  cardTop: number;
  pin: number;
  /** The next card's in-flow top, or Infinity when this card is the last */
  nextTop: number;
  focusTop: number;
  focusBottom: number;
}): number | null => {
  const stick = cardTop - pin; // from this scrollY on, the card holds still
  const ranges: [number, number][] = [];
  // Before the card pins, everything scrolls together and the next card is still below it
  ranges.push([Math.max(0, focusBottom + FOCUS_GAP - viewport), Math.min(focusTop - PIN - FOCUS_GAP, stick)]);
  // Once pinned the control stays put on screen, until the next card's top reaches its bottom
  if (pin + focusTop - cardTop >= PIN && pin + focusBottom - cardTop <= viewport) {
    ranges.push([stick, nextTop - pin - (focusBottom - cardTop) - FOCUS_GAP]);
  }
  let best: number | null = null;
  for (const [lo, hi] of ranges) {
    if (lo > hi) continue;
    const y = Math.min(hi, Math.max(lo, current));
    if (best === null || Math.abs(y - current) < Math.abs(best - current)) best = y;
  }
  return best === null ? null : Math.round(best);
};

/**
 * One card in a section's stack, after reelio.framer.media's services: a full-width row on a
 * dashed three-column grid with + marks where the rules meet its top edge. It pins on desktop
 * and the next card slides up over it. A card taller than the space below the nav pins higher,
 * by exactly its overflow, so it scrolls until its bottom is on screen before it holds: nothing
 * is ever covered unread. Sticky does the moving, so it never lags a fast scroll; phones flow.
 */
export const StackCard = ({ index, id, children }: { index: number; id?: string; children: ReactNode }) => {
  const ref = useRef<HTMLLIElement>(null);
  const { lenis } = useSmoothScroll();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  // WCAG 2.4.11: a control tabbed to inside a pinned card can sit under the next card. Move the page, at once, to where it shows.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    const check = (target: HTMLElement) => {
      if (!desktop.matches || !el.contains(target) || document.activeElement !== target) return;
      const next = el.nextElementSibling instanceof HTMLElement ? el.nextElementSibling : null;
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const nextRect = next?.getBoundingClientRect();
      const covered = !!nextRect && nextRect.top < rect.bottom && nextRect.bottom > rect.top;
      if (!covered && rect.top >= PIN && rect.bottom <= window.innerHeight) return;
      // Measure in-flow positions with sticky off for a moment; it's put back before the browser paints
      const cards = next ? [el, next] : [el];
      const saved = cards.map((c) => c.style.position);
      cards.forEach((c) => (c.style.position = "static"));
      const y = window.scrollY;
      const cardTop = el.getBoundingClientRect().top + y;
      const nextTop = next ? next.getBoundingClientRect().top + y : Infinity;
      const focus = target.getBoundingClientRect();
      cards.forEach((c, i) => (c.style.position = saved[i]));
      const pin = parseFloat(el.style.getPropertyValue("--pin")) || PIN;
      const to = uncoveredScroll({
        current: y,
        viewport: window.innerHeight,
        cardTop,
        pin,
        nextTop,
        focusTop: focus.top + y,
        focusBottom: focus.bottom + y,
      });
      if (to === null || Math.abs(to - y) < 1) return;
      const smooth = lenisRef.current;
      if (smooth) smooth.scrollTo(to, { immediate: true, force: true });
      else window.scrollTo({ top: to, behavior: "instant" });
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!desktop.matches || performance.now() - lastPointerDown < POINTER_FOCUS_MS) return;
      if (!(e.target instanceof HTMLElement)) return;
      const target = e.target;
      // After the browser's own scroll-into-view for the focus has run
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => check(target));
    };
    el.addEventListener("focusin", onFocusIn);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.setProperty("--pin", `${Math.min(PIN, window.innerHeight - el.offsetHeight)}px`);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  return (
    <li
      ref={ref}
      id={id}
      className={`relative lg:sticky lg:top-[var(--pin)] bg-night border-t scroll-mt-20 ${DASH}`}
      style={{ zIndex: index + 1, "--pin": `${PIN}px` } as CSSProperties}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="relative">
          {["left-0", "left-1/3 hidden lg:block", "left-2/3 hidden lg:block", "left-full"].map((pos) => (
            <span
              key={pos}
              className={`absolute -top-[8px] -translate-x-1/2 text-snow/40 text-[14px] leading-none select-none ${pos}`}
            >
              +
            </span>
          ))}
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        {/* minmax(0,1fr) columns and min-w-0 children: nothing inside can widen the page */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 [&>*]:min-w-0 lg:min-h-[min(calc(100vh-76px),640px)] border-x ${DASH}`}
        >
          {children}
        </div>
      </div>
    </li>
  );
};

/** First column: a small figure line over the title */
export const StackHead = ({ kicker, title, foot }: { kicker: string; title: string; foot?: ReactNode }) => (
  <div className={`p-6 md:p-10 lg:py-16 lg:border-r ${DASH}`}>
    <p className="t-figure text-[12px] text-muted">{kicker}</p>
    <h3 className="mt-3 font-body font-medium tracking-[-0.03em] leading-[1.05] text-[2.25rem] md:text-[2.75rem] lg:text-[clamp(1.75rem,2.6vw,2.75rem)] break-words">
      {title}
    </h3>
    {foot}
  </div>
);

/** Middle column: whatever visual the card brings */
export const StackMiddle = ({ children }: { children: ReactNode }) => (
  <div className={`px-6 md:px-10 lg:px-0 lg:border-r ${DASH}`}>
    <div className="lg:mt-16">{children}</div>
  </div>
);

/** Last column */
export const StackBody = ({ children }: { children: ReactNode }) => (
  <div className="p-6 md:p-10 lg:py-16">{children}</div>
);

/** A mark on a soft emerald glow and a fine grid; pass an icon, or any children */
export const StackTile = ({
  icon: Icon,
  caption,
  children,
}: {
  icon?: LucideIcon;
  caption?: string;
  children?: ReactNode;
}) => (
  <div className="relative h-40 sm:h-56 md:h-72 lg:h-auto lg:aspect-[4/3] rounded-lg overflow-hidden border border-line bg-tile grid place-items-center">
    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,hsl(var(--accent-500)/0.24),transparent_70%)]" />
    <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(0_0%_100%/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
    {Icon && (
      <Icon
        className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 text-emerald-300 -mt-6"
        strokeWidth={1}
        aria-hidden="true"
      />
    )}
    {children}
    {caption && <p className="absolute left-5 bottom-5 right-5 t-figure text-[11px] text-snow/50">{caption}</p>}
  </div>
);

/** Small outlined tags, one per tool */
export const StackTags = ({ items }: { items: readonly string[] }) => (
  <ul className="mt-6 flex flex-wrap gap-2">
    {items.map((t) => (
      <li key={t} className="rounded-pill border border-line px-3 py-1 text-[12px] md:text-[13px] text-snow/75">
        {t}
      </li>
    ))}
  </ul>
);

/** The short header the stacked sections open with: label, big two-line title, and a line on the right */
export const StackIntro = ({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) => (
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-24 lg:pt-32 pb-16 lg:pb-20">
    <p className="t-label mb-10 lg:mb-14">{label}</p>
    <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-end">
      <h2 className="t-statement text-5xl md:text-7xl lg:text-[5.5rem]">{title}</h2>
      <div className="t-body text-snow/60 text-[17px] md:text-[19px] max-w-md xl:justify-self-end">{children}</div>
    </div>
  </div>
);
