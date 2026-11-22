# "Ask AI" chat assistant

Visitors ask about Achyuth's experience, skills, projects and contact details; answers stream
from Google Gemini (free tier) through the Vercel AI SDK, using only what the portfolio says.

| Piece                                                         | Where                                            |
| ------------------------------------------------------------- | ------------------------------------------------ |
| Floating "Ask AI" button (loads the panel on first open)      | `src/components/ChatLauncher.tsx`                |
| Chat panel: suggestions, streaming, retry, stop, clear, links | `src/components/ui/ChatPanel.tsx`                |
| Footer "Ask me anything" next to the portrait                 | `src/components/CrowdFooter.tsx`                 |
| Safe Markdown and `section:` / `project:` links               | `src/lib/chatMarkdown.tsx`                       |
| Endpoint URL, suggested questions, `openChat()`               | `src/lib/chat.ts`                                |
| `POST /api/chat`: Gemini, limits, CORS                        | `api/chat.ts` (Vercel Function)                  |
| What the assistant knows (built from `src/data`)              | `src/lib/chatKnowledge.ts` → `api/_knowledge.ts` |
| Local `/api/chat` on the Vite dev server                      | `vite/chatApi.ts`                                |

## Costs nothing

- **Gemini API**: free tier, default model `gemini-3.5-flash-lite` (measured: about 1 second to
  the first words, where the newest Flash models were overloaded on the free tier). Google uses
  free-tier prompts to improve its products.
- **Vercel**: free Hobby plan, only for the function. The site stays on GitHub Pages.
- No database or vector store: the knowledge is a text file sent with each request.

## Setup

1. **Gemini key**: create one at <https://aistudio.google.com/app/apikey>.
2. **Local**: copy `.env.example` to `.env.local`, set `GOOGLE_GENERATIVE_AI_API_KEY`, run
   `npm run dev` and open the "Ask AI" button. `.env.local` is git-ignored.
3. **Deploy the function on Vercel** (free): sign in at <https://vercel.com> with GitHub,
   **Add New → Project**, import this repository, keep the settings from `vercel.json`, and add
   these environment variables before deploying:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: your Gemini key
   - `CHAT_ALLOWED_ORIGINS`: your GitHub Pages origin, e.g. `https://achyuthkp27.github.io`

   After it deploys, `https://<project>.vercel.app/api/chat` is the endpoint.

4. **Point GitHub Pages at it**: in the GitHub repository, **Settings → Secrets and variables →
   Actions → Variables**, add `VITE_CHAT_API_URL` = `https://<project>.vercel.app/api/chat`, then
   re-run the Pages deploy (or push). The workflow passes it to the build.

Without step 4 the button still appears, and a question ends in "Couldn't reach the assistant"
with a retry, never a broken page.

## Updating what it knows

The assistant reads `api/_knowledge.ts`, generated from `src/data`. After editing anything there:

```sh
npm run chat:knowledge
```

A unit test fails if the generated file and the data disagree, so CI catches a forgotten run.

## Limits and abuse protection

All in `api/chat.ts` (`LIMITS`), and tunable with environment variables (defaults shown):

| Variable                     | Default | What it limits                   |
| ---------------------------- | ------- | -------------------------------- |
| `CHAT_RATE_LIMIT_PER_MINUTE` | 5       | Questions per visitor per minute |
| `CHAT_RATE_LIMIT_PER_HOUR`   | 30      | Questions per visitor per hour   |
| `CHAT_MAX_MESSAGE_LENGTH`    | 1000    | Characters in one question       |
| `CHAT_MAX_OUTPUT_TOKENS`     | 500     | Length of one answer             |

Fixed: the newest 12 messages per request and 24 KB per request. Only the site's own host,
localhost and `CHAT_ALLOWED_ORIGINS` may call it. The rate limit is kept in memory, so it is per
function instance: good against casual abuse, not a hard global cap. For a hard cap, set a quota on
the Gemini key in Google AI Studio. The chat panel also stops at 1,000 characters; if you change
`CHAT_MAX_MESSAGE_LENGTH`, change `MAX_CHARS` in `src/components/ui/ChatPanel.tsx` to match.

## When Gemini is busy

The newest Gemini models are often overloaded on the free tier: Google either refuses ("high demand") or
accepts and sends nothing. The function then tries the next model in `GEMINI_FALLBACK_MODELS`,
giving each `GEMINI_FIRST_TOKEN_TIMEOUT_MS` to start answering. Answers are never spliced: a model
is only swapped before it has written anything. If every model is busy, the visitor sees "The
assistant is getting a lot of questions right now" with a retry.

## Testing

- `npm run test:run`: the knowledge stays in sync with `src/data`; links and Markdown render
  safely; the API refuses bad origins, missing keys, oversized and malformed requests, rate-limits,
  trims history, and streams a reply (with the AI SDK's mock model, no key needed).
- `npm run test:e2e`: on the production build the panel opens, focuses the input, offers five
  questions, shows the error and retry when no API is reachable, closes on Escape and returns focus.
- With a key in `.env.local`: `npm run dev`, then ask the suggested questions and check answers
  against the site, follow a section link and a project link, and ask something off-topic (it
  should steer back).
