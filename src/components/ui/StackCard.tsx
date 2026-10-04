import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** The dashed rule the stacked sections share */
export const DASH = "border-dashed border-snow/[0.12]";

/**
 * One card in a section's stack, after reelio.framer.media's services: a full-width row on a
 * dashed three-column grid with + marks where the rules meet its top edge. It pins under the
 * nav on desktop and the next card slides up over it. Pure CSS sticky, so it never lags a
 * fast scroll; phones flow normally. Pass the three columns as children.
 */
export const StackCard = ({ index, id, children }: { index: number; id?: string; children: ReactNode }) => (
  <li
    id={id}
    className={`relative lg:sticky lg:top-[76px] bg-night border-t scroll-mt-20 ${DASH}`}
    style={{ zIndex: index + 1 }}
  >
    <div aria-hidden="true" className="absolute inset-x-0 top-0 max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
      <div className="relative">
        {["left-0", "left-1/3 hidden lg:block", "left-2/3 hidden lg:block", "left-full"].map((pos) => (
          <span
            key={pos}
            className={`absolute -top-[8px] -translate-x-1/2 text-snow/40 text-[14px] leading-none select-none ${pos}`}
          >
            +
          </span>
        ))}
      </div>
    </div>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
      <div className={`grid lg:grid-cols-3 lg:min-h-[min(calc(100vh-76px),640px)] border-x ${DASH}`}>{children}</div>
    </div>
  </li>
);

/** First column: a small figure line over the title */
export const StackHead = ({ kicker, title, foot }: { kicker: string; title: string; foot?: ReactNode }) => (
  <div className={`p-6 md:p-10 lg:py-16 lg:border-r ${DASH}`}>
    <p className="t-figure text-[12px] text-muted">{kicker}</p>
    <h3 className="mt-3 font-body font-medium tracking-[-0.03em] leading-[1.05] text-[2.25rem] md:text-[2.75rem] break-words">
      {title}
    </h3>
    {foot}
  </div>
);

/** Middle column: whatever visual the card brings */
export const StackMiddle = ({ children }: { children: ReactNode }) => (
  <div className={`px-6 md:px-10 lg:px-0 lg:border-r ${DASH}`}>
    <div className="lg:mt-16">{children}</div>
  </div>
);

/** Last column */
export const StackBody = ({ children }: { children: ReactNode }) => (
  <div className="p-6 md:p-10 lg:py-16">{children}</div>
);

/** A mark on a soft emerald glow and a fine grid; pass an icon, or any children */
export const StackTile = ({
  icon: Icon,
  caption,
  children,
}: {
  icon?: LucideIcon;
  caption?: string;
  children?: ReactNode;
}) => (
  <div className="relative h-56 md:h-72 lg:h-auto lg:aspect-[4/3] rounded-lg overflow-hidden border border-line bg-tile grid place-items-center">
    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,hsl(var(--accent-500)/0.24),transparent_70%)]" />
    <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(0_0%_100%/0.05)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%/0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
    {Icon && (
      <Icon className="relative w-20 h-20 md:w-24 md:h-24 text-emerald-300 -mt-6" strokeWidth={1} aria-hidden="true" />
    )}
    {children}
    {caption && <p className="absolute left-5 bottom-5 right-5 t-figure text-[11px] text-snow/50">{caption}</p>}
  </div>
);

/** Small outlined tags, one per tool */
export const StackTags = ({ items }: { items: readonly string[] }) => (
  <ul className="mt-6 flex flex-wrap gap-2">
    {items.map((t) => (
      <li key={t} className="rounded-pill border border-line px-3 py-1 text-[12px] md:text-[13px] text-snow/75">
        {t}
      </li>
    ))}
  </ul>
);

/** The short header the stacked sections open with: label, big two-line title, and a line on the right */
export const StackIntro = ({ label, title, children }: { label: string; title: ReactNode; children: ReactNode }) => (
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 pt-24 lg:pt-32 pb-16 lg:pb-20">
    <p className="t-label mb-10 lg:mb-14">{label}</p>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-end">
      <h2 className="t-statement text-5xl md:text-7xl lg:text-[5.5rem]">{title}</h2>
      <div className="t-body text-snow/60 text-[17px] md:text-[19px] max-w-md lg:justify-self-end">{children}</div>
    </div>
  </div>
);
