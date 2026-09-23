import { describe, it, expect } from "vitest";
import { cleanReadme } from "../github";

describe("cleanReadme", () => {
  it("rewrites relative images and links into the repository, and leaves absolute ones alone", () => {
    const html =
      '<p><img src="assets/shot.png"><img src="./docs/a.png"><img src="https://x.test/y.png"></p>' +
      '<a href="docs/GUIDE.md">guide</a><a href="https://example.com">site</a><a href="#install">jump</a><a href="mailto:a@b.c">mail</a>';
    const out = cleanReadme(html, "demo-repo");
    expect(out).toContain('src="https://raw.githubusercontent.com/achyuthkp27/demo-repo/HEAD/assets/shot.png"');
    expect(out).toContain('src="https://raw.githubusercontent.com/achyuthkp27/demo-repo/HEAD/docs/a.png"');
    expect(out).toContain('src="https://x.test/y.png"');
    expect(out).toContain('href="https://github.com/achyuthkp27/demo-repo/blob/HEAD/docs/GUIDE.md"');
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('href="#install"');
    expect(out).toContain('href="mailto:a@b.c"');
  });

  it("strips GitHub's heading anchors and badge images", () => {
    const html =
      '<div class="markdown-heading" dir="auto"><h2 dir="auto"><a id="user-content-x" class="anchor" href="#x"><svg></svg></a>Title</h2></div>' +
      '<img src="https://img.shields.io/badge/a-b" data-canonical-src="https://img.shields.io/badge/a-b"><p></p>';
    const out = cleanReadme(html, "r");
    expect(out).toBe("<div><h2>Title</h2></div>");
  });
});
