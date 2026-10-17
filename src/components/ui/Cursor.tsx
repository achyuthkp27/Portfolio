import { useEffect, useRef } from "react";
import { useReducedMotionConfig } from "framer-motion";

/** What counts as something to click: the ring opens up over it */
const CLICKABLE = "a[href], button, [role='button'], summary, label, select";
/** Where the native cursor comes back: fields you type in */
const TYPING = "input, textarea, [contenteditable='true']";

/** One step of easing toward a target, frame-rate independent */
const ease = (have: number, want: number, rate: number, dt: number) =>
  have + (want - have) * (1 - Math.exp(-rate * dt));

/**
 * The pointer, after the cursors on wodniack.dev and noomo: an emerald dot exactly on the
 * pointer and a ring that trails it, opening up and turning emerald over anything clickable.
 * Two small touches ride on the same loop: controls marked `data-magnetic` lean toward the
 * pointer, and cards marked `data-tilt` tip toward it. Mouse only; touch screens and reduced
 * motion keep the system cursor and nothing moves.
 */
export const Cursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionConfig();

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;
    document.documentElement.classList.add("has-cursor");

    const p = { x: -100, y: -100 };
    const ringAt = { x: -100, y: -100, size: 34, open: 0 };
    let shown = 0;
    let visible = false;
    let over: Element | null = null;
    let typing = false;
    // Elements leaning or tipping now, and how far, so they ease back when the pointer leaves
    const pulled = new Map<HTMLElement, { x: number; y: number }>();
    const tipped = new Map<HTMLElement, { x: number; y: number }>();
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      let busy = false;

      const clickable = !!over?.closest(CLICKABLE);
      ringAt.x = ease(ringAt.x, p.x, 16, dt);
      ringAt.y = ease(ringAt.y, p.y, 16, dt);
      ringAt.open = ease(ringAt.open, clickable ? 1 : 0, 14, dt);
      shown = ease(shown, visible && !typing ? 1 : 0, 12, dt);
      const size = 34 + 30 * ringAt.open;
      r.style.transform = `translate3d(${ringAt.x - size / 2}px, ${ringAt.y - size / 2}px, 0)`;
      r.style.width = r.style.height = `${size}px`;
      r.style.opacity = String(shown);
      r.style.borderColor = `color-mix(in srgb, hsl(var(--accent-400)) ${Math.round(ringAt.open * 100)}%, hsl(0 0% 100% / 0.45))`;
      r.style.backgroundColor = `hsl(var(--accent-400) / ${0.1 * ringAt.open})`;
      d.style.transform = `translate3d(${p.x - 3}px, ${p.y - 3}px, 0) scale(${1 - 0.6 * ringAt.open})`;
      d.style.opacity = String(shown);
      if (Math.abs(ringAt.x - p.x) + Math.abs(ringAt.y - p.y) > 0.3 || Math.abs(shown - (visible ? 1 : 0)) > 0.01)
        busy = true;

      // Magnetic controls: lean a little toward the pointer while it is over them
      const magnet = over?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && !pulled.has(magnet)) pulled.set(magnet, { x: 0, y: 0 });
      pulled.forEach((at, el) => {
        let wx = 0;
        let wy = 0;
        if (el === magnet) {
          const b = el.getBoundingClientRect();
          wx = (p.x - (b.left + b.width / 2)) * 0.3;
          wy = (p.y - (b.top + b.height / 2)) * 0.4;
        }
        at.x = ease(at.x, wx, 12, dt);
        at.y = ease(at.y, wy, 12, dt);
        if (el !== magnet && Math.abs(at.x) + Math.abs(at.y) < 0.1) {
          el.style.translate = "";
          pulled.delete(el);
          return;
        }
        el.style.translate = `${at.x.toFixed(2)}px ${at.y.toFixed(2)}px`;
        busy = true;
      });

      // Tilting cards: tip toward the pointer, a few degrees at most
      const card = over?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (card && !tipped.has(card)) tipped.set(card, { x: 0, y: 0 });
      tipped.forEach((at, el) => {
        let wx = 0;
        let wy = 0;
        if (el === card) {
          const b = el.getBoundingClientRect();
          wy = ((p.x - (b.left + b.width / 2)) / b.width) * 5;
          wx = -((p.y - (b.top + b.height / 2)) / b.height) * 4;
        }
        at.x = ease(at.x, wx, 8, dt);
        at.y = ease(at.y, wy, 8, dt);
        if (el !== card && Math.abs(at.x) + Math.abs(at.y) < 0.02) {
          el.style.transform = "";
          tipped.delete(el);
          return;
        }
        el.style.transform = `perspective(1400px) rotateX(${at.x.toFixed(2)}deg) rotateY(${at.y.toFixed(2)}deg)`;
        busy = true;
      });

      if (busy) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      p.x = e.clientX;
      p.y = e.clientY;
      if (!visible) {
        // First move after entering: start the ring on the pointer, not flying in from a corner
        ringAt.x = p.x;
        ringAt.y = p.y;
      }
      visible = true;
      over = e.target instanceof Element ? e.target : null;
      typing = !!over?.closest(TYPING);
      wake();
    };
    const onLeave = () => {
      visible = false;
      over = null;
      wake();
    };
    // A scroll moves the page under a still pointer: what is under it changes
    const onScroll = () => {
      if (!visible) return;
      over = document.elementFromPoint(p.x, p.y);
      wake();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("has-cursor");
      pulled.forEach((_, el) => (el.style.translate = ""));
      tipped.forEach((_, el) => (el.style.transform = ""));
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[400]">
      <div
        ref={ring}
        className="absolute left-0 top-0 rounded-full border opacity-0"
        style={{ width: 34, height: 34, borderColor: "hsl(0 0% 100% / 0.45)" }}
      />
      <div ref={dot} className="absolute left-0 top-0 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0" />
    </div>
  );
};

export default Cursor;
