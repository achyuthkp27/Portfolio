import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Github, Instagram, Linkedin, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { NAV_ITEMS } from "@/data/nav";
import { PROFILE } from "@/data/profile";
import { ExternalLink } from "./ExternalLink";

export type SheetState = "open" | "closing";

/** The sections that aren't in the main list, by their own headings */
const MORE = [
  { label: "How I think", id: "vision" },
  { label: "Open source", id: "open-source" },
] as const;

const PROFILES = [
  { label: "Instagram", href: PROFILE.links.instagram, icon: <Instagram className="w-5 h-5" aria-hidden="true" /> },
  { label: "GitHub", href: PROFILE.links.github, icon: <Github className="w-5 h-5" aria-hidden="true" /> },
  { label: "LinkedIn", href: PROFILE.links.linkedin, icon: <Linkedin className="w-5 h-5" aria-hidden="true" /> },
  {
    label: "Medium",
    href: PROFILE.links.medium,
    icon: (
      <span className="t-heading text-[20px] leading-none" aria-hidden="true">
        M
      </span>
    ),
  },
];

/** A fixed pseudo-random number in [0, 1) for each n, so every letter falls the same way each time */
const rand = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Where one piece drifts, how far it spins, how long it hangs on, and its place for the hover hop */
const fall = (n: number, i: number) =>
  ({
    "--fx": `${((rand(n) - 0.5) * 160).toFixed(0)}px`,
    "--fr": `${((rand(n + 7) - 0.5) * 220).toFixed(0)}deg`,
    "--fd": `${Math.round(rand(n + 13) * 220)}ms`,
    "--fi": i,
  }) as CSSProperties;

/** Text as single letters that can tumble on their own; screen readers get the whole text once */
const Letters = ({ text, seed }: { text: string; seed: number }) => {
  let i = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <Fragment key={w}>
            {w > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch) => {
                const k = i++;
                return (
                  <span key={k} className="fall" style={fall(seed * 97 + k, k)}>
                    {ch}
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
};

/** A whole element that falls as one piece */
const Piece = ({ seed, children }: { seed: number; children: ReactNode }) => (
  <span className="fall" style={fall(seed, 0)}>
    {children}
  </span>
);

/**
 * The menu: a light sheet over the blurred page, with the sections set large, the rest of the
 * page's sections and the résumé under them, then email and profiles. It slides in from the
 * right; on closing every letter, button and icon drops out of it on its own, then the sheet
 * fades. Rendered on <body>, so the nav's transform can't trap it.
 */
export const MenuSheet = ({
  state,
  active,
  onClose,
  onGo,
  onTerminal,
}: {
  state: SheetState;
  active: string;
  onClose: () => void;
  onGo: (id: string) => void;
  onTerminal: () => void;
}) => {
  const sheet = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useFocusTrap(sheet, state === "open");
  useEffect(() => {
    if (state === "open") closeButton.current?.focus();
  }, [state]);

  const resumeHref = `${import.meta.env.BASE_URL}${PROFILE.resume}`;
  const small =
    "hop py-2 -my-2 text-[16px] md:text-[18px] text-night/75 hover:text-night transition-colors duration-fast";

  return createPortal(
    <>
      <div
        data-state={state}
        aria-hidden="true"
        onClick={onClose}
        className="menu-backdrop fixed inset-0 z-[60] bg-black/55 backdrop-blur-md"
      />
      <div
        ref={sheet}
        data-state={state}
        data-lenis-prevent
        data-reveal-skip
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        // Clipped so the falling letters leave through the sheet's bottom edge; at rest nothing
        // reaches it (the padding is far larger than any descender)
        className="menu-sheet fixed z-[61] top-3 right-3 bottom-3 w-[min(720px,calc(100vw-24px))] rounded-[28px] bg-stone text-night overflow-hidden flex flex-col p-7 md:p-12 origin-top-right"
      >
        <div className="flex justify-end">
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="hop group flex items-center gap-4 text-[17px] md:text-[19px]"
          >
            <Letters text="close" seed={1} />
            <Piece seed={2}>
              <span className="grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-night text-snow transition-transform duration-base ease-out group-hover:rotate-90">
                <X className="w-5 h-5" aria-hidden="true" />
              </span>
            </Piece>
          </button>
        </div>

        <nav aria-label="Menu" className="flex-1 flex flex-col justify-center py-6">
          <ul>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onGo(item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className="hop flex items-center gap-4 py-1 t-heading text-[clamp(52px,9vw,104px)] leading-[1] text-night"
                >
                  <Letters text={item.label} seed={10 + i} />
                  {active === item.id && (
                    <Piece seed={20 + i}>
                      <span aria-hidden="true" className="block w-3 h-3 rounded-full bg-emerald-500" />
                    </Piece>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <ul className="mt-8 md:mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {MORE.map((item, i) => (
              <li key={item.id}>
                <button type="button" onClick={() => onGo(item.id)} className={small}>
                  <Letters text={item.label} seed={30 + i} />
                </button>
              </li>
            ))}
            <li>
              <ExternalLink href={resumeHref} className={small}>
                <Letters text="Résumé" seed={40} />
              </ExternalLink>
            </li>
            <li>
              <button type="button" onClick={onTerminal} className={small}>
                <Letters text="Terminal" seed={41} />
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <a href={`mailto:${PROFILE.email}`} className={small}>
            <Letters text={PROFILE.email} seed={50} />
          </a>
          <ul className="flex gap-2.5 md:gap-3">
            {PROFILES.map((p, i) => (
              <li key={p.label}>
                <Piece seed={60 + i}>
                  <ExternalLink
                    href={p.href}
                    aria-label={p.label}
                    className="grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-night text-snow hover:bg-emerald-500 hover:text-night transition-colors duration-fast"
                  >
                    {p.icon}
                  </ExternalLink>
                </Piece>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>,
    document.body,
  );
};
