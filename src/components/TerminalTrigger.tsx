import { useState, useEffect, lazy, Suspense } from "react";

const TerminalOverlay = lazy(() => import("./TerminalOverlay"));

export default function TerminalTrigger() {
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    let keyBuffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if (e.key.length === 1) {
        keyBuffer += e.key;
        if (keyBuffer.length > 2) keyBuffer = keyBuffer.slice(-2);
      }
      
      if (keyBuffer === ">_" || e.key === "`") {
        e.preventDefault();
        setIsRequested(true);
        keyBuffer = "";
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isRequested) return null;

  return (
    <Suspense fallback={null}>
      <TerminalOverlay forceOpen={true} onClose={() => setIsRequested(false)} />
    </Suspense>
  );
}
