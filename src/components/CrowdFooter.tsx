import { useEffect, useState } from "react";
import { ArrowUp, Github, Instagram, Linkedin } from "lucide-react";
import { useSmoothScroll } from "@/context/smoothScroll";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { hasKeyboardAndPointer, isMacPlatform, openCommandMenu, openTerminal } from "@/lib/shortcuts";
import { NAV_ITEMS } from "@/data/nav";
import { PROFILE, SOCIALS } from "@/data/profile";
import ScrambleNumber from "@/components/ui/ScrambleNumber";
import { ExternalLink, HoverArrow } from "@/components/ui/ExternalLink";
import { Crowd } from "@/components/ui/Crowd";
import { setMotionOff, useMotionOff } from "@/lib/motionPreference";

/** The classic footer's profiles, plus Instagram */
const PROFILES = [...SOCIALS, { label: "Instagram", href: PROFILE.links.instagram }];

/** The same profiles as icon buttons in the strip under the crowd */
const ICONS = [
  { label: "GitHub", href: PROFILE.links.github, icon: <Github className="w-[18px] h-[18px]" aria-hidden="true" /> },
  {
    label: "LinkedIn",
    href: PROFILE.links.linkedin,
    icon: <Linkedin className="w-[18px] h-[18px]" aria-hidden="true" />,
  },
  {
    label: "Medium",
    href: PROFILE.links.medium,
    icon: (
      <span className="t-heading text-[17px] leading-none" aria-hidden="true">
        M
      </span>
    ),
  },
  {
    label: "Instagram",
    href: PROFILE.links.instagram,
    icon: <Instagram className="w-[18px] h-[18px]" aria-hidden="true" />,
  },
];

const control = "py-3 -my-3 inline-flex items-center gap-2 hover:text-snow transition-colors duration-fast";
const heading = "text-sm text-muted mb-4";
const link =
  "group inline-flex items-center gap-1 py-1.5 -my-1.5 text-[15px] text-snow/80 hover:text-snow transition-colors duration-fast";

/**
 * Footer as the page's last scene: who, where to go, how to reach me, a goodbye, then the crowd,
 * people walking across a white band in front of the name with me standing among them.
 * Keeps the original footer's shortcuts hint and animation switch in the strip under it.
 */
const CrowdFooter = () => {
  const { lenis } = useSmoothScroll();
  const scrollToSection = useSectionScroll();
  const [mod, setMod] = useState<string | null>(null);
  const motionOff = useMotionOff();
  useEffect(() => {
    if (hasKeyboardAndPointer()) setMod(isMacPlatform() ? "⌘" : "Ctrl");
  }, []);
  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resumeHref = `${import.meta.env.BASE_URL}${PROFILE.resume}`;

  return (
    <footer data-reveal-skip className="theme-dark relative bg-night text-snow overflow-hidden">
      <div aria-hidden="true" className="grain absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-screen" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr_1fr] md:gap-12 pt-14 pb-12 border-t border-line">
          <div>
            <button type="button" onClick={backToTop} className="t-heading text-3xl">
              {PROFILE.first}
              <span className="text-emerald-400">.</span>
            </button>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {PROFILE.title},
              <br />
              {PROFILE.city.split(",")[0]}.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className={heading}>Explore</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => scrollToSection(item.id)} className={link}>
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <ExternalLink href={resumeHref} className={link}>
                  Résumé
                  <HoverArrow />
                </ExternalLink>
              </li>
            </ul>
          </nav>

          <div>
            <p className={heading}>Get in touch</p>
            <a href={`mailto:${PROFILE.email}`} className={link}>
              {PROFILE.email}
              <HoverArrow accent />
            </a>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {PROFILES.map((s) => (
                <li key={s.label}>
                  <ExternalLink href={s.href} className={`${link} text-[13px] uppercase tracking-[0.03em]`}>
                    {s.label}
                    <HoverArrow />
                  </ExternalLink>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted">
              © <ScrambleNumber value={String(new Date().getFullYear())} /> {PROFILE.name}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6 pb-8">
          <p className="t-heading text-4xl md:text-[3.5rem] leading-[1]">
            See you around<span className="text-emerald-400">.</span>
          </p>
          <button
            type="button"
            onClick={backToTop}
            className="shrink-0 py-3 -my-3 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.03em] text-snow/70 hover:text-snow transition-colors duration-fast"
          >
            Back to top <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Crowd motionOff={motionOff} />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        {/* The bottom glass steps aside while this strip is on screen, so it stays readable */}
        <div data-glass-off className="grid gap-5 py-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <p className="text-[13px] text-snow/75">Finally, some traffic on my website.</p>
          <ul className="flex items-center gap-2.5 lg:justify-center">
            {ICONS.map((p) => (
              <li key={p.label}>
                <ExternalLink
                  href={p.href}
                  aria-label={p.label}
                  className="grid place-items-center w-10 h-10 rounded-[10px] border border-snow/20 text-snow/85 hover:text-night hover:bg-emerald-400 hover:border-emerald-400 transition-colors duration-fast"
                >
                  {p.icon}
                </ExternalLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-snow/75 lg:justify-end">
            <span aria-hidden="true" className="hidden lg:block h-6 w-px bg-snow/15" />
            {mod && (
              <button type="button" onClick={openCommandMenu} className={control}>
                <span className="t-figure text-snow/60">{mod} K</span> Quick menu
              </button>
            )}
            <button type="button" onClick={openTerminal} className={control}>
              <span className="t-figure text-snow/60">&gt;_</span> Terminal
            </button>
            <button
              type="button"
              onClick={() => setMotionOff(!motionOff)}
              aria-pressed={!motionOff}
              className={control}
            >
              <span
                aria-hidden="true"
                className={`relative h-[18px] w-8 rounded-pill transition-colors duration-fast ${motionOff ? "bg-snow/15" : "bg-emerald-400"}`}
              >
                <span
                  className={`absolute top-[3px] left-[3px] h-3 w-3 rounded-full bg-snow transition-transform duration-fast ${motionOff ? "" : "translate-x-3.5"}`}
                />
              </span>
              Animations {motionOff ? "off" : "on"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CrowdFooter;
