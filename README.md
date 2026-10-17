# Achyuth KP, Software Engineer

**Java · Spring Boot · Kafka · Spring AI · Banking Systems**

A personal site for a backend engineer, live at **[achyuthkp27.github.io/Portfolio](https://achyuthkp27.github.io/Portfolio)**.

Five years building card, payment, and authentication systems for First Citizens Bank (Trinidad and Tobago and Barbados): Card on File tokenization, virtual cards and the first Google Pay launch in Trinidad and Tobago, and a production LLM banking assistant. The site is one long scroll story on a dark page grid: Antonio for display, Inter for reading, and emerald as the only accent, used for highlights and never as a background.

## What's on the site

- **Splash screen:** a word flip that ends on the name, shown on every visit and device. It is protected: see [`CLAUDE.md`](CLAUDE.md).
- **Hero:** "Hey, I'm Achyuth." beside the portrait. As you scroll, the photo comes apart into a WebGL particle twin that streams away in bands and gathers again on the way back.
- **What I believe:** a pinned statement with the numbers behind it: years in production, services in the estate, banking channels, and the 2024 award.
- **Who I am:** a statement that fills in as you read it, then a bento. On wide screens the years counter fills the screen, shrinks into its slot, and the other cards deal out from behind it.
- **Work:** a capsule rises and wipes WORK into view, opens into a swaying wall of letters, and the projects stack up over it as a deck. Eleven projects on six cards, related ones sharing a card, each with its problem, approach, outcome, stack, and links. Client specifics are generalised and no metrics are invented.
- **What I build:** one pinned scene, a large number per service with its stack and where it shipped, and a progress rail of all five.
- **How I think:** three principles coming down a grid corridor.
- **Experience:** "Shipping since 2021" lies on a floor running to a sun and stands up over a crease onto the wall (drawn on a canvas so Safari matches Chrome). The camera then pulls back from Card on File, one service, to the 30+ service estate, the three banking channels, the platform across two countries, and the two employers. Each role pins its company and dates while its achievements light up in turn, with the FIS award after the work that earned it.
- **Experiments:** public repos from the GitHub API as a large index list, the row in the middle of the screen lit, over a globe of particles that blasts apart as you scroll. Early Medium explainers sit under it.
- **Contact:** a small card on the pale grid grows until it fills the screen. Linger and the grid ripples.
- **Footer:** the first name at wordmark scale, clipped by the page edge.
- **Desktop extras:** a custom cursor whose ring opens over anything clickable, `⌘K` / `Ctrl+K` for a quick menu, and `` ` `` for an interactive terminal.

Phones get native scrolling and lighter versions of the heavy effects (no backdrop blur, text revealed as whole blocks, slower canvases), and reduced motion gets a static page with all the same content.

## Tech stack

| Layer     | Choice                                                                   |
| --------- | ------------------------------------------------------------------------ |
| Framework | React 18 + TypeScript (strict), Vite 8                                   |
| Styling   | Tailwind CSS 3                                                           |
| Animation | Framer Motion, Lenis smooth scroll (desktop), raw WebGL and Canvas 2D    |
| Routing   | React Router 7 (hash routing for GitHub Pages)                           |
| Data      | GitHub REST API, cached in localStorage, with a build-time snapshot      |
| Quality   | Vitest, Playwright smoke tests, ESLint, Prettier, Husky with lint-staged |
| PWA       | vite-plugin-pwa (auto-updating service worker)                           |

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

Pushes to `main` run the format check, lint, type-check, and unit tests, build the site, then run Playwright smoke tests against that build before deploying to GitHub Pages (`.github/workflows/deploy.yml`). Any failing check blocks the deploy, including a build that renders a blank page.

The build first runs `scripts/snapshot-github.mjs`, which saves public repo data to `public/data/github.json`. When a visitor is rate-limited by GitHub, the site falls back to that snapshot. A failed snapshot never fails the build.

The service worker activates new versions immediately, so a normal reload picks up a deploy.

## Structure

```
src/
├── components/         # one file per section: Hero, AboutSection, WorkSection, ExperienceSection, …
│   └── ui/             # scenes and pieces: WorkScene, ExperienceScenes, ParticlePortrait, ParticleOrb, Cursor, …
├── context/            # LoadingContext (splash screen state), smooth scroll
├── data/               # profile, projects, experience, nav, splash words
├── hooks/              # useSectionScroll, useScrollReveal, useWarpGrid, useMobile, …
├── lib/                # GitHub client, motion vocabulary, viewport helpers, analytics
├── pages/              # Index, ProjectDetail, NotFound
└── test/               # test setup
scripts/                # build-time GitHub snapshot
e2e/                    # Playwright smoke tests
```
