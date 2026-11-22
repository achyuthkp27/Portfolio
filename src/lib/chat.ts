/** The "Ask AI" assistant: where it lives, and the event that opens it from anywhere on the page. */

/**
 * The chat endpoint. On GitHub Pages it is the Vercel Function's full URL, set at build time with
 * VITE_CHAT_API_URL; in dev (and when the site itself runs on Vercel) the same-origin /api/chat.
 */
export const CHAT_API_URL: string = import.meta.env.VITE_CHAT_API_URL || "/api/chat";

export const OPEN_CHAT_EVENT = "portfolio:open-chat";

/** Opens the assistant, optionally sending a first question */
export const openChat = (question?: string) =>
  window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_CHAT_EVENT, { detail: question }));

/** Shown before the first message, as one-tap questions */
export const SUGGESTED_QUESTIONS = [
  "Tell me about Achyuth.",
  "What are his technical skills?",
  "What projects has he worked on?",
  "What is his professional experience?",
  "How can I contact him?",
];
