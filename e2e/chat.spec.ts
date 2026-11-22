import { expect, test, type Page, type Route } from "@playwright/test";

/**
 * The "Ask AI" assistant on the production build. /api/chat is answered here, never by the real
 * function: the tests must not depend on the network, nor spend the Gemini quota. The replies
 * use the AI SDK's UI message stream format, as api/chat.ts sends it.
 */
const uiStream = (text: string) =>
  [
    { type: "start" },
    { type: "start-step" },
    { type: "text-start", id: "t" },
    { type: "text-delta", id: "t", delta: text },
    { type: "text-end", id: "t" },
    { type: "finish-step" },
    { type: "finish" },
  ]
    .map((part) => `data: ${JSON.stringify(part)}\n\n`)
    .join("") + "data: [DONE]\n\n";

const answer = (route: Route, text: string) =>
  route.fulfill({
    status: 200,
    headers: { "Content-Type": "text/event-stream", "x-vercel-ai-ui-message-stream": "v1" },
    body: uiStream(text),
  });

const openChat = async (page: Page) => {
  await page.goto("./");
  await expect(page.getByTestId("splash-screen")).toBeHidden({ timeout: 6_000 });
  const launcher = page.getByRole("button", { name: "Ask AI about Achyuth" });
  await expect(launcher).toBeVisible();
  await launcher.click();
  const panel = page.getByRole("dialog", { name: /AI assistant/ });
  await expect(panel).toBeVisible();
  return { launcher, panel };
};

test("Ask AI streams an answer whose links jump to the page, and closes with Escape", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    answer(route, "Achyuth is a **Software Engineer**. See his [Experience](section:experience)."),
  );
  const { launcher, panel } = await openChat(page);

  await expect(panel.getByRole("textbox", { name: /Ask about/ })).toBeFocused();
  const suggestions = panel.getByRole("list", { name: "Suggested questions" }).getByRole("button");
  await expect(suggestions).toHaveCount(5);

  await suggestions.first().click();
  await expect(panel.getByText("Tell me about Achyuth.")).toBeVisible();
  await expect(panel.getByText("Software Engineer", { exact: true })).toBeVisible();
  await expect(panel.getByRole("button", { name: "Experience" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();
});

test("Ask AI shows the server's error with a retry that recovers", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/chat", (route) => {
    calls += 1;
    if (calls === 1) {
      return route.fulfill({
        status: 503,
        headers: { "Content-Type": "text/plain" },
        body: "The assistant isn't set up yet. Please email Achyuth instead.",
      });
    }
    return answer(route, "You can email him or use the [Contact](section:contact) section.");
  });
  const { panel } = await openChat(page);

  await panel.getByRole("textbox", { name: /Ask about/ }).fill("How can I contact him?");
  await page.keyboard.press("Enter");
  await expect(panel.getByRole("alert")).toContainText("isn't set up yet");

  await panel.getByRole("button", { name: /Try again/ }).click();
  await expect(panel.getByRole("alert")).toBeHidden();
  await expect(panel.getByRole("button", { name: "Contact" })).toBeVisible();
  expect(calls).toBe(2);
});
