# Logan Loans AI-Ops State

## Identity

- Project Code: LFNYC-LL
- Name: Logan Loans (Arizona Mortgage Advisor)
- Tier: Tier 2 · Risk: Medium (regulated mortgage + lead form)
- Canonical Path: /Users/davidmarsh/Desktop/LiFi NYC/Clients/Logan Loans/logan-loans
- Git-backed: yes · Remote: https://github.com/omgitsthedm/logan-loans.git · Default branch: `master`

## Current Stamp

- Updated: 2026-06-28
- Updated By: Claude
- Basis: AI-Ops onboarding (handoff-ready). Read-only scope.
- Git HEAD at onboarding: 6fe11f29

## Rules Version

- 2026-06-27-aiops-foundation-v1

## State Confidence

- High for path/repo/branch/remote/stack/commands and live domain (repo canonical + Netlify reader confirm www.logan.loans / logan.loans).

## Current Live Truth

- Live URL: `https://www.logan.loans` (canonical). Netlify primary `https://logan.loans`, project `loganloans`, Netlify Forms enabled. Static `publish = "."`, no build.
- Internal files blocked from serving via forced `/CLAUDE.md`, `/AGENTS.md`, `/.ai/*` → 404 redirects.
- Production QA status: not run by AI-Ops.

## Repo State

- Branch `master`, in sync with origin at onboarding; clean working tree.
- BankingBridge calculator iframes + Forward Loans homepage frame allowed in CSP (netlify.toml).

## Risk / Compliance

- Regulated mortgage advisor. Logan MLO NMLS #2466872; brokered under Forward Loans, LLC NMLS #2006640. Rates, APRs, license #s, lending claims, disclosures = compliance-sensitive; do not alter without David/Logan approval.
- `/apply` = real Netlify lead form; real submissions are transactional.

## QA-PENDING

- Confirm forced 404 redirects also catch `/.ai/*` on live (verify `/.ai/STATE.md` → 404 after next deploy).

## Do Not Touch

- `.env`/secrets; NMLS/license/rate/APR/disclosure copy without approval.
- The forced `→ 404` redirects (keep internal docs private); CSP iframe allowlist.
- `git push` to `master` (= production deploy) without `APPROVE LIVE CHANGE`.

## Proposed Changes / Inbox

- None yet.

## Next Steps Queue

- Verify `.ai/*.md` returns 404 on live after this onboarding deploy.

## Recent Session History

- 2026-06-28: Claude onboarded Logan Loans to AI-Ops (handoff-ready). Created `.ai/{LOCK,RULES_HEADER,RULES,STATE}.md` + AGENTS pointer; prepended AI-Ops pointer to existing CLAUDE.md; added forced `/.ai/*` + `/AGENTS.md` → 404 redirects to netlify.toml (`/CLAUDE.md` already blocked). No source/content change. Static site, branch `master`.

## Next Agent Directive

Read `.ai/RULES.md` + `.ai/STATE.md` + `CLAUDE.md` first. Static regulated-mortgage site on `master`. Compliance-sensitive copy (NMLS/rates/APR/disclosures) — don't change without approval. `git push` to `master` = production deploy (gated). Real `/apply` leads are transactional. Keep the forced `→ 404` redirects + CSP iframe allowlist. Don't read `.env`/secrets.

## Emergency / Bypass Notes

- No bypass for deploy/push/compliance-copy/lead-form/production mutations.
- Bypass/YOLO is only an execution accelerator for approved local setup and read-only verification.
- Emergency mode: stop, preserve evidence, smallest reversible action.
