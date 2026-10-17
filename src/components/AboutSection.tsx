import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotionConfig, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FillText } from "./ui/FillText";
import { DrawRule } from "./ui/DrawRule";
import { PROFILE } from "@/data/profile";
import ExperienceTimer from "./ui/ExperienceTimer";
import ScrambleNumber from "./ui/ScrambleNumber";
import { Smoke } from "./ui/Smoke";
import { ExternalLink, HoverArrow } from "./ui/ExternalLink";
import { Portrait } from "./ui/Portrait";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useSmoothScroll } from "@/context/smoothScroll";
import { useLocalTime } from "@/hooks/useLocalTime";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fetchLatestRepositories, type GitHubRepo } from "@/lib/github";
import { reveal } from "@/lib/motion";
import { clamp01, monthDay } from "@/lib/format";
import { phase } from "@/lib/phase";

const STATEMENT =
  "I spent five years building the systems that move money. Now I build the AI that works on top of them, with the same standards.";

const card = "spot relative rounded-lg border border-line bg-tile overflow-hidden";

/** The pale ground of the belief section above, continued behind this sheet's top corners */
const PALE = "hsl(var(--pale))";

/** The live counter card: on wide screens the rest of the bento is dealt out from behind it */
const ANCHOR = 2;
/** The cards dealt from the counter card on wide screens; the others tip up into place on their own */
const DEALT = [0, 1, 3, 4, 5];
/** Share of the zoom the full-screen counter holds before it starts to shrink into its slot */
const HOLD = 0.25;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The counter card's face: the name, the live counter, and the line under it */
const CounterFace = ({ timerRef }: { timerRef?: React.Ref<HTMLDivElement> }) => (
  <>
    <span className="relative t-figure text-[13px] tracking-[0.3em] uppercase text-snow/70">Achyuth KP</span>
    <div ref={timerRef} className="relative my-auto py-8">
      <ExperienceTimer startDate={PROFILE.careerStart} compact />
    </div>
    <div className="relative">
      <p className="t-heading text-3xl md:text-4xl">Production first</p>
      <DrawRule center className="w-10 bg-snow/30 my-4" />
      <p className="t-body text-snow/70 text-[15px]">Five years of backend systems, now applied to AI that ships.</p>
    </div>
  </>
);

/**
 * (Who I am): a bento after spector.framer.website. A founder card with the portrait and
 * bio, a vertical label strip, a tall dark card with the live counter over drifting smoke,
 * a principle card, the story with a way to the work, the services count, local time and
 * availability, and the latest public push.
 *
 * On wide screens, after the statement the counter card fills the screen, smoke and all, with
 * the counter large in the middle. As you scroll it shrinks into its slot in the bento while the
 * cards around it slide out from behind it, tilted, and straighten in theirs; the last row tips
 * up into place. On phones each card tips up as it
 * arrives. All of it follows the scroll both ways.
 */

const AboutSection = () => {
  const scrollTo = useSectionScroll();

  // One pointer lights every card's border near it, so the glow crosses the gaps between cards
  const frame = useRef(0);
  const onSpotMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const grid = e.currentTarget;
    const { clientX: x, clientY: y } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      // Measure every card first, then write: interleaving would force a layout per card
      const cards = [...grid.querySelectorAll<HTMLElement>(".spot")];
      const rects = cards.map((el) => el.getBoundingClientRect());
      cards.forEach((el, i) => {
        el.style.setProperty("--mx", `${x - rects[i].left}px`);
        el.style.setProperty("--my", `${y - rects[i].top}px`);
      });
      grid.style.setProperty("--spot-o", "1");
    });
  }, []);
  const onSpotLeave = useCallback((e: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(frame.current);
    e.currentTarget.style.setProperty("--spot-o", "0");
  }, []);
  const time = useLocalTime(PROFILE.timeZone);
  const [latest, setLatest] = useState<GitHubRepo | null>(null);
  const [latestDone, setLatestDone] = useState(false);
  useEffect(() => {
    const c = new AbortController();
    fetchLatestRepositories(12, c.signal).then((r) => {
      // Newest by push date, not the featured ordering the list uses
      const newest = [...r].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))[0];
      if (c.signal.aborted) return;
      if (newest) setLatest(newest);
      setLatestDone(true);
    });
    return () => c.abort();
  }, []);

  // The sheet rises out of the pale section as an inset rounded card, opens to full bleed,
  // then closes back into a card as it leaves. Clip-path keeps the copy unscaled and crisp.
  const reduceMotion = useReducedMotionConfig();
  const sheet = useRef<HTMLDivElement>(null);
  const { scrollYProgress: enter } = useScroll({ target: sheet, offset: ["start end", "start 0.15"] });
  const { scrollYProgress: leave } = useScroll({ target: sheet, offset: ["end 0.95", "end 0.35"] });
  const clipPath = useTransform([enter, leave], ([a, b]: number[]) => {
    if (reduceMotion) return "inset(0 0 0 0 round 32px 32px 0 0)";
    const open = clamp01(a);
    const close = clamp01(b);
    // Wide screens start well inset so the opening reads; narrow ones stay inside the copy's padding
    const inset = window.innerWidth >= 1024 ? 7 : 2.5;
    const side = Math.max((1 - open) * inset, close * inset);
    const top = 64 - open * 32;
    const bottom = close * 56;
    return `inset(0 ${side}vw 0 ${side}vw round ${top}px ${top}px ${bottom}px ${bottom}px)`;
  });

  const wide = useMediaQuery("(min-width: 1024px)");
  const grid = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  // Each card's offset to the counter card's centre, and how far that is (0 near, 1 farthest)
  const deck = useRef<{ dx: number; dy: number; d: number }[]>([]);
  // The full-screen counter: held for a moment, then shrinking into its slot while the bento
  // holds still, pinned 15% down the screen; the bento stays a little longer, then scrolls on
  const zoomTrack = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const overlayFace = useRef<HTMLDivElement>(null);
  const overlayTimer = useRef<HTMLDivElement>(null);
  // Once the deal has played and the section is off screen, the extra scroll it needed goes, so
  // a second visit scrolls straight through the finished bento instead of holding on it
  const [played, setPlayed] = useState(false);
  const zooms = wide && !reduceMotion && !played;
  const spacer = useRef<HTMLDivElement>(null);
  const sheetOnScreen = useInView(sheet);
  const { lenis } = useSmoothScroll();
  // The scroll taken out above the visitor, to hand back the moment it goes so nothing moves
  const giveBack = useRef(0);
  const { scrollYProgress: zoom } = useScroll({ target: zoomTrack, offset: ["start start", "start -0.9"] });
  const { scrollY } = useScroll();
  // The deal plays once: after the counter has landed, scrolling back up leaves the bento as it is,
  // and a card that has tipped into place stays there
  const dealt = useRef(false);
  const landed = useRef(new Set<number>());

  useEffect(() => {
    if (played || sheetOnScreen || !dealt.current) return;
    const below = sheet.current ? sheet.current.getBoundingClientRect().bottom < 0 : false;
    giveBack.current = below ? (spacer.current?.offsetHeight ?? 0) : 0;
    setPlayed(true);
  }, [sheetOnScreen, played]);
  useLayoutEffect(() => {
    const by = giveBack.current;
    if (!played || !by) return;
    giveBack.current = 0;
    if (lenis) lenis.scrollTo(lenis.scroll - by, { immediate: true, force: true });
    else window.scrollBy(0, -by);
  }, [played, lenis]);

  const measure = useCallback(() => {
    const els = cards.current;
    const anchor = els[ANCHOR];
    if (!anchor) return;
    // Layout offsets, which transforms don't change; every card shares the same offset parent
    const centre = (el: HTMLElement) => [el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2];
    const [ax, ay] = centre(anchor);
    const raw = els.map((el) => {
      if (!el) return { dx: 0, dy: 0 };
      const [x, y] = centre(el);
      return { dx: ax - x, dy: ay - y };
    });
    const far = Math.max(1, ...DEALT.map((i) => Math.hypot(raw[i].dx, raw[i].dy)));
    deck.current = raw.map((r) => ({ ...r, d: Math.hypot(r.dx, r.dy) / far }));
  }, []);

  const apply = useCallback(() => {
    const els = cards.current;
    const settle = (el: HTMLElement) => {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.zIndex = "";
    };
    if (reduceMotion) {
      els.forEach((el) => el && settle(el));
      return;
    }
    if (zoom.get() >= 1) dealt.current = true;
    const z = dealt.current ? 1 : zoom.get();
    const k = clamp01((z - HOLD) / (1 - HOLD));
    const vh = window.innerHeight;
    const anchorEl = els[ANCHOR];
    const ov = overlay.current;
    const face = overlayFace.current;
    if (zooms && anchorEl && ov && face) {
      // The overlay's clip runs from the whole screen to the slot's live rect, and the face, set
      // at the slot's size, shrinks from large to life size at the clip's centre. At the end the
      // overlay sits exactly on the card, and hands over to it.
      const o = ov.getBoundingClientRect();
      const a = anchorEl.getBoundingClientRect();
      const e = phase(z, HOLD, 1);
      const left = lerp(0, a.left - o.left, e);
      const top = lerp(0, a.top - o.top, e);
      const right = lerp(o.width, a.right - o.left, e);
      const bottom = lerp(o.height, a.bottom - o.top, e);
      const radius = parseFloat(getComputedStyle(anchorEl).borderTopLeftRadius) || 8;
      ov.style.clipPath = `inset(${top}px ${o.width - right}px ${o.height - bottom}px ${left}px round ${lerp(28, radius, e)}px)`;
      const big = Math.min(o.width / a.width, o.height / a.height) * 0.92;
      const scale = lerp(big, 1, e);
      face.style.width = `${a.width}px`;
      face.style.height = `${a.height}px`;
      face.style.transform = `translate(${(left + right - a.width * scale) / 2}px, ${(top + bottom - a.height * scale) / 2}px) scale(${scale})`;
      // The counter itself starts larger still, the one thing on the screen
      if (overlayTimer.current) overlayTimer.current.style.transform = `scale(${lerp(2.1, 1, e)})`;
      const done = z >= 1;
      ov.style.visibility = done ? "hidden" : "visible";
      anchorEl.style.opacity = done ? "" : "0";
    } else if (anchorEl) {
      anchorEl.style.opacity = "";
    }
    // The grid is positioned, so each card's offsetTop is measured from the grid's top
    const gridTop = grid.current?.getBoundingClientRect().top ?? 0;
    els.forEach((el, i) => {
      if (!el) return;
      if (wide && i === ANCHOR) return;
      if (wide && DEALT.includes(i)) {
        // Out from behind the counter card, tilted and small, to its own slot; nearer cards first
        const c = deck.current[i];
        if (!c) return;
        const from = 0.12 + c.d * 0.28;
        const g = phase(k, from, from + 0.5);
        if (g >= 1) return settle(el);
        const lean = (c.dx > 0 ? -1 : 1) * 6 * (1 - g);
        el.style.transform = `translate(${c.dx * (1 - g)}px, ${c.dy * (1 - g)}px) rotate(${lean}deg) scale(${0.82 + 0.18 * g})`;
        el.style.opacity = String(phase(g, 0, 0.4));
        el.style.zIndex = "";
        return;
      }
      // Tips up from below, hinged at its foot, as its top comes up the screen
      if (landed.current.has(i)) return settle(el);
      const top = gridTop + el.offsetTop;
      const g = phase((vh - top) / (vh * 0.45), 0, 1);
      if (g >= 1) {
        landed.current.add(i);
        return settle(el);
      }
      el.style.transformOrigin = "50% 100%";
      el.style.transform = `perspective(1000px) translateY(${(1 - g) * 80}px) rotateX(${(1 - g) * 18}deg) scale(${0.94 + 0.06 * g})`;
      el.style.opacity = String(g);
    });
  }, [zoom, reduceMotion, wide, zooms]);

  useMotionValueEvent(scrollY, "change", apply);
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const redo = () => {
      measure();
      apply();
    };
    redo();
    // Cards change size as fonts, the clock and the GitHub card arrive
    const ro = new ResizeObserver(redo);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, apply]);

  const setCard = (i: number) => (el: HTMLDivElement | null) => {
    cards.current[i] = el;
  };

  return (
    <section
      id="about"
      className="theme-dark text-snow scroll-mt-16"
      style={{ background: `linear-gradient(to bottom, ${PALE} 0, ${PALE} 50%, hsl(var(--night)) 50%)` }}
    >
      <motion.div ref={sheet} style={{ clipPath }} className="bg-graphite px-6 md:px-10 lg:px-12 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-[1400px] mx-auto">
            {/* The section's heading, set as its label, so heading navigation finds it */}
            <motion.h2 {...reveal()} className="t-label mb-8">
              Who I am
            </motion.h2>
            <FillText
              text={STATEMENT}
              className="t-statement text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl max-w-6xl"
            />

            <div ref={zoomTrack} className="relative mt-16 lg:mt-24">
              {zooms && (
                <>
                  {/* The counter card at full screen, shrinking into its slot */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 z-10"
                    style={{ left: "calc(50% - 50vw)", width: "100vw" }}
                  >
                    <div ref={overlay} className="sticky top-0 h-screen bg-night text-snow">
                      <Smoke />
                      <div
                        ref={overlayFace}
                        className="absolute left-0 top-0 origin-top-left flex flex-col items-center text-center p-6 md:p-8"
                      >
                        <CounterFace timerRef={overlayTimer} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div
                ref={grid}
                onPointerMove={onSpotMove}
                onPointerLeave={onSpotLeave}
                // Keyboard: a focused link or button must be visible, so focus inside the bento
                // finishes the deal at once and every card stands in place
                onFocus={() => {
                  if (dealt.current && landed.current.size >= cards.current.length) return;
                  dealt.current = true;
                  cards.current.forEach((_, i) => landed.current.add(i));
                  apply();
                }}
                className={`relative grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4 ${zooms ? "sticky top-[15vh]" : ""}`}
              >
                {/* Founder card */}
                <motion.div ref={setCard(0)} className={`${card} md:col-span-6 lg:col-span-5 p-6 md:p-8 flex flex-col`}>
                  <span className="flex items-center gap-2 t-figure text-xs text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Open to
                    opportunities
                  </span>
                  <h3 className="t-heading text-4xl md:text-5xl mt-6">From the engineer</h3>
                  <span className="block w-10 h-px bg-line mt-5 mb-5" aria-hidden="true" />
                  <p className="t-body text-snow/80 max-w-md">{PROFILE.intro}</p>
                  <div className="mt-auto pt-8 flex items-center gap-5">
                    <Portrait
                      alt={PROFILE.name}
                      pictureClassName="shrink-0"
                      className="w-24 h-24 md:w-28 md:h-28 rounded-md object-cover object-top border border-line"
                    />
                    <div>
                      <p className="font-body text-lg font-medium">{PROFILE.name}</p>
                      <p className="t-caps text-muted text-[12px] mt-1">
                        {PROFILE.title} · {PROFILE.city.split(",")[0]}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Vertical label strip */}
                <motion.div
                  ref={setCard(1)}
                  className={`${card} hidden lg:flex lg:col-span-1 flex-col items-center justify-between py-6`}
                >
                  <span className="t-figure text-xs text-muted [writing-mode:vertical-rl] rotate-180">
                    Software Engineer
                  </span>
                  <span className="t-heading text-xl [writing-mode:vertical-rl] rotate-180">Achyuth KP</span>
                </motion.div>

                {/* Tall dark card with the live counter over smoke */}
                <motion.div
                  ref={setCard(2)}
                  className={`${card} md:col-span-3 lg:col-span-3 bg-night min-h-[420px] lg:min-h-0 flex flex-col items-center text-center p-6 md:p-8`}
                >
                  <Smoke />
                  <CounterFace />
                </motion.div>

                {/* Principle card */}
                <motion.div
                  ref={setCard(3)}
                  className={`${card} md:col-span-3 lg:col-span-3 p-6 md:p-8 flex flex-col justify-center text-center`}
                >
                  {/* Concentric hairlines rippling out from the top-left corner */}
                  <svg
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="xMinYMin slice"
                    viewBox="0 0 400 600"
                  >
                    {/* Clustered at the top-left, each arc whole within the card, fading outward */}
                    {[110, 190, 280, 380].map((r, i) => (
                      <circle
                        key={r}
                        cx="-30"
                        cy="-40"
                        r={r}
                        fill="none"
                        stroke={`hsl(0 0% 100% / ${0.09 - i * 0.015})`}
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                  <h3 className="relative t-heading text-3xl md:text-4xl">
                    Reliable systems.
                    <br />
                    <span className="text-emerald-400">Useful AI.</span>
                  </h3>
                  <DrawRule center className="w-10 relative bg-line my-5" />
                  <p className="relative t-body text-snow/70 text-[15px]">
                    Correctness, security, and observability stay in scope from the first commit to the last.
                  </p>
                </motion.div>

                {/* Story + actions */}
                <motion.div ref={setCard(4)} className={`${card} md:col-span-6 lg:col-span-8 p-6 md:p-8 flex flex-col`}>
                  <h3 className="t-heading text-3xl md:text-4xl">Same platform, higher bar</h3>
                  <DrawRule className="w-10 bg-line mt-5 mb-5" />
                  <p className="t-body text-snow/70">
                    I started at FIS Global, was promoted to Senior Software Engineer, and moved with the same platform
                    and client to Cognizant. The interesting problems now sit where reliable systems meet AI: models
                    that are useful, gated, and observable in production, not just in a demo.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollTo("work")}
                    className="group mt-auto pt-8 inline-flex items-center gap-3 t-heading text-2xl self-start"
                  >
                    See the work{" "}
                    <ArrowRight
                      className="w-6 h-6 transition-transform duration-fast group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </motion.div>

                {/* Accent count */}
                <motion.div
                  ref={setCard(5)}
                  data-reveal-skip
                  className="spot spot-light group relative rounded-lg overflow-hidden md:col-span-6 lg:col-span-4 bg-snow p-6 md:p-8 flex flex-col"
                >
                  <p className="relative t-heading text-3xl md:text-4xl text-night">Services in the estate</p>
                  <p className="relative t-wordmark leading-none text-[6rem] md:text-[7.5rem] mt-auto pt-8 text-night">
                    <ScrambleNumber value="30" suffix="+" suffixClassName="text-emerald-500 plus-pulse" />
                  </p>
                  <DrawRule className="w-10 relative bg-night/40 mt-4" />
                </motion.div>

                {/* Local time and availability */}
                <motion.div ref={setCard(6)} className={`${card} md:col-span-3 lg:col-span-4 p-6 md:p-8 flex flex-col`}>
                  <div className="flex flex-row md:flex-col min-[1400px]:flex-row items-start justify-between gap-4 md:gap-0 min-[1400px]:gap-4">
                    <div>
                      <p className="t-label">Local time</p>
                      <p className="t-wordmark leading-none text-5xl md:text-6xl t-figure mt-5 whitespace-nowrap">
                        {time.time.split(":")[0]}
                        <span className="clock-colon">:</span>
                        {time.time.split(":")[1]}
                        <span data-no-split className="t-heading text-xl md:text-2xl text-muted ml-2">
                          {time.period}
                        </span>
                      </p>
                      <p className="t-caps text-muted text-[12px] mt-2">{PROFILE.city.split(",")[0]} · IST</p>
                    </div>
                    <div className="text-right md:text-left min-[1400px]:text-right md:mt-8 min-[1400px]:mt-0">
                      <p className="t-label">Status</p>
                      <p className="flex items-center justify-end md:justify-start min-[1400px]:justify-end gap-2.5 t-heading text-2xl md:text-3xl mt-5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </span>
                        Open
                      </p>
                      <p className="t-caps text-muted text-[12px] mt-2">To opportunities</p>
                    </div>
                  </div>
                </motion.div>

                {/* Latest public push */}
                <motion.div
                  ref={setCard(7)}
                  className={`${card} md:col-span-3 lg:col-span-8 p-6 md:p-8 flex flex-col min-w-0`}
                >
                  <p className="t-label mb-auto">Latest on GitHub</p>
                  {latest ? (
                    <ExternalLink
                      href={latest.html_url}
                      className="group mt-6 flex items-end justify-between gap-6 min-w-0"
                    >
                      <span className="min-w-0">
                        <span className="block t-heading text-2xl md:text-3xl break-words">{latest.name}</span>
                        <span className="block t-body text-muted mt-1 line-clamp-2">{latest.description}</span>
                      </span>
                      <span className="shrink-0 flex items-center gap-3 t-figure text-xs text-muted">
                        {monthDay(latest.updated_at)}
                        <HoverArrow accent />
                      </span>
                    </ExternalLink>
                  ) : (
                    <p className="mt-6 t-figure text-xs text-muted">
                      {latestDone ? (
                        // GitHub didn't answer (rate limit, offline): point at the profile instead of waiting forever
                        <ExternalLink
                          href={PROFILE.links.github}
                          className="underline underline-offset-4 hover:text-snow"
                        >
                          See it on GitHub
                        </ExternalLink>
                      ) : (
                        "Fetching…"
                      )}
                    </p>
                  )}
                </motion.div>
              </div>
              {/* Scroll for the counter to fill the screen, shrink into its slot, and for the pinned
                  bento to hold a moment before it moves on */}
              {zooms && <div ref={spacer} aria-hidden="true" className="h-[130vh]" />}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
