/**
 * A plain, semantic HTML copy of the homepage's content, for crawlers and readers without
 * JavaScript. The build writes it into #root of index.html (see vite/seoShell.ts); React
 * replaces it on mount, and until then the shell loader covers it, so no visitor with
 * JavaScript ever sees it. Every word comes from src/data: nothing here is written for it.
 *
 * Pure: data in, HTML string out. It never runs in the browser bundle.
 */

export interface StaticSiteData {
  profile: {
    name: string;
    title: string;
    email: string;
    resume: string;
    city: string;
    headline: readonly string[];
    tagline: string;
    intro: string;
    principles: readonly { title: string; note: string }[];
    education: { year: string; title: string; org: string };
  };
  socials: readonly { label: string; href: string }[];
  services: readonly { title: string; blurb: string; stack: readonly string[] }[];
  experiences: readonly {
    company: string;
    role: string;
    period: string;
    achievements: readonly string[];
    technologies: readonly string[];
  }[];
  /** In the order the Work section shows them */
  work: readonly {
    title: string;
    description: string;
    problem?: string;
    solution?: string;
    outcome?: string;
    tags: readonly string[];
    repo?: string;
    origin?: string;
  }[];
  posts: readonly { title: string; url: string; takeaway: string }[];
}

/** The wrapper's id: the inline styles in vite/seoShell.ts target it */
export const STATIC_SITE_ID = "static-site";

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes text and attribute values */
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (ch) => ENTITIES[ch]);

const text = (tag: string, value: string) => `<${tag}>${escapeHtml(value)}</${tag}>`;
const link = (href: string, label: string) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
const list = (items: readonly string[]) => `<ul>${items.map((item) => text("li", item)).join("")}</ul>`;
/** Ends a phrase with a full stop unless it already has one */
const sentence = (value: string) => (/[.!?]$/.test(value) ? value : `${value}.`);

export function renderStaticSite(data: StaticSiteData): string {
  const { profile } = data;

  const about = [
    `<h1>${escapeHtml(profile.name)}, ${escapeHtml(profile.title)}</h1>`,
    text("p", profile.headline.join(" ")),
    text("p", profile.tagline),
    text("p", profile.intro),
    text("p", profile.city),
  ].join("");

  const work = data.work
    .map((project) =>
      [
        "<article>",
        text("h3", project.title),
        project.origin ? text("p", project.origin) : "",
        text("p", project.description),
        project.problem ? `<p>Problem: ${escapeHtml(sentence(project.problem))}</p>` : "",
        project.solution ? `<p>Approach: ${escapeHtml(sentence(project.solution))}</p>` : "",
        project.outcome ? `<p>Outcome: ${escapeHtml(sentence(project.outcome))}</p>` : "",
        `<p>${escapeHtml(project.tags.join(", "))}</p>`,
        project.repo ? `<p>${link(project.repo, "View source")}</p>` : "",
        "</article>",
      ].join(""),
    )
    .join("");

  const services = data.services
    .map((service) =>
      [
        text("h3", service.title),
        text("p", service.blurb),
        `<p>Stack: ${escapeHtml(service.stack.join(", "))}</p>`,
      ].join(""),
    )
    .join("");

  const principles = profile.principles
    .map((principle) => text("h3", principle.title) + text("p", principle.note))
    .join("");

  const experience = data.experiences
    .map((job) =>
      [
        "<article>",
        text("h3", `${job.role}, ${job.company}`),
        text("p", job.period),
        list(job.achievements),
        `<p>${escapeHtml(job.technologies.join(", "))}</p>`,
        "</article>",
      ].join(""),
    )
    .join("");

  const education = [
    text("h3", "Education"),
    text("p", `${profile.education.title}, ${profile.education.org}, ${profile.education.year}`),
  ].join("");

  const writing = data.posts
    .map((post) => `<li>${link(post.url, post.title)}: ${escapeHtml(post.takeaway)}</li>`)
    .join("");

  const contact = [
    `<li>${link(`mailto:${profile.email}`, profile.email)}</li>`,
    ...data.socials.map((social) => `<li>${link(social.href, social.label)}</li>`),
    `<li>${link(profile.resume, "Résumé")}</li>`,
  ].join("");

  return [
    `<div id="${STATIC_SITE_ID}">`,
    "<main>",
    `<section>${about}</section>`,
    `<section><h2>Work</h2>${work}</section>`,
    `<section><h2>What I build</h2>${services}</section>`,
    `<section><h2>How I think</h2>${principles}</section>`,
    `<section><h2>Experience</h2>${experience}${education}</section>`,
    `<section><h2>Writing</h2><ul>${writing}</ul></section>`,
    `<section><h2>Contact</h2><ul>${contact}</ul></section>`,
    "</main>",
    "</div>",
  ].join("");
}
