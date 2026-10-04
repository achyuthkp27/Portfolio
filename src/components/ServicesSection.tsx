import { Boxes, Brain, Server, ShieldCheck, Workflow, type LucideIcon } from "lucide-react";
import { SERVICES } from "@/data/profile";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { StackBody, StackCard, StackHead, StackIntro, StackMiddle, StackTags, StackTile } from "./ui/StackCard";

type Service = (typeof SERVICES)[number];

/** One mark per service, in order: backend, event-driven, security, delivery, AI */
const ICONS: LucideIcon[] = [Server, Workflow, ShieldCheck, Boxes, Brain];

/**
 * (What I build), after reelio.framer.media's services: a short header, then one card per
 * service on a dashed three-column grid — number and title, a visual tile, then the blurb,
 * stack and proof. Each card pins under the nav and the next slides up over it, a simple
 * stack. Pure CSS sticky: it can't fall behind a fast scroll, and phones flow normally.
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

    <ol>
      {SERVICES.map((s, i) => (
        <ServiceCard key={s.title} service={s} index={i} />
      ))}
    </ol>
  </section>
);

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const scrollTo = useSectionScroll();
  return (
    <StackCard index={index}>
      <StackHead kicker={String(index + 1)} title={service.title} />
      <StackMiddle>
        <StackTile icon={ICONS[index] ?? Server} caption={service.stack.slice(0, 3).join(" · ")} />
      </StackMiddle>
      <StackBody>
        <p className="t-figure text-[12px] text-muted">What it covers</p>
        <p className="mt-3 text-[19px] md:text-[22px] leading-snug text-snow">{service.blurb}</p>
        <StackTags items={service.stack} />
        {service.proof.length > 0 && (
          <ul className="mt-6 space-y-2">
            {service.proof.map((p) => (
              <li key={p.href + p.label}>
                <button
                  type="button"
                  onClick={() => scrollTo(p.href.replace(/^#/, ""))}
                  className="group inline-flex items-center gap-2 text-left text-[14px] text-snow/65 hover:text-snow transition-colors duration-fast"
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
        )}
      </StackBody>
    </StackCard>
  );
};

export default ServicesSection;
