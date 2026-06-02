import { test, expect } from "@playwright/test";

/** Every route renders, has exactly one <h1>, a unique title, canonical + OG meta. */
const pages = [
  { path: "/", title: /Seth Brasile/, h1: /Seth builds/ },
  { path: "/work", title: /Projects & Work/, h1: "Projects & Work" },
  { path: "/cv", title: /CV & Résumé/, h1: "CV & Résumé" },
  { path: "/contact", title: /Contact Seth Brasile/, h1: "Contact" },
  { path: "/privacy", title: /Privacy/, h1: "Privacy" },
];

for (const p of pages) {
  test(`renders ${p.path}`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status()).toBeLessThan(400);

    await expect(page).toHaveTitle(p.title);

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(p.h1);

    // SEO essentials baked in Phase 3.
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  });
}

test("404 page serves on unknown route", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  await expect(page.locator("h1")).toContainText("didn't put it back");
});

test("primary nav links navigate", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("header nav").first();

  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/work\/?$/);

  await page.locator("header nav").first().getByRole("link", { name: "CV" }).click();
  await expect(page).toHaveURL(/\/cv\/?$/);

  await page.locator("header nav").first().getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact\/?$/);
});

test("active nav link gets aria-current", async ({ page }) => {
  await page.goto("/work");
  await expect(
    page.locator('header nav').first().locator('a[aria-current="page"]'),
  ).toContainText("Work");
});
