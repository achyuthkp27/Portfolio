import { lazy, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { LazySection } from "@/components/ui/LazySection";
import { DUR } from "@/lib/motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WorkSection = lazy(() => import("@/components/WorkSection"));
const FocusSection = lazy(() => import("@/components/FocusSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const StackMarquee = lazy(() => import("@/components/StackMarquee"));
const VisionSection = lazy(() => import("@/components/VisionSection"));
const RecordSection = lazy(() => import("@/components/RecordSection"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const OpenSourceSection = lazy(() => import("@/components/OpenSourceSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

/** Home, in the reference's order: work, who, services, stack, principles, record, experience, updates, contact. */
const Index = () => {
  const location = useLocation();
  const root = useRef<HTMLDivElement>(null);
  useScrollReveal(root);

  useEffect(() => {
    if (!new URLSearchParams(location.search).has("scrollTo")) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("open-source")?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.search]);

  return (
    <motion.div
      ref={root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base }}
      className="bg-night"
    >
      <main id="main-content" tabIndex={-1} className="relative outline-none">
        <Hero />
        <LazySection sectionId="work" minHeight="6000px">
          <WorkSection />
        </LazySection>
        <LazySection minHeight="100vh">
          <FocusSection />
        </LazySection>
        <LazySection sectionId="about" minHeight="1100px">
          <AboutSection />
        </LazySection>
        <LazySection sectionId="services" minHeight="800px">
          <ServicesSection />
        </LazySection>
        <LazySection minHeight="640px">
          <StackMarquee />
        </LazySection>
        <LazySection sectionId="vision" minHeight="7000px">
          <VisionSection />
        </LazySection>
        <LazySection minHeight="700px">
          <RecordSection />
        </LazySection>
        <LazySection sectionId="experience" minHeight="1200px">
          <ExperienceSection />
        </LazySection>
        <LazySection sectionId="open-source" minHeight="1000px">
          <OpenSourceSection />
        </LazySection>
        <LazySection sectionId="contact" minHeight="700px">
          <ContactSection />
        </LazySection>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
