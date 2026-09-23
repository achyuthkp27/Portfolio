import { PillLink } from "./ui/Pill";
import { SectionHeader } from "./ui/SectionHeader";
import { PROFILE } from "@/data/profile";
import CaseStudyStack from "./CaseStudyStack";

/** (Selected work): the header, then the full-width stack of case-study cards. */
const WorkSection = () => (
  <section id="work" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
    <div className="max-w-[1400px] mx-auto">
      <SectionHeader
        label="Selected work"
        title="My work"
        description="Seven systems from a regulated banking platform, and two AI products built on my own time. Client specifics are generalised and no metrics are invented. Two are interactive."
      />
      <CaseStudyStack />
      <div className="mt-12 flex justify-center">
        <PillLink tone="outline" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer">
          All code on GitHub
        </PillLink>
      </div>
    </div>
  </section>
);

export default WorkSection;
