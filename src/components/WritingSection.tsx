import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import { posts } from "@/data/writing";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });

const WritingSection = () => (
  <section id="writing" className="py-20 lg:py-24 px-6 md:px-12 relative">
    <div className="max-w-5xl mx-auto">
      <SectionHeader
        label="Writing"
        title="Early writing on Medium"
        description="Explainers I wrote in 2020, before my first engineering role."
      />

      <ul className="border-t border-white/10">
        {[...posts].sort((a, b) => b.published.localeCompare(a.published)).map((post, i) => (
          <motion.li
            key={post.url}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="border-b border-white/10"
          >
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid md:grid-cols-[7rem_1fr_auto] gap-x-8 gap-y-2 py-7 items-baseline"
            >
              <time dateTime={post.published} className="font-mono text-xs text-white/55">
                {formatDate(post.published)}
              </time>
              <span>
                <span className="block font-display text-lg md:text-xl font-semibold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {post.title}
                </span>
                <span className="block mt-2 text-[15px] font-body font-light text-white/70 leading-relaxed max-w-2xl">
                  {post.takeaway}
                </span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-sm font-body text-white/60 group-hover:text-white transition-colors">
                Read on Medium
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

export default WritingSection;
