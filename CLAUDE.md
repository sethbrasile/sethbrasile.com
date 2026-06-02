# sethbrasile.com

Personal portfolio site for Seth Brasile (designer / developer).

> **STATUS: transform in progress — built + tested locally, not yet deployed.** The
> Astro site is scaffolded from `designer-src/` (Phases 3–5 done; full build green) and
> the Phase 6 Playwright suite passes (28/28, e2e + axe a11y). Remaining: Phase 6.5
> recreation review, Phase 7 audits, and Phase 2/8 deploy (GitHub repo + Cloudflare
> Pages). Progress tracked in `.transform-state.json`.

---

## Current state (post-pivot)

- This repo was pivoted off an abandoned Next.js + Tina starter. That tree was
  deleted from the working copy; **git history is preserved** (commit `f81afce`).
- `designer-src/` contains the designer's source, flattened from
  `Portfolio-Builder/` in the delivered zip. The zip's own nested `.git/` was
  intentionally dropped — this repo's history is the only history we keep.
- No Astro project, no `package.json` at root, no build yet.

## The plan: brochure-site-transform → Astro

Run the `brochure-site-transform` skill (multi-session pipeline). Target stack:
**Astro + React islands + Tailwind + Cloudflare Pages/Functions**. The skill
handles discovery → infra → strip/scaffold/harden → forms → content review →
testing → recreation review → audits → deploy.

The skill's invocation gate applies — it will not auto-launch. When invoked it
will detect `designer-src/` already present (skipping the Downloads asset hunt)
and treat this directory as the project root.

## designer-src is a monorepo — the brochure frontend is one package

`designer-src/` is **not** a plain React SPA. It is a pnpm-workspace monorepo
(Node 24, TS 5.9) that a Replit agent generated, containing a full backend the
static portfolio does **not** need:

| Path | What it is | Transform disposition |
|------|------------|-----------------------|
| `designer-src/artifacts/sethbrasile/` | **The brochure frontend** — Vite + React 19, shadcn/ui (radix), Tailwind 4, framer-motion, wouter router, react-helmet-async, react-hook-form, react-query | **This is the source to transform.** Pages: Home, Work, CV, Contact, 404. |
| `designer-src/artifacts/api-server/` | Express 5 API | Discard — static site, no server |
| `designer-src/artifacts/mockup-sandbox/` | Scratch mockups | Discard unless a section is needed |
| `designer-src/lib/{db,api-spec,api-zod,api-client-react}/` | Postgres/Drizzle, OpenAPI, Orval client | Discard — no DB, no API client |
| `designer-src/scripts/` | Workspace tooling | Discard |
| `designer-src/attached_assets/` | Designer's raw assets (~32K) | Mine for logo / images |
| `designer-src/.local/` | pnpm store cache (~428M) | **gitignored** (regenerable) |

**Phase 3 (Strip) implication:** strip down to `artifacts/sethbrasile`. The
contact form currently talks to the Express API via `@workspace/api-client-react`;
in Astro it gets replaced by a Cloudflare Pages Function (see Forms below).
Routing moves from wouter to Astro file-based pages. `react-helmet-async` head
management is replaced by Astro's native `<head>` per page.

---

## Skill-parameter decisions (read before running the skill)

The skill **leans toward a local-service-area business** (roofer/HVAC/restoration:
LocalBusiness schema, geo coordinates, NAP, multi-city pages, "service + city"
alt text). **This is a personal portfolio — override those defaults:**

| Skill default (local service biz) | Override for this portfolio |
|------------------------------------|-----------------------------|
| **Step 3.10 JSON-LD `LocalBusiness`** with `@id` + `geo`/`GeoCoordinates` | Use **`Person`** schema (optionally `WebSite` + `ProfessionalService`). No `geo`/`GeoCoordinates` required. |
| `geo.placename` / `geo.region` meta as layout props | **Omit** — not a geographic business. |
| Footer **NAP** (Name, Address, Phone) + service-area city list | **No street address** (personal privacy). Name + email/contact-form + social links. Phone only if Seth explicitly wants it public. |
| **Phase 5.5 Local Service Pages** (multi-city) | **Skip** — single person, not multi-city. |
| Phase 1.2 service area / cities list | **N/A** |
| Alt text = "service + city" keywords | Use **project / role / skill** keywords for portfolio + CV images. |

**Confirmed decisions:**

- **Form routing (Phase 1.8): Resend → email, NO GHL/CRM.** Standard PPMC
  no-CRM setup = skill **Variant A** (Resend primary + n8n fallback). The
  designer over-built a backend (Express + Postgres) — **ignore/discard it
  entirely**; we use our standard CF Pages Function + Resend instead. → **Phase
  8.5 Form UAT** (GHL+n8n / non-email stacks) is **skipped** (email-only form).

**Decisions to confirm with Seth at the skill's Phase 1 (defaults noted):**

- **Domain:** `sethbrasile.com` (assumed from repo name — confirm).
- **Analytics (Phase 1.12):** **Cloudflare Web Analytics** (skill default — no
  cookie banner needed).
- **Legal pages (Phase 5):** a personal portfolio may not need full privacy/
  terms pages. Confirm; add a light privacy note only if the contact form
  collects/stores data.
- **Match the designer:** **Yes — recreate faithfully.** This is Seth's own
  design. **Do NOT** mark this project "do not match designer." Phase 6.5
  (Designer Recreation Review) **should run** and compare against
  `designer-src/artifacts/sethbrasile`. The local→portfolio swaps above are
  content/SEO changes, not visual ones.

**Astro Gotcha that will bite here:** the frontend uses **framer-motion**. The
skill bans framer-motion for content sections (it sets `opacity:0` until JS +
in-view, invisible to crawlers and broken under CSP). Convert content sections
to static `.astro` with CSS `@keyframes`; keep React islands only for genuinely
interactive bits (contact form, mobile menu).

## Git tracking of designer-src

**Decision: `designer-src/` is tracked in git** (the skill requires it — Phase
6.5 recreation review reads it). Exception: `designer-src/.local/` (428M pnpm
store cache, regenerable) is gitignored. No file exceeds 100MB, so **Git LFS is
not needed**. See `.gitignore`.

---

## Stack

- **Astro 5** static output, **zero JS framework** — no React island runtime.
  Dropped `@astrojs/react` deliberately; all interactivity is vanilla JS in
  `<script>` tags (theme toggle, mobile menu, Work/CV lens filters, contact form).
- **Tailwind v4** via `@tailwindcss/vite` (not `@astrojs/tailwind`) — matches the
  designer's stack. Theme in `src/styles/global.css` (`@theme` + HSL CSS vars).
- **Fonts:** `@fontsource` self-hosted — Syne (display), Inter (sans), Space Mono (mono).
- **Icons:** `astro-icon` + `@iconify-json/lucide` (zero-JS inline SVG).
- **Sitemap:** `@astrojs/sitemap` (needs `site` in `astro.config.mjs` — set).
- **Hosting:** Cloudflare Pages (static) + Pages Functions (`/functions/api/contact.ts`).

## Commands

- `npm run dev` — Astro dev server (localhost:4321)
- `npm run build` — `astro check` (typecheck) + `astro build` → `dist/`
- `npm run preview` — serve the production build locally
- `npm test` — Playwright e2e + axe a11y against the preview build (Phase 6). Runs
  on **port 4399** (not default 4321 — collides with other local projects' previews).
  `npm run test:ui` for the UI runner, `npm run test:report` for the last HTML report.
  Specs in `tests/e2e/`. Tests build+preview automatically (`reuseExistingServer: !CI`,
  never the dev server — toolbar artifacts break asserts).

## Repo map

- `src/pages/` — `index`, `work`, `cv`, `contact`, `privacy`, `404` (`.astro`)
- `src/layouts/BaseLayout.astro` — head/meta/OG, Person JSON-LD (`@id`, no geo),
  skip-nav, no-FOUC theme script, font imports; `<slot name="head">` for per-page schema
- `src/components/` — `Navigation.astro` (active link + mobile menu + theme toggle),
  `Footer.astro` (socials + privacy link)
- `src/styles/global.css` — Tailwind v4 entry + theme + `.animate-fade-up` keyframes
- `functions/api/contact.ts` — contact Pages Function (own `functions/tsconfig.json`,
  excluded from root `astro check`)
- `public/` — `favicon.svg`, `opengraph.jpg`, `robots.txt`, `_headers` (CSP + cache)
- `designer-src/artifacts/sethbrasile/` — original React source (kept for recreation review)

## Forms

Contact form → `POST /api/contact` (CF Pages Function), **Variant A**: Turnstile
verify (fail-secure) → Zod → **Resend** to seth@tenorcreative.com (primary) →
**n8n** HMAC-signed fallback via `waitUntil` (optimistic success). Env documented in
`.env.example`; secrets live in the Pages dashboard. Turnstile site key defaults to
CF's always-pass TEST key until `PUBLIC_TURNSTILE_SITE_KEY` is set in prod.

---

## Tech debt

- `@fontsource` emits 22 woff2 subsets (all languages). Unicode-range gated → no
  load penalty, but could trim to latin-only to declutter `dist/`.
- 6 moderate npm advisories (transitive dev tooling) — audit/resolve in Phase 7.
- Résumé PDF (`public/Seth_Brasile_Resume.pdf`) not yet provided — CV download
  button 404s until Seth drops the file.
- n8n fallback for the contact form is coded but unconfigured (`N8N_WEBHOOK_URL`
  unset) — Resend-only until set up at deploy.

## Intentional deviations from designer-src (Phase 6.5 input — NOT drift)

These are deliberate changes from `designer-src/artifacts/sethbrasile`, made in Phase 6
to satisfy WCAG AA. The designer-recreation-review should treat them as intentional:

- **`--muted-foreground` darkened 46.1% → 42%** (light mode only, `global.css`). The
  shadcn default rendered #73737c, failing 4.5:1 contrast on the page bg (4.49) and the
  CV's translucent sticky filter bar (4.2). 42% clears AA everywhere. Visually a hair
  darker muted gray; dark mode unchanged.
- **Home `byteMyCache` inline link now has a persistent underline** (was `hover:underline`).
  axe `link-in-text-block` — in-prose links must be distinguishable without color.
- **CV "Open to opportunities" email/PDF button row got `flex-wrap`** — was overflowing
  the viewport by 9px at 390px; now wraps.

## Open questions

- **Phase 6.5 recreation review (2026-06-02): ZERO accidental drift.** Compared all 4
  pages × 2 viewports (1440/390) against `designer-src/artifacts/sethbrasile` booted on
  :5173. Every delta was intentional + documented (theme toggle, Turnstile, Privacy
  link/page, the 3 WCAG fixes above). No client assets needed — designer is text-forward
  (no stock photos/avatars/heroes to source). No open questions raised.
- To re-run the visual diff: `node scripts/shot.mjs` (boot designer per the notes in
  `.transform-state.json`'s `recreationReview` block first).

## Dismissed

_(log one-liners + date when a suggestion is declined; don't re-ask until scope shifts)_
