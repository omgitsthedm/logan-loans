# Logan Loans — Source of Truth

Last verified: 2026-07-20 by Codex against the resolved checkout, Git/GitHub state, repository manifests, a safe Netlify deploy preview, Netlify form/deploy metadata, and public/live responses.

## Canonical code

- Visible workspace: `/Users/davidmarsh/Desktop/LiFi NYC/Clients/Logan Loans/logan-loans`
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
- Test: structural 58-page link/asset audit, browser QA, and Lighthouse are manual release checks; no package script exists
- Lint: no standard lint command detected

## Production linkage

- Verified Netlify authority: project `loganloans` · id `a9776112-531e-4ca2-ba17-9338b8eef423` · primary https://logan.loans · canonical https://www.logan.loans.
- Netlify provider/repository/production-branch fields are null/unreported. Production deploys are manual CLI/API deploys; pushing GitHub does not currently publish the site.
- Safe artifact preview `6a5ef3d04c2899b3815dcc0b` is `ready`; its homepage/CSS/JS hashes match local source. Internal docs and the raw-media path return 404.
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
- `.ai/RULES.md` is generated and still contains stale root-publish/Git-auto-deploy language. Follow this source-of-truth file and `.ai/STATE.md` until the rules source header is corrected and regenerated.
