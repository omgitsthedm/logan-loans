# AI-Ops Project Rules

Rules Version: 2026-07-24-logan-safe-publish-v2
Generated date/time: 2026-07-24T23:54:17-0700
Source Base: /Users/davidmarsh/AI-OPS/TEMPLATES/RULES_BASE.md
Source Header: /Users/davidmarsh/Code/LiFi NYC/Clients/Logan Loans/logan-loans/.ai/RULES_HEADER.md
<!-- AI-OPS-GENERATED: edit RULES_HEADER.md or RULES_BASE.md, then rerun generate-rules. -->
<!-- AI-OPS-CONTENT-CHECKSUM: 4112388334:9995 -->

<!-- AI-OPS-CONTENT-BEGIN -->
## Project Rules Header

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

## Shared Rules Base

# AI-Ops Shared Rules Base

This is the canonical shared behavior contract for Little Fight NYC AI-Ops work.

Keep truth in the repo. Store only what Git cannot know. Maintain shared rules once. Automate facts. Have AI propose judgment. Safety overrides forward motion.

## Command Words

Agents must recognize these exact commands:

- `SESSION START`
- `SESSION CLOSEOUT`
- `STOP`
- `HALT`

## Operating Contract

- Repo truth beats chat truth.
- Git knows code history.
- Deployment/build metadata knows what shipped.
- `.ai/STATE.md` stores what Git cannot know.
- Ideas go to inbox before becoming rules.
- Production QA must separate observation from transaction.
- Autonomy is useful until risk appears.
- Safety overrides forward motion.

## SESSION START Protocol

When starting work:

1. Read `.ai/RULES.md`.
2. Read `.ai/STATE.md`.
3. Check the current branch, worktree, and git status.
4. Check recent commits relevant to the requested work.
5. Check whether `.ai/STATE.md` is stale against Git, deploy metadata, or current task context.
6. Check `QA-PENDING` before claiming anything is complete.
7. State the current branch, dirty files, active risk level, and intended first action.

Do not rely on chat memory when the repo has a newer source of truth.

## SESSION CLOSEOUT Protocol

Before ending a work session:

1. Update `.ai/STATE.md` with facts Git cannot know.
2. Record unresolved `QA-PENDING` items.
3. Record proposed rule changes in the inbox rather than editing generated rules directly.
4. Report branch, files created, files modified, verification run, warnings, and next-agent directive.
5. Do not claim production QA passed unless production QA was actually run and stayed observational or was properly approved.

## Emergency Mode

Emergency Mode applies when production, client data, billing, secrets, auth, DNS, deployments, or irreversible operations may be affected.

In Emergency Mode:

- Stop forward feature work.
- Preserve evidence.
- Do the smallest reversible action.
- Ask David before destructive or transactional action.
- Prefer observation, rollback, and containment over new behavior.

## STOP / HALT Protocol

`STOP` means pause all work and report current state.

`HALT` means stop immediately, avoid further file or system changes, and report the last completed action plus the next safest recovery step.

If a STOP or HALT conflicts with automation, human instruction wins.

## Live Change Confirmation Protocol

Clear scoped confirmation is required before any live transactional action unless the action is sandboxed, staged, explicitly David-run, or already protected by a project-specific approved safe path.

Approval must be scoped to a specific action. It does not authorize unrelated live changes.

## Proposed Changes / Inbox

Rules are not rewritten ad hoc.

Put candidate changes in `.ai/STATE.md` under `Proposed Changes / Inbox` with:

- Proposal
- Reason
- Risk
- Source evidence
- Suggested owner

Promote proposals into `.ai/RULES_HEADER.md` or `~/AI-OPS/TEMPLATES/RULES_BASE.md` only after review.

## Tactical Visibility Before >3 Source File Edits

Before editing more than three source files, report:

- Goal
- Files expected to change
- Risk
- Verification plan
- Rollback plan

Documentation, generated rules, and state files still require visibility when they affect agent behavior.

## Observational vs Transactional QA Split

Observational production QA is allowed when it only reads public or authorized state and does not create, mutate, submit, send, buy, book, upload, export, or persist anything.

Transactional production QA is not allowed unless sandboxed, staged, explicitly David-run, or gated by clear, scoped confirmation from David plus a safe test path.

If a `qa:prod` harness exists, run it instead of improvising checks.

Transactional actions include:

- live checkout orders
- live payments
- real appointment bookings
- real lead form submissions
- real client emails
- real database writes
- real uploads into client workflows
- PHC bid/export actions that could alter client data
- anything that pollutes client records, calendars, inboxes, analytics, orders, or production data

## Dangerous Operation Gate

Do not perform dangerous operations without explicit approval.

Dangerous operations include:

- pushing to protected branches
- deploying
- deleting files or cloud resources
- modifying secrets, `.env`, DNS, auth, or billing
- mutating production data
- running live transactional QA
- changing production infrastructure

Live danger requires clear confirmation from David that identifies the intended production action and scope.

Broad standing autonomy does not cover ambiguous or destructive production changes. Confirm the intended live action and scope in plain language before proceeding.

## Stale State Protocol

If `.ai/STATE.md` conflicts with Git, deploy metadata, logs, or current source files:

1. Treat the state as stale.
2. Use repo/deploy facts as the higher source of truth.
3. Update `.ai/STATE.md` during closeout with the corrected fact and evidence.
4. Do not silently carry stale assumptions forward.

## QA-PENDING Protocol

`QA-PENDING` means work is not verified enough to claim done.

Each pending item must include:

- What needs verification
- Why it matters
- Safe verification path
- Whether it is observational or transactional
- Current owner

Do not collapse QA-PENDING into success language.

## Collision Detection

Before editing, check for collisions:

- current branch
- current worktree
- `git status --short`
- recent commits
- existing lock file if the project uses one
- whether Claude Code, Codex, or another agent is likely active on the same branch or files

If a collision appears likely, stop and report the risk before writing.

## Optional Lock File Protocol

Projects may use `.ai/LOCK.md` for coordination.

If present, read it before edits. If creating one, include:

- Agent
- Branch
- Files or area claimed
- Start time
- Expected closeout
- Recovery note

Do not use a lock file as permission to bypass safety gates.

## Session History Compaction

Keep durable state short and factual.

Use `.ai/STATE.md` for current operational truth, not transcripts. Summarize long histories into recent decisions, unresolved risks, next steps, and evidence pointers.

## Safety Override

Safety overrides forward motion.
<!-- AI-OPS-CONTENT-END -->
