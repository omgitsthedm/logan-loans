# Logan Loans AI-Ops State

## Identity

- Project Code: LFNYC-LL
- Name: Logan Loans (Arizona Mortgage Advisor)
- Tier: Tier 2 · Risk: Medium (regulated mortgage + lead form)
- Canonical Path: /Users/davidmarsh/Code/LiFi NYC/Clients/Logan Loans/logan-loans
- Git-backed: yes · Remote: https://github.com/omgitsthedm/logan-loans.git · Default branch: `master`

## Current Stamp

- Updated: 2026-07-24
- Updated By: Codex
- Basis: preserve-mode design implementation, sitewide source audit, 320px browser QA, accessibility, performance, SEO/AEO, safe publishing boundary, Netlify preview, and verified production release.
- Release source commit: 764cb76

## Rules Version

- 2026-07-24-logan-safe-publish-v2

## State Confidence

- High for path/repo/branch/remote/stack/commands, Netlify project/linkage, form registry, preview artifact, and live domain.

## Current Live Truth

- Live URL and canonical: `https://logan.loans`. Netlify project `loganloans`; site id `a9776112-531e-4ca2-ba17-9338b8eef423`. `www` and the Netlify site subdomain redirect 301 to apex.
- Netlify is not Git-linked: provider/repo/production-branch/build settings are unreported/null and recent production deploys are manual. Git push and production deploy are separate release steps.
- Safe publish rail: `bash scripts/build-site.sh` creates ignored `dist/`; Netlify builds and publishes `dist`, not the repository root. Raw client media and internal operational docs are absent from the artifact and protected paths return 404.
- Production deploy: `6a645e5fbe43e385760235aa` (`state=ready`, `context=production`, published 2026-07-25T06:57:39Z). It was promoted from clean repository HEAD `0990296` and serves the CSS/JS fingerprints built from release source commit `764cb76`.
- Validated deploy preview: `6a645c8d0f70c23e5aa9cd94` (`state=ready`, `context=deploy-preview`).
- Netlify Forms registered: `apply`, `preapproval`, `general-contact`, `partner-referral`, and legacy `newsletter`. No test lead was submitted.
- Production QA status: passed. Live Lighthouse: home 99/100/100/100, apply 100/100/100/100, calculator 98/100/100/100, FAQ 100/100/100/100. Core routes, forms registry, protected paths, headers, apex redirects, FAQ search, topic-aware contact routing, reduced motion, 320px full-scroll containment, and calculator interaction were verified without submitting a real lead.

## Repo State

- `master` and `origin/master` include the preserve-mode UX/search release at `764cb76`; Git and Netlify deployment remain separate operations.
- The homepage uses first-party calculator links. The previously approved BankingBridge and Forward Loans frame origins remain in CSP for compatibility.
- Site remains static HTML/CSS/JavaScript: 58 HTML pages, shared `styles.css`/`app.js`, safe allowlisted publish script, no package manager dependency.

## Risk / Compliance

- Regulated mortgage advisor. Logan MLO NMLS #2466872; brokered under Forward Loans, LLC NMLS #2006640. Rates, APRs, license #s, lending claims, disclosures = compliance-sensitive; do not alter without David/Logan approval.
- `/apply` = real Netlify lead form; real submissions are transactional.

## QA-PENDING

- `disclosures.html` still contains client-supplied placeholder text for the AZ Mortgage Banker License and CA-DFPI License numbers. Do not invent or remove it; obtain the actual client/compliance-approved values before changing disclosure copy.
- Conforming, high-cost, FHA, and Arizona HOME Plus figures/eligibility language need a compliance-approved 2026 program-matrix correction. The release audit warns instead of guessing.
- Homepage review/testimonial provenance and funded-deal/press claims require owner approval. `funded-deals`, `press`, and five near-template California locality pages are `noindex,follow` until proof is supplied.

## Do Not Touch

- `.env`/secrets; NMLS/license/rate/APR/disclosure copy without approval.
- The forced `→ 404` redirects (keep internal docs private); CSP iframe allowlist.
- Git push or Netlify production deploy without clear, scoped confirmation from David.

## Proposed Changes / Inbox

- Obtain a compliance-approved 2026 program matrix, exact state license identifiers, approved review/deal proof, Search Console access, and Google Business Profile access.

## Next Steps Queue

- Obtain compliance-approved AZ and CA license values for the two disclosure placeholders.
- Correct regulated 2026 values in one source-wide release after approval.
- Replace quarantined proof/template pages with distinct first-party evidence before returning them to the sitemap.

## Recent Session History

- 2026-07-24: Codex completed and released the Logan Loans preserve-mode reinvention. Kept the evergreen/cream/Georgia/real-photo identity; rebuilt the homepage journey; made FAQ search and specialty-program routing functional; reduced animation and mobile friction; fixed 320px overflow, focus trapping, and table containment; normalized the apex host; added a safe `dist` build and sitewide release audit; corrected current Sedona STR guidance; and quarantined unapproved proof/doorway pages. Release source `764cb76`; final production promotion `6a645e5fbe43e385760235aa`; live Lighthouse 98–100 performance and 100 accessibility/best practices/SEO on representative routes. No real form submission.
- 2026-07-20: Codex completed a full Logan Loans code/UI/UX/design/accessibility/performance/publishing audit and implementation pass. Fixed no-JS/reduced-motion blank-content risk, mobile hero ordering, consent/mobile-CTA and drawer collisions, CTA/verdict contrast, dead anchors, Instagram accessible names, missing blog headshots, robots validity, logo crop, honeypot markup, raw-media exposure, and cache versioning across 57 customer-facing HTML documents. Structural audit: 58 HTML files, zero broken links/anchors/duplicate IDs/missing assets. Production deploy `6a5ef4b9f002f06bbb509158` is ready and byte-matches release `7a6919a`; live Lighthouse homepage 100/100/100/100, live refinance 100 accessibility/SEO. No real form submission.
- 2026-06-28: Claude onboarded Logan Loans to AI-Ops (handoff-ready). Created `.ai/{LOCK,RULES_HEADER,RULES,STATE}.md` + AGENTS pointer; prepended AI-Ops pointer to existing CLAUDE.md; added forced `/.ai/*` + `/AGENTS.md` → 404 redirects to netlify.toml (`/CLAUDE.md` already blocked). No source/content change. Static site, branch `master`.

## Next Agent Directive

Read `.ai/RULES.md` + `.ai/STATE.md` + `CLAUDE.md` first. Build with `bash scripts/build-site.sh`; publish only `dist`; treat Git push and Netlify deploy as separate actions. This is a regulated mortgage site: do not change NMLS/license/rate/APR/program/disclosure copy without approval and never submit real lead forms. Keep protected-path redirects and the CSP iframe allowlist. Do not read `.env`/secrets.

## Emergency / Bypass Notes

- No bypass for deploy/push/compliance-copy/lead-form/production mutations.
- Bypass/YOLO is only an execution accelerator for approved local setup and read-only verification.
- Emergency mode: stop, preserve evidence, smallest reversible action.
