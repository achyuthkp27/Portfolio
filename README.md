# Achyuth KP — Software Engineer

**Java · Spring Boot · Banking Systems**

A premium dark portfolio, live at **[achyuthkp27.github.io/Portfolio](https://achyuthkp27.github.io/Portfolio)**.

Five years building secure banking microservices — retail, mobile, and corporate channels — presented with the restraint of an editorial site: typography-led, one accent color, no noise.

## Design system

- **Type** — [Anton](https://fonts.google.com/specimen/Anton) (condensed display) for monument statements, [Inter](https://rsms.me/inter/) for everything else, JetBrains Mono for terminal and metadata.
- **Color** — emerald on near-black. One accent, sitewide.
- **Hero** — centered monument composition with a word-flip loader, live years-of-experience counter, and a slow drifting emerald light. Desktop gets a lazy-loaded 3D wireframe scene (React Three Fiber); mobile gets a clean gradient and never downloads three.js.
- **Case studies** — sticky-stacking cards with HTML-built architecture diagrams (NDA-safe, no invented metrics).
- **Projects & Awards** — Squarespace-style card bands: a light emerald-sage gradient field holding near-black rounded cards with code-built animations.
- **Pipeline terminal** — a retro-green interactive terminal (the `>_` trigger, desktop) with commands, themes, and a few jokes. The site's designated toy.

## Tech stack

| Layer             | Choice                                                          |
| ----------------- | --------------------------------------------------------------- |
| Framework         | React 18 + TypeScript, Vite 5                                   |
| Styling           | Tailwind CSS 3                                                  |
| Animation         | Framer Motion, Lenis smooth scroll                              |
| 3D (desktop only) | three.js via React Three Fiber + drei, lazy-loaded              |
| Routing           | React Router (hash routing for GitHub Pages)                    |
| Data              | GitHub REST API (repos, commit count) with localStorage caching |
| Quality           | Vitest + Testing Library, ESLint, Prettier, Husky + lint-staged |
| PWA               | vite-plugin-pwa (auto-update service worker)                    |

Performance notes: below-the-fold sections are lazy-loaded behind `content-visibility` placeholders, heavy chunks (three.js, r3f, framer-motion) are split and deferred, and mobile skips the loader, the 3D scenes, and the expensive backdrop blurs.

## Run it

```bash
npm install
npm run dev        # http://localhost:8080
```

```bash
npm run build      # production build to dist/
npm run preview    # serve the build locally
npm test           # vitest
npm run lint       # eslint
```

## Deploy

Pushes to `main` deploy via the GitHub Pages workflow (`.github/workflows/deploy.yml`).

> **PWA caveat:** the service worker precaches aggressively. After a deploy, returning visitors may need a hard refresh (or a second visit) to pick up the new version.

## Structure

```
src/
├── components/       # sections (Hero, CaseStudyStack, AwardSection, …)
│   ├── 3d/           # lazy-loaded R3F scenes (desktop only)
│   └── ui/           # small building blocks (TextReveal, MagneticButton, …)
├── data/             # projects & experience content
├── hooks/            # useMobile, useLowEndDevice, useIdleMount
├── lib/              # GitHub API client, analytics
└── pages/            # Index, ProjectDetail, NotFound
```
