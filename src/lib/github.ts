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
}

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

export async function fetchLatestRepositories(limit: number = 6): Promise<GitHubRepo[]> {
  const cacheKey = `gh_repos_${limit}`;
  const cached = readCache<GitHubRepo[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limit}`);
    if (!res.ok) {
      throw new Error("Failed to fetch repositories.");
    }
    const data = await res.json() as GitHubRepo[];
    writeCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("[GitHub API] Error fetching repos:", error);
    return [];
  }
}

export async function fetchRepositoryDetails(repoName: string): Promise<GitHubRepo | null> {
  const cacheKey = `gh_detail_${repoName}`;
  const cached = readCache<GitHubRepo>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`);
    if (!res.ok) return null;
    const data = await res.json() as GitHubRepo;
    writeCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("[GitHub API] Error fetching repository details:", error);
    return null;
  }
}

export async function fetchRepositoryReadme(repoName: string): Promise<string | null> {
  const cacheKey = `gh_readme_${repoName}`;
  const cached = readCache<string>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch via the raw githubusercontent to instantly get the raw markdown bypassing base64 decoding
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/README.md`);
    
    // Fallback to master if main doesn't exist
    if (res.status === 404) {
      const fallbackRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
      if (!fallbackRes.ok) return null;
      const text = await fallbackRes.text();
      writeCache(cacheKey, text);
      return text;
    }
    
    if (!res.ok) return null;
    const text = await res.text();
    writeCache(cacheKey, text);
    return text;
  } catch (error) {
    console.error("[GitHub API] Error fetching README for", repoName, error);
    return null;
  }
}

