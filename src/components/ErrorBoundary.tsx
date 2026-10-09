import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A lazy chunk (or its stylesheet) that no longer exists, usually because a deploy replaced it.
 * Chrome says "Failed to fetch dynamically imported module", Firefox "error loading dynamically
 * imported module", Safari "Importing a module script failed", and Vite's preloader
 * "Unable to preload CSS for …". A server answering with index.html instead trips the MIME check.
 */
const CHUNK_ERROR =
  /Loading (CSS )?chunk|MIME type|dynamically imported module|Importing a module script failed|Unable to preload CSS/i;

// eslint-disable-next-line react-refresh/only-export-components
export const isChunkLoadError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return typeof error === "string" && CHUNK_ERROR.test(error);
  const { name, message } = error as { name?: unknown; message?: unknown };
  return name === "ChunkLoadError" || (typeof message === "string" && CHUNK_ERROR.test(message));
};

const RELOAD_KEY = "last-error-reload";
const RELOAD_NAME_PREFIX = "error-reload:";
const RELOAD_WINDOW_MS = 10_000;
/** This page's own last reload, so two boundaries failing together ask for only one */
let lastReloadInMemory = 0;

/**
 * Where the last recovery reload is remembered across the reload itself. sessionStorage when the
 * browser allows it; when site data is blocked it throws, so the tab's `window.name` (which survives
 * a same-tab reload and needs no storage permission) carries the timestamp instead. If `window.name`
 * already holds something else it is left alone and no reload happens: never a loop.
 */
const readLastReload = (): number => {
  try {
    return Number(window.sessionStorage.getItem(RELOAD_KEY)) || 0;
  } catch {
    const name = window.name;
    return name.startsWith(RELOAD_NAME_PREFIX) ? Number(name.slice(RELOAD_NAME_PREFIX.length)) || 0 : 0;
  }
};

const writeLastReload = (now: number): boolean => {
  try {
    window.sessionStorage.setItem(RELOAD_KEY, String(now));
    return true;
  } catch {
    if (window.name && !window.name.startsWith(RELOAD_NAME_PREFIX)) return false;
    window.name = RELOAD_NAME_PREFIX + now;
    return true;
  }
};

/**
 * Reload the page to fetch a deploy's new chunks, at most once every 10 seconds, so a chunk that
 * is genuinely missing can't reload forever. Returns whether it reloaded.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const reloadOnce = (reload: () => void = () => window.location.reload()): boolean => {
  const now = Date.now();
  const last = Math.max(lastReloadInMemory, readLastReload());
  if (now - last <= RELOAD_WINDOW_MS) return false;
  if (!writeLastReload(now)) return false;
  lastReloadInMemory = now;
  reload();
  return true;
};

/**
 * Vite fires `vite:preloadError` when a lazy chunk's CSS or JS can't be fetched. Reload (guarded as
 * above) instead of letting the import fail. When the guard refuses, the event is left alone so the
 * error reaches the nearest error boundary as usual. Returns a function that removes the listener.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const registerPreloadErrorReload = (): (() => void) => {
  const onPreloadError = (event: Event) => {
    if (reloadOnce()) event.preventDefault();
  };
  window.addEventListener("vite:preloadError", onPreloadError);
  return () => window.removeEventListener("vite:preloadError", onPreloadError);
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("Error caught by boundary:", error, errorInfo);

    // A chunk that went missing in a deploy: reload once to fetch the new one
    if (isChunkLoadError(error)) reloadOnce();
  }

  handleReset = () => {
    // A failed lazy import is remembered by React.lazy, so only a reload can fetch the new chunk
    if (isChunkLoadError(this.state.error)) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="t-heading text-3xl md:text-4xl text-snow">Oops! Something went wrong</h1>
              <p className="t-body text-muted">We encountered an unexpected error. Don't worry, it's not your fault!</p>
            </div>

            {/* The raw message is for the developer; visitors only see the friendly text */}
            {import.meta.env.DEV && this.state.error && (
              <div className="text-left">
                <details className="rounded-lg border border-line bg-tile p-4 cursor-pointer">
                  <summary className="text-sm font-mono text-muted">Error Details</summary>
                  <pre className="mt-3 text-xs text-red-300 overflow-auto">{this.state.error.toString()}</pre>
                </details>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 rounded-pill bg-snow text-night font-medium hover:bg-stone transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = import.meta.env.BASE_URL)}
                className="px-6 py-3 rounded-pill border border-line text-snow font-medium hover:bg-snow/10 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
