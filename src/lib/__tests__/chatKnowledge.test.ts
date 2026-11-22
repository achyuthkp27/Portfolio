import { describe, expect, it } from "vitest";
import { buildKnowledge, CHAT_SECTIONS } from "../chatKnowledge";
import { KNOWLEDGE } from "../../../api/_knowledge";
import { PROFILE } from "../../data/profile";
import { experiences } from "../../data/experience";
import { WORK } from "../../data/projects";

describe("chat knowledge", () => {
  const knowledge = buildKnowledge();

  it("matches the copy the chat function reads (run `npm run chat:knowledge` after editing src/data)", () => {
    expect(KNOWLEDGE).toBe(knowledge);
  });

  it("carries the facts visitors ask about, straight from the site's data", () => {
    expect(knowledge).toContain(PROFILE.name);
    expect(knowledge).toContain(PROFILE.email);
    expect(knowledge).toContain(PROFILE.links.linkedin);
    expect(knowledge).toContain(PROFILE.education.org);
    for (const job of experiences) expect(knowledge).toContain(job.company);
    expect(knowledge).toContain("Above and Beyond Individual Award");
  });

  it("lists every project the site shows, with the slug its links use", () => {
    for (const slug of [...WORK.banking, ...WORK.ai, WORK.spotlight]) expect(knowledge).toContain(`slug: ${slug}`);
  });

  it("says plainly what the portfolio doesn't have, so the assistant won't make it up", () => {
    expect(knowledge).toMatch(/## Certifications\s+None are listed/);
  });

  it("offers only sections that exist on the home page", () => {
    for (const s of CHAT_SECTIONS) expect(knowledge).toContain(`(section:${s.id})`);
  });
});
