import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import { ThemeProvider } from "@/hooks/useTheme";
import { useLoading } from "./context/LoadingContext";
import { useMobile } from "@/hooks/useMobile";
import { useIdleMount } from "@/hooks/useIdleMount";

// Lazy load the project detail page
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Analytics = import.meta.env.PROD ? lazy(() => import("@/components/Analytics")) : null;
const CustomCursor = lazy(() => import("@/components/ui/CustomCursor"));
const ScrollProgress = lazy(() => import("@/components/ui/ScrollProgress"));
const CommandMenu = lazy(() => import("@/components/ui/CommandMenu").then((module) => ({ default: module.CommandMenu })));
const TerminalTrigger = lazy(() => import("@/components/TerminalTrigger"));
const ActivityWidget = lazy(() => import("@/components/ActivityWidget"));

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-transparent">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin" />
      <span className="font-mono text-xs text-white/40 tracking-widest uppercase">LOADING_MODULE...</span>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/project/:slug" element={<Suspense fallback={<RouteLoader />}><ProjectDetail /></Suspense>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const DeferredExperience = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const isReady = useIdleMount(!isLoading, isMobile ? 10000 : 8000);

  if (!isReady) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      {Analytics ? <Analytics /> : null}
      {!isMobile && (
        <>
          <CustomCursor />
          <CommandMenu />
          <TerminalTrigger />
          <ActivityWidget />
          <ScrollProgress />
        </>
      )}
    </Suspense>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <LoadingProvider>
        <PremiumLoader />
        <TooltipProvider>
          <Toaster />
          <HashRouter>
            <ThemeProvider>
              {/* Skip to main content — accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-mono"
              >
                Skip to content
              </a>
              <DeferredExperience />
              <Navigation />
              <SmoothScroll>
                <AnimatedRoutes />
              </SmoothScroll>
            </ThemeProvider>
          </HashRouter>
        </TooltipProvider>
      </LoadingProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
