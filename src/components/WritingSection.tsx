import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import { posts } from "@/data/writing";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * The takeaway is the substance of each of these posts, so it leads and the title
 * becomes metadata — the opposite of a link list, and the reason to read one.
 */
const WritingSection = () => (
  <section id="writing" className="py-20 lg:py-24 px-6 md:px-12 relative">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        label="Writing"
        title="Early writing on Medium"
        description="Explainers I wrote in 2020, before my first engineering role. One idea each."
      />

      <ul className="grid md:grid-cols-3 gap-5 lg:gap-7">
        {[...posts]
          .sort((a, b) => b.published.localeCompare(a.published))
          .map((post, i) => (
            <motion.li
              key={post.url}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="min-w-0"
            >
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 transition-colors duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
              >
                <span
                  className="block w-8 h-px bg-emerald-500/70 mb-6 transition-all duration-500 group-hover:w-14"
                  aria-hidden="true"
                />

                {/* The idea, in the post's own terms */}
                <p className="text-lg md:text-xl font-body font-light text-white/85 leading-snug text-pretty">
                  {post.takeaway}
                </p>

                <span className="mt-auto pt-8 block">
                  <span className="block font-display text-sm font-semibold text-white/70 group-hover:text-white transition-colors leading-snug">
                    {post.title}
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-3">
                    <time dateTime={post.published} className="font-mono text-[11px] text-white/45">
                      {formatDate(post.published)}
                    </time>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/45 group-hover:text-emerald-300 transition-colors">
                      Medium
                      <ArrowUpRight
                        className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
      </ul>
    </div>
  </section>
);

export default WritingSection;
