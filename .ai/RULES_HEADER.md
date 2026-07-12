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

Medium — regulated mortgage / real-estate lending site. NMLS licensing, a real `/apply` Netlify lead form, and BankingBridge mortgage-calculator iframes. Copy is compliance-sensitive — treat like Grand Funding.

Canonical Path:

/Users/davidmarsh/Desktop/LiFi NYC/Clients/Logan Loans/logan-loans

Remote:

https://github.com/omgitsthedm/logan-loans.git  (default branch: `master`)

Host:

Netlify — project `loganloans`. **Static site, `publish = "."`** (whole repo root), no build. Netlify Forms enabled. Internal files are blocked from public serving via forced `/CLAUDE.md`, `/AGENTS.md`, `/.ai/*` → 404 redirects (so `.ai/`, `CLAUDE.md`, `AGENTS.md` are NOT public).

Live URL:

`https://www.logan.loans` (canonical; Netlify primary `https://logan.loans`)

Stack:

Static HTML/CSS/JS (~70 pages: scenario/location/blog/tools). No framework, no build step, no `package.json`. BankingBridge calculator iframes; Forward Loans, LLC (NMLS #2006640) homepage frame allowed in CSP. Logan MLO NMLS #2466872.

## Commands

- Dev / preview: serve the folder statically (e.g. `npx serve .` or Netlify dev); no build needed.
- Build: none (`publish = "."`, static).
- Lint/format: none defined.
- Deploy: `git push origin master` → Netlify auto-publishes (push = production deploy → gated by clear, scoped confirmation from David).

## Locked Rules

- Live regulated mortgage site — treat as production. Branch is `master` (not main).
- **Compliance-sensitive copy:** NMLS #s (Logan 2466872, Forward Loans 2006640), license #s, rates, APRs, lending claims, and disclosures must not be altered without David/Logan approval. Don't invent rates or legal/financial claims.
- `/apply` is a real Netlify lead form — do not submit test leads against production.
- LiFi brand standards apply (orange `#FE5800` agency brand; site palette in CLAUDE.md). LiFi footer present.
- **Never publish prices/rates** as fixed claims — keep to approved, disclosure-backed language only.
- Images `.webp` + explicit `width`/`height` + lazy-load below fold.
- Mobile-first, WCAG AA contrast, body text 16px+, respect `prefers-reduced-motion`.
- `git push` (to `master`) = production deploy → gated. `.env`/secrets never read.
- `.ai/`, `CLAUDE.md`, `AGENTS.md` stay private via the forced `→ 404` redirects — do not remove them.

## Logan Loans QA Harness Map

Observational (agent may run): `git status/log`, read source/config, static local serve, public GET to www.logan.loans, read-only Netlify deploy metadata.

Transactional/gated (David/Logan-run or approved): `git push`/Netlify deploy; real `/apply` lead submissions; any change to NMLS/license/rate/APR/disclosure copy; DNS/domain/env changes; CSP/iframe-allowlist changes.
