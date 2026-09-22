import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";

import ErrorBoundary from "./components/ErrorBoundary";
import PremiumLoader from "@/components/PremiumLoader";
import SmoothScroll from "./components/ui/SmoothScroll";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoadingProvider } from "./context/LoadingContext";
import { useLoading } from "./context/LoadingContext";
import { useMobile } from "@/hooks/useMobile";
import { useIdleMount } from "@/hooks/useIdleMount";

const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Analytics = import.meta.env.PROD ? lazy(() => import("@/components/Analytics")) : null;
const ScrollProgress = lazy(() => import("@/components/ui/ScrollProgress"));
const TerminalTrigger = lazy(() => import("@/components/TerminalTrigger"));
const CommandMenu = lazy(() =>
  import("@/components/ui/CommandMenu").then((module) => ({ default: module.CommandMenu })),
);

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
        <Route path="/" element={<Index />} />
        <Route
          path="/project/:slug"
          element={
            <Suspense fallback={<RouteLoader />}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
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
    <Suspense fallback={null}>
      <CommandMenu />
      <TerminalTrigger />
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
      {Analytics ? <Analytics /> : null}
      {!isMobile && <ScrollProgress />}
    </Suspense>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <LoadingProvider>
        {/* PROTECTED: opening splash screen. Required on every visit and device — never remove. See CLAUDE.md. */}
        <PremiumLoader />
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
            <DeferredExperience />
            <Navigation />
            <AnimatedRoutes />
          </SmoothScroll>
        </HashRouter>
      </LoadingProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
