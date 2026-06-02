import { test, expect, type Page } from "@playwright/test";

/**
 * The contact form is the only JS-heavy island: client-side Zod validation, then a
 * Turnstile token gate, then POST /api/contact. We make tests deterministic by:
 *   - blocking the external Turnstile script (no network dep, token never auto-fills)
 *   - injecting a fake cf-turnstile-response when a happy path needs a token
 *   - intercepting /api/contact (the real Pages Function isn't running under preview)
 */

async function blockTurnstile(page: Page) {
  await page.route("**challenges.cloudflare.com/**", (r) => r.abort());
}

async function injectToken(page: Page) {
  await page.evaluate(() => {
    const form = document.getElementById("contact-form")!;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "cf-turnstile-response";
    input.value = "test-token";
    form.appendChild(input);
  });
}

test.beforeEach(async ({ page }) => {
  await blockTurnstile(page);
});

test("client-side validation: empty form shows field errors", async ({ page }) => {
  await page.goto("/contact");
  await page.locator("#submit-btn").click();

  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#subject-error")).toBeVisible();
  await expect(page.locator("#message-error")).toBeVisible();
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
});

test("client-side validation: invalid email is flagged in isolation", async ({ page }) => {
  await page.goto("/contact");
  await page.fill("#name", "Jane Doe");
  await page.fill("#email", "not-an-email");
  await page.fill("#subject", "Project");
  await page.fill("#message", "This is a sufficiently long message.");
  await page.locator("#submit-btn").click();

  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#name-error")).toBeHidden();
  await expect(page.locator("#subject-error")).toBeHidden();
  await expect(page.locator("#message-error")).toBeHidden();
});

test("valid form without anti-bot token is blocked before any POST", async ({ page }) => {
  let posted = false;
  await page.route("**/api/contact", (r) => {
    posted = true;
    return r.fulfill({ status: 200, body: "{}" });
  });

  await page.goto("/contact");
  await page.fill("#name", "Jane Doe");
  await page.fill("#email", "jane@example.com");
  await page.fill("#subject", "Project");
  await page.fill("#message", "This is a sufficiently long message.");
  await page.locator("#submit-btn").click();

  await expect(page.locator("#form-status")).toContainText(/anti-bot/i);
  expect(posted).toBe(false);
});

test("happy path: POSTs payload and shows success", async ({ page }) => {
  let payload: any = null;
  await page.route("**/api/contact", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/contact");
  await page.fill("#name", "Jane Doe");
  await page.fill("#email", "jane@example.com");
  await page.fill("#subject", "Need a thing built");
  await page.fill("#message", "Details about the project and timeline.");
  await injectToken(page);
  await page.locator("#submit-btn").click();

  await expect(page.locator("#form-status")).toContainText(/on its way/i);
  await expect(page.locator("#name")).toHaveValue(""); // form.reset()
  expect(payload).toMatchObject({
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "Need a thing built",
    "cf-turnstile-response": "test-token",
  });
});

test("server error path: surfaces the error message", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Delivery failed. Email seth.brasile@gmail.com directly." }),
    }),
  );

  await page.goto("/contact");
  await page.fill("#name", "Jane Doe");
  await page.fill("#email", "jane@example.com");
  await page.fill("#subject", "Need a thing built");
  await page.fill("#message", "Details about the project and timeline.");
  await injectToken(page);
  await page.locator("#submit-btn").click();

  await expect(page.locator("#form-status")).toContainText(/Delivery failed/i);
});
