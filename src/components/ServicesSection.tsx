import { useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Plus } from "lucide-react";
import { SERVICES } from "@/data/profile";
import { DUR, EASE, reveal } from "@/lib/motion";
import { useSectionScroll } from "@/hooks/useSectionScroll";

const N = SERVICES.length;
const code = (i: number) => `(${String(i + 1).padStart(3, "0")})`;

type Service = (typeof SERVICES)[number];

/**
 * (What I build): a numbered index after the reference's services list. A large title with
 * its count, then one row per service: the number in the left column, the title, and a
 * round toggle. One row is open at a time and shows the blurb, the stack as pills, and
 * links to the work that proves it. Rows below slide to make room; nothing is clipped.
 */
const ServicesSection = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" className="theme-dark text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] gap-6 lg:gap-10 items-start mb-16 lg:mb-24">
          <motion.p {...reveal()} className="flex items-center gap-3 text-[15px] font-medium text-snow/90 lg:pt-6">
            <span className="grid place-items-center h-6 w-6 rounded-full bg-snow text-night" aria-hidden="true">
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
            What I work on
          </motion.p>
          <motion.h2 {...reveal(0.05)} className="t-statement text-6xl sm:text-7xl md:text-8xl lg:text-[9rem]">
            What I build.
            <sup className="ml-2 align-super t-figure font-normal tracking-normal text-2xl md:text-4xl text-snow/40">
              ({N})
            </sup>
          </motion.h2>
        </div>

        <LayoutGroup>
          <ol className="border-t border-line">
            {SERVICES.map((s, i) => (
              <Row
                key={s.title}
                service={s}
                index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </ol>
        </LayoutGroup>
      </div>
    </section>
  );
};

/** One service. Its title writes itself in once on first sight; closed rows brighten from grey as they cross the reading line. */
const Row = ({
  service,
  index,
  isOpen,
  onToggle,
}: {
  service: Service;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  // The title writes itself in once, letter by letter, the same way the site's other text reveals
  const still = useReducedMotion();
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const panel = `service-${index}`;
  const scrollTo = useSectionScroll();
  return (
    <motion.li
      ref={ref}
      layout="position"
      transition={{ layout: { duration: DUR.base, ease: EASE } }}
      className="border-b border-line"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_auto] gap-x-4 lg:gap-x-10 py-7 md:py-9">
        <span
          className={`col-span-2 lg:col-span-1 mb-3 lg:mb-0 t-figure text-sm md:text-base lg:pt-1.5 ${isOpen ? "text-snow" : "text-muted"}`}
        >
          {code(index)}
        </span>

        <div className="min-w-0">
          <h3>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={panel}
              className="text-left font-body font-medium tracking-[-0.02em] text-[26px] md:text-[34px] leading-tight"
            >
              <span className="sr-only">{service.title}</span>
              <motion.span style={{ opacity: isOpen ? 1 : fill }} aria-hidden="true" className="inline-block">
                {service.title.split(" ").map((word, w, words) => (
                  <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
                    {[...word].map((ch, c) => {
                      const k = words.slice(0, w).join("").length + c;
                      return (
                        <motion.span
                          key={c}
                          className="inline-block pt-[0.08em] pb-[0.22em] -mb-[0.22em]"
                          initial={still ? false : { opacity: 0, y: "0.18em" }}
                          animate={seen || still ? { opacity: 1, y: 0 } : undefined}
                          transition={{ duration: 0.55, ease: EASE, delay: k * 0.022 }}
                        >
                          {ch}
                        </motion.span>
                      );
                    })}
                    {w < words.length - 1 && "\u00a0"}
                  </span>
                ))}
              </motion.span>
            </button>
          </h3>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={panel}
                key="detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: DUR.fast } }}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.1 }}
                className="mt-6 grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 md:gap-10"
              >
                <div>
                  <p className="t-body text-snow/65 text-[17px] leading-relaxed max-w-md">{service.blurb}</p>
                  <ul className="mt-6 space-y-2">
                    {service.proof.map((p) => (
                      <li key={p.href + p.label}>
                        {/* A button, not a "#case-…" link: under HashRouter that href would open a 404 route */}
                        <button
                          type="button"
                          onClick={() => scrollTo(p.href.replace(/^#/, ""))}
                          className="group inline-flex items-center gap-2 text-left text-[14px] text-snow/80"
                        >
                          <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden="true" />
                          {p.label}
                          <span
                            className="text-muted group-hover:text-emerald-300 group-hover:-translate-y-0.5 transition duration-fast"
                            aria-hidden="true"
                          >
                            ↑
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[13px] text-muted mb-4">Stack</p>
                  <ul className="flex flex-wrap gap-2.5">
                    {service.stack.map((item, k) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DUR.base, ease: EASE, delay: 0.18 + k * 0.05 }}
                        className="rounded-pill bg-snow text-night px-4 py-2 text-[14px] font-medium"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The round toggle: the plus turns into a cross when the row is open */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panel}
          aria-label={isOpen ? `Close ${service.title}` : `Open ${service.title}`}
          // The title is the keyboard control; this is the same action for the mouse, one tab stop per row
          tabIndex={-1}
          className={`grid place-items-center h-12 w-12 md:h-14 md:w-14 rounded-full border transition-colors duration-base ${
            isOpen ? "border-emerald-400 bg-emerald-400 text-night" : "border-line text-snow/70 hover:border-snow/40"
          }`}
        >
          <Plus
            className={`w-5 h-5 transition-transform duration-base ease-out ${isOpen ? "rotate-45" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </motion.li>
  );
};

export default ServicesSection;
