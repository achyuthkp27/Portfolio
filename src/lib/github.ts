const GITHUB_USERNAME = "achyuthkp27";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  default_branch: string;
  /** Present on live API responses; the build-time snapshot drops it, having already filtered */
  fork?: boolean;
}

export type RepoDetailsResult =
  | { status: "ok"; repo: GitHubRepo; fromSnapshot: boolean }
  | { status: "not-found" }
  | { status: "unavailable" };

const isAbort = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

/** Read a cached value from localStorage if it hasn't expired. */
function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/** Write a value to localStorage with the current timestamp. */
function writeCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

let snapshotPromise: Promise<GitHubRepo[]> | null = null;

/** Repos saved at build time (scripts/snapshot-github.mjs). Empty when there is no snapshot. */
export function loadSnapshot(): Promise<GitHubRepo[]> {
  snapshotPromise ??= fetch(`${import.meta.env.BASE_URL}data/github.json`)
    .then((res) => (res.ok ? res.json() : { repos: [] }))
    .then((body: { repos?: GitHubRepo[] }) => (Array.isArray(body.repos) ? body.repos : []))
    .catch(() => []);
  return snapshotPromise;
}

/** Test hook: forget the memoized snapshot. */
export const resetSnapshotForTests = () => {
  snapshotPromise = null;
};

/** Repos the owner wants first, in this order, ahead of the rest by last update. */
export const FEATURED_REPOS = ["VoxOs", "spring-ai-langchain4j", "kairo-offline-ai-bank", "forge-fit"];
/** Repos that never show: the profile README repo carries nothing worth listing. */
export const HIDDEN_REPOS = new Set(["achyuthkp27"]);

/** Featured first in their given order, then everything else as GitHub returned it, hidden ones dropped. */
export function arrangeRepositories(repos: GitHubRepo[]): GitHubRepo[] {
  const rank = new Map(FEATURED_REPOS.map((name, i) => [name.toLowerCase(), i]));
  const kept = repos.filter((r) => !HIDDEN_REPOS.has(r.name.toLowerCase()) && !HIDDEN_REPOS.has(r.name));
  const featured = kept
    .filter((r) => rank.has(r.name.toLowerCase()))
    .sort((a, b) => rank.get(a.name.toLowerCase())! - rank.get(b.name.toLowerCase())!);
  const rest = kept.filter((r) => !rank.has(r.name.toLowerCase()));
  return [...featured, ...rest];
}

export async function fetchLatestRepositories(limit: number = 6, signal?: AbortSignal): Promise<GitHubRepo[]> {
  const cacheKey = "gh_repos_all_v2";
  const cached = readCache<GitHubRepo[]>(cacheKey);
  if (cached) return arrangeRepositories(cached).slice(0, limit);

  try {
    // Always the full page: the featured repos must be present whatever the limit
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      signal,
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    // Forks are someone else's work; the build-time snapshot already excludes them,
    // so the live path has to agree or the two lists drift. Private repos cannot
    // appear here at all — this endpoint is public-only for unauthenticated calls.
    const data = ((await res.json()) as GitHubRepo[]).filter((repo) => !repo.fork);
    writeCache(cacheKey, data);
    return arrangeRepositories(data).slice(0, limit);
  } catch (error) {
    if (isAbort(error)) return [];
    // Rate-limited or offline: fall back to the build-time snapshot
    return arrangeRepositories(await loadSnapshot()).slice(0, limit);
  }
}

export async function fetchRepositoryDetails(repoName: string, signal?: AbortSignal): Promise<RepoDetailsResult> {
  const cacheKey = `gh_detail_${repoName}`;
  const cached = readCache<GitHubRepo>(cacheKey);
  if (cached) return { status: "ok", repo: cached, fromSnapshot: false };

  const fromSnapshot = async (): Promise<RepoDetailsResult | null> => {
    const repo = (await loadSnapshot()).find((r) => r.name.toLowerCase() === repoName.toLowerCase());
    return repo ? { status: "ok", repo, fromSnapshot: true } : null;
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${encodeURIComponent(repoName)}`, {
      signal,
    });
    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) return (await fromSnapshot()) ?? { status: "unavailable" };
    const data = (await res.json()) as GitHubRepo;
    writeCache(cacheKey, data);
    return { status: "ok", repo: data, fromSnapshot: false };
  } catch (error) {
    if (isAbort(error)) return { status: "unavailable" };
    return (await fromSnapshot()) ?? { status: "unavailable" };
  }
}

export interface RepoExtras {
  /** README as GitHub-rendered HTML, with GitHub's anchor chrome removed; null when unavailable */
  readme: string | null;
  /** Bytes per language, largest first */
  languages: { name: string; bytes: number; share: number }[];
  /** Latest commits on the default branch */
  commits: { sha: string; message: string; date: string; url: string }[];
}

const EMPTY_EXTRAS: RepoExtras = { readme: null, languages: [], commits: [] };

/** Strip GitHub's heading anchors and permalinks so the README reads as plain document HTML. */
const cleanReadme = (html: string) =>
  html
    .replace(/<a id="user-content-[^"]*" class="anchor"[\s\S]*?<\/a>/g, "")
    .replace(/<div class="markdown-heading" dir="auto">/g, "<div>")
    .replace(/ dir="auto"/g, "")
    .replace(/<img[^>]*data-canonical-src[^>]*>/g, (m) => (m.includes("shields.io") || m.includes("badge") ? "" : m))
    .replace(/<p>\s*<\/p>/g, "");

/**
 * README, languages, and recent commits for one repo. Each part fails on its own, so a
 * rate-limited README still leaves the language bar and commits intact. Cached a day.
 */
export async function fetchRepositoryExtras(repoName: string, signal?: AbortSignal): Promise<RepoExtras> {
  const cacheKey = `gh_extras_${repoName}`;
  const cached = readCache<RepoExtras>(cacheKey);
  if (cached) return cached;
  const base = `https://api.github.com/repos/${GITHUB_USERNAME}/${encodeURIComponent(repoName)}`;

  const readme = fetch(`${base}/readme`, { signal, headers: { Accept: "application/vnd.github.html" } })
    .then((r) => (r.ok ? r.text() : null))
    .then((html) => (html ? cleanReadme(html) : null))
    .catch(() => null);

  const languages = fetch(`${base}/languages`, { signal })
    .then((r): Promise<Record<string, number>> => (r.ok ? r.json() : Promise.resolve({})))
    .then((map) => {
      const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
      return Object.entries(map)
        .map(([name, bytes]) => ({ name, bytes, share: bytes / total }))
        .sort((a, b) => b.bytes - a.bytes);
    })
    .catch(() => []);

  const commits = fetch(`${base}/commits?per_page=5`, { signal })
    .then((r) => (r.ok ? r.json() : []))
    .then((list: { sha: string; html_url: string; commit: { message: string; author: { date: string } } }[]) =>
      list.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        date: c.commit.author.date,
        url: c.html_url,
      })),
    )
    .catch(() => []);

  try {
    const extras: RepoExtras = { readme: await readme, languages: await languages, commits: await commits };
    if (extras.readme || extras.languages.length || extras.commits.length) writeCache(cacheKey, extras);
    return extras;
  } catch (error) {
    if (isAbort(error)) return EMPTY_EXTRAS;
    return EMPTY_EXTRAS;
  }
}
