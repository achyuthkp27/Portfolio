import { lazy, useEffect, useRef, useState } from "react";
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
const VisionSection = lazy(() => import("@/components/VisionSection"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const OpenSourceSection = lazy(() => import("@/components/OpenSourceSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

/** Home: hero, belief, who, work, what I build, principles, experience, updates, contact. */
const Index = () => {
  const root = useRef<HTMLDivElement>(null);
  useScrollReveal(root);

  // Back from a project page (/?scrollTo=repo): jump to Open source so it mounts and can then
  // centre that repo's row, instead of waiting at the hero until the visitor scrolls there.
  // One instant jump: the section's own effect does the final, precise one.
  const { search } = useLocation();
  const [returning] = useState(() => new URLSearchParams(search).has("scrollTo"));
  useEffect(() => {
    if (returning) document.getElementById("open-source")?.scrollIntoView({ behavior: "instant", block: "start" });
    // Once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.base }}
      className="bg-night"
    >
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        <Hero />
        {/* Reserved heights are the sections' measured heights (desktop, then phone) so the page
            doesn't shift as they mount; re-measure when a section's layout changes */}
        <LazySection minHeight="320vh">
          <FocusSection />
        </LazySection>
        <LazySection sectionId="about" minHeight="1800px" minHeightMobile="3150px">
          <AboutSection />
        </LazySection>
        <LazySection sectionId="work" minHeight="6950px" minHeightMobile="9200px">
          <WorkSection />
        </LazySection>
        <LazySection sectionId="services" minHeight="1320px" minHeightMobile="1550px">
          <ServicesSection />
        </LazySection>
        <LazySection sectionId="vision" minHeight="490vh">
          <VisionSection />
        </LazySection>
        <LazySection sectionId="experience" minHeight="2410px" minHeightMobile="3430px">
          <ExperienceSection />
        </LazySection>
        <LazySection sectionId="open-source" minHeight="1030px" minHeightMobile="1750px">
          <OpenSourceSection />
        </LazySection>
        <LazySection sectionId="contact" minHeight="320vh">
          <ContactSection />
        </LazySection>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </motion.div>
  );
};

export default Index;
