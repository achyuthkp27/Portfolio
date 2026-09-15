#!/usr/bin/env node
/**
 * Build-time snapshot of public GitHub repos, written to public/data/github.json.
 * The site tries the live API first and falls back to this file when a visitor is
 * rate-limited or offline. A failed snapshot never fails the build.
 */
import { mkdir, writeFile } from "node:fs/promises";

const USERNAME = "achyuthkp27";
const OUT_DIR = new URL("../public/data/", import.meta.url);
const OUT_FILE = new URL("github.json", OUT_DIR);
const FIELDS = [
  "id", "name", "description", "html_url", "homepage", "stargazers_count",
  "forks_count", "language", "topics", "updated_at", "default_branch",
];

const headers = { Accept: "application/vnd.github+json", "User-Agent": `${USERNAME}-portfolio-build` };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

try {
  const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const repos = (await res.json())
    .filter((repo) => !repo.fork && !repo.private)
    .map((repo) => Object.fromEntries(FIELDS.map((key) => [key, repo[key] ?? null])));

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), repos }, null, 2) + "\n");
  console.log(`[snapshot-github] saved ${repos.length} repos`);
} catch (error) {
  console.warn(`[snapshot-github] skipped: ${error instanceof Error ? error.message : error}`);
}
