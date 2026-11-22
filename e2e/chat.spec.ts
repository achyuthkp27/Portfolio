import { expect, test } from "@playwright/test";

/**
 * The "Ask AI" assistant on the production build. The preview server has no chat API, so a sent
 * question must end in the friendly error with a retry, never a broken panel.
 */
test("Ask AI opens, offers questions, recovers from an unreachable API, and closes", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByTestId("splash-screen")).toBeHidden({ timeout: 6_000 });

  const launcher = page.getByRole("button", { name: "Ask AI about Achyuth" });
  await expect(launcher).toBeVisible();
  await launcher.click();

  const panel = page.getByRole("dialog", { name: /AI assistant/ });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("textbox", { name: /Ask about/ })).toBeFocused();
  const suggestions = panel.getByRole("list", { name: "Suggested questions" }).getByRole("button");
  await expect(suggestions).toHaveCount(5);

  await suggestions.first().click();
  await expect(panel.getByText("Tell me about Achyuth.")).toBeVisible();
  await expect(panel.getByRole("alert")).toBeVisible({ timeout: 10_000 });
  await expect(panel.getByRole("button", { name: /Try again/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();
});
