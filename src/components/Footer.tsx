import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/context/smoothScroll";
import { hasKeyboardAndPointer, isMacPlatform } from "@/lib/shortcuts";
import { PROFILE } from "@/data/profile";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

const LINKS = [
  { label: "LinkedIn", href: PROFILE.links.linkedin },
  { label: "GitHub", href: PROFILE.links.github },
  { label: "Medium", href: PROFILE.links.medium },
  { label: "Résumé", href: `${import.meta.env.BASE_URL}Achyuth KP_Resume.pdf` },
];

const kbd =
  "inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-line px-1.5 font-mono text-[11px] leading-none text-snow/80";

/**
 * Footer: wordmark, the social links, scroll to top, then copyright, then the name at
 * wordmark scale, filled with a dot matrix and clipped by the bottom of the page.
 */
const Footer = () => {
  const { lenis } = useSmoothScroll();
  const [mod, setMod] = useState<string | null>(null);
  useEffect(() => {
    if (hasKeyboardAndPointer()) setMod(isMacPlatform() ? "⌘" : "Ctrl");
  }, []);
  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer data-reveal-skip className="theme-dark relative bg-night text-snow overflow-hidden">
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none mix-blend-screen"
      >
        <filter id="footer-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#footer-grain)" />
      </svg>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-8 border-t border-line">
          <button type="button" onClick={backToTop} className="t-heading text-2xl flex items-baseline gap-1.5">
            {PROFILE.first} <span className="text-muted">{PROFILE.last}</span>
            <span className="t-figure text-[10px] text-muted -translate-y-2" aria-hidden="true">
              ©
            </span>
          </button>
          <ul className="flex flex-wrap items-center gap-6">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium uppercase tracking-[0.03em] text-snow/70 hover:text-snow transition-colors duration-fast"
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={backToTop}
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.03em] text-snow/70 hover:text-snow transition-colors duration-fast"
          >
            Scroll to top <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-t border-line">
          <p className="text-sm text-muted">
            © <ScrambleNumber value={String(new Date().getFullYear())} /> {PROFILE.name}. {PROFILE.title},{" "}
            {PROFILE.city.split(",")[0]}.
          </p>
          {mod ? (
            <p className="hidden lg:flex items-center gap-2 t-figure text-xs text-muted">
              <kbd className={kbd}>{mod} K</kbd> quick menu <span className="opacity-40">·</span>{" "}
              <kbd className={kbd}>`</kbd> terminal
            </p>
          ) : (
            <p className="text-sm text-muted">React · TypeScript · Tailwind</p>
          )}
        </div>
      </div>

      {/* The name, dot-matrix filled, cut by the bottom edge of the page */}
      <div aria-hidden="true" className="relative h-[29vw] md:h-[26vw] lg:h-[24vw] overflow-hidden select-none">
        <span
          className="absolute left-1/2 -translate-x-1/2 top-[0.02em] font-body font-semibold tracking-[-0.05em] leading-[0.86] whitespace-nowrap text-[32vw] md:text-[29vw] lg:text-[27vw] text-transparent bg-clip-text"
          style={{
            backgroundImage: "radial-gradient(circle at center, hsl(0 0% 100% / 0.2) 0.9px, transparent 1.2px)",
            backgroundSize: "6px 6px",
            WebkitTextStroke: "1px hsl(0 0% 100% / 0.05)",
          }}
        >
          {PROFILE.first}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
