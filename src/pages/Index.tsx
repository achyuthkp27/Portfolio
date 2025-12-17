import { ThemeProvider } from "@/hooks/useTheme";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ArchitectureGallery from "@/components/ArchitectureGallery";
import AwardSection from "@/components/AwardSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import SystemStatus from "@/components/SystemStatus";
import PhilosophySection from "@/components/PhilosophySection";

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

      <div className="min-h-screen bg-black text-white selection:bg-white/20">
        <Navigation />
        <main id="main-content">
          <Hero />
          <SystemStatus />
          <Services />
          <About />
          <ExperienceTimeline />
          <SkillsSection />
          <ProjectsSection />
          <ArchitectureGallery />
          <PhilosophySection />
          <AwardSection />
          <EducationSection />
          <ContactSection />
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
