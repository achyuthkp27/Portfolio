import { lazy } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SpaceBackground from "@/components/3d/SpaceBackground";
import { LazySection } from "@/components/ui/LazySection";

// Lazy load below-the-fold heavy components
const AboutMeSection = lazy(() => import("@/components/AboutMeSection"));
const ExperienceTimeline = lazy(() => import("@/components/ExperienceTimeline"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const AwardSection = lazy(() => import("@/components/AwardSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

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

            <LazySection sectionId="about" minHeight="1200px">
              <AboutMeSection />
            </LazySection>

            <LazySection sectionId="experience" minHeight="900px">
              <ExperienceTimeline />
            </LazySection>

            <LazySection sectionId="projects" minHeight="1000px">
              <ProjectsSection />
            </LazySection>

            <LazySection sectionId="skills" minHeight="800px">
              <SkillsSection />
            </LazySection>

            <LazySection sectionId="awards" minHeight="600px">
              <AwardSection />
            </LazySection>

            <LazySection sectionId="contact" minHeight="800px">
              <ContactSection />
            </LazySection>
          </main>
          <Footer />
      </div>
    </motion.div>
  );
};

export default Index;
