# Claim ledger — Logan Loans (SEO surfaces)

Evidence packet: `SOURCE_OF_TRUTH.md` (verified 2026-09-28) + facts already
published on `https://logan.loans`.
No regulated license/rate/eligibility/disclosure copy was reworded (hard rule).

## Approved fact

- NAP phone `(480) 803-7763` — 450 occurrences site-wide + `llms.txt`.
  (`(480) 000-0000` / `(480) 555-0100` are form input placeholders only.)
- NAP email `logan@forward.loans` — site-wide, matches Netlify notification
  inbox per SOURCE_OF_TRUTH.md.
- Advisor identity: Logan Sullivan, Mortgage Advisor, NMLS #2466872,
  via Forward Loans, LLC, NMLS #2006640 — footer/disclosures/`llms.txt`,
  57/59 pages carry NMLS text.
- Service area "Arizona and Southern California" + named metros (Phoenix,
  Scottsdale, Paradise Valley, Beverly Hills, Newport Beach) — site copy,
  location pages, `llms.txt`.
- Product/service list (purchase, refi, jumbo, FHA, VA, DSCR, conventional,
  relocation, partner support) — site nav/pages + `llms.txt`.
- Sitemap/robots/ai-access state: 48-url sitemap already Search Console
  Success (per SOURCE_OF_TRUTH.md); robots.txt allows AI crawlers (GPTBot,
  OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-Web, anthropic-ai,
  ClaudeBot, Google-Extended, Applebot-Extended, Amazonbot, Bytespider).

## Supportable interpretation

- Benefit-led title/description wording ("Same-day pre-approval available",
  "no hand-offs") — paraphrases of long-published on-page copy; no new
  factual assertion added.
- FAQ answers in FAQPage schema (39 pages) — drawn verbatim from on-page FAQ
  content; no synthetic questions added.

## Owner decision

- NMLS/license display, rate/APR, eligibility, 2026 loan limits, disclosure
  language — on hold pending approved facts per SOURCE_OF_TRUTH.md; untouched.
- GBP: no Logan Loans listing exists (Business Profile Manager checked
  2026-09-28 per SOURCE_OF_TRUTH.md); NAP above is GBP-ready canonical.
  Reviews/local-pack remain external work.
- Rankings, index coverage, qualified traffic — not verified by this pass.
- No Spanish pages exist: hreflang N/A.

## 2026-10-08 pass (responsive QA + calibration + internal linking)

### Approved fact

- Geo tags `US-AZ` / `Phoenix, Arizona` on all 57 canonical pages —
  restates the published office city/state; no coordinates added
  (none published).
- Contact-page Google Maps + Apple Maps links for
  `11201 N Tatum Blvd #300, Phoenix, AZ 85028` — the exact
  published office string; query URLs only, no new factual claim.
- "Keep reading" blocks on the 5 blog posts — links + shortened
  labels drawn only from the site's own published post titles.
- Sitemap `<lastmod>2026-10-08</lastmod>` on the 6 touched pages;
  `llms.txt` date bumped to 2026-10-08.
- Meta pixel plumbing verified consent-gated by reading `app.js`:
  separate `ll_ads_consent === 'granted'` opt-in, GPC/webdriver
  opt-out, production-analytics-context gate, Lead/Contact event
  map with routing-labels-only params.

### Supportable interpretation

- Related-post pairings (which two siblings each post links) are an
  editorial judgment about topical closeness, not a factual claim.

### Owner decision

- See `claims/OWNER-ACTIONS.md`: GBP create/claim, Apple Business
  Connect claim, review solicitation, Search Console recrawl check.
  Regulated copy still on hold, untouched.

### Responsive QA (this pass)

- 8 key pages x 1440/768/390 in headless Chrome, screenshots in
  `/tmp/logan-qa/` (24 + menu-open). Zero horizontal overflow,
  zero page errors, mobile menu opens/closes cleanly. Small
  tap-target hits were inline text links only (WCAG inline
  exception) — no breakage fixed because none found.

## SEO mechanics verified (this pass, uncommitted tree)

- All indexable pages: unique title, meta description, canonical, OG/twitter,
  JSON-LD (Person/Organization/OfferCatalog/FAQPage where apt, speakable on
  key pages). Only 404, Google-verification, and noindex thanks pages lack
  full meta — correct.
- `sitemap.xml`: 48 urls, all resolve to real files.
- NOTE: tree carries unrelated uncommitted ads/Meta-Pixel work (app.js,
  docs/ADS.md, theme-color/og:site_name additions); verified present, left
  untouched — not part of this SEO pass.
