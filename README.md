# Achyuth KP — Software Engineer

**Java · Spring Boot · Banking Systems**

A dark, typography-led portfolio, live at **[achyuthkp27.github.io/Portfolio](https://achyuthkp27.github.io/Portfolio)**.

Five years building secure banking microservices for retail, mobile, and corporate channels. The site shows that work instead of describing it.

## What's on the site

- **Splash screen** — a word flip that ends on the name, shown on every visit and device. It is protected: see [`CLAUDE.md`](CLAUDE.md).
- **Hero** — centered headline, a live years-of-experience counter, and a lazy-loaded 3D wireframe on capable desktops. Phones never download three.js.
- **Case studies** — seven sticky-stacking cards from a regulated banking platform, each with problem, approach, and outcome, plus an architecture diagram. Client specifics are generalized and no metrics are invented.
- **Interactive demos** — a maker-checker approval flow (try approving your own transfer) and a real RFC 6238 TOTP generator with replay rejection, verified against the RFC test vectors.
- **Open source** — recent public repos from the GitHub API, with a language filter.
- **Writing** — early explainers from Medium, each with a one-line takeaway.
- **Keyboard shortcuts** (desktop) — `⌘K` / `Ctrl+K` opens a quick menu, and `` ` `` opens an interactive terminal.

## Tech stack

| Layer             | Choice                                                              |
| ----------------- | ------------------------------------------------------------------- |
| Framework         | React 18 + TypeScript (strict), Vite 8                              |
| Styling           | Tailwind CSS 3                                                      |
| Animation         | Framer Motion, Lenis smooth scroll                                  |
| 3D (desktop only) | three.js via React Three Fiber + drei, lazy-loaded                  |
| Routing           | React Router 7 (hash routing for GitHub Pages)                      |
| Data              | GitHub REST API, cached in localStorage, with a build-time snapshot |
| Quality           | Vitest, Playwright smoke tests, ESLint, Prettier, Husky             |
| PWA               | vite-plugin-pwa (auto-updating service worker)                      |

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
│   ├── 3d/             # lazy-loaded R3F hero scene (desktop only)
│   ├── case-studies/   # interactive maker-checker and TOTP demos
│   └── ui/             # SectionHeader, CommandMenu, SmoothScroll, …
├── context/            # LoadingContext (splash screen state)
├── data/               # case studies, experience, splash words
├── hooks/              # useSectionScroll, useFocusTrap, useMobile, …
├── lib/                # GitHub client, TOTP, shortcuts, analytics
├── pages/              # Index, ProjectDetail, NotFound
└── test/               # test setup
scripts/                # build-time GitHub snapshot
e2e/                    # Playwright smoke tests
```
