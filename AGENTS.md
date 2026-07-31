# Logan Loans

Production mortgage website with regulated disclosures and real Netlify lead forms.

## Truth

- Local: `/Users/davidmarsh/Code/LiFi NYC/Clients/Logan Loans/logan-loans`
- GitHub: `omgitsthedm/logan-loans`; canonical branch `master`
- Netlify: `loganloans`, site ID `a9776112-531e-4ca2-ba17-9338b8eef423`
- Live: `https://logan.loans`
- Production is a manual Netlify CLI release; a GitHub push does not deploy.

## Commands

- Build: `bash scripts/build-site.sh` → ignored `dist/`
- Audit source/build: `node scripts/audit-site.mjs .` / `node scripts/audit-site.mjs dist`
- Preview and production deploys are explicit Netlify CLI actions.

## Safety

- Do not invent or casually change NMLS, license, APR/rate, eligibility, disclosure, or legal claims.
- Never submit real lead forms or expose `.env`, credentials, or applicant data.
- Preserve exact Netlify form names and hidden `form-name` values.
- Read `SOURCE_OF_TRUTH.md` for release/compliance facts only; historical reports are not startup context.

Before edits run `git status --short`; before handoff build/audit proportionally and report Git, Netlify, and live state separately.
