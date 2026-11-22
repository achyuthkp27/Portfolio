import { afterEach, describe, expect, it } from "vitest";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { createChatHandler, LIMITS } from "../../../api/chat";

const ORIGIN = "https://achyuthkp27.github.io";

const userMessage = (text: string, id = Math.random().toString(36).slice(2)) => ({
  id,
  role: "user",
  parts: [{ type: "text", text }],
});

const request = (body: unknown, { origin = ORIGIN, ip = "1.1.1.1" } = {}) =>
  new Request("https://chat.example.vercel.app/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, "x-real-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const mockModel = () =>
  new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "stream-start", warnings: [] },
          { type: "text-start", id: "t" },
          { type: "text-delta", id: "t", delta: "Achyuth builds " },
          { type: "text-delta", id: "t", delta: "banking systems." },
          { type: "text-end", id: "t" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: "stop" },
            usage: {
              inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
              outputTokens: { total: 5, text: 5, reasoning: 0 },
            },
          },
        ],
      }),
    }),
  });

describe("POST /api/chat", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  it("streams the model's answer back as a UI message stream, with CORS for an allowed origin", async () => {
    process.env.CHAT_ALLOWED_ORIGINS = ORIGIN;
    const model = mockModel();
    const { POST } = createChatHandler({ model: () => model });
    const res = await POST(request({ messages: [userMessage("Who is Achyuth?")] }));
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe(ORIGIN);
    const body = await res.text();
    expect(body).toContain("Achyuth builds ");
    expect(body).toContain("banking systems.");
    // The portfolio knowledge goes to the model as instructions
    expect(JSON.stringify(model.doStreamCalls[0].prompt)).toContain("kpachyuthz@gmail.com");
  });

  it("sends only the newest messages, to keep each request small", async () => {
    process.env.CHAT_ALLOWED_ORIGINS = ORIGIN;
    const model = mockModel();
    const { POST } = createChatHandler({ model: () => model });
    const messages = Array.from({ length: 20 }, (_, i) =>
      i % 2
        ? { id: `a${i}`, role: "assistant", parts: [{ type: "text", text: `answer ${i}` }] }
        : userMessage(`question ${i}`),
    );
    messages.push(userMessage("last question"));
    await (await POST(request({ messages }))).text();
    const sent = model.doStreamCalls[0].prompt.filter((m) => m.role !== "system");
    expect(sent).toHaveLength(LIMITS.history);
    expect(JSON.stringify(sent.at(-1))).toContain("last question");
  });

  it("refuses origins that aren't allowed, before doing any work", async () => {
    const { POST, OPTIONS } = createChatHandler({ model: mockModel });
    expect((await POST(request({ messages: [userMessage("hi")] }, { origin: "https://evil.example" }))).status).toBe(
      403,
    );
    expect(OPTIONS(request({}, { origin: "https://evil.example" })).status).toBe(403);
  });

  it("answers the preflight for the GitHub Pages site and localhost", async () => {
    process.env.CHAT_ALLOWED_ORIGINS = `${ORIGIN}/`;
    const { OPTIONS } = createChatHandler({ model: mockModel });
    const pages = OPTIONS(request({}));
    expect(pages.status).toBe(204);
    expect(pages.headers.get("access-control-allow-methods")).toContain("POST");
    expect(OPTIONS(request({}, { origin: "http://localhost:8080" })).status).toBe(204);
  });

  it("says it isn't set up when there is no Gemini key", async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const { POST } = createChatHandler();
    const res = await POST(request({ messages: [userMessage("hi")] }, { origin: "http://localhost:8080" }));
    expect(res.status).toBe(503);
    expect(await res.text()).toMatch(/isn't set up/);
  });

  it("rejects malformed, oversized and over-long requests", async () => {
    const { POST } = createChatHandler({ model: mockModel });
    const local = { origin: "http://localhost:8080" };
    expect((await POST(request("not json", local))).status).toBe(400);
    expect((await POST(request({ messages: [] }, local))).status).toBe(400);
    expect(
      (
        await POST(
          request({ messages: [{ id: "x", role: "assistant", parts: [{ type: "text", text: "hi" }] }] }, local),
        )
      ).status,
    ).toBe(400);
    expect((await POST(request({ messages: [userMessage("x".repeat(LIMITS.message + 1))] }, local))).status).toBe(413);
    expect((await POST(request("x".repeat(LIMITS.body + 1), local))).status).toBe(413);
  });

  it("rate-limits a visitor who sends too much too fast", async () => {
    let t = 0;
    const { POST } = createChatHandler({ model: mockModel, now: () => t });
    const local = { origin: "http://localhost:8080", ip: "9.9.9.9" };
    for (let i = 0; i < LIMITS.perMinute; i++) {
      const res = await POST(request({ messages: [userMessage("hi")] }, local));
      expect(res.status).toBe(200);
      await res.text();
    }
    const limited = await POST(request({ messages: [userMessage("hi")] }, local));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
    // Another visitor is unaffected, and the first one can ask again a minute later
    expect((await POST(request({ messages: [userMessage("hi")] }, { ...local, ip: "8.8.8.8" }))).status).toBe(200);
    t += 61_000;
    expect((await POST(request({ messages: [userMessage("hi")] }, local))).status).toBe(200);
  });
});
