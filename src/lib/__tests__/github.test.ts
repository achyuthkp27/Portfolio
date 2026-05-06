import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchLatestRepositories,
  fetchRepositoryDetails,
  fetchRepositoryReadme,
} from "../github";

// Clear localStorage cache before each test
beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

const mockRepo = {
  id: 1,
  name: "test-repo",
  description: "A test repository",
  html_url: "https://github.com/achyuthkp27/test-repo",
  homepage: "",
  stargazers_count: 5,
  forks_count: 2,
  language: "TypeScript",
  topics: ["react"],
  updated_at: "2026-01-01T00:00:00Z",
  default_branch: "main",
};

describe("fetchLatestRepositories", () => {
  it("fetches repos from GitHub API", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [mockRepo],
    } as Response);

    const repos = await fetchLatestRepositories(6);

    expect(repos).toEqual([mockRepo]);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("api.github.com/users/achyuthkp27/repos")
    );
  });

  it("returns cached data on subsequent calls", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [mockRepo],
    } as Response);

    await fetchLatestRepositories(6);
    const repos = await fetchLatestRepositories(6);

    expect(repos).toEqual([mockRepo]);
    expect(fetchSpy).toHaveBeenCalledTimes(1); // Only one fetch, second was cached
  });

  it("returns empty array on network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"));

    const repos = await fetchLatestRepositories(6);

    expect(repos).toEqual([]);
  });

  it("returns empty array on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    const repos = await fetchLatestRepositories(6);

    expect(repos).toEqual([]);
  });
});

describe("fetchRepositoryDetails", () => {
  it("fetches single repo details", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepo,
    } as Response);

    const repo = await fetchRepositoryDetails("test-repo");

    expect(repo).toEqual(mockRepo);
  });

  it("returns null on 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    const repo = await fetchRepositoryDetails("nonexistent");

    expect(repo).toBeNull();
  });

  it("caches successful responses", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepo,
    } as Response);

    await fetchRepositoryDetails("test-repo");
    await fetchRepositoryDetails("test-repo");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe("fetchRepositoryReadme", () => {
  it("fetches README from main branch", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => "# Hello World",
    } as Response);

    const readme = await fetchRepositoryReadme("test-repo");

    expect(readme).toBe("# Hello World");
  });

  it("falls back to master branch on 404", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 404 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        text: async () => "# From Master",
      } as Response);

    const readme = await fetchRepositoryReadme("test-repo");

    expect(readme).toBe("# From Master");
  });

  it("returns null when both branches fail", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 404 } as Response)
      .mockResolvedValueOnce({ ok: false } as Response);

    const readme = await fetchRepositoryReadme("test-repo");

    expect(readme).toBeNull();
  });
});
