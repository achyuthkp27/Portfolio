import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_ITEMS } from "@/data/nav";

/**
 * Scroll spy: the id of the topmost nav section crossing a thin reading line mid-viewport, or ""
 * near the top of the page and off the home page. The same rules as the classic Navigation's.
 */
export function useActiveSection(isHomePage: boolean) {
  const [active, setActive] = useState("");
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < window.innerHeight * 0.5) setActive("");
  });

  useEffect(() => {
    if (!isHomePage) {
      setActive("");
      return;
    }
    const targets = new Map<string, Element>();
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        });
        const topmost = [...crossing]
          .map((id) => ({ id, top: targets.get(id)?.getBoundingClientRect().top ?? Infinity }))
          .sort((a, b) => a.top - b.top)[0];
        setActive(topmost ? topmost.id : "");
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    const rescan = () => {
      targets.forEach((element, id) => {
        if (element.isConnected) return;
        observer.unobserve(element);
        targets.delete(id);
        crossing.delete(id);
      });
      NAV_ITEMS.forEach(({ id }) => {
        const element = document.querySelector(`main #${id}`);
        if (!element || targets.get(id) === element) return;
        const previous = targets.get(id);
        if (previous) {
          observer.unobserve(previous);
          crossing.delete(id);
        }
        targets.set(id, element);
        observer.observe(element);
      });
    };
    let timer: ReturnType<typeof setTimeout> | null = null;
    const domObserver = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(rescan, 300);
    });
    rescan();
    domObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
      domObserver.disconnect();
    };
  }, [isHomePage]);

  return active;
}
