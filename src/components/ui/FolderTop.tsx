import { CLASSIC_LOOK } from "@/lib/look";

/**
 * Turns a card into the front of a folder: the rear flap's tab and two sheets stick up above its
 * top edge, and the sheets lift a little when the card (`group/folder`) is hovered. The sheets
 * are dark, a step lighter than the card, with hairline edges and a couple of ruled lines (one in
 * the accent), so they read as paper without glaring white against the dark page. Drawn only
 * above the card, never over it. On the Work deck it fades quickly with the card's shade
 * (`--shade`, set by WorkScene), so only the front card's folder really shows. Nothing in the
 * classic look.
 */
export const FolderTop = () =>
  CLASSIC_LOOK ? null : (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-full h-7 md:h-9"
      style={{ opacity: "calc(1 - var(--shade, 0) * 1.6)" }}
    >
      {/* The rear flap's tab */}
      <span className="absolute left-0 bottom-0 h-[62%] w-[34%] max-w-[260px] rounded-t-2xl border border-b-0 border-snow/[0.12] bg-[hsl(0_0%_9%)]" />
      {/* The back sheet, then the front one with its ruled lines */}
      <span className="absolute left-[20%] right-[7%] bottom-0 h-[82%] rounded-t-lg border border-b-0 border-snow/10 bg-[hsl(0_0%_12%)] rotate-[1.2deg] origin-bottom-right transition-transform duration-base ease-out group-hover/folder:-translate-y-1" />
      <span
        className="absolute left-[24%] right-[12%] bottom-0 h-full rounded-t-lg border border-b-0 border-snow/[0.16] bg-[hsl(0_0%_16%)] rotate-[-0.6deg] origin-bottom-left transition-transform duration-base ease-out group-hover/folder:-translate-y-2.5"
        style={RULED}
      />
    </span>
  );

/** Two ruled lines on the front sheet: a short one in the accent, a longer faint one */
const RULED = {
  backgroundImage:
    "linear-gradient(hsl(var(--accent-400) / 0.7), hsl(var(--accent-400) / 0.7)), linear-gradient(hsl(0 0% 100% / 0.14), hsl(0 0% 100% / 0.14))",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "6% 40%, 6% 70%",
  backgroundSize: "14% 2px, 42% 2px",
} as const;
