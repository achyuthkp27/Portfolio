import { useEffect, useRef, type FocusEvent } from "react";
import { useInView, useMotionValueEvent, useReducedMotionConfig, useScroll } from "framer-motion";
import { ArrowUp, Boxes, Brain, Server, ShieldCheck, Workflow, type LucideIcon } from "lucide-react";
import { SERVICES } from "@/data/profile";
import { useSmoothScroll } from "@/context/smoothScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { clamp01, pad2 } from "@/lib/format";
import { ease } from "@/lib/phase";
import { onLayoutResize } from "@/lib/viewport";

type Service = (typeof SERVICES)[number];

/** One mark per service, in order: backend, event-driven, security, delivery, AI */
const ICONS: LucideIcon[] = [Server, Workflow, ShieldCheck, Boxes, Brain];

const EMERALD = "rgb(52 211 153)";
const N = SERVICES.length;
/** Share of each service's stretch of scroll spent handing over to the next; the rest holds it */
const HANDOVER = 0.35;

/** The section's own opening: the label, a title at the scale of the screen, and the line under it */
const Intro = () => (
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-24 lg:pt-32 pb-12 lg:pb-16">
    <p className="t-label mb-10 lg:mb-14">What I build</p>
    <h2 className="t-statement text-[clamp(2.6rem,6.6vw,7.5rem)] leading-[1.02] text-balance break-words">
      From the first commit
      <br />
      to production.
    </h2>
    <p className="mt-8 lg:mt-10 t-body text-snow/70 text-[18px] md:text-[21px] max-w-xl">
      Five things I build, each <span className="text-snow">proven on a regulated banking platform</span>.
    </p>
  </div>
);

/** The stack as pills, set a size up from the shared tags so it reads at a glance */
const Pills = ({ items }: { items: readonly string[] }) => (
  <ul className="mt-3 flex flex-wrap gap-2">
    {items.map((t) => (
      <li key={t} className="rounded-pill border border-white/20 px-3.5 py-1.5 text-[14px] text-snow/85">
        {t}
      </li>
    ))}
  </ul>
);

/** Where a service shipped: each line jumps to that part of the page */
const Proof = ({ service }: { service: Service }) => {
  const scrollTo = useSectionScroll();
  if (service.proof.length === 0) return null;
  return (
    <>
      <p className="mt-8 t-figure text-[13px] text-snow/70">Where it shipped</p>
      <ul className="mt-1.5">
        {service.proof.map((p) => (
          <li key={p.href + p.label}>
            <button
              type="button"
              onClick={() => scrollTo(p.href.replace(/^#/, ""))}
              className="group inline-flex items-center gap-2.5 min-h-11 text-left text-[16px] text-snow/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              {p.label}
              <span
                className="text-snow/50 group-hover:text-emerald-300 group-hover:-translate-y-0.5 transition duration-fast"
                aria-hidden="true"
              >
                <ArrowUp className="w-4 h-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

/**
 * (What I build). On wide screens one pinned scene, after wodniack.dev's bold index: the
 * service's number fills the left of the screen in emerald, its title, line, stack and where it
 * shipped sit on the right, and a rail of all five runs along the foot, laid on the page's grid.
 * Scrolling rolls the number to the next (the old one lifts away as the new one rises in, with
 * no clipping window) and hands the right side over with it. Phones, tablets and reduced motion
 * get the editorial index: one row per service, its number filling with emerald as it crosses
 * the middle of the screen.
 */
const ServicesSection = () => {
  const reduceMotion = useReducedMotionConfig();
  const wide = useMediaQuery("(min-width: 1024px)");
  return (
    <section id="services" className="theme-dark text-snow relative">
      <Intro />
      {wide && !reduceMotion ? (
        <ServicesScene />
      ) : (
        <ol className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pb-24 lg:pb-32">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.title} service={s} index={i} />
          ))}
        </ol>
      )}
    </section>
  );
};

/** Where the scene stands at scroll progress v: 0 is the first service, N - 1 the last */
const positionAt = (v: number) => {
  const s = clamp01(v) * N;
  const i = Math.min(N - 1, Math.floor(s));
  if (i >= N - 1) return N - 1;
  return i + ease(clamp01((s - i - (1 - HANDOVER)) / HANDOVER));
};

/**
 * How a digit pair is drawn in the number's own font, in ems of its size: the inked height, and
 * how far the ink's centre sits below the centre of a line box of 0.87em, which is the line
 * height the number is set in.
 */
const digitInk = (el: HTMLElement | null | undefined) => {
  const fallback = { height: 0.9, offset: 0.05 };
  const ctx = el && document.createElement("canvas").getContext("2d");
  if (!el || !ctx) return fallback;
  const cs = getComputedStyle(el);
  ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
  const m = ctx.measureText("08");
  if (!m.fontBoundingBoxAscent) return fallback;
  const [fa, fd, ia, id] = [
    m.fontBoundingBoxAscent,
    m.fontBoundingBoxDescent,
    m.actualBoundingBoxAscent,
    m.actualBoundingBoxDescent,
  ].map((v) => v / 100);
  const line = 0.87;
  // The browser centres the font's ascent and descent in the line box; the baseline sits under the ascent
  const baseline = (line - (fa + fd)) / 2 + fa;
  return { height: ia + id, offset: baseline + (id - ia) / 2 - line / 2 };
};

const ServicesScene = () => {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const numberBox = useRef<HTMLDivElement>(null);
  const panelBox = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const numbers = useRef<(HTMLSpanElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const contents = useRef<(HTMLDivElement | null)[]>([]);
  const { lenis } = useSmoothScroll();
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  // Lay the scene on the page's grid: a cell is a twelfth of the width, and the grid starts at the
  // screen's top left, so while the stage is pinned these positions sit on its lines
  const layout = () => {
    const el = stage.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const c = W / 12;
    // The rail sits on the last grid line that leaves room under it for the labels
    const railTop = Math.floor((H - 76) / c) * c;
    const top = Math.max(c * 0.8, 92);
    const bottom = H - railTop + 24;
    if (numberBox.current) {
      Object.assign(numberBox.current.style, {
        left: `${c}px`,
        width: `${5 * c}px`,
        top: `${top}px`,
        bottom: `${bottom}px`,
      });
      // As large as fits between the nav and the rail, by the digits' drawn height rather than
      // their line box: the font draws them lower than the box, which put them over the rail
      const ink = digitInk(numbers.current[0]);
      const gap = 32;
      const size = Math.min((railTop - top - gap) / ink.height, (5 * c) / 0.95);
      numberBox.current.style.fontSize = `${size}px`;
      // Centre the drawn digits, not the line box, in the room above the rail
      numbers.current.forEach((el) => el && (el.style.marginTop = `${-ink.offset * size - gap / 2}px`));
    }
    if (panelBox.current)
      Object.assign(panelBox.current.style, {
        left: `${6 * c}px`,
        width: `${5 * c}px`,
        top: `${top}px`,
        bottom: `${bottom}px`,
      });
    if (rail.current) Object.assign(rail.current.style, { left: `${c}px`, width: `${10 * c}px`, top: `${railTop}px` });
    // The longest service sets one scale for all, so every panel fits between the nav and the rail
    const room = H - top - bottom;
    contents.current.forEach((el) => el && (el.style.transform = ""));
    const tallest = Math.max(1, ...contents.current.map((el) => el?.offsetHeight ?? 0));
    const fit = Math.min(1, room / tallest);
    contents.current.forEach((el) => el && (el.style.transform = fit < 1 ? `scale(${fit})` : ""));
  };

  const draw = (v: number) => {
    const pos = positionAt(v);
    const current = Math.round(pos);
    numbers.current.forEach((el, i) => {
      if (!el) return;
      const d = i - pos;
      const near = clamp01(1 - Math.abs(d));
      // The old number lifts away and the new one rises in, crossing in opacity: nothing clips them.
      // The new one rises only a little, so it never passes down over the rail on its way in.
      el.style.transform = `translateY(calc(-50% + ${d < 0 ? d * 55 : d * 10}%))`;
      el.style.opacity = String(clamp01(1 - Math.abs(d) * 1.15));
      el.style.color = `rgb(52 211 153 / ${near})`;
    });
    panels.current.forEach((el, i) => {
      if (!el) return;
      const d = i - pos;
      el.style.opacity = String(clamp01(1 - Math.abs(d) * 2.2));
      el.style.transform = `translateY(${d * 56}px)`;
      el.style.pointerEvents = Math.abs(d) < 0.25 ? "auto" : "none";
    });
    fills.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleX(${clamp01(pos - i + 1)})`;
    });
    labels.current.forEach((el, i) => {
      if (!el) return;
      el.style.color = i === current ? EMERALD : "rgb(255 255 255 / 0.7)";
      if (i === current) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
  };

  useMotionValueEvent(p, "change", draw);
  useEffect(() => {
    const redo = () => {
      layout();
      draw(p.get());
    };
    redo();
    // Panel heights depend on the display font, which may still be loading
    document.fonts?.ready.then(redo);
    const offResize = onLayoutResize(redo);
    return () => offResize();
    // Draws from refs; p is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Where service i holds the stage, in page px
  const momentOf = (i: number) => {
    const el = track.current;
    if (!el) return 0;
    const range = el.offsetHeight - window.innerHeight;
    return el.getBoundingClientRect().top + window.scrollY + ((i + 0.3) / N) * range;
  };
  const goTo = (i: number, immediate: boolean) => {
    const y = momentOf(i);
    if (lenis) lenis.scrollTo(y, { immediate, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
  };
  // Keyboard: a control on a service that isn't showing brings that service to the stage
  const onPanelFocus = (i: number) => (e: FocusEvent) => {
    if (e.target === e.currentTarget) return;
    if (Math.abs(positionAt(p.get()) - i) > 0.25) goTo(i, true);
  };

  return (
    <div ref={track} className="relative" style={{ height: `${(N + 1) * 100}vh` }}>
      <div ref={stage} className="sticky top-0 h-screen">
        {/* The number, as large as the left of the screen allows */}
        <div ref={numberBox} aria-hidden="true" className="absolute">
          {SERVICES.map((s, i) => (
            <span
              key={s.title}
              ref={(el) => {
                numbers.current[i] = el;
              }}
              className="absolute left-0 top-1/2 t-wordmark leading-[0.87] [-webkit-text-stroke:1.5px_rgb(255_255_255/0.32)]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {pad2(i + 1)}
            </span>
          ))}
        </div>

        {/* What the service is, what it's built with, and where it shipped */}
        <div ref={panelBox} className="absolute">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[i] ?? Server;
            return (
              <div
                key={s.title}
                ref={(el) => {
                  panels.current[i] = el;
                }}
                onFocus={onPanelFocus(i)}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
              >
                <div
                  ref={(el) => {
                    contents.current[i] = el;
                  }}
                  className="origin-left"
                >
                  <p className="flex items-center gap-3 t-figure text-[13px] text-snow/70">
                    <span
                      className="grid place-items-center w-10 h-10 rounded-full border border-emerald-400/50 text-emerald-300 bg-emerald-400/10"
                      aria-hidden="true"
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.25} />
                    </span>
                    {pad2(i + 1)} / {pad2(N)}
                  </p>
                  <h3 className="mt-5 t-heading text-[clamp(2.75rem,4.6vw,5rem)] leading-[0.98] break-words">
                    {s.title}
                  </h3>
                  <p className="mt-5 t-body text-[19px] xl:text-[20px] leading-relaxed text-snow/80 max-w-xl">
                    {s.blurb}
                  </p>
                  <p className="mt-7 t-figure text-[13px] text-snow/70">Stack</p>
                  <Pills items={s.stack} />
                  <Proof service={s} />
                </div>
              </div>
            );
          })}
        </div>

        {/* All five along the foot, two grid cells each; the one on the stage in emerald */}
        <div ref={rail} className="absolute grid grid-cols-5">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="pr-4">
              <span aria-hidden="true" className="relative block h-px bg-white/20">
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  className="absolute inset-x-0 -top-px h-[3px] bg-emerald-400 origin-left"
                  style={{ transform: `scaleX(${i === 0 ? 1 : 0})` }}
                />
              </span>
              <button
                ref={(el) => {
                  labels.current[i] = el;
                }}
                type="button"
                onClick={() => goTo(i, false)}
                className="mt-3 flex items-baseline gap-2 min-h-11 text-left t-figure text-[13px] uppercase tracking-[0.12em]"
                style={{ color: i === 0 ? EMERALD : "rgb(255 255 255 / 0.7)" }}
              >
                <span className="tabular-nums">{pad2(i + 1)}</span>
                <span className="break-words">{s.title}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceRow = ({ service, index }: { service: Service; index: number }) => {
  const ref = useRef<HTMLLIElement>(null);
  // Active while the row crosses the middle band of the screen
  const active = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const Icon = ICONS[index] ?? Server;
  const last = index === SERVICES.length - 1;

  return (
    <li ref={ref} className={`relative border-t border-white/15 ${last ? "border-b" : ""}`}>
      <span
        aria-hidden="true"
        className={`absolute left-0 -top-px h-[2px] bg-emerald-400 transition-[width] duration-700 ease-out ${active ? "w-full" : "w-0"}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)_minmax(0,1.2fr)] gap-6 lg:gap-14 py-12 md:py-16 lg:py-20">
        <div className="flex items-start justify-between gap-6 lg:flex-col lg:justify-start">
          <p
            className="t-wordmark leading-[0.87] text-[38vw] md:text-[12rem] lg:text-[11rem] transition-[color,-webkit-text-stroke-color] duration-500"
            style={{
              color: active ? EMERALD : "transparent",
              WebkitTextStroke: `1.5px ${active ? EMERALD : "rgba(255,255,255,0.35)"}`,
            }}
          >
            {pad2(index + 1)}
          </p>
          <span
            className={`grid place-items-center w-14 h-14 lg:mt-8 rounded-full border transition-colors duration-500 ${active ? "border-emerald-400/60 text-emerald-300 bg-emerald-400/10" : "border-white/20 text-snow/70"}`}
            aria-hidden="true"
          >
            <Icon className="w-6 h-6" strokeWidth={1.25} />
          </span>
        </div>

        <div>
          <h3 className="t-heading text-[2.75rem] md:text-6xl lg:text-6xl leading-[1.02] break-words">
            {service.title}
          </h3>
          <p className="mt-6 t-body text-[18px] md:text-[20px] leading-relaxed text-snow/80 max-w-xl">
            {service.blurb}
          </p>
        </div>

        <div className="lg:pt-3">
          <p className="t-figure text-[13px] text-snow/70">Stack</p>
          <Pills items={service.stack} />
          <Proof service={service} />
        </div>
      </div>
    </li>
  );
};

export default ServicesSection;
