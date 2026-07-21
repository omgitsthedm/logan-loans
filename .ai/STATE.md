# Logan Loans AI-Ops State

## Identity

- Project Code: LFNYC-LL
- Name: Logan Loans (Arizona Mortgage Advisor)
- Tier: Tier 2 · Risk: Medium (regulated mortgage + lead form)
- Canonical Path: /Users/davidmarsh/Desktop/LiFi NYC/Clients/Logan Loans/logan-loans
- Git-backed: yes · Remote: https://github.com/omgitsthedm/logan-loans.git · Default branch: `master`

## Current Stamp

- Updated: 2026-07-20
- Updated By: Codex
- Basis: full code, accessibility, performance, responsive UI/UX, design, publishing-boundary, Netlify preview, and unpublished-state audit.
- Git HEAD before release commit: 95f922e

## Rules Version

- 2026-06-27-aiops-foundation-v1

## State Confidence

- High for path/repo/branch/remote/stack/commands, Netlify project/linkage, form registry, preview artifact, and live domain.

## Current Live Truth

- Live URL: `https://www.logan.loans` (canonical). Netlify primary `https://logan.loans`; project `loganloans`; site id `a9776112-531e-4ca2-ba17-9338b8eef423`.
- Netlify is not Git-linked: provider/repo/production-branch/build settings are unreported/null and recent production deploys are manual. Git push and production deploy are separate release steps.
- Safe publish rail: `bash scripts/build-site.sh` creates ignored `dist/`; Netlify builds and publishes `dist`, not the repository root. Raw client media and internal operational docs are absent from the artifact and protected paths return 404.
- Ready deploy preview: `6a5ef3d04c2899b3815dcc0b` (`state=ready`, `context=deploy-preview`). Homepage/CSS/JS hashes match the reviewed local files.
- Netlify Forms registered: `apply`, `preapproval`, `general-contact`, `partner-referral`, and legacy `newsletter`. No test lead was submitted.
- Production QA status: preview passed; authorized production publish and live verification remain in `QA-PENDING` until executed.

## Repo State

- Release work is on `chore/plain-language-live-confirmation-20260711`, based two commits ahead of `master`; it includes the previously unpublished plain-language agent-rule updates plus the audited site release.
- BankingBridge calculator iframes + Forward Loans homepage frame allowed in CSP (netlify.toml).
- Site remains static HTML/CSS/JavaScript: 58 HTML pages, shared `styles.css`/`app.js`, safe allowlisted publish script, no package manager dependency.

## Risk / Compliance

- Regulated mortgage advisor. Logan MLO NMLS #2466872; brokered under Forward Loans, LLC NMLS #2006640. Rates, APRs, license #s, lending claims, disclosures = compliance-sensitive; do not alter without David/Logan approval.
- `/apply` = real Netlify lead form; real submissions are transactional.

## QA-PENDING

- Publish the validated commit to GitHub `master`, run the manual Netlify production deploy, and confirm the live deploy is `ready` with reviewed HTML/CSS/JS hashes.
- Verify live protected paths, raw media path, key routes, cache headers, forms registry, console, mobile/desktop layout, and Lighthouse after production publish.
- `disclosures.html` still contains client-supplied placeholder text for the AZ Mortgage Banker License and CA-DFPI License numbers. Do not invent or remove it; obtain the actual client/compliance-approved values before changing disclosure copy.

## Do Not Touch

- `.env`/secrets; NMLS/license/rate/APR/disclosure copy without approval.
- The forced `→ 404` redirects (keep internal docs private); CSP iframe allowlist.
- `git push` to `master` (= production deploy) without clear, scoped confirmation from David.

## Proposed Changes / Inbox

- Proposal: regenerate `.ai/RULES.md` from `.ai/RULES_HEADER.md` after updating the header to describe `dist` publishing and manual Netlify deployment. Reason: the generated rule currently says `publish = "."` and Git push auto-publishes, which current Netlify metadata disproves. Risk: stale deploy instructions could republish raw client media. Source evidence: safe preview `6a5ef3d04c2899b3815dcc0b`; failed preview `6a5ef2dd4187934abfb8f9a1` was deleted after exposing a raw media file. Suggested owner: AI-Ops rules maintainer.

## Next Steps Queue

- Complete production release and live verification.
- Obtain compliance-approved AZ and CA license values for the two disclosure placeholders.
- Regenerate the generated AI-Ops rules after the source header is corrected.

## Recent Session History

- 2026-07-20: Codex completed a full Logan Loans code/UI/UX/design/accessibility/performance/publishing audit and implementation pass. Fixed no-JS/reduced-motion blank-content risk, mobile hero ordering, consent/mobile-CTA and drawer collisions, CTA/verdict contrast, dead anchors, Instagram accessible names, missing blog headshots, robots validity, logo crop, honeypot markup, raw-media exposure, and cache versioning across 57 customer-facing HTML documents. Structural audit: 58 HTML files, zero broken links/anchors/duplicate IDs/missing assets. Local Lighthouse homepage 99/100/100/100 (performance/accessibility/best practices/SEO); apply/contact/calculator/affordability 100 accessibility/SEO; refinance corrected to 100/100 on the safe preview except expected preview-level noindex. No real form submission.
- 2026-06-28: Claude onboarded Logan Loans to AI-Ops (handoff-ready). Created `.ai/{LOCK,RULES_HEADER,RULES,STATE}.md` + AGENTS pointer; prepended AI-Ops pointer to existing CLAUDE.md; added forced `/.ai/*` + `/AGENTS.md` → 404 redirects to netlify.toml (`/CLAUDE.md` already blocked). No source/content change. Static site, branch `master`.

## Next Agent Directive

Read `.ai/RULES.md` + `.ai/STATE.md` + `CLAUDE.md` first. Treat current repository/Netlify evidence as authoritative where the generated rules still claim root publishing or Git auto-deploy. Build with `bash scripts/build-site.sh`; publish only `dist`. This is a regulated mortgage site: don't change NMLS/license/rate/APR/disclosure copy without approval and never submit real lead forms. Keep protected-path redirects and the CSP iframe allowlist. Don't read `.env`/secrets.

## Emergency / Bypass Notes

- No bypass for deploy/push/compliance-copy/lead-form/production mutations.
- Bypass/YOLO is only an execution accelerator for approved local setup and read-only verification.
- Emergency mode: stop, preserve evidence, smallest reversible action.
