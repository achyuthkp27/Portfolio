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

  const nav = page.getByRole("navigation");
  const workLink = nav.getByRole("button", { name: "Work", exact: true });
  test.skip(!(await workLink.isVisible()), "Desktop nav links are hidden on this viewport");

  await mountAllSections(page);
  // Late-mounting content above can shift Work after the scroll, so re-aim until it settles
  await expect(async () => {
    await scrollSectionToMiddle(page, "work");
    await expect(workLink).toHaveAttribute("aria-current", "location", { timeout: 1_500 });
  }).toPass({ timeout: 15_000 });
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
});
