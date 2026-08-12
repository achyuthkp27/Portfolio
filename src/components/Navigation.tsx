import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useSmoothScroll } from "./ui/SmoothScroll";
import { useState, useEffect, useRef } from "react";
import { Menu, Download } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "./ui/Logo";
import MagneticButton from "./ui/MagneticButton";

const Navigation = () => {
  const scrollTrackerRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();
  const { lenis } = useSmoothScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/" || location.pathname === "";

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
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    setIsMobileMenuOpen(false);

    // Clear any existing scroll tracking interval to prevent conflicts if user clicks multiple links
    if (scrollTrackerRef.current) {
      clearInterval(scrollTrackerRef.current);
      scrollTrackerRef.current = null;
    }

    // If we're NOT on the homepage, navigate there first, then scroll
    if (!isHomePage) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(targetId) || document.querySelector(`section#${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return;
    }

    let targetElement = document.getElementById(targetId) || document.querySelector(`section#${targetId}`);

    if (targetElement) {
      // Start the initial smooth scroll animation
      scrollToTarget(targetElement as HTMLElement);

      // Track the ABSOLUTE document Y coordinate of the target.
      // We only re-trigger the scroll if a lazy-loaded component above us
      // mounts and changes its height, shifting the entire document layout.
      let currentTargetY = targetElement.getBoundingClientRect().top + window.scrollY;
      let scrollRetries = 0;

      const poll = setInterval(() => {
        // The placeholder might have been destroyed and replaced by the real section,
        // so we must continually re-query the DOM element.
        targetElement = document.querySelector(`section#${targetId}`) || document.getElementById(targetId);
        
        if (targetElement) {
          const newY = targetElement.getBoundingClientRect().top + window.scrollY;
          
          // If the element's absolute position in the document shifted by more than 50px
          // (meaning a layout shift occurred above it), we update the scroll target!
          if (Math.abs(newY - currentTargetY) > 50) {
            currentTargetY = newY;
            scrollToTarget(targetElement as HTMLElement);
          }
        }

        scrollRetries++;
        if (scrollRetries >= 30) {
          if (scrollTrackerRef.current) {
            clearInterval(scrollTrackerRef.current);
            scrollTrackerRef.current = null;
          }
        }
      }, 200);

      scrollTrackerRef.current = poll;

      // If the user manually interacts with the scrollbar/wheel, stop tracking to avoid fighting them
      const stopTracking = () => {
        if (scrollTrackerRef.current) {
          clearInterval(scrollTrackerRef.current);
          scrollTrackerRef.current = null;
        }
      };
      window.addEventListener('wheel', stopTracking, { once: true, passive: true });
      window.addEventListener('touchstart', stopTracking, { once: true, passive: true });
    }
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
                href="/Achyuth KP_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="Achyuth_KP_Resume.pdf"
                className="hidden md:flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-white/70 hover:text-white transition-all px-4 py-2 hover:bg-white/5 rounded-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="relative z-10">RESUME</span>
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="hidden md:flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-white/70 hover:text-white transition-all border border-white/10 hover:border-emerald-500/30 px-5 py-2 rounded-full hover:bg-emerald-500/5 group relative overflow-hidden"
              >
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                <span className="relative z-10">Get in touch</span>
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
