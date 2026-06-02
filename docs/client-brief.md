# Client Brief — sethbrasile.com

Personal portfolio for **Seth Brasile** (engineer / IT-security / builder). Not a
local-service business — Person/portfolio site. Most fields below were mined
directly from `designer-src/artifacts/sethbrasile`; items marked **(confirm)** or
**(need)** await Seth.

## 1. Identity / Contact

- **Name:** Seth Brasile
- **Tagline:** "Seth builds & operates." — Engineer · IT/Security · Builder
- **Location (public):** Durant, OK — **city/region only, no street address** (privacy)
- **Email:** seth@tenorcreative.com
- **Domain:** `sethbrasile.com` **(confirm)**
- **Phone:** none published (intentional)
- **Google Business Profile:** N/A (not a local business)

## 2. Pages (from source)

| Route | Page | Notes |
|-------|------|-------|
| `/` | Home | hero, stats band, featured projects, About, "Beyond the Keyboard" |
| `/work` | Work | 8 projects, interactive "Lens" filter (All/dev/it/leader) |
| `/cv` | CV | work history (11 roles), skills, education, certs, writing; Lens filter; résumé PDF download |
| `/contact` | Contact | agency deflection card + direct contact form |
| `*` | 404 | not-found |

## 3. Brand / Design

- **Palette:** monochrome neutral (zinc), light + dark themes both defined
- **Fonts:** Syne (display), Inter (sans/body), Space Mono (mono) — currently Google
  Fonts; **self-host in Astro** (Phase 3)
- **Logo:** text wordmark `SB.` (Syne) — no image logo. `favicon.svg` exists.
- **OG image:** `public/opengraph.jpg` (117K) exists
- **Dark mode:** DECIDED — **add a real light/dark toggle** (keep both themes). Small
  island or vanilla JS + `localStorage`, no FOUC (inline pre-paint script). Dark CSS
  is NOT dead code — keep it.

## 4. Form routing (Phase 1.8) — DECIDED

- **Variant A: Resend → email, no CRM/GHL.** (Designer's Express/Postgres backend
  discarded; current form is a `mailto:` — replaced by CF Pages Function.)
- Fields: name, email, subject, message (Zod schema exists, reuse it).
- **Recipient: seth@tenorcreative.com** (DECIDED — single recipient, no cc)
- `from`: PPMC shared sending domain (`noreply@notify.pricklypearmarketingco.com`)
- n8n fallback: standard PPMC fault-tolerance layer.

## 5. Analytics (Phase 1.12)

- **Cloudflare Web Analytics** (default, no cookie banner). **(confirm)**

## 6. Social / sameAs (footer + JSON-LD)

- GitHub: https://github.com/sethbrasile
- YouTube: https://youtube.com/@byteMyCache
- LinkedIn: https://www.linkedin.com/in/sethbrasile-43a315a0
- Blog: https://bytemycache.com
- Agency: https://pricklypearmarketing.co

## 7. Structured data

- **Person** schema (site-level, in BaseLayout) — name, jobTitle, address
  (locality/region only), email, url, sameAs, knowsAbout, worksFor (PPMC).
  Add `@id` (`https://sethbrasile.com/#person`). **No `geo`/GeoCoordinates** (not
  geo-targeted). **No `geo.placename`/`geo.region` meta.**
- **ProfilePage** schema on `/cv`.
- Source already ships both — port, don't reinvent.

## 8. Assets

- Logo: text wordmark (no file needed)
- Favicon: `favicon.svg` ✓
- OG image: `opengraph.jpg` ✓
- Résumé PDF: `/Seth_Brasile_Resume.pdf` referenced on CV. DECIDED — **Seth provides
  the PDF**; wire into `public/`, keep the download button. **(need: the actual file)**
- Fonts: self-host Syne/Inter/Space Mono (Phase 3)

## 9. Copy-review flags — CONFIRMED (Phase 5, 2026-06-02)

All marketing/factual claims below confirmed accurate by Seth. No edits needed.

- **Stats band:** "12+ Years Exp", "75+ Direct Reports", "3.2k Endpoints Managed",
  "4 Regulated Industries" — all traceable to CV (casino floor 75+, DKB 2.5–3.2k
  endpoints, regulated: casino/healthcare/manufacturing/govt). Confirm.
- **"Building software since 2013" / "twelve-plus years"** — confirm.
- **BetterLife:** "built the entire platform from zero", "team of six", "profitable
  in its first year" — confirm.
- **"PCI-DSS subject-matter expert" (2 yr)**, **PrintNightmare response lead** — confirm.
- **Writing links** all point to bytemycache.com homepage, not specific posts — could
  deep-link in Phase 5 (minor).
- **"Justice For Us — White House SXSL (2016)"** — links to TechCrunch; confirm framing.

## 10. Deploy targets (Phase 2 / 8 — gather when we get there)

- **GitHub repo:** no remote yet (fresh local repo). **(need: create where? e.g.
  `github.com/sethbrasile/sethbrasile.com`)**
- **Cloudflare account:** 3 available (Setherd14@gmail / seth@tenorcreative / hostanchor).
  **(need: which hosts this — likely tenorcreative or personal)**
- Resend API key, Turnstile widget, n8n webhook — gather at Phase 4.
