import { expect, test, type Page } from "@playwright/test";

/** Sections mount lazily as they near the viewport: scroll down in steps until the page stops growing. */
const mountAllSections = async (page: Page) => {
  let previous = 0;
  for (let step = 0; step < 40; step++) {
    const height = await page.evaluate<number>("document.body.scrollHeight");
    if (height === previous) break;
    previous = height;
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(400);
  }
};

/** Puts the section's top well above the reading line (45-50% of the viewport height).
 *  (String expressions: the e2e tsconfig has no DOM lib.) */
const scrollSectionToMiddle = async (page: Page, id: string) => {
  await page.evaluate(`(() => {
    const section = document.querySelector("main #${id}");
    if (!section) throw new Error("No section #${id}");
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - window.innerHeight * 0.3);
  })()`);
};

test("nav highlights the section in view", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByTestId("splash-screen")).toBeHidden({ timeout: 6_000 });

  // The pill nav (named "Site") shows the current section beside the name and lists the sections
  // in its menu sheet; the classic bar (?look=classic) lists them in the bar itself
  const menuButton = page.getByRole("navigation", { name: "Site" }).getByRole("button", { name: "Open menu" });
  const pill = await menuButton.isVisible();

  await mountAllSections(page);
  if (pill) {
    await expect(async () => {
      await scrollSectionToMiddle(page, "work");
      await expect(page.getByTestId("current-section")).toHaveText("/ Work", { timeout: 1_500 });
    }).toPass({ timeout: 15_000 });
    await menuButton.click();
    const sheet = page.getByRole("dialog", { name: "Site menu" });
    await expect(sheet.getByRole("button", { name: "Work", exact: true })).toHaveAttribute("aria-current", "location");
    await expect(sheet.locator('[aria-current="location"]')).toHaveCount(1);
    return;
  }

  const nav = page.getByRole("navigation").first();
  const workLink = nav.getByRole("button", { name: "Work", exact: true });
  test.skip(!(await workLink.isVisible()), "Desktop nav links are hidden on this viewport");
  // Late-mounting content above can shift Work after the scroll, so re-aim until it settles
  await expect(async () => {
    await scrollSectionToMiddle(page, "work");
    await expect(workLink).toHaveAttribute("aria-current", "location", { timeout: 1_500 });
  }).toPass({ timeout: 15_000 });
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
});
