import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";

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

// Lazy load the project detail page
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const BlogList = lazy(() => import("@/pages/BlogList"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Analytics = lazy(() => import("@/components/Analytics"));
const CustomCursor = lazy(() => import("@/components/ui/CustomCursor"));
const ScrollProgress = lazy(() => import("@/components/ui/ScrollProgress"));
const CommandMenu = lazy(() => import("@/components/ui/CommandMenu").then((module) => ({ default: module.CommandMenu })));
const TerminalOverlay = lazy(() => import("@/components/TerminalOverlay"));
const ActivityWidget = lazy(() => import("@/components/ActivityWidget"));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/project/:slug" element={<Suspense fallback={<div>Loading project...</div>}><ProjectDetail /></Suspense>} />
        <Route path="/blog" element={<Suspense fallback={<div>Loading blog...</div>}><BlogList /></Suspense>} />
        <Route path="/blog/:slug" element={<Suspense fallback={<div>Loading article...</div>}><BlogPost /></Suspense>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const DeferredExperience = () => {
  const { isLoading } = useLoading();
  const isMobile = useMobile();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    let timeoutId: number | undefined;
    let idleId: number | undefined;

    const mountEnhancements = () => setIsReady(true);
    const scheduleIdleMount = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(mountEnhancements, { timeout: 1200 });
      } else {
        idleId = window.setTimeout(mountEnhancements, 300);
      }
    };

    timeoutId = window.setTimeout(scheduleIdleMount, isMobile ? 1200 : 600);

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== undefined) {
        if ("cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      }
    };
  }, [isLoading, isMobile]);

  if (!isReady) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Analytics />
      {!isMobile && (
        <>
          <CustomCursor />
          <CommandMenu />
          <TerminalOverlay />
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
    <SpeedInsights />
  </ErrorBoundary>
);

export default App;
