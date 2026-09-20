import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { stackLayers, type StackLayer } from "@/data/stack";
import { projects } from "@/data/projects";

/**
 * Skills as the system they belong to. Picking a layer of the platform shows what I use
 * there and which case studies lean on it — the same blueprint language as the case-study
 * diagrams, so the two sections read as one story.
 */

const titleFor = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;

/** Scroll to a case-study card; `scroll-mt` on the card keeps it clear of the nav. */
const goToCase = (slug: string) => {
  document.getElementById(`case-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

interface NodeProps {
  layer: StackLayer;
  active: boolean;
  onSelect: (id: string) => void;
  variant?: "node" | "bus";
}

const MapNode = ({ layer, active, onSelect, variant = "node" }: NodeProps) => {
  const isBus = variant === "bus";
  return (
    <button
      type="button"
      onClick={() => onSelect(layer.id)}
      onMouseEnter={() => onSelect(layer.id)}
      onFocus={() => onSelect(layer.id)}
      aria-pressed={active}
      aria-controls="stack-layer-detail"
      className={`w-full rounded-lg px-3 py-2.5 text-center transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${
        isBus ? "border-dashed" : ""
      } border ${
        active
          ? "bg-emerald-500/[0.10] border-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.12)]"
          : "bg-white/[0.04] border-white/15 hover:border-white/30 hover:bg-white/[0.07]"
      }`}
    >
      <span
        className={`block font-mono text-[11px] md:text-xs leading-tight transition-colors ${
          active ? "text-emerald-200" : "text-white"
        }`}
      >
        {layer.label}
      </span>
      <span className="block font-mono text-[9px] md:text-[10px] leading-tight mt-0.5 text-white/50">{layer.sub}</span>
    </button>
  );
};

const Down = () => (
  <span className="block text-center text-emerald-500/70 font-mono text-sm leading-none py-1" aria-hidden="true">
    ↓
  </span>
);

const SkillsSection = () => {
  const [activeId, setActiveId] = useState("services");
  const active = stackLayers.find((l) => l.id === activeId) ?? stackLayers[0];
  const byId = (id: string) => stackLayers.find((l) => l.id === id)!;

  const nodeProps = (id: string) => ({
    layer: byId(id),
    active: activeId === id,
    onSelect: setActiveId,
  });

  return (
    <section id="skills" className="py-20 lg:py-28 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Skills"
          title="The stack, drawn as the system it runs in"
          description="Pick a layer to see what I use there and which case studies lean on it."
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-8 lg:gap-14 items-start">
          {/* ── The map ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-white/10 bg-[#0b0b0d] p-5 md:p-8 overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_65%)] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-[26rem] mx-auto">
              <MapNode {...nodeProps("channels")} />
              <Down />
              <MapNode {...nodeProps("edge")} />
              <Down />
              <div className="grid grid-cols-2 gap-2.5">
                <MapNode {...nodeProps("services")} />
                <MapNode {...nodeProps("ai")} />
              </div>
              <Down />
              <MapNode {...nodeProps("bus")} variant="bus" />
              <Down />
              <MapNode {...nodeProps("data")} />

              <div className="mt-6 pt-5 border-t border-dashed border-white/15 grid grid-cols-2 gap-2.5">
                <MapNode {...nodeProps("platform")} />
                <MapNode {...nodeProps("observability")} />
              </div>
              <p className="mt-3 text-center font-mono text-[10px] text-white/35">
                these two wrap every layer above
              </p>
            </div>
          </motion.div>

          {/* ── Detail for the selected layer ── */}
          <div id="stack-layer-detail" aria-live="polite" className="lg:sticky lg:top-32">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-condensed text-3xl md:text-4xl uppercase tracking-wide text-white">{active.label}</h3>
              <p className="mt-3 text-[15px] font-body font-light text-white/70 leading-relaxed max-w-lg">
                {active.blurb}
              </p>

              <dl className="mt-8">
                <dt className="text-xs font-body font-medium tracking-[0.18em] uppercase text-emerald-400/90 mb-4">
                  What I use here
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {active.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm font-body text-white/80 bg-white/[0.04] border border-white/10 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </dd>
              </dl>

              <dl className="mt-8">
                <dt className="text-xs font-body font-medium tracking-[0.18em] uppercase text-emerald-400/90 mb-4">
                  Where it shows up
                </dt>
                <dd className="flex flex-col gap-2 items-start">
                  {active.projects.map((slug) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => goToCase(slug)}
                      className="group flex items-center gap-2 text-left text-sm font-body font-light text-white/65 hover:text-white transition-colors"
                    >
                      <span className="text-emerald-400/70 font-mono text-xs" aria-hidden="true">
                        ↗
                      </span>
                      <span className="border-b border-white/15 group-hover:border-emerald-400/60 transition-colors">
                        {titleFor(slug)}
                      </span>
                    </button>
                  ))}
                </dd>
              </dl>
            </motion.div>
          </div>
        </div>

        {/* Every skill stays in the markup for crawlers, whichever layer is on screen. */}
        <ul className="sr-only">
          {stackLayers.flatMap((layer) => layer.skills.map((skill) => <li key={`${layer.id}-${skill}`}>{skill}</li>))}
        </ul>
      </div>
    </section>
  );
};

export default SkillsSection;
