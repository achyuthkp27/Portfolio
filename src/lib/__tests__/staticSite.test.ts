import { describe, expect, it } from "vitest";
import { PROFILE, SERVICES, SOCIALS } from "@/data/profile";
import { experiences } from "@/data/experience";
import { WORK, projectBySlug } from "@/data/projects";
import { posts } from "@/data/writing";
import { escapeHtml, renderStaticSite, STATIC_SITE_ID, type StaticSiteData } from "../staticSite";

const work = [...WORK.banking, ...WORK.ai, WORK.spotlight].map(projectBySlug);
const realData: StaticSiteData = {
  profile: PROFILE,
  socials: SOCIALS,
  services: SERVICES,
  experiences,
  work,
  posts,
};

const parse = (html: string) => {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = html;
  return doc.body;
};

describe("renderStaticSite", () => {
  const html = renderStaticSite(realData);
  const body = parse(html);
  const textOf = (el: Element | null) => el?.textContent ?? "";

  it("wraps one main in the static-site wrapper", () => {
    expect(body.children).toHaveLength(1);
    expect(body.firstElementChild?.id).toBe(STATIC_SITE_ID);
    expect(body.querySelectorAll("main")).toHaveLength(1);
  });

  it("has one h1 with the name and title", () => {
    const h1s = body.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(textOf(h1s[0])).toContain(PROFILE.name);
    expect(textOf(h1s[0])).toContain("Software Engineer");
  });

  it("includes the intro", () => {
    expect(body.textContent).toContain(PROFILE.intro);
  });

  it("lists every Work project title in order", () => {
    const titles = Array.from(body.querySelectorAll("h3")).map((h) => h.textContent ?? "");
    const workTitles = work.map((p) => p.title);
    expect(work).toHaveLength(WORK.banking.length + WORK.ai.length + 1);
    expect(titles.filter((t) => workTitles.includes(t))).toEqual(workTitles);
  });

  it("includes every experience company, period, and achievement", () => {
    for (const job of experiences) {
      expect(body.textContent).toContain(job.company);
      expect(body.textContent).toContain(job.period);
      for (const line of job.achievements) expect(body.textContent).toContain(line);
    }
  });

  it("includes every service and the contact links", () => {
    for (const service of SERVICES) expect(body.textContent).toContain(service.title);
    const hrefs = Array.from(body.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain(`mailto:${PROFILE.email}`);
    expect(hrefs).toContain(PROFILE.links.github);
    expect(hrefs).toContain(PROFILE.links.linkedin);
  });

  it("escapes markup and ampersands in text and attributes", () => {
    const hostile: StaticSiteData = {
      ...realData,
      work: [
        {
          title: '<script>alert("x")</script> & Co',
          description: "a < b && c > d",
          tags: ["R&D"],
          repo: 'https://example.com/?a=1&b="2"',
        },
      ],
    };
    const out = renderStaticSite(hostile);
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; Co");
    expect(out).toContain("a &lt; b &amp;&amp; c &gt; d");
    expect(out).toContain("R&amp;D");
    expect(out).toContain('href="https://example.com/?a=1&amp;b=&quot;2&quot;"');
    // Round-trips to the original text once parsed
    const parsed = parse(out);
    expect(parsed.querySelector("script")).toBeNull();
    expect(Array.from(parsed.querySelectorAll("h3")).some((h) => h.textContent === hostile.work[0].title)).toBe(true);
  });

  it("escapeHtml covers the five special characters", () => {
    expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });
});
