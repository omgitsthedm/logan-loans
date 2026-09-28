# Logan Loans source of truth

## Acquisition readiness release — 2026-09-28

- **Technical acquisition foundation — released.** Optional GTM loading and custom events run only on the exact `https://logan.loans` host after affirmative consent. Preview hosts, `?qa` sessions, webdriver runs, noindex pages, unknown routes, and unavailable session storage remain analytics-off. `GTM-MTWF64T2` remains the sole tag owner. Events use canonical origin/path context, blank referrer context, and an allowlist that drops caller-supplied URLs and form values.
- **Privacy controls — released.** Analytics storage starts denied. The privacy page describes that behavior and provides a visible way to reopen the choice. Revocation denies analytics storage, clears stored attribution, and sets the verified GA disable flag. Read-only GA4 inspection on 2026-09-28 verified property `544167583` / stream `15198816712` uses `G-VP8CWM9B50`; its UI reported no data received in the previous 48 hours. That is identity evidence, not a collection or conversion receipt.
- **Conversion reliability — released.** Contact details, registered form names, hidden `form-name` values, fields, routes, and confirmation paths remain intact. The pre-approval and general-contact forms now expose accessible, entry-preserving timeout/network-failure states with the existing direct-phone fallback. No real or Netlify form submission was made during QA.
- **Release evidence.** Source commit `7cf539408b567d29d7f8017cd114f4857b0910cc` is on GitHub `master`. One ready release candidate, [`6aba04fab5c5161197324cdf`](https://6aba04fab5c5161197324cdf--loganloans.netlify.app), returned `X-Robots-Tag: noindex`. One ready production deploy, [`6aba0538e3eebf4e9cbf3829`](https://6aba0538e3eebf4e9cbf3829--loganloans.netlify.app), published at `2026-09-28T06:12:12.590Z`; its immutable and primary `https://logan.loans/?qa=1` HTML hashes both equal `8d26c6bc7e4e7434988342e218515a5458a079e69bdc0d9f26bc4c64ee1d6f23`. The `loganloans.netlify.app` host 301s to the exact custom host.
- **Validation.** `bash scripts/build-site.sh`, `node scripts/audit-site.mjs .`, calculator regression, `node scripts/test-analytics.mjs`, and `git diff --check` passed before release. Local Chrome confirmed desktop and 390px conversion/privacy layouts without horizontal overflow, initial analytics-off behavior, and a local-only form failure message. Published HTML contains no static Google tracking URL; published contact HTML retains both form and status markers.

### Acquisition blueprint disposition

- **Service and search content:** the released 58-page source / 48-indexable-page artifact, canonical metadata, sitemap, structured data, calculators, and contact paths are present. Rankings, index coverage, and qualified traffic are not verified by this release.
- **Measurement:** consent-gated source wiring is live. The GA4 stream identity above is verified, but GTM collection, Search Console coverage, and conversion/key-event receipts remain provider checks; do not infer them from source code or deploy state.
- **Local discovery and reputation:** GBP ownership, listing accuracy, reviews, and local-pack visibility remain external/provider work. No profile was created, claimed, edited, or contacted.
- **Lead outcomes:** delivery configuration and actual recipient response coverage require live provider/operating confirmation. Measure qualified calls, forms, pre-approvals, and funded outcomes over a 28-day window after this release; do not call the acquisition program complete before that evidence exists.
- **Compliance:** NMLS/license, rate/APR, eligibility, 2026 limits, and disclosure claims remain on hold pending approved facts. This release intentionally does not alter them.

Verified: 2026-09-28

- Local: `/Users/davidmarsh/Code/LiFi NYC/Clients/Logan Loans/logan-loans`
- GitHub: `https://github.com/omgitsthedm/logan-loans`
- Canonical/default branch: `master`
- Netlify site: `loganloans`
- Site ID: `a9776112-531e-4ca2-ba17-9338b8eef423`
- Production URL: `https://logan.loans`
- Canonical source HEAD: `7cf539408b567d29d7f8017cd114f4857b0910cc`
- Production deploy: `6aba0538e3eebf4e9cbf3829`
- Production state/context: `ready` / `production`
- Published: `2026-09-28T06:12:12.590Z`
- Netlify deploy branch label: `main`
- Production deploy title: `Logan consent and contact recovery 7cf5394`
- Immutable production URL: `https://6aba0538e3eebf4e9cbf3829--loganloans.netlify.app`
- Deploy method: manual Netlify CLI/API from allowlisted `dist/`

The current manual production deploy has no Netlify `commit_ref`; its title ties it to the canonical source HEAD above. Netlify labels the manual deploy branch `main`; that label is not the repository branch, whose canonical/default name is `master`. GitHub is not connected to Netlify, so this documentation-only GitHub change does not create a Netlify deploy.

Regulated copy still requires client/compliance approval. Do not invent or silently remove license, NMLS, rate/APR, eligibility, or disclosure language. Preserve the registered Netlify form names and never submit real leads during QA.

## 2026-09-28 provider-receipt correction

- A consented production `https://logan.loans/` session loaded sole GTM `GTM-MTWF64T2`, requested the matching `G-VP8CWM9B50` tag, and sent a sanitized `page_view` collector request with canonical root page location and blank referrer. GA4 Realtime then reported `page_view`, `session_start`, `first_visit`, and `user_engagement`. This proves collection only; no lead, qualification, conversion, or customer result is inferred. The browser choice was reset to optional analytics off.
- Netlify form detection is enabled for five forms. Its sole visible submission-notification configuration sends each new form submission to the existing business inbox `logan@forward.loans`. No submission was created or opened; actual receipt, human response, qualification, and funded outcome remain unproven.
- Search Console is already correctly connected through the verified URL-prefix property `https://logan.loans/`, owned by Little Fight NYC (`hello@littlefightnyc.com`). Settings confirms verified owner; Associations confirms Google Analytics GA4 → Logan Loans / Logan Loans stream / matching HTTPS host. Its sitemap.xml is Success with 48 discovered pages, last read September 17, 2026; overview reports nine indexed URLs and five total web-search clicks in its displayed window. The separate `sc-domain:logan.loans` entry is unverified and is not the active property; it does not block the existing connection. GA4 property `544167583` is editable under Little Fight NYC account `384652620`. Business Profile Manager has no Logan Loans listing; no duplicate profile was created or claimed.
