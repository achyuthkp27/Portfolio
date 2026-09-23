import { useReducedMotion } from "framer-motion";
import { FillText } from "./ui/FillText";
import { PROFILE } from "@/data/profile";

const LINE = "I build things that work when it matters, even when nobody is watching and everything is on the line.";

/**
 * A breath between Work and About, after neiden.framer.media: the portrait cut into a
 * large arc and tinted in the accent, a faint grid, a bracketed label with a marker, the
 * statement filling in as you scroll, a supporting line signed with the name, and a
 * frosted band along the bottom that content blurs into as it passes under.
 */
const FocusSection = () => {
  const reduceMotion = useReducedMotion();
  return (
    <section
      aria-label="A line about how I work"
      className="theme-dark bg-night text-snow relative overflow-hidden"
      style={{ minHeight: reduceMotion ? "70vh" : "100vh" }}
    >
      {/* Faint grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-[4%] w-px bg-snow/[0.05]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-snow/[0.05]" />
        <div className="absolute inset-y-0 right-[4%] w-px bg-snow/[0.05]" />
        <div className="absolute inset-x-0 top-[32%] h-px bg-snow/[0.05]" />
        <div className="absolute inset-x-0 top-[62%] h-px bg-snow/[0.05]" />
      </div>

      {/* Portrait, cut by a large arc on the right and tinted in the accent */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-[10%] w-[40vw] max-w-[560px] aspect-[4/5] pointer-events-none hidden md:block overflow-hidden rounded-tr-[38%] rounded-br-[62%]"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/portrait.jpg`}
          alt=""
          className="w-full h-full object-cover object-top grayscale contrast-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-emerald-400 mix-blend-multiply" />
        <div className="absolute inset-0 bg-emerald-300/25 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-night/60" />
      </div>

      {/* Text column */}
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 min-h-[inherit] flex flex-col justify-center py-28 md:pl-[38%] lg:pl-[40%]">
        <p className="flex items-center gap-3 t-figure text-[12px] uppercase tracking-[0.12em] text-snow/80">
          <span className="flex gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block w-2.5 h-3 rounded-r-full bg-emerald-400"
                style={{ opacity: 0.55 + i * 0.15 }}
              />
            ))}
          </span>
          <span>[ AKP® — What I believe ]</span>
        </p>
        <span
          aria-hidden="true"
          className="mt-3 ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-snow/40"
        >
          <span className="h-2 w-2 rounded-full bg-snow" />
        </span>

        <FillText
          text={LINE}
          className="mt-8 font-body font-semibold tracking-[-0.03em] leading-[1.05] text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[4.6rem] text-balance max-w-4xl"
          offset={["start 0.8", "end 0.55"]}
        />

        <p className="t-body text-muted mt-10 max-w-lg">
          Reliable systems are built through clear thinking, small verified steps, and decisions that still make sense
          at 2 AM.
        </p>
        <div className="mt-8">
          <p className="font-body text-[15px] font-medium">{PROFILE.name}</p>
          <p className="t-body text-muted text-[14px]">{PROFILE.title}</p>
        </div>
      </div>

      {/* Liquid glass: a frosted band along the bottom that content blurs into */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-52 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_30%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_30%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-52 bg-gradient-to-t from-night/70 to-transparent"
      />
    </section>
  );
};

export default FocusSection;
