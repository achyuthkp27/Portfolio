import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { useMotionOff } from "@/lib/motionPreference";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect, useRef } from "react";
import { HelmetProvider } from "react-helmet-async";

import ErrorBoundary from "./components/ErrorBoundary";
import PremiumLoader from "@/components/PremiumLoader";
import { FilmGrain } from "@/components/ui/FilmGrain";
import SmoothScroll from "./components/ui/SmoothScroll";
import { LoadingProvider } from "./context/LoadingContext";
import { useLoading } from "@/hooks/useLoading";
import { useMobile } from "@/hooks/useMobile";
import { useIdleMount } from "@/hooks/useIdleMount";

// The page loads in its own chunk, in parallel with the splash: the splash only needs React and
// framer-motion, so it paints sooner, and the page arrives while the splash still covers it
const Index = lazy(() => import("./pages/Index"));
const Navigation = lazy(() => import("@/components/Navigation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
// Production builds with a PostHog key only: without one there is no Analytics chunk and no request
const Analytics =
  import.meta.env.PROD && import.meta.env.VITE_POSTHOG_KEY ? lazy(() => import("@/components/Analytics")) : null;
const ScrollProgress = lazy(() => import("@/components/ui/ScrollProgress"));
import { GlassEdge } from "@/components/ui/GlassEdge";
const TerminalTrigger = lazy(() => import("@/components/TerminalTrigger"));
// Only the shortcut and open state load up front; the menu's panel (cmdk) is its own chunk
import { CommandMenu } from "@/components/ui/CommandMenu";
import { preloadCommandMenu } from "@/components/ui/loadCommandMenuPanel";

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="t-figure text-xs text-muted" role="status">
      Loading…
    </span>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Index />
            </Suspense>
          }
        />
        <Route
          path="/project/:slug"
          element={
            <Suspense fallback={<RouteLoader />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * Keyboard shortcuts load immediately on desktop: the nav advertises them,
 * so they must work from the first second.
 */
const KeyboardShortcuts = () => {
  const isMobile = useMobile();
  if (isMobile) return null;
  return (
    <>
      <CommandMenu />
      <Suspense fallback={null}>
        <TerminalTrigger />
      </Suspense>
    </>
  );
};

/** Once the page has settled, fetch the quick menu's panel on idle so its first open is instant. */
const PrefetchCommandMenu = () => {
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(preloadCommandMenu, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preloadCommandMenu, 1000);
    return () => clearTimeout(id);
  }, []);
  return null;
};

/** PostHog starts ~2s after the splash ends (or on first interaction), in its own chunk. */
const DeferredAnalytics = () => {
  const { isLoading } = useLoading();
  const isReady = useIdleMount(!isLoading && Analytics !== null, 2000, 3000);
  if (!isReady || !Analytics) return null;
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  );
};

const DeferredExperience = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const isReady = useIdleMount(!isLoading, isMobile ? 10000 : 8000);

  if (!isReady) return null;

  return (
    <Suspense fallback={null}>
      {!isMobile && <ScrollProgress />}
      {!isMobile && <PrefetchCommandMenu />}
      <GlassEdge />
    </Suspense>
  );
};

/**
 * While the splash covers the page, the page behind it can't take focus or clicks, so a
 * keyboard user tabbing during the splash doesn't land on links they can't see. The splash
 * itself is untouched and still shows on every visit.
 */
const InertWhileLoading = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoading();
  const ref = useRef<HTMLDivElement>(null);
  // Set as a DOM property: this React version's types don't know the inert attribute yet
  useEffect(() => {
    if (ref.current) ref.current.inert = isLoading;
  }, [isLoading]);
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
};

const App = () => {
  const motionOff = useMotionOff();
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <LoadingProvider>
          {/* PROTECTED: opening splash screen. Required on every visit and device — never remove. See CLAUDE.md. */}
          <PremiumLoader />
          {/* Film grain over everything but the About section, splash included */}
          <FilmGrain />
          <MotionConfig reducedMotion={motionOff ? "always" : "user"}>
            <InertWhileLoading>
              <HashRouter>
                {/* Skip to main content. A button, because "#main-content" would be a route under HashRouter. */}
                <button
                  type="button"
                  onClick={() => {
                    const main = document.getElementById("main-content");
                    main?.focus();
                    main?.scrollIntoView();
                  }}
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:bg-snow focus:text-night focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm"
                >
                  Skip to content
                </button>
                {/* One Lenis instance for everything: nav, overlays, and pages share it */}
                <SmoothScroll>
                  <KeyboardShortcuts />
                  <DeferredAnalytics />
                  <DeferredExperience />
                  <Suspense fallback={null}>
                    <Navigation />
                  </Suspense>
                  <AnimatedRoutes />
                </SmoothScroll>
              </HashRouter>
            </InertWhileLoading>
          </MotionConfig>
        </LoadingProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
