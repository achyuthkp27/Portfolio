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
 * A lazy chunk that no longer exists, usually because a deploy replaced it. Chrome, Safari
 * and Firefox each word this differently.
 */
const isChunkLoadError = (error: Error | null) =>
  !!error &&
  (error.name === "ChunkLoadError" ||
    /Loading chunk|MIME type|dynamically imported module|Importing a module script failed/i.test(error.message));

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

    // Check if it's a chunk load error (common during new deployments)
    const isChunkError = isChunkLoadError(error);

    if (isChunkError) {
      console.log("Chunk load error detected. Attempting to recover...");
      // Check if we've already tried to reload in the last 10 seconds to avoid infinite loops
      const lastReload = sessionStorage.getItem("last-error-reload");
      const now = Date.now();

      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem("last-error-reload", now.toString());
        window.location.reload();
      }
    }
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

            {this.state.error && (
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
