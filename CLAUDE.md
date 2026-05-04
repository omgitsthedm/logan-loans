# Logan Loans — CLAUDE.md

## Client Config

- **Client:** Logan Sullivan, Mortgage Advisor
- **Company:** Forward Loans, LLC
- **Site URL:** https://www.logan.loans
- **Primary Email:** logan@forward.loans
- **Phone:** (480) 803-7763
- **NMLS (Logan):** 2466872
- **NMLS (Forward Loans):** 2006640
- **NMLS Profile:** https://forward.loans/loan-officer/logan-sullivan/
- **Hours:** Mon–Fri 9am–6pm, Sat 10am–4pm
- **Address:** 11201 N Tatum Blvd #300, Phoenix, AZ 85028
- **License:** AZ, Southern California

## Brand Palette

```css
--bg:       #FBF7EF   /* warm cream — page background */
--surface:  #FFFFFF   /* card/panel backgrounds */
--ink:      #1F2933   /* body text */
--muted:    #52616B   /* secondary text */
--primary:  #165A3F   /* forest green — main brand color */
--sage:     #CFE7D7   /* light sage — accents, chips */
--border:   #E7E0D6   /* warm gray borders */
--apricot:  #F3B27A   /* warm apricot — accent highlights */
--mint:     #2FAF7A   /* bright mint — CTAs, success states */
```

## Typography

- **Headings:** Georgia, 'Times New Roman', serif
- **Body:** system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Body size: 19px, line-height 1.7
- H1: clamp(36px, 5vw, 60px)
- H2: clamp(30px, 3.5vw, 46px)
- H3: clamp(24px, 2.5vw, 30px)

## Key CSS Classes

- `.wrap` — max-width 1120px centered container
- `.section` — section padding (80px desktop, 56px mobile)
- `.door` — animated entry card (hero panel)
- `.porch` — gradient CTA banner
- `.card` — standard bordered card
- `.btn.btnPrimary` — green gradient pill button
- `.btn.btnSecondary` — white/green outlined pill button
- `.kicker` — uppercase category label
- `.threshold` — animated divider line (IntersectionObserver reveal)
- `data-observe` — triggers `.is-visible` on section scroll-in
- `.grid3` / `.grid4` — responsive column grids
- `.desktopOnly` / `.mobileOnly` — responsive visibility

## Social Links

- Instagram: https://www.instagram.com/logan.loans
- LinkedIn: https://www.linkedin.com/in/logansulliv
- Linktree: https://linktr.ee/Logan.loans
- Google Reviews: https://www.google.com/search?q=Logan+Sullivan+Mortgage+Advisor

## Pages Inventory

| File | Purpose |
|------|---------|
| index.html | Homepage — answer-in-5-seconds funnel |
| programs.html | Loan product catalog |
| apply.html | Pre-approval form (primary conversion) |
| contact.html | General contact + intake form |
| about.html → meet-logan.html | Founder story |
| faq.html | FAQ with FAQPage schema |
| blog.html | Content hub |
| funded-deals.html | Deal showcase / social proof |
| partners.html | Broker & referral partner page |
| press.html | Media kit & press page |
| how-it-works.html | Process explainer |
| first-time-buyer.html | First-time buyer guide |
| refinance.html | Refinance product |
| investor-loans.html | Investor/DSCR loans |
| relocation.html | Relocation loans |
| service-areas.html | Service area hub |
| premium-markets.html | Luxury markets hub |
| thanks.html | Post-conversion (apply) |
| thanks-contact.html | Post-conversion (contact) |
| privacy.html | Privacy policy |
| disclosures.html | Regulatory disclosures |
| terms.html | Terms of service |
| 404.html | Branded 404 |
| City pages | arcadia-biltmore, arizona, beverly-hills, catalina-foothills, flagstaff, la-jolla-del-mar, malibu, newport-corona, north-phoenix, north-scottsdale, palisades-brentwood, paradise-valley, santa-monica, sedona, southern-california |

## Netlify

- **Site name:** loganloans
- **Site URL:** https://logan.loans
- **Netlify ID:** a9776112-531e-4ca2-ba17-9338b8eef423
- **Team:** Little Fight NYC
- **Form notification:** logan@forward.loans (via Netlify webhooks)

## Form Names (must match `<form name>` and hidden `<input name="form-name">`)

| Form | name attribute | form-name value |
|------|---------------|-----------------|
| Pre-approval (contact.html) | preapproval | preapproval |
| General contact (contact.html) | general-contact | general-contact |
| Apply form (apply.html) | apply | apply |

## Tracking (pending client input)

- GA4 Measurement ID: **NEEDED from Logan** (format: G-XXXXXXXXXX)
- GTM Container ID: **NEEDED from Logan** (format: GTM-XXXXXXX)
- Google Ads Conversion IDs: **NEEDED from Logan**
- Once received, replace placeholders in `<head>` of all pages

## Performance Targets

- Mobile: 85+ / Desktop: 99-100 / A11y: 100 / SEO: 100 / Best Practices: 100

## Critical Bug Guards (learned from Grand Funding)

1. **Never let JS click handlers match `[type="submit"]` or `closest("form")`** — kills all form submissions
2. **`form-name` hidden input MUST match `<form name>`** — Netlify uses this to route
3. **Counters MUST read `data-to` attribute** — never parse textContent
4. **Always pair `-webkit-backdrop-filter` with `backdrop-filter`**
5. **`.reveal` elements default to opacity:1** — JS adds class to activate animation hiding
6. **LCP image MUST have `fetchpriority="high"` + `loading="eager"`**

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-03-01 | Static HTML/CSS/JS, no build step | Max performance, zero build complexity, Netlify-native |
| 2026-03-01 | System fonts (no self-hosted) | Eliminates FOUT, reduces bytes, matches device aesthetics |
| 2026-03-01 | BankingBridge rate calculator embedded | Logan's existing partner, pre-authorized |
| 2026-03-01 | Cream (#FBF7EF) background, not white | Warmer feel, lower eye strain, differentiates from sterile bank sites |
| 2026-05-03 | Full schema stack added | All 3 audited competitors have thin/no schema — competitive SEO advantage |
| 2026-05-03 | netlify.toml security headers | Site had zero headers — F on security scan, now A+ |
| 2026-05-03 | llms.txt added | Zero competitors have AI search optimization |
| 2026-05-03 | UTM capture to sessionStorage | Enables Google Ads attribution once IDs provided by Logan |
| 2026-05-03 | partners.html built | Broker/agent referral page with Netlify form (name=partner-referral), 6 value props, 3-step process, 3 FAQ, all 8 UTM inputs, BreadcrumbList+FAQPage schema |
| 2026-05-03 | press.html built | Media kit page with Person schema, two-column bio+photo layout, expertise chip grid, pull quote, 3 coverage placeholder cards |
| 2026-05-03 | terms.html built | Legal prose page, max-width 780px centered, 10 sections dated 2026-05-01, Equal Housing statement, BreadcrumbList schema |
| 2026-05-03 | OG image fixed site-wide | og-image.jpg → /assets/img/logan-main.webp across all 32 pages |
| 2026-05-03 | Nav CTAs fixed site-wide | contact.html#intake → apply.html across all pages |
| 2026-05-03 | BreadcrumbList added to 9 pages | programs, first-time-buyer, refinance, investor-loans, relocation, premium-markets, how-it-works, faq, meet-logan |
| 2026-05-04 | Homepage full redesign | Dark forest green hero, Logan photo above fold, real review cards, numbered path cards, dark split bio panel, zero emojis. Beats cream-on-cream monotony of competitors. |
| 2026-05-04 | .door.heroDark specificity fix | styles.css .door (specificity 010) was overriding .heroDark (010). Fixed with .door.heroDark (020). |
