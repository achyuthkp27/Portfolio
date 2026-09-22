import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { hasKeyboardAndPointer, isMacPlatform, openCommandMenu } from "@/lib/shortcuts";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { DUR, EASE } from "@/lib/motion";
import { NAV_ITEMS } from "@/data/nav";
import { PROFILE } from "@/data/profile";
import { PillButton, PillLink } from "./ui/Pill";

/** The bar the reference uses: wordmark left, uppercase links centred, one white pill right. */
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const scrollToSection = useSectionScroll();
  const isHomePage = location.pathname === "/" || location.pathname === "";
  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, isMenuOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const [activeSection, setActiveSection] = useState("");
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 40);
    if (latest < window.innerHeight * 0.5) setActiveSection("");
  });

  const [shortcut, setShortcut] = useState<{ show: boolean; mod: string }>({ show: false, mod: "Ctrl" });
  useEffect(() => {
    setShortcut({ show: hasKeyboardAndPointer(), mod: isMacPlatform() ? "⌘" : "Ctrl" });
  }, []);

  // Scroll spy: the topmost section crossing a thin reading line mid-viewport is current
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("");
      return;
    }
    const targets = new Map<string, Element>();
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        });
        const topmost = [...crossing]
          .map((id) => ({ id, top: targets.get(id)?.getBoundingClientRect().top ?? Infinity }))
          .sort((a, b) => a.top - b.top)[0];
        if (topmost) setActiveSection(topmost.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    const rescan = () => {
      NAV_ITEMS.forEach(({ id }) => {
        const element = document.querySelector(`main #${id}`);
        if (!element || targets.get(id) === element) return;
        const previous = targets.get(id);
        if (previous) {
          observer.unobserve(previous);
          crossing.delete(id);
        }
        targets.set(id, element);
        observer.observe(element);
      });
    };
    let timer: ReturnType<typeof setTimeout> | null = null;
    const domObserver = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(rescan, 300);
    });
    rescan();
    const main = document.getElementById("main-content");
    if (main) domObserver.observe(main, { childList: true, subtree: true });
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
      domObserver.disconnect();
    };
  }, [isHomePage]);

  const goTo = (id: string) => {
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  const resumeHref = `${import.meta.env.BASE_URL}Achyuth KP_Resume.pdf`;
  const link = (active: boolean) =>
    `font-body text-[14px] font-medium uppercase tracking-[0.03em] transition-colors duration-fast ${active ? "text-snow" : "text-snow/70 hover:text-snow"}`;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.base, ease: EASE, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 text-snow"
      >
        <div
          className={`absolute inset-0 bg-night/85 backdrop-blur-md border-b border-line transition-opacity duration-base pointer-events-none ${
            isScrolled && !isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        <div className="relative flex items-center justify-between gap-6 px-6 md:px-10 lg:px-12 h-[72px] md:h-[76px]">
          <button
            type="button"
            onClick={() => goTo("top")}
            className="t-heading text-[22px] md:text-2xl whitespace-nowrap flex items-baseline gap-1.5"
          >
            {PROFILE.first} <span className="text-muted">{PROFILE.last}</span>
            <span className="t-figure text-[10px] text-muted -translate-y-2" aria-hidden="true">
              ©
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(item.id)}
                  aria-current={activeSection === item.id ? "location" : undefined}
                  className={link(activeSection === item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {shortcut.show && (
              <button
                type="button"
                onClick={openCommandMenu}
                title="Quick menu"
                aria-label={`Open quick menu (${shortcut.mod === "⌘" ? "Command" : "Control"} K)`}
                className="hidden lg:inline-flex items-center gap-1 h-8 px-2.5 rounded-sm border border-line font-mono text-xs text-muted hover:text-snow transition-colors duration-fast"
              >
                <span>{shortcut.mod}</span>
                <span>K</span>
              </button>
            )}
            <PillButton size="sm" className="hidden md:inline-flex" onClick={() => goTo("contact")}>
              Let's talk
            </PillButton>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="md:hidden relative w-11 h-10 -mr-2 flex flex-col items-end justify-center gap-[6px]"
            >
              <span
                className={`block h-[2px] bg-current transition-all duration-base ease-out ${isMenuOpen ? "w-6 translate-y-[4px] rotate-45" : "w-8"}`}
              />
              <span
                className={`block h-[2px] bg-current transition-all duration-base ease-out ${isMenuOpen ? "w-6 -translate-y-[4px] -rotate-45" : "w-8"}`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast }}
            ref={menuRef}
            className="fixed inset-0 z-40 md:hidden theme-dark bg-night text-snow px-6 pt-28 pb-10 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <ol className="border-t border-line">
              {NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR.base, ease: EASE, delay: 0.05 * index }}
                  className="border-b border-line"
                >
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    className="w-full flex items-baseline gap-6 py-5 text-left"
                  >
                    <span className="t-label w-12">{String(index + 1).padStart(2, "0")}</span>
                    <span className="t-statement text-5xl">{item.label}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.base, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <PillButton onClick={() => goTo("contact")}>Let's talk</PillButton>
              <PillLink
                tone="outline"
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                download="Achyuth_KP_Resume.pdf"
              >
                Résumé
              </PillLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
