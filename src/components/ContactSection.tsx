import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotionConfig,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { useLocalTime } from "@/hooks/useLocalTime";
import { useSmoothScroll } from "@/context/smoothScroll";
import { PillLink, PillButton } from "./ui/Pill";
import { clamp01 } from "@/lib/format";

/** The small card the page opens on, before it grows to fill the screen */
const CARD_W = "min(440px, 86vw)";
const CARD_H = "min(320px, 56vh)";

/**
 * The closing, as the bookend of What I believe: that section shrank a full-screen panel
 * into a card on the pale grid; this one starts as a small dark card on the same grid, with
 * the ways to reach me floating around it, and grows until it fills the screen and swallows
 * them. One heading carries it: "Let's talk." sits small in the card and grows with it until
 * it owns the screen; only then do the line and the two actions arrive under it.
 */
const ContactSection = () => {
  const reduceMotion = useReducedMotionConfig();
  const time = useLocalTime(PROFILE.timeZone);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

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

  const { lenis } = useSmoothScroll();
  const jumpToEnd = () => {
    const el = ref.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight - window.innerHeight;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo({ top: y, behavior: "instant" });
  };

  // The section arrives dark, continuing the page, and the pale ground lights up once it has pinned
  const paleIn = useTransform(p, (v) => (reduceMotion ? 1 : clamp01((v - 0.01) / 0.09)));
  // The details beside the card arrive only once the pale ground is lit: never dark green on black
  const appear = useTransform(p, (v) => (reduceMotion ? 1 : clamp01((v - 0.04) / 0.06)));

  // 0 = the small card, 1 = full screen. Function transforms keep these on the JS path.
  const grow = useTransform(p, (v) => (reduceMotion ? 1 : clamp01((v - 0.34) / 0.36)));
  const clipPath = useTransform(grow, (k) => {
    const s = 1 - k;
    return `inset(calc((100% - ${CARD_H}) / 2 * ${s}) calc((100% - ${CARD_W}) / 2 * ${s}) round ${20 * s}px)`;
  });
  // One heading carries the whole sequence: small inside the card, then growing with it
  const headScale = useTransform(grow, (k) => 0.3 + 0.7 * k);
  const headY = useTransform(p, (v) => (reduceMotion ? "-12vh" : `${-12 * clamp01((v - 0.68) / 0.12)}vh`));
  const restOpacity = useTransform(p, (v) => (reduceMotion ? 1 : clamp01((v - 0.76) / 0.12)));
  const restY = useTransform(restOpacity, (o) => (1 - o) * 30);
  const restPointer = useTransform(restOpacity, (o) => (o > 0.6 ? "auto" : "none"));
  // Invisible must also mean unreachable: hidden content leaves the tab order
  const restVisibility = useTransform(restOpacity, (o) => (o < 0.05 ? "hidden" : "visible"));

  const facts = [
    {
      label: "Local time",
      value: `${PROFILE.city.split(",")[0]} · ${time.time} ${time.period} IST`,
      side: "left",
      top: "24%",
    },
    { label: "Status", value: "Open to opportunities", side: "left", top: "58%", live: true },
    { label: "Find me on", side: "right", top: "24%" },
    {
      label: "Résumé",
      value: "Download PDF",
      href: `${import.meta.env.BASE_URL}${PROFILE.resume}`,
      side: "right",
      top: "58%",
    },
  ] as const;

  return (
    <section
      id="contact"
      ref={ref}
      data-reveal-skip
      data-glass-off
      data-scroll-end
      className={`theme-dark relative scroll-mt-0 ${reduceMotion ? "" : "h-[320vh]"}`}
    >
      {/* Keyboard way in: the actions only become visible near the end of the scroll, so
          tabbing here jumps to that finished state and the next Tab lands on "Contact me" */}
      <div className="sticky top-0 h-screen overflow-hidden bg-night">
        {/* Inside the pinned pane so it is always in view while pinned, and the jump waits two
            frames so the browser's own scroll-into-view on focus can't undo it */}
        {!reduceMotion && (
          <button
            type="button"
            onFocus={() => requestAnimationFrame(() => requestAnimationFrame(jumpToEnd))}
            onClick={jumpToEnd}
            className="sr-only"
          >
            Show contact options
          </button>
        )}
        {/* The pale ground lights up around the card once the section has pinned: no hard edge with the dark page above */}
        <motion.div aria-hidden="true" style={{ opacity: paleIn }} className="absolute inset-0 bg-pale" />
        {/* The same faint grid as What I believe */}
        <div
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(hsl(var(--pale-grid)/0.07)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--pale-grid)/0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(45%_55%_at_50%_50%,black,transparent)] [-webkit-mask-image:radial-gradient(45%_55%_at_50%_50%,black,transparent)]"
        />

        {/* Ways to reach me, floating around the card until it grows over them */}
        {facts.map((fact, i) => (
          <Fact key={fact.label} fact={fact} index={i} grow={grow} appear={appear} />
        ))}

        {/* The card that becomes the screen */}
        <motion.div style={{ clipPath }} className="absolute inset-0 bg-night text-snow">
          {/* The one heading: "Let's talk." small in the card, growing until it owns the screen */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.h2
              style={{ scale: headScale, y: headY }}
              className={`relative font-display font-semibold uppercase leading-[0.9] tracking-[-0.005em] text-[24vw] md:text-[min(15rem,26vh)] whitespace-nowrap will-change-transform`}
            >
              Let&apos;s talk.
            </motion.h2>
          </div>

          {/* Then the rest, under it, once the card is the screen */}
          <motion.div
            style={{ opacity: restOpacity, y: restY, pointerEvents: restPointer, visibility: restVisibility }}
            className="absolute inset-x-0 top-1/2 mt-[6vh] md:mt-[10vh] flex flex-col items-center px-6 md:px-10 lg:px-12 text-center"
          >
            <p className="font-body text-[14px] md:text-[16px] font-medium uppercase leading-[1.55] tracking-[0.01em] text-muted max-w-2xl mx-auto">
              Building something serious with backend systems, or the AI on top of them? Email gets the fastest
              response, usually within a day.
            </p>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3">
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
            </div>
            {/* Reduced motion has no side details floating round a card, so they sit here instead */}
            {reduceMotion && (
              <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-snow/70">
                <li>
                  {PROFILE.city.split(",")[0]} · {time.time} {time.period} IST
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="live-dot" aria-hidden="true" /> Open to opportunities
                </li>
                {[
                  ["LinkedIn", PROFILE.links.linkedin],
                  ["GitHub", PROFILE.links.github],
                  ["Medium", PROFILE.links.medium],
                ].map(([name, href]) => (
                  <li key={name}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-snow">
                      {name}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`${import.meta.env.BASE_URL}${PROFILE.resume}`}
                    download={PROFILE.resumeDownloadName}
                    className="hover:text-snow"
                  >
                    Résumé (PDF)
                  </a>
                </li>
              </ul>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

type FactItem = {
  label: string;
  value?: string;
  side: "left" | "right";
  top: string;
  live?: boolean;
  href?: string;
};

/** One way to reach me beside the card: it drifts out to the side and fades as the card grows over it */
const Fact = ({
  fact,
  index,
  grow,
  appear,
}: {
  fact: FactItem;
  index: number;
  grow: MotionValue<number>;
  appear: MotionValue<number>;
}) => {
  // In: slides in from its side once the ground is lit. Out: drifts away as the card grows over it.
  const opacity = useTransform(
    [appear, grow],
    ([a, k]: number[]) => a * (1 - clamp01((k - 0.2) / (0.3 + index * 0.05))),
  );
  const x = useTransform(
    [appear, grow],
    ([a, k]: number[]) => (fact.side === "left" ? -1 : 1) * ((1 - a) * 40 + k * 60),
  );
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const visibility = useTransform(opacity, (o) => (o < 0.05 ? "hidden" : "visible"));
  const edge = `calc(50% + ${CARD_W} / 2 + clamp(20px, 4vw, 64px))`;
  // Once it has slid in, it flickers on like a tube catching; scrolling back puts it out again
  const [lit, setLit] = useState(() => appear.get() > 0.6);
  useMotionValueEvent(appear, "change", (a) => setLit(a > 0.6));
  return (
    <motion.div
      style={{
        opacity,
        x,
        pointerEvents,
        visibility,
        top: fact.top,
        ...(fact.side === "left" ? { right: edge } : { left: edge }),
      }}
      className={`absolute hidden lg:block ${fact.side === "left" ? "text-right" : "text-left"}`}
    >
      <div className={lit ? "flicker-on" : "opacity-0"} style={{ animationDelay: `${index * 0.12}s` }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-night/55">{fact.label}</p>
        {fact.href ? (
          <a
            href={fact.href}
            download={PROFILE.resumeDownloadName}
            className="mt-2 t-heading text-[1.9rem] leading-tight text-night group inline-flex items-center gap-2"
          >
            {fact.value}
            <ArrowDown
              className="w-5 h-5 transition-transform duration-fast group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        ) : fact.value ? (
          <p className="mt-2 t-heading text-[1.9rem] leading-tight text-night inline-flex items-center gap-3">
            {fact.live && <span className="live-dot" aria-hidden="true" />}
            {fact.value}
          </p>
        ) : (
          <div className="mt-2 flex gap-5 t-heading text-[1.6rem] text-night">
            {[
              ["LinkedIn", PROFILE.links.linkedin],
              ["GitHub", PROFILE.links.github],
              ["Medium", PROFILE.links.medium],
            ].map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1"
              >
                {name}
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContactSection;
