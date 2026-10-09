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
    size === "sm"
      ? // 36px pill; the invisible ::before stretches the tap target to 46px without changing the look
        "relative h-9 px-4 text-[12px] before:absolute before:content-[''] before:-inset-y-[5px] before:inset-x-0"
      : size === "lg"
        ? "h-14 px-8 text-[15px]"
        : "h-11 px-6 text-[13px]",
  ].join(" ");

/** Label text stays still on hover; hover feedback lives on the background and the arrow */
const Label = ({ children }: { children: ReactNode }) => <>{children}</>;

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
      <Label>{children}</Label>
      {arrow && <Arrow />}
    </button>
  ),
);
PillButton.displayName = "PillButton";

export const PillLink = forwardRef<HTMLAnchorElement, PillLinkProps>(
  ({ tone = "light", size = "md", className = "", children, arrow = true, ...rest }, ref) => (
    <a ref={ref} className={`${pillClass(tone, size)} ${className}`} {...rest}>
      <Label>{children}</Label>
      {arrow && <Arrow />}
    </a>
  ),
);
PillLink.displayName = "PillLink";
