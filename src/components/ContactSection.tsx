import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { PillLink, PillButton } from "./ui/Pill";
import { reveal } from "@/lib/motion";

const LINKS = [
  { label: "LinkedIn", href: PROFILE.links.linkedin },
  { label: "GitHub", href: PROFILE.links.github },
  { label: "Medium", href: PROFILE.links.medium },
  { label: "Résumé", href: `${import.meta.env.BASE_URL}Achyuth KP_Resume.pdf` },
];

/** The closing block, as the reference closes: an uppercase statement, one line, one pill. Then the address. */
const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
    } catch {
      // Clipboard blocked: the address is selectable text, and the mail link still works
    }
  };
  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Hello from your portfolio")}`;

  return (
    <section id="contact" className="theme-dark bg-night text-snow py-28 lg:py-40 px-6 md:px-10 lg:px-12 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto text-center">
        <motion.h2
          {...reveal()}
          className="t-statement text-[3.4rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] max-w-5xl mx-auto text-balance"
        >
          Backend problems worth solving? Let's talk.
        </motion.h2>
        <motion.p {...reveal(0.05)} className="t-caps text-muted max-w-xl mx-auto mt-8">
          Hiring for backend or banking platform work, or have a systems question? Email gets the fastest response,
          usually within a day.
        </motion.p>
        <motion.div {...reveal(0.1)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <PillLink size="lg" href={mailto}>
            Contact me
          </PillLink>
          <PillButton tone="outline" size="lg" arrow={false} onClick={copy} aria-live="polite">
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : PROFILE.email}
          </PillButton>
        </motion.div>
        <motion.ul {...reveal(0.15)} className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-medium uppercase tracking-[0.03em] text-muted hover:text-snow transition-colors duration-fast"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default ContactSection;
