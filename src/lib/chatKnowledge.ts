/**
 * The chat assistant's knowledge: the portfolio's own data, written out as plain Markdown. Built
 * from src/data so the assistant only ever repeats what the site says. `npm run chat:knowledge`
 * writes it to api/_knowledge.ts for the serverless function; a unit test fails when the two
 * drift apart.
 *
 * Imports carry their .ts extension so the generator script can run under plain Node.
 */
import { PROFILE, SERVICES, SOCIALS } from "../data/profile.ts";
import { experiences } from "../data/experience.ts";
import { projects, WORK } from "../data/projects.ts";
import { posts } from "../data/writing.ts";
import { NAV_ITEMS } from "../data/nav.ts";

/** Sections a reply can link to, as `[label](section:id)`; ids match the elements on the home page */
export const CHAT_SECTIONS = [
  ...NAV_ITEMS.map((item) => ({ id: item.id, label: item.label })),
  { id: "vision", label: "How I think" },
  { id: "open-source", label: "Open source" },
] as const;

const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

export const buildKnowledge = (): string => {
  const shown = new Set<string>([...WORK.banking, ...WORK.ai, WORK.spotlight]);

  const sections = [
    `# ${PROFILE.name}`,
    `${PROFILE.title} in ${PROFILE.city}. Career started ${PROFILE.careerStart.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: PROFILE.timeZone })}.`,
    `Headline: ${PROFILE.headline.join(" ")}`,
    PROFILE.tagline,
    PROFILE.intro,

    `## Contact`,
    list([
      `Email: ${PROFILE.email}`,
      ...SOCIALS.map((s) => `${s.label}: ${s.href}`),
      `Instagram: ${PROFILE.links.instagram}`,
      `Résumé (PDF): ${PROFILE.resume} on the site`,
      `The Contact section of the site has a "Contact me" email button and a button to copy the address.`,
    ]),

    `## How he works (principles)`,
    list(PROFILE.principles.map((p) => `${p.title} ${p.note}`)),

    `## What he builds (skills by area)`,
    ...SERVICES.map((s) => `### ${s.title}\n${s.blurb}\nStack: ${s.stack.join(", ")}`),

    `## Experience`,
    ...experiences.map(
      (job) =>
        `### ${job.role} at ${job.company} (${job.period})\n${list(job.achievements)}\nTechnologies: ${job.technologies.join(", ")}`,
    ),

    `## Education`,
    `${PROFILE.education.title}, ${PROFILE.education.org} (${PROFILE.education.year}).`,

    `## Awards`,
    `Above and Beyond Individual Award, FIS Global, Q1 2024, for critical project delivery (an individual award, not a team credit). Promoted to Senior Software Engineer at FIS Global.`,

    `## Certifications`,
    `None are listed on the portfolio.`,

    `## Projects`,
    `Each project has its own page, linked as [title](project:slug). Banking work is client work with specifics generalised; no metrics are invented.`,
    ...projects
      .filter((p) => shown.has(p.slug))
      .map((p) =>
        [
          `### ${p.title} (slug: ${p.slug}${p.category ? `, ${p.category}` : ""})`,
          p.origin ? `Context: ${p.origin}` : "Context: professional work at the bank",
          p.description,
          p.problem ? `Problem: ${p.problem}.` : "",
          p.solution ? `Approach: ${p.solution}.` : "",
          p.outcome ? `Outcome: ${p.outcome}.` : "",
          `Stack: ${p.tags.join(", ")}`,
          p.repo ? `Source: ${p.repo}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),

    `## Writing (Medium, 2020)`,
    list(posts.map((post) => `${post.title} (${post.published}): ${post.takeaway} ${post.url}`)),

    `## Site sections you can link to`,
    list(CHAT_SECTIONS.map((s) => `[${s.label}](section:${s.id})`)),
  ];

  return sections.join("\n\n");
};
