# Achyuth KP — Software Engineer

**Java · Spring Boot · Banking Systems**

A personal brand site for a backend engineer, live at **[achyuthkp27.github.io/Portfolio](https://achyuthkp27.github.io/Portfolio)**.

Five years building secure banking microservices for retail, mobile, and corporate channels. The site introduces the person first, then shows the work: a condensed-type editorial layout (Antonio for display, Inter for reading) on near-black, with slash labels, pill buttons, and one accent colour.

## What's on the site

- **Splash screen** — a word flip that ends on the name, shown on every visit and device. It is protected: see [`CLAUDE.md`](CLAUDE.md).
- **Hero** — the name at wordmark scale with one uppercase line; it zooms and fades as you scroll while fact tiles drift in from the edges.
- **Work** — seven sticky-stacking cards from a regulated banking platform, each with a diagram or live demo as its artwork, plus problem, approach, and outcome. Client specifics are generalized and no metrics are invented.
- **Trace** — one corporate wire transfer as a span waterfall.
- **Who I am** — a statement that fills in as you read it, the bio, and a live years-of-experience counter.
- **Services, stack, numbers, principles, record** — a two-column accordion of what I do, a marquee of the stack, real counts, five principles as tilted cards, and dated highlights.
- **Interactive demos** — a maker-checker approval flow (try approving your own transfer) and a real RFC 6238 TOTP generator with replay rejection, verified against the RFC test vectors.
- **Open source and writing** — public repos from the GitHub API and early Medium explainers, as row lists.
- **Contact** — a closing statement with the address as the control. No form, because there is no server.
- **Footer** — the first name at wordmark scale, filled with a dot matrix and clipped by the page edge.
- **Keyboard shortcuts** (desktop) — `⌘K` / `Ctrl+K` opens a quick menu, and `` ` `` opens an interactive terminal.

## Tech stack

| Layer     | Choice                                                              |
| --------- | ------------------------------------------------------------------- |
| Framework | React 18 + TypeScript (strict), Vite 8                              |
| Styling   | Tailwind CSS 3                                                      |
| Animation | Framer Motion, Lenis smooth scroll                                  |
| Routing   | React Router 7 (hash routing for GitHub Pages)                      |
| Data      | GitHub REST API, cached in localStorage, with a build-time snapshot |
| Quality   | Vitest, Playwright smoke tests, ESLint, Prettier, Husky             |
| PWA       | vite-plugin-pwa (auto-updating service worker)                      |

## Run it

Requires Node 20.19+ or 22.12+ (`.nvmrc` pins 22).

```bash
npm install
npm run dev          # http://localhost:8080
```

```bash
npm run build        # snapshot GitHub repos, then build to dist/ with the /Portfolio/ base
npm run preview      # serve the build at http://localhost:4173/Portfolio/
npm run test:run     # vitest, once
npm run test:e2e     # Playwright smoke tests against the production build (run `npm run build` first)
npm run lint         # eslint
npm run type-check   # tsc for app and config
```

## Deploy

Pushes to `main` run lint, type-check, and unit tests, build the site, then run Playwright smoke tests against that build before deploying to GitHub Pages (`.github/workflows/deploy.yml`). Any failing check blocks the deploy, including a build that renders a blank page.

The build first runs `scripts/snapshot-github.mjs`, which saves public repo data to `public/data/github.json`. When a visitor is rate-limited by GitHub, the site falls back to that snapshot. A failed snapshot never fails the build.

The service worker activates new versions immediately, so a normal reload picks up a deploy.

## Structure

```
src/
├── components/
│   ├── case-studies/   # interactive maker-checker and TOTP demos, trace waterfall
│   └── ui/             # Pill, SectionHeader, CommandMenu, SmoothScroll, …
├── context/            # LoadingContext (splash screen state)
├── data/               # profile, case studies, experience, nav, splash words
├── hooks/              # useSectionScroll, useFocusTrap, useMobile, …
├── lib/                # GitHub client, TOTP, shortcuts, motion vocabulary, analytics
├── pages/              # Index, ProjectDetail, NotFound
└── test/               # test setup
scripts/                # build-time GitHub snapshot
e2e/                    # Playwright smoke tests
```
