# Logan Loans PR #8 — release decision

Reviewed October 19, 2026. **Keep PR #8 in draft. Hold the complete candidate from production.**

The implementation is ready for an authenticated hosted review. Local automated checks are strong, but they do not provide content approval, current license verification, a rendered desktop/mobile pass, or proof of lead delivery. No approval was found in the PR discussion or the review register. No production release, merge, or lead submission was performed.

## Current source and deployment

- PR: https://github.com/omgitsthedm/logan-loans/pull/8 — open, unmerged, draft when inspected; original head `3d296f4a423cf060d7bc0153418345965f81b412`.
- Canonical base: `master`, `73aa3e7b4ad57ec603aa0e89d0d4dccf20f59b3c`.
- This review's changes remain on `codex/logan-site-audit-2026-10-18`; the commit containing this report identifies the reviewed revision. Later changes require corresponding review.
- Netlify project: `loganloans`, `a9776112-531e-4ca2-ba17-9338b8eef423`.
- Published production: `6acd603263303f94f5730b94`, October 12, 2026. Its title identifies source `73aa3e7`; Netlify has no `commit_ref`, so the title alone is not a cryptographic source receipt.
- Direct HTTP checks of `https://logan.loans/?qa=1` and the published immutable URL both returned 200 and the same homepage SHA-256: `4856cf4347df2c764510d57546361129db1bd2339e7005cc5056af9d34e96518`. This confirms the live homepage still matches that production deployment, not the proposed draft.
- GitHub returned no combined commit-status entries at the original head. Its Claude Code Review workflow was skipped. Passing checks reported here are **local automated tests**, not a successful GitHub CI run.

## What can progress, and what cannot publish yet

| Change group | Readiness | Remaining owner and condition |
| --- | --- | --- |
| Build/audit improvements, asset fingerprints, single indexing directives, internal-file exclusion, analytics/privacy safeguards, provider separation | Code-ready; no lending fact needs approval for the mechanism itself | Little Fight NYC: final exact-revision build and hosted verification. This is not a separately prepared partial release. |
| Inquiry behavior: preserved five identities, optional fields, goal routing, no-JavaScript access and failure recovery | Code-ready; original names, endpoints and legacy fields preserved | Little Fight NYC: hosted field detection and visual/interaction checks. Logan: confirm inquiry owner, secure handoff and service-specific labels. |
| Navigation, ten destinations, sitemap and structured offers | Technically consistent; publication is coupled to the underlying content | Logan/compliance: actual offerings and approved wording. An unapproved route must also be removed/revised in cards, links, schema, sitemap and related inquiry labels if excluded. |
| Nine specialist pages | Educational descriptions supported; all nine held for publication approval | Logan/compliance: approve actual category availability, state/use scope, identity/role and full page package. See page-by-page matrix in `specialist-verification.md`. |
| FAQ, glossary, DSCR explanations, disclosures and public identity wording | Source-supported corrections prepared; not compliance-approved | Authorized reviewer: approve corrected and inherited regulated text against current company and program facts. See `regulated-verification.md`. |
| Three hypothetical scenarios | Clearly educational; no claimed customer result | Logan/compliance: approve wording and linked offerings. They require no fabricated client evidence and must remain hypothetical. |
| Video renderer with empty approved inventory | Technical framework passes; zero videos published | May remain empty for core release. Actual clips require verified content, captions, rights and authorized approval before addition. |
| Real testimonials, filmed statements or actual client outcomes | No new material approved | Optional; omit until evidence and permission exist. Their absence alone does not block an otherwise approved text-only release. |

There is no production-ready release artifact today: the complete `dist` contains pending branded offerings and regulated copy. The review register is a record, not an automatic deployment interlock; a successful build must never be interpreted as publication authorization.

## Corrections made in this review

- Corrected nine FAQ answers in visible text and matching FAQ schema, plus eight glossary definitions. Changes address Home Plus participation/terms, repeat-buyer conventional down-payment eligibility, PMI cancellation conditions, refinance break-even versus total cost, cash-out limits/tax overclaims, and the reversed VA subsequent-use funding-fee statement, repeated FHA/conventional cost claims and seller-credit terminology. No replacement Logan-specific pricing or eligibility matrix was invented.
- Added primary-source links supporting those explanations. General definitions are evidence for review; they do not confirm Logan's product access.
- Moved the `loan-scenarios` footer outside its main landmark. The hypothetical text and inquiry actions are unchanged.
- Expanded `content/review-register.json` with named release owners, specific evidence requirements and optional media gates. Its approval-evidence list remains empty; all applicable approvals remain pending.

Existing NMLS identifiers, direct phone/email and all five form identities are preserved. No unverified video, real client outcome, testimonial or new rate was added.

## Exact client/compliance sign-off needed

1. **Identity and authority:** current individual/company NMLS and state records; approved `Forward Holdings LLC dba Forward Loans` presentation; AZ/CA license labels and Logan's actual individual coverage; broker/correspondent role and required advertising disclosures. Forward's company page supports the published identity but does not certify current individual authority. NMLS record retrieval did not yield a verifiable record during this review.
2. **Actual offerings, one decision per category:** hard money, Non-QM, bank statement, DSCR, fix-and-flip, bridge, construction, home equity and jumbo. Confirm intended state, occupancy, property and purpose scope. Approve metadata, cards, CTAs and structured offers with body copy. Public historical marketing is not an approved current product matrix.
3. **Specific structures:** distinguish construction-only from permanent conversion, investor bridge from homeowner buy-before-sell, HELOC from closed-end home equity, and standard from alternative-documentation jumbo. The draft often presents these as questions; more detailed terms can stay omitted. Do not require a rate sheet merely to publish a cautious, approved category explanation. Do not add standalone land lending without confirmation.
4. **Regulated explanations and operating promises:** approve FAQ/glossary/DSCR/disclosures, hypothetical labels, inquiry-versus-application wording and the remaining inherited regulated statements identified in the detailed review. Confirm the shared conditional same-day preapproval and direct-response promises against actual operations; conditional wording still needs a factual basis.
5. **Contact and trust destinations:** confirm the preserved direct phone/email and intended Google review profile. Forward's biography displays corporate contact details, so it does not independently verify Logan's direct channel. Confirm inquiry-response ownership and secure document instructions. Actual email receipt has not been tested here.

Approval evidence must identify the reviewer and authority, date, exact revision/pages approved, approved state/product scope and any exclusions. A missing response or a date marked “review due” is not approval. Little Fight NYC owns implementation and release checks; it does not grant regulatory approval on Logan's behalf.

## Hosted preview and responsive checks

Netlify account inspection succeeded through the connector. The connector exposes deployment reads but no draft-upload action. Netlify CLI 23.11.0 was installed and an explicit draft-only command returned **`Unauthorized: could not retrieve project`**. No deploy URL or deploy ID was created. The available browser showed Netlify's sign-in screen, and could not reach the workspace HTTP server (`ERR_CONNECTION_REFUSED`). These are access limitations, not successful visual checks.

No desktop/mobile screenshots, browser overflow checks or hosted-candidate header/redirect checks are claimed. CSS inspection found responsive breakpoints and wrapping rules, but cannot establish rendered quality.

After secure deployment authentication is available, Little Fight NYC must:

1. Rebuild this final source and create an immutable draft on the **existing** project, using repository `netlify.toml` and `dist`. Do not use `--prod`, `--prod-if-unlocked`, create a new project, or modify production access controls.
2. Verify draft noindex/HTTPS, security headers, assets, canonical routes, ten new redirects, and analytics-off behavior. Confirm current production ID is unchanged.
3. Inspect home/programs/investor hub, all nine pages, scenarios, contact/apply, FAQ/disclosures/privacy at desktop and 320px/390px phone widths. Check overflow, keyboard focus, menu, sticky controls, footer and text/CTA clipping.
4. Walk every inquiry scenario, goal switching/restoration and no-JavaScript access without sending a live lead. Verify the same five form identities and added fields in the hosted artifact/provider record. Provider receipt is a separate explicitly controlled test, not an inferred result.
5. Record exact preview/commit and final passing build; reconcile written approvals with that exact content before a separately authorized production release.

The five retained identities are `apply`, `preapproval`, `general-contact`, `partner-referral`, and `newsletter`. Only the main application/contact inquiry requires just name/email: partner referrals still require name/phone/email/brokerage; newsletter requires email. Do not generalize the optional-field change to every form.

## Evidence files

- `technical-verification.md` — build, forms, privacy, artifact boundaries and precise pending hosted checks.
- `specialist-verification.md` — all nine routes, three scenarios, source limits and product-specific decisions.
- `regulated-verification.md` — claim/source matrix, corrections and inherited review items.
- `../../content/review-register.json` — machine-readable pending state. Canonical path is `content/review-register.json` at repository root.

Build validation for the final assembled source is recorded in `build-verification.txt`. Nothing in this report lifts the production hold.
