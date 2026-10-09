import { describe, it, expect } from "vitest";
import { demoteReadmeHeadings } from "../readmeHtml";

describe("demoteReadmeHeadings", () => {
  it("moves each heading down two levels and records the original level", () => {
    const out = demoteReadmeHeadings("<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6>");
    expect(out).toBe(
      '<h3 data-h="1">A</h3><h4 data-h="2">B</h4><h5 data-h="3">C</h5>' +
        '<h6 data-h="4">D</h6><h6 data-h="5">E</h6><h6 data-h="6">F</h6>',
    );
  });

  it("keeps attributes and child markup", () => {
    const out = demoteReadmeHeadings(
      '<h1 id="top" class="x" dir="auto">Hello <code>world</code> <a href="#b">link</a></h1>',
    );
    expect(out).toBe(
      '<h3 id="top" class="x" dir="auto" data-h="1">Hello <code>world</code> <a href="#b">link</a></h3>',
    );
  });

  it("handles GitHub's markdown-heading wrapper", () => {
    const html =
      '<div class="markdown-heading" dir="auto"><h1 class="heading-element" dir="auto">Title</h1>' +
      '<a id="user-content-title" class="anchor" href="#title"><svg class="octicon"></svg></a></div>';
    const out = demoteReadmeHeadings(html);
    expect(out).toBe(
      '<div class="markdown-heading" dir="auto"><h3 class="heading-element" dir="auto" data-h="1">Title</h3>' +
        '<a id="user-content-title" class="anchor" href="#title"><svg class="octicon"></svg></a></div>',
    );
  });

  it("leaves HTML without headings untouched", () => {
    const html =
      '<p>Text <strong>bold</strong></p><ul><li>one</li></ul><pre><code>x &lt; y</code></pre><img src="a.png" alt="">';
    expect(demoteReadmeHeadings(html)).toBe(html);
  });
});
