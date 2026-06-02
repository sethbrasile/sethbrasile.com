import { test, expect } from "@playwright/test";

// Mobile menu only exists below the md breakpoint (768px).
test.use({ viewport: { width: 390, height: 844 } });

test("mobile menu opens, swaps icons, and Escape closes", async ({ page }) => {
  await page.goto("/");
  const btn = page.locator("#mobile-menu-toggle");
  const menu = page.locator("#mobile-menu");

  await expect(btn).toBeVisible();
  await expect(menu).toBeHidden();
  await expect(btn).toHaveAttribute("aria-expanded", "false");

  await btn.click();
  await expect(menu).toBeVisible();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#menu-icon")).toBeHidden();
  await expect(page.locator("#close-icon")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(btn).toHaveAttribute("aria-expanded", "false");
});

test("desktop nav is hidden at mobile width", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#theme-toggle")).toBeHidden();
  await expect(page.locator("#theme-toggle-mobile")).toBeVisible();
});
