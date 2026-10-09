import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { OPEN_COMMAND_MENU_EVENT } from "@/lib/shortcuts";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSmoothScroll } from "@/context/smoothScroll";
import { loadCommandMenuPanel } from "./loadCommandMenuPanel";

// The panel (cmdk) loads on first open, or earlier on idle; see loadCommandMenuPanel
const CommandMenuPanel = lazy(loadCommandMenuPanel);

/** The nav's ⌘K button, where focus goes when the element that opened the menu is gone */
const NAV_TRIGGER = 'button[aria-label^="Open quick menu"]';

const restoreFocus = (target: HTMLElement | null) => {
  if (target && target.isConnected && target !== document.body) {
    target.focus({ preventScroll: true });
    if (document.activeElement === target) return;
  }
  document.querySelector<HTMLElement>(NAV_TRIGGER)?.focus({ preventScroll: true });
};

/**
 * The always-loaded part of the quick menu: the ⌘K / Ctrl+K shortcut, the nav's open event, the
 * open state, the scroll lock, and focus return. The panel renders as soon as its chunk is there,
 * so the first ⌘K opens the menu even before the chunk has arrived.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { lenis } = useSmoothScroll();
  // Captured when the open is asked for: the panel's autoFocus moves focus before any effect runs
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const isOpen = useRef(false);

  useEffect(() => {
    const show = () => {
      if (isOpen.current) return;
      returnFocusTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      isOpen.current = true;
      setOpen(true);
    };
    const hide = () => {
      isOpen.current = false;
      setOpen(false);
    };

    // ⌘K / Ctrl+K toggles, Escape closes, and the nav badge can open it
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // One overlay at a time: never open under another open dialog (the terminal, the phone menu)
        const other = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].some(
          (d) => !d.hasAttribute("data-command-menu"),
        );
        if (other) return;
        if (isOpen.current) hide();
        else show();
      } else if (e.key === "Escape" && isOpen.current) {
        hide();
      }
    };

    document.addEventListener("keydown", down);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, show);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, show);
    };
  }, []);

  const close = useCallback(() => {
    isOpen.current = false;
    setOpen(false);
  }, []);

  useScrollLock(open, lenis);

  // A chosen command waits until the menu has closed: the scroll lock has to release first, or the
  // paused smooth scroller ignores the scroll, and restarting it would cancel one already begun.
  // This effect is declared after the scroll lock, so the lock's cleanup has already run.
  const pendingCommand = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (open) return;
    if (returnFocusTo.current !== null || pendingCommand.current) {
      // Focus goes back first: a command that opens another overlay (the terminal) records it
      restoreFocus(returnFocusTo.current);
    }
    returnFocusTo.current = null;
    const command = pendingCommand.current;
    pendingCommand.current = null;
    command?.();
  }, [open]);

  const runCommand = useCallback(
    (command: () => void) => {
      pendingCommand.current = command;
      close();
    },
    [close],
  );

  if (!open) return null;

  return (
    <Suspense fallback={null}>
      <CommandMenuPanel runCommand={runCommand} onClose={close} />
    </Suspense>
  );
}
