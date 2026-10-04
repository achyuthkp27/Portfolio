import type { AnchorHTMLAttributes } from "react";
import { ArrowUpRight } from "lucide-react";

/** A link that opens in a new tab without handing the new page a reference back to this one */
export const ExternalLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a target="_blank" rel="noopener noreferrer" {...props} />
);

/** The ↗ after a link. It nudges up and right when its `group` parent is hovered; `accent` also turns it emerald. */
export const HoverArrow = ({ accent = false }: { accent?: boolean }) => (
  <ArrowUpRight
    className={`w-4 h-4 transition duration-fast group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${accent ? "group-hover:text-emerald-300" : ""}`}
    aria-hidden="true"
  />
);
