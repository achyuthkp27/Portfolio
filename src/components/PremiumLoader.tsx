import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { useMobile } from "@/hooks/useMobile";
import { LOADER_WORDS } from "@/data/loader";

/**
 * PROTECTED — the opening splash screen (word flip ending on the name).
 * The site owner requires it on every visit, on every device. Do not remove it,
 * skip it, or gate it behind mobile / low-end / reduced-motion checks.
 * Guarded by src/components/__tests__/PremiumLoader.test.tsx and CLAUDE.md.
 */

const WORD_DURATION_MS = 280;
const FINAL_WORD_HOLD_MS = 450;
/** Safety net so the site can never stay covered. */
const FALLBACK_UNLOCK_MS = 4000;

const PremiumLoader = () => {
  const { isLoading, setIsLoading } = useLoading();
  const [index, setIndex] = useState(0);
  const isMobile = useMobile();
  // Reduced motion keeps the splash, only swapping movement for a plain crossfade
  const reduceMotion = useReducedMotion();
  const useBlur = !isMobile && !reduceMotion;
  const offsetY = reduceMotion ? 0 : 20;

  // Word flip sequence
  useEffect(() => {
    if (index >= LOADER_WORDS.length - 1) return;
    const timeout = setTimeout(() => setIndex((prev) => prev + 1), WORD_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [index]);

  // Hold the final word, then reveal the site
  useEffect(() => {
    if (index !== LOADER_WORDS.length - 1) return;
    const timeout = setTimeout(() => setIsLoading(false), FINAL_WORD_HOLD_MS);
    return () => clearTimeout(timeout);
  }, [index, setIsLoading]);

  useEffect(() => {
    const fallback = setTimeout(() => setIsLoading(false), FALLBACK_UNLOCK_MS);
    return () => clearTimeout(fallback);
  }, [setIsLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          data-testid="splash-screen"
          initial={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-night"
          role="status"
          aria-label="Loading Achyuth KP's portfolio"
        >
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={
                  index === 0
                    ? { opacity: 1, y: 0, filter: useBlur ? "blur(0px)" : undefined }
                    : { opacity: 0, y: offsetY, filter: useBlur ? "blur(10px)" : undefined }
                }
                animate={{ opacity: 1, y: 0, filter: useBlur ? "blur(0px)" : undefined }}
                exit={{ opacity: 0, y: -offsetY, filter: useBlur ? "blur(10px)" : undefined }}
                transition={{ duration: 0.2 }}
                className="t-wordmark text-5xl md:text-7xl text-snow text-center pb-1 px-6"
                aria-hidden="true"
              >
                {LOADER_WORDS[index]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumLoader;
