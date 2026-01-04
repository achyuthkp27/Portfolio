import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";

import ErrorBoundary from "./components/ErrorBoundary";
import PremiumLoader from "@/components/PremiumLoader";
import Analytics from "@/components/Analytics";
import SmoothScroll from "./components/ui/SmoothScroll";
import CustomCursor from "./components/ui/CustomCursor";
import ScrollProgress from "./components/ui/ScrollProgress";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoadingProvider } from "./context/LoadingContext";

const queryClient = new QueryClient();

// Lazy load the project detail page
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const BlogList = lazy(() => import("@/pages/BlogList"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

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

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <LoadingProvider>
        <PremiumLoader />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CustomCursor />
            <HashRouter>
              <ScrollProgress />
              <Analytics />
              <SmoothScroll>
                <AnimatedRoutes />
              </SmoothScroll>
            </HashRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LoadingProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
