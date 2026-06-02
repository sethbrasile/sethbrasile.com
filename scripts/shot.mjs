#!/usr/bin/env node
// Phase 6.5 recreation-review screenshot capture. Uses the project's own
// @playwright/test chromium. Output: /tmp/shots/<side>-<page>-<width>.png
//
//   CURRENT_URL=http://localhost:4323 DESIGNER_URL=http://localhost:5173 node scripts/shot.mjs

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = "/tmp/shots";
const CURRENT_URL = process.env.CURRENT_URL || "http://localhost:4323";
const DESIGNER_URL = process.env.DESIGNER_URL || "http://localhost:5173";

const PAGES = [
  { name: "home", path: "/" },
  { name: "work", path: "/work" },
  { name: "cv", path: "/cv" },
  { name: "contact", path: "/contact" },
];

const WIDTHS = [1440, 390];

async function shoot(browser, baseUrl, pagePath, width, outName) {
  const context = await browser.newContext({
    viewport: { width, height: width === 1440 ? 900 : 844 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce", // settle entrance animations for a stable diff
  });
  const page = await context.newPage();
  try {
    await page.goto(baseUrl + pagePath, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT_DIR, outName), fullPage: true });
    console.log(`  ok ${outName}`);
  } catch (err) {
    console.error(`  FAIL ${outName} — ${err.message}`);
  } finally {
    await context.close();
  }
}

(async () => {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  console.log(`current=${CURRENT_URL} designer=${DESIGNER_URL}`);
  for (const p of PAGES) {
    for (const w of WIDTHS) {
      await shoot(browser, CURRENT_URL, p.path, w, `current-${p.name}-${w}.png`);
      await shoot(browser, DESIGNER_URL, p.path, w, `designer-${p.name}-${w}.png`);
    }
  }
  await browser.close();
  console.log("Done.");
})();
