import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchLatestRepositories, fetchRepositoryDetails, resetSnapshotForTests } from "../github";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  resetSnapshotForTests();
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

const snapshotRepo = { ...mockRepo, id: 2, name: "snapshot-repo" };

const json = (body: unknown, init: { ok?: boolean; status?: number } = {}) =>
  ({ ok: init.ok ?? true, status: init.status ?? 200, json: async () => body }) as Response;

/** Routes the live API and the build-time snapshot to separate responses. */
const mockFetch = (api: () => Promise<Response>, snapshot: () => Promise<Response>) =>
  vi.spyOn(globalThis, "fetch").mockImplementation((input) =>
    String(input).includes("data/github.json") ? snapshot() : api(),
  );

describe("fetchLatestRepositories", () => {
  it("requests the most recently updated repos with the given page size", async () => {
    const fetchSpy = mockFetch(async () => json([mockRepo]), async () => json({ repos: [] }));

    const repos = await fetchLatestRepositories(6);

    expect(repos).toEqual([mockRepo]);
    const url = new URL(String(fetchSpy.mock.calls[0][0]));
    expect(url.pathname).toBe("/users/achyuthkp27/repos");
    expect(url.searchParams.get("sort")).toBe("updated");
    expect(url.searchParams.get("per_page")).toBe("6");
  });

  it("returns cached data on subsequent calls", async () => {
    const fetchSpy = mockFetch(async () => json([mockRepo]), async () => json({ repos: [] }));

    await fetchLatestRepositories(6);
    const repos = await fetchLatestRepositories(6);

    expect(repos).toEqual([mockRepo]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("falls back to the build-time snapshot when rate-limited", async () => {
    mockFetch(async () => json({}, { ok: false, status: 403 }), async () => json({ repos: [snapshotRepo, mockRepo] }));

    await expect(fetchLatestRepositories(1)).resolves.toEqual([snapshotRepo]);
  });

  it("falls back to the snapshot on a network error", async () => {
    mockFetch(() => Promise.reject(new Error("Network error")), async () => json({ repos: [snapshotRepo] }));

    await expect(fetchLatestRepositories(6)).resolves.toEqual([snapshotRepo]);
  });

  it("returns an empty list when both GitHub and the snapshot are unavailable", async () => {
    mockFetch(() => Promise.reject(new Error("Network error")), async () => json({}, { ok: false, status: 404 }));

    await expect(fetchLatestRepositories(6)).resolves.toEqual([]);
  });
});

describe("fetchRepositoryDetails", () => {
  it("fetches single repo details", async () => {
    mockFetch(async () => json(mockRepo), async () => json({ repos: [] }));

    await expect(fetchRepositoryDetails("test-repo")).resolves.toEqual({ status: "ok", repo: mockRepo, fromSnapshot: false });
  });

  it("reports a real 404 as not found", async () => {
    mockFetch(async () => json({}, { ok: false, status: 404 }), async () => json({ repos: [snapshotRepo] }));

    await expect(fetchRepositoryDetails("nonexistent")).resolves.toEqual({ status: "not-found" });
  });

  it("uses the snapshot when GitHub rate-limits the visitor", async () => {
    mockFetch(async () => json({}, { ok: false, status: 403 }), async () => json({ repos: [snapshotRepo] }));

    await expect(fetchRepositoryDetails("snapshot-repo")).resolves.toEqual({
      status: "ok",
      repo: snapshotRepo,
      fromSnapshot: true,
    });
  });

  it("reports unavailable, not missing, when rate-limited and the repo isn't in the snapshot", async () => {
    mockFetch(async () => json({}, { ok: false, status: 403 }), async () => json({ repos: [] }));

    await expect(fetchRepositoryDetails("test-repo")).resolves.toEqual({ status: "unavailable" });
  });

  it("caches successful responses", async () => {
    const fetchSpy = mockFetch(async () => json(mockRepo), async () => json({ repos: [] }));

    await fetchRepositoryDetails("test-repo");
    await fetchRepositoryDetails("test-repo");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
