import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
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

// Lazy load the project detail page
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const BlogList = lazy(() => import("@/pages/BlogList"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Analytics = import.meta.env.DEV ? lazy(() => import("@/components/Analytics")) : null;
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

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: ReturnType<typeof setTimeout> | number | undefined;

    const mountEnhancements = () => {
      setIsReady(true);
      removeInteractionListeners();
    };
    const handleInteraction = () => mountEnhancements();

    const addInteractionListeners = () => {
      if (typeof window === "undefined") return;
      const opts = { once: true, passive: true } as AddEventListenerOptions;
      window.addEventListener("scroll", handleInteraction, opts);
      window.addEventListener("mousemove", handleInteraction, opts);
      window.addEventListener("keydown", handleInteraction, opts);
      window.addEventListener("touchstart", handleInteraction, opts);
    };

    const removeInteractionListeners = () => {
      if (typeof window === "undefined") return;
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    const scheduleIdleMount = () => {
      if (typeof window === "undefined") return;
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(mountEnhancements, { timeout: 12000 });
      } else {
        idleId = setTimeout(mountEnhancements, 12000);
      }
    };

    addInteractionListeners();
    if (typeof window !== "undefined") {
      timeoutId = setTimeout(scheduleIdleMount, isMobile ? 10000 : 8000);
    }

    return () => {
      removeInteractionListeners();
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      if (idleId !== undefined) {
        if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId as number);
        } else {
          clearTimeout(idleId as ReturnType<typeof setTimeout>);
        }
      }
    };
  }, [isLoading, isMobile]);

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
  </ErrorBoundary>
);

export default App;
