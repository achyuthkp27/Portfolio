import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "@/data/profile";
import ExperienceTimer from "./ui/ExperienceTimer";
import { PillButton } from "./ui/Pill";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { reveal } from "@/lib/motion";

const STATEMENT =
  "I've spent five years inside the systems that move money: the microservices behind retail, mobile, and corporate banking for hundreds of corporate clients.";

/** One word that brightens as the reading line passes it, the way the reference's statement fills in on scroll. */
const Word = ({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
};

/** (Who I am): a statement that fills in as you read it, the bio, and the live counter. */
const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTo = useSectionScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="about" className="theme-dark bg-night text-snow py-24 lg:py-32 px-6 md:px-10 lg:px-12 scroll-mt-16">
      <div className="max-w-[1400px] mx-auto">
        <motion.p {...reveal()} className="t-label mb-8">
          Who I am
        </motion.p>
        <div ref={ref} className="relative">
          <p className="t-statement text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl max-w-6xl">
            {words.map((w, i) => (
              <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
            ))}
          </p>
        </div>

        <div className="mt-16 lg:mt-24 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-12 lg:gap-20 items-start">
          <motion.div {...reveal()} className="rounded-md bg-tile border border-line p-6 md:p-8">
            <p className="t-label mb-2">Time in banking</p>
            <ExperienceTimer startDate={PROFILE.careerStart} />
          </motion.div>
          <div className="space-y-6">
            <motion.p {...reveal(0.05)} className="t-body text-snow/85 max-w-2xl">
              {PROFILE.intro}
            </motion.p>
            <motion.p {...reveal(0.1)} className="t-body text-muted max-w-2xl">
              I started at FIS Global, was promoted to Senior Software Engineer, and moved with the same platform and
              client to Cognizant when the client rebadged the team. Lately the interesting problems sit where banking
              meets AI: LLM-powered assistants that verify who they're talking to, and real-time Video KYC over WebRTC.
            </motion.p>
            <motion.div {...reveal(0.15)} className="flex flex-wrap gap-3 pt-2">
              <PillButton onClick={() => scrollTo("work")}>See the work</PillButton>
              <PillButton tone="outline" onClick={() => scrollTo("contact")}>
                Get in touch
              </PillButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
