import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { SERVICES } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";
import { DUR, EASE, reveal } from "@/lib/motion";
import ScrambleNumber from "@/components/ui/ScrambleNumber";

/**
 * (What I do): one column of numbered rows, one open at a time. On large screens the open
 * service's detail sits in a sticky panel on the right; on small screens it expands inline.
 */
interface ServiceRowProps {
  index: number;
  title: string;
  isOpen: boolean;
  onOpen: () => void;
  detail: React.ReactNode;
}

/** One service row. Its title brightens from grey to white as it crosses the reading line, the way the reference's list fills in on scroll. */
const ServiceRow = ({ index, title, isOpen, onOpen, detail }: ServiceRowProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0.28, 1]);
  return (
    <motion.li ref={ref} {...reveal(index * 0.04)} className="relative border-b border-line">
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-controls="service-detail"
        className="group w-full flex items-center gap-5 py-6 md:py-7 text-left"
      >
        <span className="t-label shrink-0 w-12">{String(index + 1).padStart(2, "0")}</span>
        <motion.span
          style={{ opacity: isOpen ? 1 : fill }}
          className="flex-1 font-body text-2xl md:text-[28px] font-medium tracking-[-0.02em] text-snow transition-opacity duration-fast group-hover:!opacity-100"
        >
          {title}
        </motion.span>
        <Plus
          className={`w-5 h-5 text-muted transition-transform duration-base ease-out ${isOpen ? "rotate-45" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className="lg:hidden overflow-hidden">
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: DUR.base, ease: EASE }}
            >
              {detail}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
};

const ServicesSection = () => {
  const [open, setOpen] = useState(0);
  const current = SERVICES[open];

  const Detail = ({ compact = false }: { compact?: boolean }) => (
    <motion.div
      key={current.title}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: DUR.fast, ease: EASE }}
      className={compact ? "pb-7 pl-[4.25rem]" : "rounded-md bg-tile border border-line p-7 md:p-9"}
    >
      {!compact && (
        <ScrambleNumber
          key={open}
          value={String(open + 1).padStart(2, "0")}
          className="t-label mb-6 block"
          durationMs={600}
        />
      )}
      {!compact && <h3 className="t-heading text-4xl md:text-5xl mb-5">{current.title}</h3>}
      <p className="t-body text-muted max-w-md">{current.blurb}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {current.stack.map((item) => (
          <li key={item} className="rounded-pill border border-line px-3 py-1 text-[12px] text-snow/80">
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <section id="services" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeader label="What I do" title="My services" align="center" />
        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          <ol className="border-t border-line">
            {SERVICES.map((s, i) => (
              <ServiceRow
                key={s.title}
                index={i}
                title={s.title}
                isOpen={open === i}
                onOpen={() => setOpen(i)}
                detail={<Detail compact />}
              />
            ))}
          </ol>

          <div id="service-detail" aria-live="polite" className="hidden lg:block lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <Detail />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
