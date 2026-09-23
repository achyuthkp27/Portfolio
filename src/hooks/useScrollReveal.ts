import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motionPreference";

/** Text-bearing elements that reveal on first sight. Nested matches defer to their nearest revealing ancestor. */
const SELECTOR = "h1, h2, h3, h4, p, li, dt, dd, pre, blockquote, a, button";
/** Elements whose single static text node may be split into letters or words */
const SPLIT_LEAVES = "h1, h2, h3, h4, p, span, dt, dd, li, figcaption";
const STAGGER_MS = 60;
const MAX_DELAY_MS = 360;
/** Letters up to this length, words beyond it, so long paragraphs stay cheap */
const LETTER_LIMIT = 60;
/** Whole sequence for one element never exceeds this, whatever its length */
const SEQUENCE_MS = 700;
const MIN_STEP_MS = 14;

/**
 * Splits one static text node into words of letters (or into words alone), each unit a span
 * carrying its index so CSS can stagger it. Spaces stay as bare text so lines still wrap.
 * Only text that React never updates is split: a single text child, no aria-hidden, outside
 * any `data-no-split` or `data-reveal-skip` subtree, and never a button or link.
 */
const split = (el: HTMLElement): number => {
  if (el.childNodes.length !== 1 || el.firstChild?.nodeType !== Node.TEXT_NODE) return 0;
  if (el.closest("[data-no-split], [data-reveal-skip], button, a, [aria-hidden='true']")) return 0;
  const text = el.textContent ?? "";
  if (!text.trim()) return 0;
  const byLetter = text.length <= LETTER_LIMIT;
  const frag = document.createDocumentFragment();
  let index = 0;
  text.split(/(\s+)/).forEach((chunk) => {
    if (!chunk) return;
    if (/^\s+$/.test(chunk)) {
      frag.appendChild(document.createTextNode(chunk));
      return;
    }
    const word = document.createElement("span");
    word.className = "rv-w";
    if (byLetter) {
      for (const ch of chunk) {
        const u = document.createElement("span");
        u.className = "rv-u";
        u.style.setProperty("--u", String(index++));
        u.textContent = ch;
        word.appendChild(u);
      }
    } else {
      word.classList.add("rv-u");
      word.style.setProperty("--u", String(index++));
      word.textContent = chunk;
    }
    frag.appendChild(word);
  });
  el.setAttribute("aria-label", text);
  el.replaceChildren(frag);
  el.style.setProperty("--step", `${Math.max(MIN_STEP_MS, Math.min(28, SEQUENCE_MS / Math.max(index, 1)))}ms`);
  return index;
};

/**
 * Gaussian-blur reveal for everything inside `root`: each matching element starts blurred,
 * transparent and slightly low, and settles the first time it enters the viewport, with a
 * small stagger among siblings. Inside it, static text writes itself in left to right and
 * top to bottom, letter by letter for short text and word by word for long text.
 * Subtrees marked `data-reveal-skip` (the hero, the kinetic stage, live demos) run their own
 * motion and are left alone; `data-no-split` keeps the blur but not the split.
 * Reduced motion disables it in CSS.
 */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if (prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const prime = (el: Element) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.classList.contains("reveal")) return;
      if (el.closest("[data-reveal-skip]")) return;
      if (el.parentElement?.closest(".reveal")) return;
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [el];
      const index = siblings.indexOf(el);
      el.style.setProperty("--reveal-delay", `${Math.min(index * STAGGER_MS, MAX_DELAY_MS)}ms`);
      // Split the element's own text, or the static text leaves inside it
      let units = split(el);
      if (units === 0) {
        el.querySelectorAll<HTMLElement>(SPLIT_LEAVES).forEach((leaf) => {
          units += split(leaf);
        });
      }
      el.classList.add("reveal");
      if (units > 0) el.classList.add("reveal-split");
      io.observe(el);
    };

    const scan = (node: ParentNode) => {
      if (node instanceof Element && node.matches(SELECTOR)) prime(node);
      node.querySelectorAll(SELECTOR).forEach(prime);
    };

    scan(host);
    const mo = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((n) => n instanceof Element && scan(n)));
    });
    mo.observe(host, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [root]);
}
