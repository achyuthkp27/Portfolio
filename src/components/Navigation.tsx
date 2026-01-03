import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

import Logo from "./ui/Logo";
import MagneticButton from "./ui/MagneticButton";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-all duration-300`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Logo / Name */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05 }}
            className="font-display text-lg font-bold tracking-tight text-white"
          >
            ACHYUTH<span className="opacity-50">.DEV</span>
          </motion.a>

          {/* Desktop Nav - Minimalist */}
          <ul className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className={`text-xs font-mono tracking-widest uppercase transition-colors relative group ${activeSection === item.href.substring(1)
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                    }`}
                >
                  <span className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">/</span>
                  {item.label}
                </a>
              </motion.li>
            ))}
          </ul>

          {/* Right side - Just CTA */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Minimal */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:opacity-70 transition-opacity"
            >
              {isMobileMenuOpen ? "CLOSE" : "MENU"}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="hidden md:block text-xs font-mono tracking-widest uppercase text-white/70 hover:text-white transition-colors border border-white/20 px-4 py-2 hover:bg-white/5"
            >
              [ GET_IN_TOUCH ]
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : "100%",
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 md:hidden"
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="text-2xl font-display font-semibold text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              initial={{ opacity: 0, y: 20 }}
              animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-4 px-8 py-3 text-lg font-medium bg-gradient-cyber text-primary-foreground rounded-full"
            >
              Hire Me
            </motion.a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Navigation;
