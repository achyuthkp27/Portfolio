import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "./ui/SmoothScroll";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLocation } from "react-router-dom";

import Logo from "./ui/Logo";
import MagneticButton from "./ui/MagneticButton";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();
  const { lenis } = useSmoothScroll();
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("");
      return;
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        let nextActiveSection = "";
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            nextActiveSection = entry.target.id;
          }
        });

        if (nextActiveSection) {
          setActiveSection(nextActiveSection);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.25 }
    );

    // Track which sections we're already observing
    const observedIds = new Set<string>();

    const observeAllSections = () => {
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        if (!observedIds.has(section.id)) {
          observedIds.add(section.id);
          sectionObserver.observe(section);
        }
      });
    };

    // Initial scan
    observeAllSections();

    // Re-scan whenever the DOM changes (LazySection mounting new sections)
    const domObserver = new MutationObserver(() => observeAllSections());
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      sectionObserver.disconnect();
      domObserver.disconnect();
    };
  }, [isHomePage]);

  const scrollToTarget = (element: HTMLElement) => {
    if (lenis) {
      lenis.scrollTo(element, { duration: 1.2, offset: 0 });
    } else {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Process", href: "#process" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    setIsMobileMenuOpen(false);

    // Check if the real section already exists
    const existingSection = document.querySelector(`section#${targetId}`) as HTMLElement | null;
    if (existingSection) {
      scrollToTarget(existingSection);
      return;
    }

    // Section not mounted yet — force ALL lazy sections to mount immediately.
    // This ensures the page reaches its true height so scroll positions are accurate.
    window.dispatchEvent(new Event("force-mount-sections"));

    // Poll for the real <section> to appear (lazy import is async), then scroll.
    // Once found, keep re-scrolling until the element is actually near the
    // viewport top — this handles layout shifts from other sections still mounting.
    let findAttempts = 0;
    const poll = setInterval(() => {
      findAttempts++;
      const realSection = document.querySelector(`section#${targetId}`) as HTMLElement | null;

      if (realSection) {
        clearInterval(poll);
        
        let scrollRetries = 0;
        const ensurePosition = () => {
          if (scrollRetries >= 15) return; // 6s max (15 × 400ms)
          scrollRetries++;

          scrollToTarget(realSection);

          setTimeout(() => {
            const rect = realSection.getBoundingClientRect();
            // If the section isn't within 50px of the top of the viewport, retry
            if (Math.abs(rect.top) > 50) {
              ensurePosition();
            }
          }, 400);
        };

        ensurePosition();
      }

      if (findAttempts > 25) clearInterval(poll);
    }, 200);
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
          className="absolute inset-0 bg-black/60 backdrop-blur-xl border-b border-white/[0.06] pointer-events-none"
        >
          {/* Gradient shimmer line on bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </motion.div>

        <div className="max-w-[1800px] mx-auto flex items-center justify-between relative z-10">
          {/* Logo / Name */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            whileHover={{ scale: 1.05 }}
            className="font-display text-lg font-bold tracking-tight text-white"
          >
            ACHYUTH<span className="opacity-50">.DEV</span>
          </motion.a>

          {/* Desktop Nav — Pill-style active indicator */}
          <div className="hidden md:flex items-center relative">
            <ul className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-sm">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.substring(1);
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
                    <a
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative z-10 block px-4 py-1.5 text-[11px] font-mono tracking-widest uppercase transition-colors rounded-full ${
                        isActive
                          ? "text-white"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Right side - CTA */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              className="md:hidden text-white hover:opacity-70 transition-opacity font-mono text-xs tracking-widest uppercase"
            >
              {isMobileMenuOpen ? "CLOSE" : "MENU"}
            </button>

            <MagneticButton>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="hidden md:flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-white/70 hover:text-white transition-all border border-white/10 hover:border-emerald-500/30 px-5 py-2 rounded-full hover:bg-emerald-500/5 group relative overflow-hidden"
              >
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                <span className="relative z-10">[ GET_IN_TOUCH ]</span>
              </a>
            </MagneticButton>
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
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl">
              <div className="flex flex-col items-center justify-center h-full gap-6">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
                    className={`text-3xl font-display font-semibold tracking-tight transition-colors ${
                      activeSection === item.href.substring(1)
                        ? "text-white"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#contact"
                  aria-label="Hire Me"
                  onClick={(e) => handleScroll(e, "#contact")}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="mt-6 px-8 py-3 text-sm font-mono font-bold tracking-widest uppercase bg-white text-black hover:bg-emerald-400 transition-colors"
                >
                  Hire Me
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
