import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** WCAG 2.0/2.1 A + AA automated sweep on every page (Phase 6.3). */
const paths = ["/", "/work", "/cv", "/contact", "/privacy"];

async function scan(page: Page, path: string) {
  // Block external Turnstile so /contact reaches networkidle deterministically.
  await page.route("**challenges.cloudflare.com/**", (r) => r.abort());
  // Disable entrance animations (.animate-fade-up is gated on prefers-reduced-motion:
  // no-preference) so axe measures steady-state opacity, not a mid-fade blended color.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations;
}

for (const path of paths) {
  test(`no axe violations on ${path}`, async ({ page }) => {
    const violations = await scan(page, path);
    expect(
      violations,
      violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`).join("\n"),
    ).toEqual([]);
  });
}
