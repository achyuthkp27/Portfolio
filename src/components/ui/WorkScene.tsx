import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import type { Project } from "@/data/projects";
import { useSmoothScroll } from "@/context/smoothScroll";
import { clamp01 } from "@/lib/format";
import { phase } from "@/lib/phase";
import { DotField } from "./DotField";
import { WorkCard, WorkGroupCard } from "./WorkCard";
import { isTouchFirst, onLayoutResize } from "@/lib/viewport";

const WORD = ["W", "O", "R", "K"] as const;
/** Screens of scroll before the first card faces you: the capsule rises, opens, and becomes the wall */
const OPEN = 2.7;
/** Screens between one card landing and the next: a shared card holds more, so each stays longer */
const GAP = 0.85;
/** Screens a card takes to slide up into place */
const SLIDE = 0.5;
/** Cards that stay visible in the deck under the top one */
const DECK = 3;
/** How far each card in the deck peeks out above the one over it, in px */
const PEEK = 24;
/** Screens after the last card lands when the deck lifts away, and how long that takes */
const EXIT_AT = 0.35;
const EXIT = 0.5;
/** Screens after the last card lands when the opening starts to play backwards, and how long
 * the wall takes to fold back into the capsule. The scene lets go as soon as it has, so the
 * capsule rides up and out with the page and the next section follows straight on. */
const FOLD_AT = 0.55;
const FOLD = 1.0;
/** Where the capsule stops in the middle, in screens: the folding plays back to here */
const SETTLED = 0.85;

type Layout = {
  W: number;
  H: number;
  copies: number;
  font: number;
  spacing: number;
  rowGap: number;
  radius: number;
  capW: number;
  capH: number;
  wallScale: number;
};

/** Sizes from the pinned stage itself: on iOS the window's height follows the address bar, while
 * the stage is a full screen tall, and mixing the two put the WORK reveal 40px off */
const measure = (stage?: HTMLElement | null): Layout => {
  const W = stage?.clientWidth || window.innerWidth;
  const H = stage?.clientHeight || window.innerHeight;
  const wide = W >= 768;
  // One copy per project on wide screens; phones keep seven so the letters never touch
  const copies = wide ? 11 : 7;
  const font = wide ? Math.min(H * 0.17, W * 0.12) : Math.min(W * 0.13, H * 0.1);
  const spacing = wide ? Math.min(W * 0.082, font * 0.82) : W * 0.135;
  const half = (copies - 1) / 2;
  const rowGap = font * 0.98;
  return {
    W,
    H,
    copies,
    font,
    spacing,
    rowGap,
    // The drum the rows wrap around: its arc over ±70° matches the flat row's length
    radius: (spacing * half) / ((70 * Math.PI) / 180),
    capW: font * 1.35,
    capH: rowGap * 4 + font * 0.75,
    wallScale: wide ? Math.min(1.35, (H * 0.94) / (rowGap * 4)) : 1.15,
  };
};

/** Writes a style only when it changes: a scroll frame that leaves an element as it was costs nothing */
const written = new WeakMap<HTMLElement, Record<string, string>>();
const put = (el: HTMLElement, prop: string, value: string) => {
  const seen = written.get(el) ?? {};
  if (seen[prop] === value) return;
  seen[prop] = value;
  written.set(el, seen);
  if (prop.startsWith("--")) el.style.setProperty(prop, value);
  else
    el.style.setProperty(
      prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
      value,
    );
};

/** Where card i lands on the deck, in screens from the top of the scene */
const momentOf = (i: number) => OPEN + i * GAP;

/**
 * Work, after wodniack.dev. A capsule rises into the middle of the screen over WORK, which
 * stands in place and shows only inside it, wiped into view from the bottom up by its top edge. The capsule then opens, each
 * letter copies itself out sideways into a row wrapped round a drum, and the drum flattens
 * into a wall of letters that keeps swaying. The projects then stack up over the wall, related
 * ones sharing a card: each card slides up into place on top of the last, and the ones
 * underneath shrink back and darken into a deck, the top few peeking out above. After the last one the deck lifts away and the opening
 * plays backwards into the capsule, which leaves with the page.
 * The wipe lasts only while the capsule rises; at rest no letter is clipped. Every card stays in
 * the tab order; focusing one brings it to the front.
 */
export const WorkScene = ({ groups, onOpen }: { groups: Project[][]; onOpen: (study: Project) => void }) => {
  const track = useRef<HTMLDivElement>(null);
  const capsule = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  // The window WORK shows through while the capsule rises, and its counter-moving contents
  const reveal = useRef<HTMLDivElement>(null);
  const revealInner = useRef<HTMLDivElement>(null);
  const gridLayer = useRef<HTMLDivElement>(null);
  const dotLayer = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const shades = useRef<(HTMLDivElement | null)[]>([]);
  // Where the deck's top sits, in px: the cards share the tallest one's height, centred on screen.
  // On a short screen the deck is scaled to fit between the nav and the foot.
  const deckTop = useRef(0);
  const deckFit = useRef(1);
  // Phones: the letters stop swaying once the wall stands, and stacked cards slide and darken
  // without shrinking. A card that changes scale is drawn again in full each frame on iOS, and
  // 28 swaying 3D letters behind it took the frames the deck needed.
  const still = useRef(isTouchFirst());
  const stage = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>(() => measure());
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const { lenis } = useSmoothScroll();
  const n = groups.length;
  const screens = momentOf(n - 1) + FOLD_AT + FOLD;
  const { scrollYProgress: p } = useScroll({ target: track, offset: ["start start", "end end"] });

  const draw = (v: number) => {
    const L = layoutRef.current;
    const { H, copies, font, spacing, rowGap, radius, capW, capH } = L;
    const s = v * screens;
    const half = (copies - 1) / 2;
    // After the last card the opening plays backwards: the wall shrinks, curls back onto the
    // drum, and folds into the capsule, which then leaves with the page.
    // `o` is where the opening stands: the scroll itself on the way in, running back down after.
    const foldFrom = momentOf(n - 1) + FOLD_AT;
    const o = s < foldFrom ? s : OPEN - clamp01((s - foldFrom) / FOLD) * (OPEN - SETTLED);

    // The capsule rises from just below the middle (already in view as the scene arrives),
    // stops in the middle, then opens wide and lets go
    const capY = (1 - phase(o, 0, SETTLED)) * H * 0.5;
    const widen = phase(o, 1.0, 1.5);
    if (capsule.current) {
      capsule.current.style.width = `${capW + widen * (L.W * 1.2 - capW)}px`;
      capsule.current.style.transform = `translate(-50%, -50%) translateY(${capY}px)`;
      capsule.current.style.opacity = String(1 - phase(o, 1.25, 1.6));
    }
    if (gridLayer.current) gridLayer.current.style.opacity = String(1 - phase(o, 1.0, 1.5));
    if (dotLayer.current) dotLayer.current.style.opacity = String(phase(o, 1.0, 1.5));

    // The wall grows to fill the screen once it has flattened, and keeps swaying while the cards pass
    const spread = phase(o, 1.0, 1.5);
    const curve = 1 - phase(o, 1.55, 2.05);
    const sway = still.current ? 0 : phase(o, 2.2, 2.7);
    if (wall.current) {
      put(wall.current, "transform", `scale(${1 + phase(o, 2.0, 2.5) * (L.wallScale - 1)})`);

      // The outline copies step back while the projects pass, so the card in front is what you read
      const calm = phase(s, OPEN - 0.7, OPEN - 0.2) * (1 - phase(s, foldFrom, foldFrom + 0.3));
      put(wall.current, "--wall-ink", (0.42 - 0.27 * calm).toFixed(3));
    }
    // WORK stands in place from the start and shows only inside the rising capsule. A window
    // rides up with the capsule's top edge while its contents move the other way, so the letters
    // hold still and are wiped into view from the bottom up: two moving layers, nothing redrawn.
    // Once the capsule stops, the wall's own copy takes over and nothing is clipped at rest.
    const rising = o < SETTLED;
    // Measured from the stage's centre, where the capsule and the letters are anchored
    const edge = capY - capH / 2 + 14;
    if (reveal.current) {
      put(reveal.current, "opacity", rising ? "1" : "0");
      put(reveal.current, "transform", `translate(-50%, ${edge.toFixed(1)}px)`);
    }
    if (revealInner.current) put(revealInner.current, "transform", `translateY(${(-edge).toFixed(1)}px)`);
    letters.current.forEach((row, r) =>
      row.forEach((el, i) => {
        if (!el) return;
        const k = i - half;
        const a = half ? k / half : 0;
        const phi = ((a * 70 * Math.PI) / 180) * spread;
        const flatX = k * spacing * spread;
        const x = flatX + (radius * Math.sin(phi) - flatX) * curve;
        const z = radius * (Math.cos(phi) - 1) * curve;
        const turn = (phi * 180 * curve) / Math.PI + sway * Math.sin(s * 2.2 + k * 0.6 + r * 0.9) * 16;
        const y = (r - 1.5) * rowGap + sway * Math.sin(s * 1.7 + k * 0.45 + r) * font * 0.06;
        put(
          el,
          "transform",
          `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${turn.toFixed(2)}deg)`,
        );
        // The centre column shows through the capsule's window while it rises, then stands here
        put(el, "opacity", k === 0 ? (rising ? "0" : "1") : clamp01(spread * 1.6 - Math.abs(a) * 0.15).toFixed(3));
      }),
    );

    // The deck: each card slides up into place over the last, and the ones under it shrink back,
    // darken and peek out above it; after the last card the whole deck lifts away
    const exitFrom = momentOf(n - 1) + EXIT_AT;
    const exit = phase(s, exitFrom, exitFrom + EXIT);
    cards.current.forEach((el, i) => {
      if (!el) return;
      const m = momentOf(i);
      const enter = phase(s, m - SLIDE, m);
      // How many cards now lie on top of this one, counting the one sliding in as a share
      const depth = Math.max(0, (s - m) / GAP);
      const shown = (enter > 0 ? 1 : 0) * (1 - phase(depth, DECK, DECK + 1)) * (1 - exit);
      // Out of view it stays rendered but invisible, so its controls are still in the tab order
      put(el, "opacity", shown.toFixed(3));
      if (!shown) {
        put(el, "pointerEvents", "none");
        return;
      }
      const stack = Math.min(depth, DECK + 1);
      const top = deckTop.current;
      const y = (1 - enter) * (L.H - top + 40) + top - stack * PEEK - exit * L.H * 0.5;
      const scale = (still.current ? 1 : 1 - 0.05 * stack) * deckFit.current;
      put(el, "transform", `translate(-50%, ${y.toFixed(1)}px) scale(${scale.toFixed(4)})`);
      put(el, "zIndex", String(i + 1));
      put(el, "pointerEvents", enter > 0.95 && depth < 0.5 && exit < 0.5 ? "auto" : "none");
      const shade = shades.current[i];
      if (shade) put(shade, "opacity", Math.min(0.6, depth * 0.24).toFixed(3));
    });
  };

  // Where the scene really is, read from the track's position. The scroll tracker below only
  // says when to draw: after an instant jump (a focused control bringing its card forward) it can
  // report a stale value, which drew the deck for the wrong moment and hid the focused card.
  const progressNow = () => {
    const el = track.current;
    if (!el) return p.get();
    const box = el.getBoundingClientRect();
    const vh = stage.current?.clientHeight || window.innerHeight;
    return clamp01(-box.top / Math.max(1, box.height - vh));
  };
  useMotionValueEvent(p, "change", () => draw(progressNow()));
  useEffect(() => {
    draw(progressNow());
    const onResize = () => setLayout(measure(stage.current));
    // Once mounted, measure the stage itself rather than the window
    onResize();
    const offResize = onLayoutResize(onResize);
    return () => offResize();
    // Draws from refs; p is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Every card takes the tallest one's height, so the deck is even, and the deck is centred
    // on the screen with room above it for the cards peeking out
    const sizeDeck = () => {
      const els = cards.current.filter((el): el is HTMLLIElement => !!el);
      els.forEach((el) => (el.style.height = ""));
      const tallest = Math.max(0, ...els.map((el) => el.offsetHeight));
      els.forEach((el) => (el.style.height = `${tallest}px`));
      const nav = layout.W >= 768 ? 88 : 72;
      const room = layout.H - nav - DECK * PEEK - 24;
      deckFit.current = Math.min(1, room / Math.max(1, tallest));
      const shown = tallest * deckFit.current;
      deckTop.current = Math.max(nav + DECK * PEEK, (layout.H - shown + DECK * PEEK) / 2);
      draw(progressNow());
    };
    sizeDeck();
    // Card heights depend on the fonts, which may still be loading
    document.fonts?.ready.then(sizeDeck);
    // Redraw once the new layout has rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  // Keyboard: a control in a card that is far away or flown past brings its card to the front
  const bringToFront = (i: number) => {
    const el = track.current;
    if (!el) return;
    const s = progressNow() * screens;
    if (Math.abs(s - momentOf(i)) < 0.2) return;
    const vh = stage.current?.clientHeight || window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + momentOf(i) * vh;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: "instant" });
    // Draw for where the page now is, without waiting for the scroll tracker
    requestAnimationFrame(() => draw(progressNow()));
  };

  const { copies, font, capW, capH } = layout;
  return (
    <div ref={track} data-reveal-skip className="relative" style={{ height: `${(screens + 1) * 100}vh` }}>
      {/* Where each project's card lands, for links that point at the project */}
      {groups.flatMap((group, i) =>
        group.map((study) => (
          <div
            key={study.slug}
            id={`case-${study.slug}`}
            aria-hidden="true"
            className="absolute inset-x-0 h-px pointer-events-none"
            style={{ top: `${momentOf(i) * 100}vh` }}
          />
        )),
      )}

      <div ref={stage} className="sticky top-0 h-screen overflow-hidden bg-night">
        {/* Square cells round the capsule, giving way to a field of dots once it opens */}
        <div
          ref={gridLayer}
          aria-hidden="true"
          className="absolute inset-0 [background-image:linear-gradient(to_right,hsl(0_0%_100%/0.09)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.09)_1px,transparent_1px)] [background-size:calc(100vw/12)_calc(100vw/12)]"
        />
        <div ref={dotLayer} aria-hidden="true" className="absolute inset-0 opacity-0">
          <DotField gap={28} strength={0.7} />
        </div>

        {/* The capsule: a pill with a second ring round it, dark inside with a fine dot field */}
        <div
          ref={capsule}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 rounded-full border border-emerald-400/50 bg-night p-3 shadow-[0_0_0_10px_hsl(var(--night)),0_0_0_11px_hsl(var(--accent-400)/0.35)]"
          style={{ width: capW, height: capH }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            {/* A fixed size, wider than the capsule ever gets, so widening it never resizes the canvas */}
            <div className="absolute left-1/2 top-0 h-full w-[130vw] -translate-x-1/2">
              <DotField gap={22} />
            </div>
          </div>
        </div>

        {/* WORK while the capsule rises: a window from the capsule's top edge down, its contents
            held still against it (see draw) */}
        <div
          ref={reveal}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-screen overflow-hidden"
          style={{ width: capW }}
        >
          <div ref={revealInner} className="absolute left-1/2 top-0 h-screen w-screen -ml-[50vw]">
            {WORD.map((letter, r) => (
              <span
                key={letter}
                style={{
                  fontSize: font,
                  transform: `translate(-50%, -50%) translateY(${(r - 1.5) * layout.rowGap}px)`,
                }}
                // The contents' top is the stage's centre (see draw), where the wall's letters sit too
                className="absolute left-1/2 top-0 font-display font-semibold uppercase leading-none text-emerald-400"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* WORK, and the wall it becomes */}
        <div aria-hidden="true" className="absolute inset-0 [perspective:1100px]">
          <div ref={wall} className="absolute inset-0 [transform-style:preserve-3d]">
            {WORD.map((letter, r) =>
              Array.from({ length: copies }, (_, i) => {
                const centre = i === (copies - 1) / 2;
                return (
                  <span
                    key={`${r}-${i}`}
                    ref={(el) => {
                      letters.current[r][i] = el;
                    }}
                    style={{ fontSize: font, opacity: 0 }}
                    className={`absolute left-1/2 top-1/2 font-display font-semibold uppercase leading-none ${
                      centre
                        ? "text-emerald-400"
                        : "text-transparent [-webkit-text-stroke:1.5px_hsl(0_0%_100%/var(--wall-ink,0.42))]"
                    }`}
                  >
                    {letter}
                  </span>
                );
              }),
            )}
          </div>
        </div>

        {/* The projects, stacking up over the wall */}
        <ol className="absolute inset-0">
          {groups.map((group, i) => (
            <li
              key={group.map((study) => study.slug).join("+")}
              ref={(el) => {
                cards.current[i] = el;
              }}
              onFocus={(e: FocusEvent) => {
                if (e.target !== e.currentTarget) bringToFront(i);
              }}
              style={{ opacity: 0, pointerEvents: "none" }}
              className="absolute left-1/2 top-0 w-[min(1180px,92vw)] origin-top will-change-transform"
            >
              {group.length === 1 ? (
                <WorkCard study={group[0]} index={i} total={n} onOpen={onOpen} large />
              ) : (
                <WorkGroupCard group={group} index={i} total={n} onOpen={onOpen} />
              )}
              {/* Darkens the card as others pile on top of it; a layer, not a filter, so the text stays crisp */}
              <div
                ref={(el) => {
                  shades.current[i] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-night pointer-events-none"
                style={{ opacity: 0 }}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default WorkScene;
