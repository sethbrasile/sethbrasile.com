import { test, expect } from "@playwright/test";

test.describe("Work page lens filter", () => {
  test("filters project cards by tag", async ({ page }) => {
    await page.goto("/work");
    const cards = page.locator(".project-card");

    // "All" pressed by default → 8 cards.
    await expect(cards).toHaveCount(8);
    await expect(page.locator(".project-card:visible")).toHaveCount(8);

    await page.locator('.lens-btn[data-lens="it"]').click();
    await expect(page.locator(".project-card:visible")).toHaveCount(4);
    await expect(page.locator('.lens-btn[data-lens="it"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('.lens-btn[data-lens="all"]')).toHaveAttribute("aria-pressed", "false");

    await page.locator('.lens-btn[data-lens="leader"]').click();
    await expect(page.locator(".project-card:visible")).toHaveCount(1);

    await page.locator('.lens-btn[data-lens="all"]').click();
    await expect(page.locator(".project-card:visible")).toHaveCount(8);
  });
});

test.describe("CV page lens filter", () => {
  const cfi = ".cv-role:has-text('Community First Investments')";
  const security = ".skill-group:has-text('Security / Compliance')";

  test("filters roles, highlights, and skill groups by lens", async ({ page }) => {
    await page.goto("/cv");

    // All → leadership-only role and IT-only skill group both visible.
    await expect(page.locator(cfi)).toBeVisible();
    await expect(page.locator(security)).toBeVisible();

    // Developer lens hides the leadership-only role and the security skill group.
    await page.locator('.lens-btn[data-lens="dev"]').click();
    await expect(page.locator(cfi)).toBeHidden();
    await expect(page.locator(security)).toBeHidden();

    // Leadership lens brings the leadership role back.
    await page.locator('.lens-btn[data-lens="leader"]').click();
    await expect(page.locator(cfi)).toBeVisible();

    // IT/Security lens brings the security skill group back.
    await page.locator('.lens-btn[data-lens="it"]').click();
    await expect(page.locator(security)).toBeVisible();
  });
});
