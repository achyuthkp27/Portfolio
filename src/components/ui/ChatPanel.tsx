import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Moon, RotateCcw, Square, Sun, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useSmoothScroll } from "@/context/smoothScroll";
import { CHAT_API_URL, SUGGESTED_QUESTIONS } from "@/lib/chat";
import { renderChatMarkdown, type ChatLink } from "@/lib/chatMarkdown";
import { DUR, EASE } from "@/lib/motion";
import { PROFILE } from "@/data/profile";

/** Matches the server's limits (api/chat.ts): the newest messages only, and short questions */
const HISTORY = 12;
const THEME_KEY = "chat-theme";
const MAX_CHARS = 1000;

const textOf = (message: UIMessage) => message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");

/** A failure worth one automatic retry: the model was busy or the connection dropped */
const isTransientError = (error: Error | undefined) =>
  !!error && /lot of questions|went wrong while answering|fetch|network|load failed/i.test(error.message);

/** What to show for a failed request: the server's own sentence, or a plain fallback */
const errorText = (error: Error | undefined) => {
  const message = error?.message?.trim() ?? "";
  // A network failure, or a host with no chat API (an HTML error page) rather than our function
  if (!message || message.startsWith("<") || message.length > 240 || /fetch|network|load failed/i.test(message)) {
    return "Couldn't reach the assistant. Check your connection and try again.";
  }
  return message;
};

/**
 * The "Ask AI" panel: a light sheet in the corner on wide screens and the whole screen on phones,
 * over a dimmed page. Streams answers from POST /api/chat (Gemini via the AI SDK), with
 * suggested questions, links that jump to a section or open a project, retry, stop and clear.
 * Stays mounted after the first open so the conversation survives closing it.
 */
const ChatPanel = ({
  open,
  onClose,
  question,
  onQuestionTaken,
}: {
  open: boolean;
  onClose: () => void;
  /** A question to send as soon as the panel opens (from the footer or a suggestion elsewhere) */
  question?: string;
  onQuestionTaken: () => void;
}) => {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: CHAT_API_URL,
        prepareSendMessagesRequest: ({ messages }) => ({ body: { messages: messages.slice(-HISTORY) } }),
      }),
    [],
  );
  const { messages, sendMessage, status, error, regenerate, stop, setMessages, clearError } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  // Gemini on the free tier sometimes overloads in the middle of an answer. Ask once more on our
  // own, replacing the broken partial answer, before showing the visitor an error. Only for
  // "busy" failures: our own limits (too fast, too long) are shown straight away.
  const [retrying, setRetrying] = useState(false);
  const retried = useRef(false);
  useEffect(() => {
    if (status === "ready") retried.current = false;
    if (status !== "error" || retried.current || !isTransientError(error)) return;
    retried.current = true;
    setRetrying(true);
    const timer = setTimeout(() => {
      setRetrying(false);
      clearError();
      void regenerate();
    }, 1500);
    return () => {
      clearTimeout(timer);
      setRetrying(false);
    };
  }, [status, error, clearError, regenerate]);

  const [input, setInput] = useState("");
  // Light or dark, remembered per browser; light by default
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      return false;
    }
  });
  const toggleTheme = () =>
    setDark((d) => {
      try {
        localStorage.setItem(THEME_KEY, d ? "light" : "dark");
      } catch {
        // Private mode: the switch still works for this visit
      }
      return !d;
    });
  const panel = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();
  const navigate = useNavigate();
  const scrollToSection = useSectionScroll();
  useFocusTrap(panel, open);
  useScrollLock(open, lenis);

  const send = useCallback(
    (text: string) => {
      const q = text.trim();
      if (!q || busy || q.length > MAX_CHARS) return;
      clearError();
      void sendMessage({ text: q });
      setInput("");
    },
    [busy, clearError, sendMessage],
  );

  // A question handed over from outside (the footer's "Ask me anything", for one)
  useEffect(() => {
    if (!open || !question) return;
    send(question);
    onQuestionTaken();
  }, [open, question, send, onQuestionTaken]);

  useEffect(() => {
    if (!open) return;
    const focus = setTimeout(() => field.current?.focus(), 60);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Follow the answer as it streams in, unless the visitor has scrolled up to read
  const pinned = useRef(true);
  useEffect(() => {
    const el = log.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, error]);

  // The field grows with the question, up to a few lines
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [input, open]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };
  const clear = () => {
    void stop();
    setMessages([]);
    clearError();
    setInput("");
    field.current?.focus();
  };

  const renderLink = (link: ChatLink, label: string, key: string) => {
    const style =
      "font-medium text-chat-fg underline decoration-emerald-500 decoration-2 underline-offset-[3px] hover:decoration-chat-fg transition-colors";
    if (link.kind === "external") {
      return (
        <a key={key} href={link.href} target="_blank" rel="noopener noreferrer" className={style}>
          {label}
        </a>
      );
    }
    const go = () => {
      onClose();
      // After the panel has closed and the page can scroll again
      setTimeout(() => {
        if (link.kind === "section") scrollToSection(link.id);
        else navigate(`/project/${link.slug}`);
      }, 80);
    };
    return (
      <button key={key} type="button" onClick={go} className={style}>
        {label}
      </button>
    );
  };

  const last = messages.at(-1);
  const waiting =
    retrying ||
    status === "submitted" ||
    (status === "streaming" && (!last || last.role !== "assistant" || !textOf(last)));
  const tooLong = input.trim().length > MAX_CHARS;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="chat-backdrop"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast }}
            className="fixed inset-0 z-[56] bg-black/50 backdrop-blur-[2px]"
          />
          <motion.div
            key="chat-panel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-title"
            data-lenis-prevent
            data-reveal-skip
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: DUR.base, ease: EASE }}
            className={`${dark ? "chat-dark" : "chat-light"} fixed z-[57] inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[420px] sm:h-[min(680px,calc(100svh-40px))] sm:rounded-[24px] origin-bottom-right flex flex-col overflow-hidden bg-chat-bg text-chat-fg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:border sm:border-chat-fg/10`}
          >
            <header className="flex items-center gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-chat-fg/10">
              <span className="relative shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}images/chat-avatar.webp`}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-chat-fg/10"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-chat-bg"
                />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="chat-title" className="text-[15px] font-semibold leading-tight">
                  {PROFILE.first}&apos;s AI assistant
                </h2>
                <p className="mt-0.5 text-xs text-chat-fg/55">Projects, skills &amp; experience</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                aria-pressed={dark}
                title={dark ? "Light theme" : "Dark theme"}
                className="grid place-items-center w-9 h-9 rounded-full text-chat-fg/60 hover:text-chat-fg hover:bg-chat-fg/[0.06] transition-colors"
              >
                {dark ? (
                  <Sun className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={messages.length === 0 && !error}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="grid place-items-center w-9 h-9 rounded-full text-chat-fg/60 hover:text-chat-fg hover:bg-chat-fg/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="grid place-items-center w-9 h-9 rounded-full text-chat-fg/60 hover:text-chat-fg hover:bg-chat-fg/[0.06] transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </header>

            <div
              ref={log}
              role="log"
              aria-live="polite"
              aria-busy={busy}
              onScroll={(e) => {
                const el = e.currentTarget;
                pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
              }}
              className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
            >
              {messages.length === 0 && !error ? (
                <div className="h-full flex flex-col justify-end">
                  <p className="t-heading text-[40px] leading-[0.95]">
                    Get to know {PROFILE.first}&apos;s work<span className="text-emerald-500">.</span>
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-chat-fg/70">
                    Hi! I&apos;m {PROFILE.first}&apos;s assistant. Ask me about his experience, skills, projects, or how
                    to reach him.
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Suggested questions">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => send(q)}
                          className="rounded-full border border-chat-fg/15 px-3.5 py-2 text-left text-[14px] text-chat-fg/80 hover:border-emerald-500 hover:bg-emerald-400/10 hover:text-chat-fg transition-colors"
                        >
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((m) => {
                    const content = textOf(m);
                    if (!content || (retrying && m === last && m.role === "assistant")) return null;
                    return m.role === "user" ? (
                      <p
                        key={m.id}
                        className="self-end max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-chat-bubble px-4 py-2.5 text-[15px] leading-snug text-chat-bubble-fg"
                      >
                        <span className="sr-only">You: </span>
                        {content}
                      </p>
                    ) : (
                      <div
                        key={m.id}
                        className="self-start max-w-[92%] break-words space-y-2.5 text-[15px] leading-relaxed text-chat-fg/90"
                      >
                        <span className="sr-only">Assistant: </span>
                        {renderChatMarkdown(content, renderLink)}
                      </div>
                    );
                  })}
                  {waiting && (
                    <div
                      role="status"
                      className="self-start flex items-center gap-1.5 py-2"
                      aria-label="Assistant is typing"
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="chat-dot w-2 h-2 rounded-full bg-chat-fg/40"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  )}
                  {error && !busy && !retrying && (
                    <div
                      role="alert"
                      className={`self-stretch rounded-2xl border px-4 py-3 text-[14px] ${dark ? "border-red-400/40 bg-red-500/10 text-red-200" : "border-red-300 bg-red-50 text-red-800"}`}
                    >
                      <p>{errorText(error)}</p>
                      <button
                        type="button"
                        onClick={() => {
                          clearError();
                          void regenerate();
                        }}
                        className={`mt-2 inline-flex items-center gap-1.5 font-medium underline underline-offset-2 ${dark ? "text-red-100" : "text-red-900"}`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Try again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex items-end gap-2 rounded-2xl border border-chat-fg/15 bg-chat-field pl-4 pr-1.5 py-1.5 focus-within:border-emerald-500 transition-colors">
                <label htmlFor="chat-input" className="sr-only">
                  Ask about {PROFILE.first}
                </label>
                <textarea
                  id="chat-input"
                  ref={field}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={`Ask about ${PROFILE.first}…`}
                  aria-describedby="chat-hint"
                  className="flex-1 resize-none bg-transparent py-2 text-[15px] leading-snug text-chat-fg placeholder:text-chat-fg/40 outline-none max-h-36"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => void stop()}
                    aria-label="Stop answering"
                    className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-chat-fg text-chat-bg hover:opacity-80 transition"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || tooLong}
                    aria-label="Send message"
                    className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-chat-fg text-chat-bg hover:bg-emerald-500 hover:text-night disabled:bg-chat-fg/15 disabled:text-chat-fg/40 disabled:pointer-events-none transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p id="chat-hint" className="mt-2 text-center text-[11px] text-chat-fg/50">
                {tooLong
                  ? `Please keep it under ${MAX_CHARS} characters (${input.trim().length} now).`
                  : `AI can make mistakes. Confirm details with ${PROFILE.first}.`}
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
