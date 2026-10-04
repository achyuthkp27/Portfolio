import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowUp, Boxes, Brain, Server, ShieldCheck, Workflow, type LucideIcon } from "lucide-react";
import { SERVICES } from "@/data/profile";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { pad2 } from "@/lib/format";
import { StackIntro, StackTags } from "./ui/StackCard";

type Service = (typeof SERVICES)[number];

/** One mark per service, in order: backend, event-driven, security, delivery, AI */
const ICONS: LucideIcon[] = [Server, Workflow, ShieldCheck, Boxes, Brain];

const EMERALD = "rgb(52 211 153)";

/**
 * (What I build): an editorial index, so it reads differently from the card stack in Work
 * just above it. One full-width row per service: a large outlined number, the title and what
 * it covers, then the stack and where it shipped. Nothing pins; the row crossing the middle
 * of the screen fills its number with emerald, draws a rule along its top and lights its mark.
 */
const ServicesSection = () => (
  <section id="services" className="theme-dark text-snow relative">
    <StackIntro
      label="What I build"
      title={
        <>
          From the first commit
          <br />
          to production.
        </>
      }
    >
      Five things I build, each <span className="text-snow">proven on a regulated banking platform</span>.
    </StackIntro>

    <ol className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pb-24 lg:pb-32">
      {SERVICES.map((s, i) => (
        <ServiceRow key={s.title} service={s} index={i} />
      ))}
    </ol>
  </section>
);

const ServiceRow = ({ service, index }: { service: Service; index: number }) => {
  const scrollTo = useSectionScroll();
  const ref = useRef<HTMLLIElement>(null);
  // Active while the row crosses the middle band of the screen
  const active = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const Icon = ICONS[index] ?? Server;
  const last = index === SERVICES.length - 1;

  return (
    <li ref={ref} className={`relative border-t border-line ${last ? "border-b" : ""}`}>
      <span
        aria-hidden="true"
        className={`absolute left-0 -top-px h-px bg-emerald-400 transition-[width] duration-700 ease-out ${active ? "w-full" : "w-0"}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)_minmax(0,1.2fr)] gap-6 lg:gap-14 py-12 md:py-16 lg:py-20">
        <div className="flex items-start justify-between gap-6 lg:flex-col lg:justify-start">
          <p
            className="t-wordmark leading-none text-[5rem] md:text-[7rem] lg:text-[9rem] transition-[color,-webkit-text-stroke-color] duration-500"
            style={{
              color: active ? EMERALD : "transparent",
              WebkitTextStroke: `1.5px ${active ? EMERALD : "rgba(255,255,255,0.35)"}`,
            }}
          >
            {pad2(index + 1)}
          </p>
          <span
            className={`grid place-items-center w-14 h-14 lg:mt-8 rounded-full border transition-colors duration-500 ${active ? "border-emerald-400/60 text-emerald-300 bg-emerald-400/10" : "border-line text-snow/50"}`}
            aria-hidden="true"
          >
            <Icon className="w-6 h-6" strokeWidth={1.25} />
          </span>
        </div>

        <div>
          <h3 className="t-heading text-[2.25rem] md:text-5xl lg:text-6xl leading-[1.05] break-words">
            {service.title}
          </h3>
          <p className="mt-6 t-body text-[17px] md:text-[19px] leading-relaxed text-snow/70 max-w-xl">
            {service.blurb}
          </p>
        </div>

        <div className="lg:pt-3">
          <p className="t-figure text-[12px] text-muted">Stack</p>
          <StackTags items={service.stack} />
          {service.proof.length > 0 && (
            <>
              <p className="mt-8 t-figure text-[12px] text-muted">Where it shipped</p>
              <ul className="mt-3 space-y-2">
                {service.proof.map((p) => (
                  <li key={p.href + p.label}>
                    <button
                      type="button"
                      onClick={() => scrollTo(p.href.replace(/^#/, ""))}
                      className="group inline-flex items-center gap-2 py-1.5 -my-1.5 text-left text-[14px] text-snow/65 hover:text-snow transition-colors duration-fast"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden="true" />
                      {p.label}
                      <span
                        className="text-muted group-hover:text-emerald-300 group-hover:-translate-y-0.5 transition duration-fast"
                        aria-hidden="true"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default ServicesSection;
