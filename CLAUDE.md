# sethbrasile.com

Personal portfolio site for Seth Brasile (designer / developer).

> **STATUS: pre-transform.** The repo currently holds only the designer's source
> (`designer-src/`) plus the prep config below. The site itself does not exist
> yet — it gets built by running the **`brochure-site-transform`** skill, which
> converts `designer-src/` into a production Astro static site on Cloudflare
> Pages. Sections tagged **(post-transform)** are placeholders the skill fills in
> as it runs. When the transform completes, this STATUS banner should be removed
> and the (post-transform) sections populated with the real stack/commands/map.

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

## Stack (post-transform)

_Filled in by the skill. Expected: Astro, `@astrojs/react`, `@astrojs/tailwind`,
`@astrojs/sitemap`, Cloudflare Pages + Functions._

## Commands (post-transform)

_Filled in by the skill (e.g. `npm run dev`, `npm run build`, `npm run preview`,
Playwright test command)._

## Repo map (post-transform)

_Filled in by the skill — `src/pages`, `src/layouts/BaseLayout.astro`,
`src/components`, `functions/api/contact.ts`, `public/_headers`, etc._

## Forms (post-transform)

_Contact form → Cloudflare Pages Function with Turnstile + server-side Zod +
Resend delivery (n8n fallback). Document env vars in `.env.example`._

---

## Tech debt

_(none yet — log skipped scale-ups here)_

## Open questions

_(Phase 6.5 logs accidental-vs-intentional visual deltas here)_

## Dismissed

_(log one-liners + date when a suggestion is declined; don't re-ask until scope shifts)_
