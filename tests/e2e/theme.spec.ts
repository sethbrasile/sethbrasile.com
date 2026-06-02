import { test, expect } from "@playwright/test";

const html = (p: import("@playwright/test").Page) => p.locator("html");

test("theme toggle flips dark class, aria-pressed, and persists", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("#theme-toggle");

  // Default (colorScheme: light) => no dark class.
  await expect(html(page)).not.toHaveClass(/dark/);
  await expect(toggle).toHaveAttribute("aria-pressed", "false");

  await toggle.click();
  await expect(html(page)).toHaveClass(/dark/);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

  // Persist across reload via the no-FOUC inline script.
  await page.reload();
  await expect(html(page)).toHaveClass(/dark/);
  await expect(page.locator("#theme-toggle")).toHaveAttribute("aria-pressed", "true");

  // Toggle back to light.
  await page.locator("#theme-toggle").click();
  await expect(html(page)).not.toHaveClass(/dark/);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
});
