import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Tone = "light" | "outline" | "dark";

interface PillStyleProps {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  /** Trailing arrow, as the reference's buttons carry */
  arrow?: boolean;
}

/** Pill button: white on the dark stage, or an outline. Uppercase, with a trailing arrow that nudges on hover. */
const pillClass = (tone: Tone, size: PillStyleProps["size"]) =>
  [
    "group/pill inline-flex items-center justify-center gap-2 rounded-pill font-body font-medium uppercase tracking-[0.02em] whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,transform] duration-base ease-out active:scale-[0.98]",
    tone === "light"
      ? "bg-snow text-night hover:bg-stone"
      : tone === "dark"
        ? "bg-night text-snow hover:bg-graphite"
        : "border border-line text-fg hover:border-fg/60",
    size === "sm" ? "h-9 px-4 text-[12px]" : size === "lg" ? "h-14 px-8 text-[15px]" : "h-11 px-6 text-[13px]",
  ].join(" ");

const Arrow = () => (
  <ArrowUpRight
    className="w-4 h-4 transition-transform duration-base ease-out group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5"
    aria-hidden="true"
  />
);

type PillButtonProps = PillStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;
type PillLinkProps = PillStyleProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ tone = "light", size = "md", className = "", children, arrow = true, ...rest }, ref) => (
    <button ref={ref} type="button" className={`${pillClass(tone, size)} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  ),
);
PillButton.displayName = "PillButton";

export const PillLink = forwardRef<HTMLAnchorElement, PillLinkProps>(
  ({ tone = "light", size = "md", className = "", children, arrow = true, ...rest }, ref) => (
    <a ref={ref} className={`${pillClass(tone, size)} ${className}`} {...rest}>
      {children}
      {arrow && <Arrow />}
    </a>
  ),
);
PillLink.displayName = "PillLink";

/** Small outline chip, for categories and tags */
export const Chip = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span
    className={`inline-flex items-center h-8 px-3.5 rounded-pill border border-line text-[13px] font-body text-fg/85 whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);
