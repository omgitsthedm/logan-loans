# Logan Loans AI-Ops Rules Header

Project Code:

LFNYC-LL

Project Name:

Logan Loans (Logan — Arizona Mortgage Advisor)

Business Line:

Client Projects under Little Fight NYC

Tier:

Tier 2 — live lead-gen site for an NMLS-licensed mortgage advisor (regulated)

Risk:

Medium — regulated mortgage / real-estate lending site. NMLS licensing and real Netlify lead forms are active. Copy is compliance-sensitive — treat like Grand Funding.

Canonical Path:

/Users/davidmarsh/Code/LiFi NYC/Clients/Logan Loans/logan-loans

Remote:

https://github.com/omgitsthedm/logan-loans.git  (default branch: `master`)

Host:

Netlify — project `loganloans`, site id `a9776112-531e-4ca2-ba17-9338b8eef423`. Static source is built with `bash scripts/build-site.sh` into an ignored, allowlisted `dist/`, and Netlify publishes only `dist`. Netlify Forms are enabled. The site is not Git-linked, so Git push and production deploy are separate release steps. Internal files are excluded from `dist` and also blocked via forced `/CLAUDE.md`, `/AGENTS.md`, `/.ai/*` → 404 redirects.

Live URL:

`https://logan.loans` (canonical and Netlify primary)

Stack:

Static HTML/CSS/JS (58 pages: scenarios, locations, articles, and first-party tools). No framework or `package.json`. The build script copies a safe allowlist, stamps shared assets, and runs the sitewide release audit. The CSP retains the approved BankingBridge and Forward Loans frame allowlist, although the homepage now uses first-party calculator links instead of an iframe. Logan MLO NMLS #2466872; Forward Loans, LLC NMLS #2006640.

## Commands

- Dev: serve the repository root for source inspection, or run `bash scripts/build-site.sh` and serve `dist/` for release QA.
- Build: `bash scripts/build-site.sh`.
- Audit: `node scripts/audit-site.mjs .` for source or `node scripts/audit-site.mjs dist` for the publish artifact.
- Preview deploy: `netlify deploy --dir=dist`.
- Production deploy: commit and push reviewed source to `master`, then run `netlify deploy --prod --dir=dist`. Production deploy remains gated by clear, scoped confirmation from David.

## Locked Rules

- Live regulated mortgage site — treat as production. Branch is `master` (not main).
- **Compliance-sensitive copy:** NMLS #s (Logan 2466872, Forward Loans 2006640), license #s, rates, APRs, lending claims, and disclosures must not be altered without David/Logan approval. Don't invent rates or legal/financial claims.
- `/apply` is a real Netlify lead form — do not submit test leads against production.
- LiFi brand standards apply (orange `#FE5800` agency brand; site palette in CLAUDE.md). LiFi footer present.
- **Never publish prices/rates** as fixed claims — keep to approved, disclosure-backed language only.
- Images `.webp` + explicit `width`/`height` + lazy-load below fold.
- Mobile-first, WCAG AA contrast, body text 16px+, respect `prefers-reduced-motion`.
- Git push and Netlify production deploy are separate actions; each must stay within the user's approved scope. `.env`/secrets are never read.
- `.ai/`, `CLAUDE.md`, `AGENTS.md` stay private via the forced `→ 404` redirects — do not remove them.

## Logan Loans QA Harness Map

Observational (agent may run): `git status/log`, read source/config, local release build/serve, public GET to `logan.loans`, read-only Netlify deploy metadata.

Transactional/gated (David/Logan-run or approved): `git push`/Netlify deploy; real `/apply` lead submissions; any change to NMLS/license/rate/APR/disclosure copy; DNS/domain/env changes; CSP/iframe-allowlist changes.
