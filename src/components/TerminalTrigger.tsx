import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { OPEN_TERMINAL_EVENT } from "@/lib/shortcuts";

const TerminalOverlay = lazy(() => import("./TerminalOverlay"));

const isTyping = () => {
  const el = document.activeElement;
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement | null)?.isContentEditable;
};

/** Opens the terminal with the ` key, by typing ">_", or from the nav badge / command menu. */
export default function TerminalTrigger() {
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    let keyBuffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key.length === 1) {
        keyBuffer = (keyBuffer + e.key).slice(-2);
      }

      if (keyBuffer === ">_" || e.key === "`") {
        e.preventDefault();
        setIsRequested(true);
        keyBuffer = "";
      }
    };
    const handleOpen = () => setIsRequested(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(OPEN_TERMINAL_EVENT, handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_TERMINAL_EVENT, handleOpen);
    };
  }, []);

  const handleClose = useCallback(() => setIsRequested(false), []);

  if (!isRequested) return null;

  return (
    <Suspense fallback={null}>
      <TerminalOverlay forceOpen={true} onClose={handleClose} />
    </Suspense>
  );
}
