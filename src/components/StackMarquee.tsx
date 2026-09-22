import { PROFILE } from "@/data/profile";
import { SectionHeader } from "./ui/SectionHeader";

/** (The stack): the technologies behind the work, as a marquee where the reference shows partner logos. */
const StackMarquee = () => {
  const items = [...PROFILE.stack, ...PROFILE.stack];
  return (
    <section className="theme-dark bg-night text-snow py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <SectionHeader
          label="The stack"
          title="Tools I ship with"
          description="Every technology here has carried production banking traffic under my name."
          align="center"
          className="mb-10 lg:mb-12"
        />
      </div>
      <div className="relative overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none]">
        <ul
          data-reveal-skip
          className="marquee-track flex w-max gap-10 md:gap-16 motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full motion-reduce:justify-center motion-reduce:px-6"
          aria-label="Technologies"
        >
          {items.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="t-heading text-3xl md:text-4xl text-snow/80 whitespace-nowrap"
              aria-hidden={i >= PROFILE.stack.length ? true : undefined}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StackMarquee;
