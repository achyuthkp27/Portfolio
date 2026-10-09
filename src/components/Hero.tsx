import { ArrowDown } from "lucide-react";
import { motion, useInView, useReducedMotionConfig, useScroll, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useLoading } from "@/hooks/useLoading";
import { PROFILE } from "@/data/profile";

const base = import.meta.env.BASE_URL;
import ExperienceTimer from "./ui/ExperienceTimer";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const OUT = [0.16, 1, 0.3, 1] as const;

/**
 * A line whose words rise into place one after another, after the reference's BlurText (no per-word blur: too costly on phones).
 * Words wrapped in *asterisks* render in italic serif, a shade brighter.
 */
const BlurWords = ({
  text,
  start,
  step,
  className,
  show,
}: {
  text: string;
  start: number;
  step: number;
  className: string;
  show: boolean;
}) => {
  const reduceMotion = useReducedMotionConfig();
  return (
    <p className={className}>
      {text.split(" ").map((raw, i) => {
        const italic = raw.startsWith("*");
        const match = raw.replace(/^\*/, "").match(/^(.*?)\*?([.,;:!?]*)$/);
        const word = match?.[1] ?? raw;
        const punctuation = match?.[2] ?? "";
        return (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: OUT, delay: start + i * step }}
          >
            {italic ? <span className="text-white/95">{word}</span> : word}
            {punctuation}{" "}
          </motion.span>
        );
      })}
    </p>
  );
};

/**
 * The introduction, matched to sarang-space.site's Hero.jsx: an accent label, "Hey, I'm"
 * as an outlined italic serif ghost behind the name in Inter Black, letters rising in one
 * by one, three paragraphs that rise in word by word and get quieter, then Explore. The
 * original photo is pinned on the right and pushes in as you scroll; the whole block lifts
 * and fades as it leaves.
 */
const Hero = () => {
  const { isLoading } = useLoading();
  const reduceMotion = useReducedMotionConfig();
  const scrollTo = useSectionScroll();
  const ref = useRef<HTMLElement>(null);
  const show = !isLoading;
  const orbOn = useInView(ref, { margin: "200px 0px" });
  // The photo fades in only once it has decoded, so a slow download never pops it in mid-fade
  const [photoReady, setPhotoReady] = useState(false);
  const markReady = useCallback(() => setPhotoReady(true), []);
  const photoRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete) markReady();
    },
    [markReady],
  );

  const { scrollYProgress } = useScroll({ target: ref, offset: ["end 0.6", "end 0.1"] });
  // The photo moves with the page: a slow push-in, a drift up and to the left, a gentle dim
  const { scrollYProgress: through } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // As the copy scrolls away, the figure glides in from the right and stops short of the centre, clear of the copy
  const toCentre = (v: number) => {
    const t = Math.min(1, v / 0.55);
    return t * t * (3 - 2 * t);
  };
  const wide = useMediaQuery("(min-width: 1024px)");
  const photoScale = useTransform(through, (v) => (reduceMotion ? 0.9 : 0.9 + toCentre(v) * 0.08));
  // The sideways glide is for the wide layout only; on phones the figure stays put above the copy
  const photoX = useTransform(through, (v) => (reduceMotion || !wide ? "0vw" : `${toCentre(v) * -15}vw`));
  const photoY = useTransform(through, () => "0%");
  const photoDim = useTransform(through, (v) => (reduceMotion ? 1 : 1 - v * 0.35));
  const fadeOut = useTransform(scrollYProgress, (v) => (reduceMotion ? 1 : 1 - v));
  const lift = useTransform(scrollYProgress, (v) => (reduceMotion ? 0 : v * -50));

  const rise = (delay: number, y = 20) => ({
    initial: reduceMotion ? false : { opacity: 0, y },
    animate: show ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, ease: OUT, delay },
  });

  return (
    <motion.section
      ref={ref}
      data-reveal-skip
      style={{ opacity: fadeOut, y: lift }}
      className="theme-dark relative min-h-[135vh] flex flex-col pt-[52svh] lg:pt-[36svh] pb-[20vh] px-6 sm:px-10 md:px-24 text-white"
    >
      {/* The original photo, pinned to the right while the copy scrolls over it */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Phones and iPad portrait: the figure sits whole in the top of the screen, the copy below it.
              Wide screens: pinned to the right while the copy scrolls over it. */}
          <div className="absolute top-0 right-0 z-[1] w-full h-[60svh] lg:h-auto lg:inset-y-0 lg:w-[64%]">
            {/* Phones: the frame cuts the sweater at the left edge, so that edge fades to the ground */}
            <div className="lg:hidden absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-night via-night/70 to-transparent pointer-events-none" />
            <motion.picture
              style={{ scale: photoScale, x: photoX, y: photoY, opacity: photoDim }}
              className="absolute inset-0 block origin-[70%_100%] will-change-transform [mask-image:linear-gradient(to_top,transparent,black_18%),linear-gradient(to_left,transparent,black_14%)] [mask-composite:intersect] [-webkit-mask-image:linear-gradient(to_top,transparent,black_18%),linear-gradient(to_left,transparent,black_14%)] [-webkit-mask-composite:source-in]"
            >
              {/* The photo fades in once its silhouette has been drawn (about 2.3s) */}
              <motion.div
                className="absolute inset-0"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={show && photoReady ? { opacity: 1 } : {}}
                transition={{ duration: 3, ease: OUT, delay: 2.2 }}
              >
                <img
                  ref={photoRef}
                  onLoad={markReady}
                  onError={markReady}
                  src={`${base}images/avatar-cutout.webp`}
                  alt=""
                  width={1672}
                  height={941}
                  // React 18 only knows the lowercase attribute; the camelCase prop logs a warning
                  {...{ fetchpriority: "high" }}
                  className="w-full h-full object-cover object-[74%_18%] lg:object-[70%_top]"
                />
              </motion.div>
              {/* An emerald outline traced from the cutout's edge draws itself first, then gives way
                  to the photo. Both halves start at the crown and meet the frame together; the SVG animates on its own, so it mounts only when the draw should start. */}
              {!reduceMotion && show && photoReady && (
                <div className="absolute inset-0">
                  <motion.img
                    src={`${base}images/avatar-outline.svg`}
                    alt=""
                    width={1672}
                    height={941}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeInOut", delay: 3.4 }}
                    className="absolute inset-0 w-full h-full object-cover object-[74%_18%] lg:object-[70%_top]"
                  />
                </div>
              )}
            </motion.picture>
          </div>
          {/* The light from the earlier hero: a soft emerald orb on a wide orbit, lingering behind the
              copy on the left and passing behind the figure on the right */}
          {/* Mounted only while the hero is near the screen: its endless orbit otherwise keeps
              the animation loop running for the whole visit */}
          {orbOn && (
            // Desktop only: on phones the orb wanders over the copy and the portrait
            <div className="absolute inset-0 hidden lg:flex items-center justify-center">
              <div
                // The orbit itself is a CSS animation (.hero-orb in index.css), so it costs no main-thread work
                className={`w-[46vw] h-[46vw] max-w-[700px] max-h-[700px] shrink-0 rounded-full motion-reduce:hidden${reduceMotion ? "" : " hero-orb"}`}
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--accent-400)/0.34) 0%, hsl(var(--accent-500)/0.12) 38%, transparent 66%)",
                }}
              />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-night to-transparent" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl">
        <motion.p
          {...rise(0.4)}
          className="text-[12px] md:text-xs text-emerald-400 tracking-[0.2em] uppercase font-bold mb-6"
        >
          {PROFILE.title} · Backend &amp; AI
        </motion.p>

        <h1 className="font-body font-black tracking-tighter leading-[0.75] mb-12 flex flex-col text-[clamp(3.6rem,12vw,11rem)]">
          <motion.span
            {...rise(0.6, 90)}
            className="block font-serif italic font-normal tracking-[-0.01em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.45)]"
          >
            Hey, I&apos;m
          </motion.span>{" "}
          {/* The name arrives whole: one soft rise out of a blur, no per-letter tumble */}
          <motion.span
            className="block -mt-2 md:-mt-6 pb-[0.26em] -mb-[0.14em]"
            initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(12px)" }}
            // The filter is dropped once the blur has cleared: WebKit clips a filtered element's glyphs to its box
            animate={show ? { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } } : {}}
            transition={{ duration: 1.1, ease: OUT, delay: 0.75 }}
          >
            {`${PROFILE.first}.`}
          </motion.span>
        </h1>

        <div className="max-w-lg flex flex-col gap-6">
          <BlurWords
            show={show}
            start={1.4}
            step={0.03}
            className="text-base md:text-[17px] text-white/60 font-medium leading-[1.6]"
            text="I build *reliable* backend systems and *useful* AI. Five years on a *regulated* banking platform taught me what production demands: correctness, security, and code that *holds* up."
          />
          <BlurWords
            show={show}
            start={1.7}
            step={0.022}
            className="text-xs md:text-sm text-white/40 font-light leading-relaxed"
            text="I mainly work with Java, Spring Boot, Kafka, and Python, and today I own cards, payments, and an LLM assistant for a *banking* *platform*."
          />
          <BlurWords
            show={show}
            start={1.9}
            step={0.015}
            className="text-xs md:text-sm text-white/30 font-light leading-relaxed"
            text="On my own time I build AI that *verifies* who it's talking to, and an *on-device* banking assistant where the model never leaves the phone."
          />

          <motion.div {...rise(2.2)} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="py-3 -my-3 text-[11px] lg:text-[10px] text-white/50 hover:text-white tracking-[0.4em] uppercase font-medium transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                Explore <ArrowDown className="w-3 h-3" aria-hidden="true" />
              </span>
            </button>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <ExperienceTimer startDate={PROFILE.careerStart} inline />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
