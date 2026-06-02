import { defineConfig, devices } from "@playwright/test";

/**
 * Phase 6 testing config.
 *
 * Tests run against the PRODUCTION PREVIEW build (`astro build && astro preview`),
 * NOT the dev server — Astro's dev toolbar injects DOM artifacts that break asserts
 * and dev never exercises the real bundled scripts.
 *
 * `reuseExistingServer: !CI` lets a locally-running `npm run preview` be reused
 * (fast iteration); CI always does a clean build + preview.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    // Unique port — 4321 is Astro's default and collides with other local projects'
    // preview servers (reuseExistingServer would then test the wrong site).
    baseURL: "http://localhost:4399",
    // Deterministic default theme — the no-FOUC script honors prefers-color-scheme.
    colorScheme: "light",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: {
    command: "npm run build && npm run preview -- --port 4399",
    url: "http://localhost:4399",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
