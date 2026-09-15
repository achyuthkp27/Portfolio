/** Global keyboard shortcuts and the events that open their overlays. */
export const OPEN_COMMAND_MENU_EVENT = "portfolio:open-command-menu";
export const OPEN_TERMINAL_EVENT = "portfolio:open-terminal";

export const openCommandMenu = () => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));
export const openTerminal = () => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT));

export const isMacPlatform = () =>
  typeof navigator !== "undefined" && /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);

/** Shortcuts only make sense with a physical keyboard and precise pointer. */
export const hasKeyboardAndPointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
