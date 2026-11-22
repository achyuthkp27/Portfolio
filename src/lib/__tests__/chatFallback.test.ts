import { describe, expect, it, vi } from "vitest";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

const answering = (id: string, text: string) =>
  new MockLanguageModelV4({
    modelId: id,
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "stream-start", warnings: [] },
          { type: "text-start", id: "t" },
          { type: "text-delta", id: "t", delta: text },
          { type: "text-end", id: "t" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: "stop" },
            usage: {
              inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
              outputTokens: { total: 1, text: 1, reasoning: 0 },
            },
          },
        ],
      }),
    }),
  });

const failing = (id: string, error: unknown) =>
  new MockLanguageModelV4({
    modelId: id,
    doStream: async () => {
      throw error;
    },
  });

/** Accepts the request, then never says anything, the way an overloaded model sometimes does */
const silent = (id: string) =>
  new MockLanguageModelV4({
    modelId: id,
    doStream: async ({ abortSignal }) => ({
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue({ type: "stream-start", warnings: [] });
          abortSignal?.addEventListener("abort", () => controller.error(new Error("aborted")));
        },
      }),
    }),
  });

const textOf = async (stream: ReadableStream<{ type: string; delta?: string }>) => {
  let text = "";
  const reader = stream.getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return text;
    if (value.type === "text-delta") text += value.delta;
  }
};

const load = async (timeoutMs = 8000) => {
  vi.resetModules();
  process.env.GEMINI_FIRST_TOKEN_TIMEOUT_MS = String(timeoutMs);
  return import("../../../api/chat");
};

describe("Gemini fallback chain", () => {
  vi.spyOn(console, "warn").mockImplementation(() => {});

  it("moves on when a model is busy, and answers from the next one", async () => {
    const { withFallbacks } = await load();
    const chain = withFallbacks([
      failing(
        "busy",
        Object.assign(new Error("This model is currently experiencing high demand."), { statusCode: 503 }),
      ),
      answering("ok", "Hello from the fallback"),
    ]);
    const { stream } = await chain.doStream({ prompt: [] } as never);
    expect(await textOf(stream)).toBe("Hello from the fallback");
  });

  it("does not hide a real error behind another model", async () => {
    const { withFallbacks } = await load();
    const next = answering("never", "should not run");
    const chain = withFallbacks([
      failing("bad", Object.assign(new Error("API key not valid"), { statusCode: 400 })),
      next,
    ]);
    await expect(chain.doStream({ prompt: [] } as never)).rejects.toThrow("API key not valid");
    expect(next.doStreamCalls).toHaveLength(0);
  });

  it("gives up on a model that accepts the request but never answers", async () => {
    const { withFallbacks } = await load(50);
    const chain = withFallbacks([silent("stuck"), answering("ok", "Answered in time")]);
    const { stream } = await chain.doStream({ prompt: [] } as never);
    expect(await textOf(stream)).toBe("Answered in time");
  });

  it("reports the last failure when every model is busy", async () => {
    const { withFallbacks } = await load(50);
    const chain = withFallbacks([
      silent("a"),
      failing("b", Object.assign(new Error("RESOURCE_EXHAUSTED"), { statusCode: 429 })),
    ]);
    await expect(chain.doStream({ prompt: [] } as never)).rejects.toThrow("RESOURCE_EXHAUSTED");
  });
});
