import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { hasKeyboardAndPointer, isMacPlatform, openCommandMenu, openTerminal } from "@/lib/shortcuts";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSmoothScroll } from "@/context/smoothScroll";
import { useMotionOff } from "@/lib/motionPreference";
import { DUR, EASE } from "@/lib/motion";
import { NAV_ITEMS } from "@/data/nav";
import { PROFILE } from "@/data/profile";
import { MenuSheet, type SheetState } from "./ui/MenuSheet";

/** How long the letters take to fall out of the sheet before it goes (the CSS lasts a little less) */
const CLOSE_MS = 1100;

/**
 * A small capsule floating at the top centre: the name, the section you are in, the quick-menu
 * key, and a white "⋯" button that opens the menu sheet. Escape, the close button, a click on
 * the blurred page, or picking a section closes it; a picked section scrolls into view once the
 * sheet has gone and the page can scroll again.
 */
const PillNavigation = () => {
  const [sheet, setSheet] = useState<SheetState | "closed">("closed");
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "";
  const active = useActiveSection(isHomePage);
  const scrollToSection = useSectionScroll();
  const { lenis } = useSmoothScroll();
  const toggle = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotionConfig();
  const motionOff = useMotionOff();
  const [mod, setMod] = useState<string | null>(null);
  useEffect(() => {
    if (hasKeyboardAndPointer()) setMod(isMacPlatform() ? "⌘" : "Ctrl");
  }, []);

  useScrollLock(sheet !== "closed", lenis);

  // What to do once the sheet has gone: declared after the scroll lock, so the lock's cleanup
  // has already run and the page can scroll to a picked section
  const after = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (sheet !== "closed") return;
    const next = after.current;
    after.current = null;
    next?.();
  }, [sheet]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const close = useCallback(
    (then: () => void = () => toggle.current?.focus()) => {
      if (sheet !== "open") return;
      after.current = then;
      if (reduceMotion || motionOff) {
        setSheet("closed");
        return;
      }
      setSheet("closing");
      timer.current = setTimeout(() => setSheet("closed"), CLOSE_MS);
    },
    [sheet, reduceMotion, motionOff],
  );

  useEffect(() => {
    if (sheet !== "open") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, close]);

  const current = NAV_ITEMS.find((item) => item.id === active)?.label;

  return (
    <>
      <motion.nav
        aria-label="Site"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.base, ease: EASE, delay: 0.1 }}
        className="fixed top-4 md:top-5 inset-x-0 mx-auto z-50 w-[min(380px,calc(100vw-32px))] text-snow"
      >
        <div className="flex items-center gap-3 h-[52px] pl-4 pr-2 rounded-[18px] border border-snow/10 bg-graphite/85 backdrop-blur-xl shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_hsl(0_0%_100%/0.06)]">
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            className="min-w-0 flex items-baseline gap-2 py-3 -my-3 text-left"
          >
            <span className="t-heading text-[19px] whitespace-nowrap">
              {PROFILE.first} <span className="text-muted">{PROFILE.last}</span>
            </span>
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.span
                  key={current}
                  data-testid="current-section"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: DUR.fast }}
                  className="hidden min-[380px]:inline text-[12px] text-snow/50 whitespace-nowrap"
                >
                  / {current}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <div className="ml-auto flex items-center gap-2">
            {mod && (
              <button
                type="button"
                onClick={openCommandMenu}
                title="Quick menu"
                aria-label={`Open quick menu (${mod === "⌘" ? "Command" : "Control"} K)`}
                className="hidden lg:inline-flex items-center gap-1 h-8 px-2 rounded-md font-mono text-xs text-muted hover:text-snow transition-colors duration-fast"
              >
                {mod} K
              </button>
            )}
            <button
              ref={toggle}
              type="button"
              onClick={() => (sheet === "closed" ? setSheet("open") : close())}
              aria-expanded={sheet === "open"}
              aria-haspopup="dialog"
              aria-label="Open menu"
              className="relative grid place-items-center w-11 h-9 rounded-[11px] bg-snow text-night hover:bg-stone transition-colors duration-fast before:absolute before:content-[''] before:-inset-1"
            >
              <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.nav>

      {sheet !== "closed" && (
        <MenuSheet
          state={sheet}
          active={active}
          onClose={() => close()}
          onGo={(id) => close(() => scrollToSection(id))}
          onTerminal={() => close(openTerminal)}
        />
      )}
    </>
  );
};

export default PillNavigation;
