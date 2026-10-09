/** How far README headings move down so they nest under the page's own h1 and section h2 */
const SHIFT = 2;

/**
 * Push every heading in GitHub-rendered README HTML down two levels (h1→h3, h2→h4, h3→h5,
 * h4–h6→h6) so the page keeps one h1 and the README sits under its "As it reads on GitHub" h2.
 * Each rewritten heading keeps its attributes and children and gains data-h="<original level>",
 * which the .readme styles key on so the README looks the same as before.
 */
export function demoteReadmeHeadings(html: string): string {
  if (typeof DOMParser === "undefined") return html;
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  for (const h of doc.body.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    const level = Number(h.tagName[1]);
    const next = doc.createElement(`h${Math.min(level + SHIFT, 6)}`);
    for (const attr of h.attributes) next.setAttribute(attr.name, attr.value);
    next.setAttribute("data-h", String(level));
    next.append(...h.childNodes);
    h.replaceWith(next);
  }
  return doc.body.innerHTML;
}
