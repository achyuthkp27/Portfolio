import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { useLocation } from "react-router-dom";
import { hasKeyboardAndPointer, isMacPlatform, openCommandMenu } from "@/lib/shortcuts";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const scrollToSection = useSectionScroll();
  const isHomePage = location.pathname === "/" || location.pathname === "";
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(mobileMenuRef, isMobileMenuOpen);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const [activeSection, setActiveSection] = useState("");
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    // Back in the hero, no section is current
    if (latest < window.innerHeight * 0.5) setActiveSection("");
  });

  const [shortcutHints, setShortcutHints] = useState<{ show: boolean; mod: string }>({ show: false, mod: "Ctrl" });

  useEffect(() => {
    setShortcutHints({ show: hasKeyboardAndPointer(), mod: isMacPlatform() ? "⌘" : "Ctrl" });
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("");
      return;
    }

    // What the nav highlights, and what to watch for it. "Education" labels a 125px row
    // inside the awards band — too short for a fast scroll to land on — so watch the whole
    // band and report it as education. #writing has no nav item, so nothing watches it.
    const spyTargets = [
      { navId: "about", elementId: "about" },
      { navId: "experience", elementId: "experience" },
      { navId: "projects", elementId: "projects" },
      { navId: "skills", elementId: "skills" },
      { navId: "education", elementId: "awards" },
      { navId: "contact", elementId: "contact" },
    ];

    // Which observed elements currently cross the reading line, and where each one is.
    const targets = new Map<string, Element>();
    const navIdByElementId = new Map(spyTargets.map((t) => [t.elementId, t.navId]));
    const crossing = new Set<string>();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const navId = navIdByElementId.get(entry.target.id);
          if (!navId) return;
          if (entry.isIntersecting) crossing.add(navId);
          else crossing.delete(navId);
        });

        // Sections are metres tall and often overlap the line together, so take the
        // highest one on the page rather than whichever entry happened to fire last.
        const topmost = [...crossing]
          .map((id) => ({ id, top: targets.get(id)?.getBoundingClientRect().top ?? Infinity }))
          .sort((a, b) => a.top - b.top)[0];

        if (topmost) setActiveSection(topmost.id);
      },
      // A thin band across the middle of the viewport is the reading line. threshold 0
      // means "touches the line at all" — with a threshold, a section taller than the
      // band could never satisfy it, which is every section on this page.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // A LazySection placeholder carries the section id until the real section mounts and
    // replaces it. Following the id alone would leave us observing a detached node, so
    // re-point whenever the element behind an id changes.
    const observeAllSections = () => {
      spyTargets.forEach(({ navId, elementId }) => {
        const element = document.querySelector(`main #${elementId}`);
        if (!element || targets.get(navId) === element) return;

        const previous = targets.get(navId);
        if (previous) {
          sectionObserver.unobserve(previous);
          crossing.delete(navId);
        }
        targets.set(navId, element);
        sectionObserver.observe(element);
      });
    };

    // Re-scan (debounced) whenever the DOM changes — LazySection mounts
    // replace placeholders with the real sections.
    const domObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(observeAllSections, 300);
    });

    // Initial scan
    observeAllSections();
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      sectionObserver.disconnect();
      domObserver.disconnect();
    };
  }, [isHomePage]);

  const navItems = [
    { label: "About", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Projects", id: "projects" },
    { label: "Skills", id: "skills" },
    { label: "Education", id: "education" },
    { label: "Contact", id: "contact" },
  ];

  // Buttons, not "#section" links: under HashRouter a real hash href is a route (and a 404).
  const goToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 transition-all duration-500 ${
          isScrolled
            ? "py-4"
            : "py-6"
        }`}
      >
        {/* Glassmorphism Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-black/85 border-b border-white/[0.06] pointer-events-none"
        >
          {/* Gradient shimmer line on bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </motion.div>

        <div className="max-w-[1800px] mx-auto flex items-center justify-between relative z-10">
          {/* Logo / Name */}
          <button
            type="button"
            onClick={() => goToSection("top")}
            className="font-display text-lg font-bold tracking-tight text-white hover:text-white/80 transition-colors"
          >
            Achyuth KP
          </button>

          {/* Desktop Nav — Pill-style active indicator */}
          <div className="hidden md:flex items-center relative">
            <ul className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-sm">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-white/10 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => goToSection(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative z-10 block px-4 py-1.5 text-[13px] font-body font-medium transition-colors rounded-full ${
                        isActive
                          ? "text-white"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Right side - CTA */}
          <div className="flex items-center gap-4">
            {/* Quick-menu key — desktop with a real keyboard only */}
            {shortcutHints.show && (
              <button
                type="button"
                onClick={openCommandMenu}
                title="Quick menu"
                aria-label={`Open quick menu (${shortcutHints.mod === "⌘" ? "Command" : "Control"} K)`}
                className="hidden lg:inline-flex items-center gap-1 h-8 px-2.5 rounded-md border border-white/15 bg-white/[0.03] font-body text-xs font-medium text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                <span className={shortcutHints.mod === "⌘" ? "text-[13px] leading-none" : ""}>{shortcutHints.mod}</span>
                <span>K</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden text-white hover:opacity-70 transition-opacity font-body text-sm font-medium"
            >
              {isMobileMenuOpen ? "Close" : "Menu"}
            </button>

              <a
                href={`${import.meta.env.BASE_URL}Achyuth KP_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                download="Achyuth_KP_Resume.pdf"
                className="hidden md:flex items-center gap-2 text-[13px] font-body font-medium text-white/75 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-full"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Résumé</span>
              </a>

              <button
                type="button"
                onClick={() => goToSection("contact")}
                className="hidden md:flex items-center text-[13px] font-body font-medium text-white hover:text-white transition-colors border border-white/20 hover:border-emerald-400/50 px-5 py-2 rounded-full hover:bg-emerald-500/5"
              >
                <span>Get in touch</span>
              </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu — Improved stagger */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={mobileMenuRef}
            className="fixed inset-0 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="absolute inset-0 bg-black">
              <div className="flex flex-col items-center justify-center h-full gap-6">
                {navItems.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item.label}
                    onClick={() => goToSection(item.id)}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
                    className={`text-3xl font-display font-semibold tracking-tight transition-colors ${
                      activeSection === item.id
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.button
                  type="button"
                  onClick={() => goToSection("contact")}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="mt-6 px-8 py-3 text-sm font-body font-semibold bg-white text-black hover:bg-emerald-100 transition-colors"
                >
                  Get in touch
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
