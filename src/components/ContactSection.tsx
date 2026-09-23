import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { PillLink, PillButton } from "./ui/Pill";
import { reveal } from "@/lib/motion";
import { FillText } from "./ui/FillText";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.965, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1400px] mx-auto text-center origin-top"
      >
        <FillText
          as="h2"
          text="Building something serious with AI or backend systems? Let's talk."
          className="t-statement text-[3.4rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] max-w-5xl mx-auto text-balance"
          offset={["start 0.9", "end 0.5"]}
        />
        <motion.p {...reveal(0.05)} className="t-caps text-muted max-w-xl mx-auto mt-8">
          Hiring for backend, platform, or AI engineering, or have a systems question? Email gets the fastest response,
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
      </motion.div>
    </section>
  );
};

export default ContactSection;
