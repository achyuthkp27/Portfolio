const GITHUB_USERNAME = "achyuthkp27";

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

export async function fetchLatestRepositories(limit: number = 6): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limit}`);
    if (!res.ok) {
      throw new Error("Failed to fetch repositories.");
    }
    const data = await res.json();
    return data as GitHubRepo[];
  } catch (error) {
    console.error("[GitHub API] Error fetching repos:", error);
    return [];
  }
}

export async function fetchRepositoryDetails(repoName: string): Promise<GitHubRepo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`);
    if (!res.ok) return null;
    return await res.json() as GitHubRepo;
  } catch (error) {
    console.error("[GitHub API] Error fetching repository details:", error);
    return null;
  }
}

export async function fetchRepositoryReadme(repoName: string): Promise<string | null> {
  try {
    // Fetch via the raw githubusercontent to instantly get the raw markdown bypassing base64 decoding
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/main/README.md`);
    
    // Fallback to master if main doesn't exist
    if (res.status === 404) {
      const fallbackRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/master/README.md`);
      if (!fallbackRes.ok) return null;
      return await fallbackRes.text();
    }
    
    if (!res.ok) return null;
    return await res.text();
  } catch (error) {
    console.error("[GitHub API] Error fetching README for", repoName, error);
    return null;
  }
}
