import type { Plugin } from "vite";
import { loadEnv } from "vite";
import { Readable } from "node:stream";

/**
 * Dev only: serves POST /api/chat from api/chat.ts on the Vite dev server, so the assistant can be
 * tried locally without the Vercel CLI. Reads GOOGLE_GENERATIVE_AI_API_KEY (and the other chat
 * variables) from .env.local into the server process; none of them reach the browser bundle,
 * which only sees VITE_-prefixed variables.
 */
export const chatApi = (): Plugin => ({
  name: "chat-api",
  apply: "serve",
  configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.root, "");
    for (const key of [
      "GOOGLE_GENERATIVE_AI_API_KEY",
      "GEMINI_MODEL",
      "GEMINI_FALLBACK_MODELS",
      "CHAT_ALLOWED_ORIGINS",
      "CHAT_RATE_LIMIT_PER_MINUTE",
      "CHAT_RATE_LIMIT_PER_HOUR",
      "CHAT_MAX_MESSAGE_LENGTH",
      "CHAT_MAX_OUTPUT_TOKENS",
      "GEMINI_FIRST_TOKEN_TIMEOUT_MS",
    ]) {
      if (env[key] && !process.env[key]) process.env[key] = env[key];
    }

    server.middlewares.use("/api/chat", async (req, res, next) => {
      // The dev server listens on the whole network (server.host); the chat uses the developer's
      // own Gemini key, so only this machine may call it
      const from = req.socket.remoteAddress ?? "";
      if (!/^(127\.|::1$|::ffff:127\.)/.test(from)) {
        res.statusCode = 403;
        res.end("The dev chat endpoint only answers this machine.");
        return;
      }
      try {
        const mod = (await server.ssrLoadModule("/api/chat.ts")) as {
          POST: (r: Request) => Promise<Response>;
          OPTIONS: (r: Request) => Response;
        };
        const method = req.method ?? "GET";
        if (method !== "POST" && method !== "OPTIONS") {
          res.statusCode = 405;
          res.end();
          return;
        }
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const controller = new AbortController();
        res.on("close", () => controller.abort());
        const request = new Request(`http://${req.headers.host}/api/chat`, {
          method,
          headers: req.headers as Record<string, string>,
          body: method === "POST" ? Buffer.concat(chunks) : undefined,
          signal: controller.signal,
        });
        const response = method === "POST" ? await mod.POST(request) : mod.OPTIONS(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        if (!response.body) {
          res.end();
          return;
        }
        Readable.fromWeb(response.body as import("node:stream/web").ReadableStream).pipe(res);
      } catch (error) {
        next(error);
      }
    });
  },
});
