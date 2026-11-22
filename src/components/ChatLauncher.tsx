import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { OPEN_CHAT_EVENT } from "@/lib/chat";
import { DUR, EASE } from "@/lib/motion";

// The panel and the AI SDK load only when someone first reaches for the chat
const loadPanel = () => import("@/components/ui/ChatPanel");
const ChatPanel = lazy(loadPanel);

/**
 * The floating "Ask AI" button in the bottom-right corner, and the panel it opens. Also opens on
 * the page-wide openChat() event (the footer's "Ask me anything"). Steps aside while the footer's
 * bottom strip is on screen, so it never covers the controls there.
 */
const ChatLauncher = () => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [question, setQuestion] = useState<string | undefined>();
  const [aside, setAside] = useState(false);
  const button = useRef<HTMLButtonElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((q?: string) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuestion(q);
    setLoaded(true);
    setOpen(true);
  }, []);
  // The launcher leaves the page while the panel is open, so focus goes back to it once it has
  // returned; anything else that opened the panel (the footer's "Ask me anything") gets it at once
  const refocus = useRef(false);
  const close = useCallback(() => {
    setOpen(false);
    const from = returnFocus.current;
    if (from && from.isConnected && from !== button.current) from.focus();
    else refocus.current = true;
  }, []);
  const taken = useCallback(() => setQuestion(undefined), []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<string | undefined>).detail);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [show]);

  // Out of the way of whatever is marked data-chat-avoid (the footer's control strip)
  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? seen.add(entry.target) : seen.delete(entry.target)));
      setAside(seen.size > 0);
    });
    const watch = () => document.querySelectorAll("[data-chat-avoid]").forEach((el) => io.observe(el));
    watch();
    // The footer mounts after the page's lazy sections: look again as the page grows
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {!open && !aside && (
          <motion.button
            ref={(el) => {
              button.current = el;
              if (el && refocus.current) {
                refocus.current = false;
                el.focus();
              }
            }}
            type="button"
            onClick={() => show()}
            onPointerEnter={() => void loadPanel()}
            onFocus={() => void loadPanel()}
            aria-label="Ask AI about Achyuth"
            aria-haspopup="dialog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: DUR.base, ease: EASE }}
            className="fixed z-[55] bottom-5 right-5 md:bottom-6 md:right-6 inline-flex items-center gap-2 h-11 pl-4 pr-5 rounded-full border border-snow/15 bg-night text-snow text-[14px] font-semibold shadow-[0_12px_32px_-10px_rgba(0,0,0,0.7)] hover:bg-snow hover:text-night hover:border-snow transition-colors"
          >
            <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
            Ask AI
          </motion.button>
        )}
      </AnimatePresence>
      {loaded && (
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={close} question={question} onQuestionTaken={taken} />
        </Suspense>
      )}
    </>
  );
};

export default ChatLauncher;
