import { useEffect, type RefObject } from "react";

/** Text-bearing elements that reveal on first sight. Nested matches defer to their nearest revealing ancestor. */
const SELECTOR = "h1, h2, h3, h4, p, li, dt, dd, pre, blockquote, a, button";
const STAGGER_MS = 60;
const MAX_DELAY_MS = 360;

/**
 * Gaussian-blur reveal for everything inside `root`: each matching element starts blurred,
 * transparent and slightly low, and settles the first time it enters the viewport, with a
 * small stagger among siblings. Subtrees marked `data-reveal-skip` (the hero, the kinetic
 * stage, live demos) run their own motion and are left alone. Reduced motion disables it in CSS.
 */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      // A revealing ancestor already carries this text
      if (el.parentElement?.closest(".reveal")) return;
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [el];
      const index = siblings.indexOf(el);
      el.style.setProperty("--reveal-delay", `${Math.min(index * STAGGER_MS, MAX_DELAY_MS)}ms`);
      el.classList.add("reveal");
      io.observe(el);
    };

    const scan = (node: ParentNode) => {
      if (node instanceof Element && node.matches(SELECTOR)) prime(node);
      node.querySelectorAll(SELECTOR).forEach(prime);
    };

    scan(host);
    // Sections mount lazily and lists page in, so keep priming what arrives
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
