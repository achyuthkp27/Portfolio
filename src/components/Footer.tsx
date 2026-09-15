import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useSmoothScroll } from "./ui/SmoothScroll";
import { hasKeyboardAndPointer, isMacPlatform } from "@/lib/shortcuts";

const kbdClass =
  "inline-flex h-6 min-w-6 items-center justify-center gap-0.5 rounded border border-white/15 bg-white/[0.04] px-1.5 font-body text-xs font-medium leading-none text-white/80";

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/achyuthkp27", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/kpachyuth", label: "LinkedIn" },
  { icon: Mail, href: "mailto:kpachyuthz@gmail.com", label: "Email" },
  { icon: FileText, href: "https://medium.com/@kpachyuthz", label: "Medium" },
];

const Footer = () => {
  const { lenis } = useSmoothScroll();
  // Only advertise shortcuts where they work: a real keyboard and pointer
  const [shortcutMod, setShortcutMod] = useState<string | null>(null);
  useEffect(() => {
    if (hasKeyboardAndPointer()) setShortcutMod(isMacPlatform() ? "⌘" : "Ctrl");
  }, []);

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-12 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1.5">
          <button type="button" onClick={backToTop} className="font-display text-lg font-bold tracking-tight text-white">
            Achyuth KP
          </button>
          <p className="text-sm font-body text-white/60">
            Software Engineer · Bengaluru · © {new Date().getFullYear()}
          </p>
        </div>

        {shortcutMod ? (
          <p className="hidden lg:flex items-center gap-2 text-sm font-body text-white/55">
            <kbd className={kbdClass}>{shortcutMod} K</kbd> quick menu
            <span className="text-white/25" aria-hidden="true">·</span>
            <kbd className={kbdClass}><span className="text-lg leading-none translate-y-[3px]">`</span></kbd> terminal
          </p>
        ) : (
          <p className="hidden md:block text-sm font-body text-white/50">Built with React, TypeScript, and Tailwind</p>
        )}

        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/65 hover:text-white hover:border-white/30 transition-colors"
            >
              <link.icon className="w-4 h-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
