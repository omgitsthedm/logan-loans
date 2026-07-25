# Logan Loans — Source of Truth

Last verified: 2026-07-24 by Codex against the resolved checkout, Git/GitHub state, repository manifests, the allowlisted release build, Netlify project metadata, and public/live responses.

## Canonical code

- Legacy agency path: `/Users/davidmarsh/Desktop/LiFi NYC/Clients/Logan Loans/logan-loans` (not present in the current filesystem)
- Resolved Git root: `/Users/davidmarsh/Code/LiFi NYC/Clients/Logan Loans/logan-loans`
- GitHub: https://github.com/omgitsthedm/logan-loans.git
- Canonical branch: `master`
- GitHub is canonical for code history. Production synchronization is a separate fact and must be verified below.

## Technology and commands

- Stack: Static HTML/CSS/JavaScript
- Dev: serve the repository root with a local static server
- Build: `bash scripts/build-site.sh` (creates ignored, allowlisted `dist/`)
- Deploy preview: `netlify deploy --context deploy-preview`
- Deploy production: `netlify deploy --prod` after the reviewed commit is on GitHub `master`
- Test: `node scripts/audit-site.mjs .` or `node scripts/audit-site.mjs dist`, plus browser QA, Axe, and Lighthouse release checks
- Lint: no standard lint command detected

## Production linkage

- Verified Netlify authority: project `loganloans` · id `a9776112-531e-4ca2-ba17-9338b8eef423` · primary and canonical https://logan.loans.
- Netlify provider/repository/production-branch fields are null/unreported. Production deploys are manual CLI/API deploys; pushing GitHub does not currently publish the site.
- Production deploy `6a645d29791e1b616ae2de12` is `ready` and serves release source commit `764cb76`; validated preview `6a645c8d0f70c23e5aa9cd94` carries the same asset hashes. Internal docs and the raw-media path return 404 on live production.
- Netlify Forms registry includes `apply`, `preapproval`, `general-contact`, `partner-referral`, and legacy `newsletter`.

## Secrets and data

- Keep credentials, `.env*`, client records, and production data out of Git and agent output.
- Commit only documented examples with non-secret values.

## Working rules

- Use short-lived branches and preserve unrelated work.
- Read `AGENTS.md`, `CLAUDE.md`, and `.ai/STATE.md` where present; current runtime evidence overrides stale notes.
- Clear, scoped plain-language authorization is sufficient for live changes; evaluate meaning rather than matching fixed wording.
- Validate proportionally before handoff. Never claim a deploy, form, payment, booking, database write, or production check succeeded without evidence.

## Known uncertainty

- `disclosures.html` contains unresolved AZ Mortgage Banker License and CA-DFPI License placeholders. Those values require client/compliance approval; do not invent, hide, or remove them.
- Current conforming/FHA/Home Plus figures and related eligibility language need a compliance-approved 2026 program-matrix correction. The release audit warns rather than rewriting regulated claims.
- `funded-deals.html` and `press.html` are retained for owner review but are `noindex,follow` and excluded from sitemap/AI manifest discovery until reviews, deal examples, and proof claims are approved.
- The five near-template Southern California locality pages are also `noindex,follow` and excluded from the sitemap until each has distinct first-party local proof. `southern-california.html` remains the indexable regional authority page.
