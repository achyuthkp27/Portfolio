import type { Plugin } from "vite";
import { PROFILE, SOCIALS, SERVICES } from "../src/data/profile.ts";
import { experiences } from "../src/data/experience.ts";
import { WORK, projectBySlug } from "../src/data/projects.ts";
import { posts } from "../src/data/writing.ts";
import { renderStaticSite, STATIC_SITE_ID } from "../src/lib/staticSite.ts";

const ROOT_OPEN = '<div id="root">';

/**
 * JavaScript visitors: the copy sits in its own fixed, scrollable layer under the shell loader
 * (z-index 50, opaque, full screen), so it never shows and never makes the page itself scroll.
 * React clears #root on mount, which removes both. It is covered, not hidden, so crawlers read it.
 */
const COVERED_CSS =
  `#${STATIC_SITE_ID}{position:fixed;inset:0;z-index:0;overflow:auto;box-sizing:border-box;` +
  `padding:1.5rem 1rem;line-height:1.6}` +
  `#${STATIC_SITE_ID} main{max-width:70ch;margin:0 auto}` +
  `#${STATIC_SITE_ID} a{color:inherit}`;

/** No JavaScript: the loader would never leave, so drop it and let the copy flow as a normal page */
const NO_SCRIPT_CSS = `#app-shell-loader{display:none}#${STATIC_SITE_ID}{position:static;overflow:visible}`;

/** Builds the static copy from the same data modules the site renders */
export function staticSiteHtml(): string {
  return renderStaticSite({
    profile: PROFILE,
    socials: SOCIALS,
    services: SERVICES,
    experiences,
    work: [...WORK.banking, ...WORK.ai, WORK.spotlight].map(projectBySlug),
    posts,
  });
}

/** Writes a plain HTML copy of the homepage's content into #root of the built index.html */
export function seoShell(): Plugin {
  return {
    name: "seo-shell",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (!html.includes(ROOT_OPEN)) {
          throw new Error(`seo-shell: ${ROOT_OPEN} not found in index.html`);
        }
        return {
          html: html.replace(ROOT_OPEN, `${ROOT_OPEN}\n    ${staticSiteHtml()}`),
          tags: [
            { tag: "style", children: COVERED_CSS, injectTo: "head" },
            {
              tag: "noscript",
              children: [{ tag: "style", children: NO_SCRIPT_CSS }],
              injectTo: "head",
            },
          ],
        };
      },
    },
  };
}
