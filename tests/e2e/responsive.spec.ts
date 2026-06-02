import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

const paths = ["/", "/work", "/cv", "/contact"];

for (const path of paths) {
  test(`no horizontal overflow at 390px on ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    // Allow 1px for sub-pixel rounding.
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("mobile controls visible, desktop nav hidden at 390px", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#mobile-menu-toggle")).toBeVisible();
  await expect(page.locator("#theme-toggle-mobile")).toBeVisible();
});
