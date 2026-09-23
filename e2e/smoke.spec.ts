import { expect, test, type Page } from "@playwright/test";

/** Fails the test on any uncaught error in the page. */
const trackPageErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
};

test("home page renders the splash screen, then the site", async ({ page }) => {
  const errors = trackPageErrors(page);
  await page.goto("./");

  // Protected splash screen (see CLAUDE.md) shows first and ends on the name
  await expect(page.getByTestId("splash-screen")).toBeVisible();
  await expect(page.getByTestId("splash-screen")).toBeHidden({ timeout: 6_000 });

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Useful AI");
  await expect(page.locator("#app-shell-loader")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("case studies and the maker-checker demo work", async ({ page }) => {
  const errors = trackPageErrors(page);
  await page.goto("./");
  await expect(page.getByTestId("splash-screen")).toBeHidden({ timeout: 6_000 });

  // Sections mount lazily as they near the viewport, so bring Work into view first
  await page.locator("#work").first().scrollIntoViewIfNeeded();
  const submit = page.getByRole("button", { name: "Submit transfer" });
  await expect(submit).toBeAttached({ timeout: 15_000 });
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  await page.getByRole("button", { name: "Approve own request" }).click();
  await expect(page.getByText("Blocked. The maker cannot approve their own request.")).toBeVisible();
  expect(errors).toEqual([]);
});

test("project detail route renders", async ({ page }) => {
  const errors = trackPageErrors(page);
  await page.goto("./#/project/Portfolio");
  // Live GitHub, the build-time snapshot, or a clear "not responding" message — never a blank page
  await expect(
    page
      .getByRole("button", { name: "Back to projects" })
      .or(page.getByRole("heading", { name: "GitHub isn't responding right now" })),
  ).toBeVisible({ timeout: 15_000 });
  expect(errors).toEqual([]);
});

test("unknown routes show the 404 page", async ({ page }) => {
  await page.goto("./#/definitely-not-a-page");
  await expect(page.getByText("404").first()).toBeVisible();
});

test("quick menu opens with the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard shortcuts are desktop-only");
  await page.goto("./");
  await expect(page.getByTestId("splash-screen")).toBeHidden({ timeout: 6_000 });
  await page.keyboard.press("ControlOrMeta+k");
  await expect(page.getByRole("dialog", { name: "Quick menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Quick menu" })).toHaveCount(0);
});
