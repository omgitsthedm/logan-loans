# Logan Loans Preserve-Mode Reinvention

Release date: 2026-07-24  
Live site: https://logan.loans  
Source commit: `764cb76`  
Production deploy: `6a645d29791e1b616ae2de12`  
Validated preview: `6a645c8d0f70c23e5aa9cd94`

## Objective

Keep the recognizable Logan Loans character while reducing mobile and conversion friction, replacing generic motion with purposeful feedback, and strengthening the technical SEO/AEO foundation without inventing lending claims.

## Design decision

The existing identity remains the source of truth: evergreen `#165A3F`, warm cream `#FBF7EF`, Georgia headings, threshold/door motifs, real Logan photography, Arizona business imagery, and plain-English copy. The release uses one signature mortgage flight-path animation plus restrained hover, press, reveal, calculator, FAQ, and form feedback. Core content never depends on animation to become visible.

## Completed

- Rebuilt the homepage journey around situation, process, relationship, special programs, self-serve tools, Logan, answers, and one clear next step.
- Replaced the fragile homepage calculator iframe with direct first-party calculator access.
- Made the 52-answer FAQ library searchable and answer-first; query URLs such as `/faq?q=DSCR` open matching answers immediately.
- Reduced the apply form's initial burden while preserving every Netlify field and form contract.
- Routed HELOC and construction-program visitors directly to a topic-aware question form.
- Added a focus-trapped mobile drawer, 44px-plus controls, a compact action bar, reduced-motion safety, and 320px containment.
- Converted program lookalikes into real destinations and made article/comparison tables keyboard-scrollable.
- Normalized canonical, Open Graph, schema, sitemap, robots, and AI-manifest URLs to the apex host.
- Added `OAI-SearchBot`, corrected `Google-Extended`, removed unrelated entity links, and removed unsupported self-serving review schema.
- Added asset fingerprints and a release audit covering all 58 pages, local links/anchors, JSON-LD, canonical/index state, sitemap exactness, protected NMLS footer identifiers, and exact form fingerprints.
- Restored safe operations: only allowlisted `dist/` is published; Git push and Netlify deploy are documented as separate steps.

## Search-quality quarantine

The pages remain available by direct URL, but are `noindex,follow` and excluded from the sitemap:

- Five near-duplicate Southern California locality pages, pending distinct first-party local proof.
- `funded-deals` and `press`, pending approved deal, review, closing-time, and media claims.

The public sitemap contains 48 reviewed indexable URLs.

## Validation

- Site audit: 58 HTML pages, 48 indexable URLs, 57 shared-shell pages.
- Netlify Forms registry unchanged: `apply`, `preapproval`, `general-contact`, `partner-referral`, `newsletter`.
- Representative Axe runs: zero WCAG A/AA violations.
- Live 320px full-scroll checks: zero document overflow, hidden core content, page errors, or mobile reloads on the homepage, apply, all three calculators, partners, DSCR article, and Sedona.
- Live Lighthouse:
  - Home: 99 performance / 100 accessibility / 100 best practices / 100 SEO.
  - Apply: 100 / 100 / 100 / 100.
  - Calculator: 98 / 100 / 100 / 100.
  - FAQ: 100 / 100 / 100 / 100.
- Alternate `www` and Netlify hosts redirect 301 to apex.
- Internal operational paths return 404.
- No production form was submitted during QA.

## Compliance holds

Do not silently rewrite these items. Obtain a Forward Loans or client-approved 2026 program matrix first:

- Stale conforming, high-cost, FHA, and Arizona HOME Plus amounts or eligibility language.
- Public AZ Mortgage Banker and CA-DFPI license placeholders.
- Visible review counts, testimonial provenance, funded-deal proof, closing-time claims, and any lender/advisor terminology requiring approval.

The audit warns on the current loan-limit and license-placeholder holds. Approved values should be updated source-wide and revalidated in one release.

## Next action

Collect the compliance-approved program matrix, exact state license identifiers, approved review/deal proof, Search Console access, and Google Business Profile access. Then correct regulated facts, replace quarantined templates with distinct evidence-led pages, and submit the apex sitemap.
