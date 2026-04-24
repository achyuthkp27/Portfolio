import { lazy } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SystemStatus from "@/components/SystemStatus";
import SpaceBackground from "@/components/3d/SpaceBackground";
import { LazySection } from "@/components/ui/LazySection";

// Lazy load below-the-fold heavy components
const Services = lazy(() => import("@/components/Services"));
const AboutMeSection = lazy(() => import("@/components/AboutMeSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const ExperienceTimeline = lazy(() => import("@/components/ExperienceTimeline"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ArchitectureGallery = lazy(() => import("@/components/ArchitectureGallery"));
const AwardSection = lazy(() => import("@/components/AwardSection"));
const EducationSection = lazy(() => import("@/components/EducationSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Guestbook = lazy(() => import("@/components/Guestbook"));

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Global Background */}
      <SpaceBackground />
      {/* Global Fixed Grid Pattern covering the entire viewport continuously */}
      <div className="fixed inset-0 grid-pattern opacity-[0.03] z-0 pointer-events-none" />

      <div className="min-h-screen bg-transparent text-white selection:bg-white/20 relative z-10">
        <main id="main-content">
            <Hero />
            <SystemStatus />
            
            <LazySection rootMargin="100px 0px">
              <Services />
            </LazySection>

            <LazySection>
              <AboutMeSection />
            </LazySection>

            <LazySection>
              <ProcessSection />
            </LazySection>

            <LazySection>
              <ExperienceTimeline />
            </LazySection>

            <LazySection>
              <SkillsSection />
            </LazySection>

            <LazySection>
              <ProjectsSection />
            </LazySection>

            <LazySection>
              <TestimonialsSection />
            </LazySection>

            <LazySection>
              <ArchitectureGallery />
            </LazySection>

            <LazySection>
              <AwardSection />
            </LazySection>

            <LazySection>
              <EducationSection />
            </LazySection>

            <LazySection>
              <BlogSection />
            </LazySection>

            <LazySection>
              <Guestbook />
            </LazySection>

            <LazySection>
              <ContactSection />
            </LazySection>
          </main>
          <Footer />
      </div>
    </motion.div>
  );
};

export default Index;
