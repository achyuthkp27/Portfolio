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

export async function fetchLatestRepositories(limit: number = 6, signal?: AbortSignal): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${limit}`;
  const cached = readCache<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limit}`, {
      signal,
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    // Forks are someone else's work; the build-time snapshot already excludes them,
    // so the live path has to agree or the two lists drift. Private repos cannot
    // appear here at all — this endpoint is public-only for unauthenticated calls.
    const data = ((await res.json()) as GitHubRepo[]).filter((repo) => !repo.fork);
    writeCache(cacheKey, data);
    return data;
  } catch (error) {
    if (isAbort(error)) return [];
    // Rate-limited or offline: fall back to the build-time snapshot
    return (await loadSnapshot()).slice(0, limit);
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
