# Logan Loans audit implementation

**October 19 follow-up:** see `../2026-10-19-release-review/release-readiness.md` for the current release decision, source-verifiable follow-up corrections, exact approval owners, and the authenticated-preview blocker. The October 18 record below is historical; it does not establish current approval or production publication.

Prepared October 18, 2026, on `codex/logan-site-audit-2026-10-18`, based on canonical `master` commit `73aa3e7b4ad57ec603aa0e89d0d4dccf20f59b3c`.

## Status

Implementation and local build checks are complete. This is a review branch, not a production release. The workspace has no authenticated Netlify CLI session. A hosted draft and desktop/mobile visual verification remain pending. The cloud browser disallows local file URLs; no screenshot or viewport verification is claimed.

The existing `SOURCE_OF_TRUTH.md` client/compliance hold applies to regulated and product copy. Draft corrections are prepared for concrete review. Actual clips, client outcomes, and publication permissions have not been supplied or invented.

## Changes

| Area | Result |
| --- | --- |
| Homepage | Leads with investor, self-employed, and home-loan conversations; prominent direct scenario inquiry and specialist navigation. |
| Program catalog | Visible links and matching structured data for the destination pages. Unsupported universal credit, down-payment, documentation-period, and HELOC-period claims removed from its metadata. |
| Nine service pages | Hard money, Non-QM, bank statement, DSCR, fix-and-flip, bridge, construction, home equity, and jumbo. Each explains suitability, preparation, constraints, process, FAQs, adjacent options, and the next step. |
| Investor journey | Inquiry precedes the build-inserted narrative image. Persistent investor and DSCR article actions retain their scenario context. New service-page header, drawer, mobile, and body actions use the matching inquiry. |
| Contact | Name/email are the only required fields. Neutral goal selector, optional specialty questions, no-JavaScript expandable groups, restored entries, and excluded inactive fields. |
| Form protection | All five registered names, hidden form-name values, historical field names, honeypots, methods, and endpoints remain. The authorized preapproval expansion and optional general-contact message have updated audit contracts. Other fingerprints remain unchanged. No real lead was sent. |
| Privacy | Query inputs use a fixed vocabulary. Arbitrary query text never fills applicant fields or analytics. Existing consent, preview, QA, noindex, and failure safeguards remain. |
| Trust details | Company identity normalized to the name attributed in Forward’s disclosures; biography links accurately labeled; separate NMLS Consumer Access links; protected NMLS IDs and direct phone/email retained. Active individual licensing is not independently certified. |
| Financial explanations | Corrected limit, preapproval, LLC transfer, occupancy, VA concession, and DSCR explanations. Details and primary sources are in `regulated-content-review.md`. |
| Biography/roles | Removed internal writing notes and blanket in-house/no-handoff promises; clarified loan-officer, lender-network, correspondent, and other participant roles. |
| Google links | Standardized to the business identifier already present on the homepage. Current business destination and testimonial permissions remain verification items. |
| Planning examples | Three explicitly hypothetical scenarios at `/loan-scenarios`. These are not records of funded client deals. |
| Video publishing | Approved, permissioned local MP4s with accurate captions, dates, a canonical original Instagram post, and a supported service route. Only manifest-approved media copies into the build. Empty video sections are omitted. |
| Search maintenance | Seven excluded pages now have a single intentional noindex tag. Ten new indexed destinations appear in the sitemap and analytics allowlist. New stylesheets receive asset fingerprints. |
| Ownership | `content/review-register.json` assigns sources, responsible reviewers, approval state, and review dates. Internal review files stay outside the public build. |
| Provider separation | The Claude PR-review workflow excludes `codex/` branches. This change adds no production deployment action. |

No standalone land offering, universal eligibility threshold, guaranteed timeline, actual testimonial, or fabricated video dialogue was added. The dormant generic Instagram cards were removed. The four-month video archive has not been represented as watched or transcribed.

## Verification completed

`bash scripts/build-site.sh` passes with **68 site pages, 58 indexed URLs, 67 shared-shell pages, and 39 rendered narratives**. The unchanged Google verification HTML is separate from the 68-page count.

The build verifies links, anchors, JSON-LD, canonical metadata, single indexing decisions, sitemap parity, protected forms, shared assets, legal links, NMLS IDs, and the Little Fight credit. It runs calculator regressions, analytics privacy/consent regressions, the inquiry suite, and video/specialist-journey checks. `git diff --check` is clean.

The inquiry tests exercise static Netlify detection, requiredness, neutral selection, no-JavaScript access, every specialty, old topic links, hostile query rejection, restored values, inactive-field serialization, duplicate submission, and mocked server/network/timeout recovery. No network request is made by that suite.

The video tests reject missing approvals/permissions, unsafe paths, unsupported service routes, arbitrary URL query/fragment data, empty captions, and reverse timing. Native controls with `preload="none"` avoid autoplay and an Instagram tracking embed. The current manifest contains zero videos.

Independent reviews checked content consistency, source/build assets, publication boundaries, and future media risks. Findings were resolved before handoff. These checks do not establish live email delivery, actual analytics collection, Google profile correctness, current lender eligibility, or responsive visual quality.

## Finish the preview and release

1. Authorize the Netlify CLI through its interactive or agent/human login flow. Do not paste an API token into chat.
2. Rebuild and create a draft on the existing site:

   ```sh
   bash scripts/build-site.sh
   netlify deploy --site a9776112-531e-4ca2-ba17-9338b8eef423 --dir dist --message "Logan Loans audit review"
   ```

3. Inspect the hosted draft on desktop/mobile: home, catalog, investor hub, each inquiry scenario, service navigation, and corrected FAQ/disclosures. Verify draft noindex behavior without sending a real lead.
4. Complete the approval and source requests in `regulated-content-review.md`, `service-content-review.md`, `source-material-needed.md`, and `content/review-register.json`.
5. Publish only through a separate explicit production release using the established manual Netlify process. GitHub push/merge does not deploy this site.
