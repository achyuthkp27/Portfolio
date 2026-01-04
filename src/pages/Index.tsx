import { Suspense, lazy } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import SystemStatus from "@/components/SystemStatus";
import SpaceBackground from "@/components/3d/SpaceBackground";

// Lazy load below-the-fold heavy components
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const ExperienceTimeline = lazy(() => import("@/components/ExperienceTimeline"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ArchitectureGallery = lazy(() => import("@/components/ArchitectureGallery"));
const PhilosophySection = lazy(() => import("@/components/PhilosophySection"));
const AwardSection = lazy(() => import("@/components/AwardSection"));
const EducationSection = lazy(() => import("@/components/EducationSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

const Index = () => {
  return (
    <ThemeProvider>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-white focus:text-black focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to main content
      </a>

      {/* Global Background */}
      <SpaceBackground />
      {/* Global Fixed Grid Pattern covering the entire viewport continuously */}
      <div className="fixed inset-0 grid-pattern opacity-[0.03] z-0 pointer-events-none" />

      <div className="min-h-screen bg-transparent text-white selection:bg-white/20 relative z-10">
        <Navigation />
        <main id="main-content">
          <Hero />
          <SystemStatus />
          <Services />
          <About />

          <Suspense fallback={<div className="h-96 w-full flex items-center justify-center text-white/20 font-mono text-sm">LOADING_SECTOR...</div>}>
            <ProcessSection />
            <ExperienceTimeline />
            <SkillsSection />
            <ProjectsSection />
            <TestimonialsSection />
            <ArchitectureGallery />
            <PhilosophySection />
            <AwardSection />
            <EducationSection />
            <BlogSection />
            <ContactSection />
          </Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
