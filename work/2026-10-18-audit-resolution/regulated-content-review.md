# Regulated content review — October 18, 2026

## Status and scope

**PREVIEW FOR CLIENT / COMPLIANCE REVIEW. The existing compliance hold remains in effect.** These edits implement the authorized audit response on local branch `codex/logan-site-audit-2026-10-18`. They do not establish production approval, active licensing, borrower eligibility, an available lender relationship, or approved pricing. No live deployment or real form submission was performed for this content work.

Read `AGENTS.md` and `SOURCE_OF_TRUTH.md` before editing; the branch was clean at the initial status check. This note covers only:

- `disclosures.html`
- `faq.html`
- `glossary.html`
- `blog-dscr-loans-arizona.html`

The existing NMLS IDs, **2466872** for Logan Sullivan and **2006640** for the company, remain unchanged. Their occurrence counts in these four pages also remain unchanged. Existing direct phone and email details are preserved. No applicant or other client information was accessed.

## Corrections prepared

| Area | Local preview change | Why / boundary |
| --- | --- | --- |
| Company identity and licensing | Use Forward Holdings LLC DBA Forward Loans. Replace the two placeholder license lines with Arizona Mortgage Broker License MB-1012025 and California DFPI Financing Law License 60DBO-132727. Attribute them to the company’s April 29, 2026 disclosures and link to verification resources. Correct the DSCR article’s company affiliation. | The company publishes these details. This work does not independently certify current regulator status or the individual’s state authority. No “approved” or “good standing” claim was added. |
| Pre-approval | Clarify conditional review and lender variation; remove a guaranteed/verified-commitment implication, unsupported turnaround and competitor comparisons, and blanket claims about Arizona sellers. Align the related glossary definitions. | CFPB says neither type of letter is a guaranteed loan offer and lenders use the terms differently. Actual workflow and service timing still need client confirmation. |
| 2026 limits | Correct the Los Angeles County one-unit figure to $1,249,125; retain the $832,750 baseline with county and unit-count context. Correct related jumbo/high-balance definitions. | These are loan-amount limits, not home-price limits or an eligibility determination. Removed unsupported jumbo rate/credit/reserve universals. |
| LLC and occupancy | Remove the assertion that lenders generally do not enforce due-on-sale clauses. Direct existing borrowers to confirm permitted transfers and conditions with their servicer. Remove the suggestion to use investment-property guidelines temporarily for a new home. | Fannie Mae’s LLC exception has defined conditions; it cannot be generalized to every loan. The program must fit the borrower’s actual intended use. |
| DSCR and non-QM | Explain that rental income can be used in some programs while borrower and property review remain. Distinguish a rental ratio from profitability or approval. Remove universal rate premiums, minimum ratios, credit/down-payment/reserve rules, portfolio claims, document waivers, and assumed property eligibility. Clarify that business-purpose lending and consumer non-QM are not identical classifications. | No approved Forward/Logan investor matrix was available for this work. General third-party product examples do not establish a product available through Logan. |
| DSCR article examples | Replace the unsupported “real North Phoenix” rate/payment example and broad local market claims with clearly assumed ratio math and a property-specific review checklist. | $2,800 / $2,200 rounds to 1.27. The $600 difference precedes operating costs. No actual property, current rate, closing, market-rent statistic, or client outcome is claimed. |
| VA seller contributions | Correct the FAQ’s conflation of FHA and VA credits: distinguish ordinary VA closing-cost credits from concessions capped at 4% of reasonable value. | The loan’s proposed credit still needs lender review. This change does not approve an amount for an actual transaction. |
| Other directly related overclaims | Remove a universal best-credit-score claim, the implication that a 580 score establishes eligibility, an unsupported Phoenix appraisal-issue statistic, and fixed alternative-income calculations. | Replace blanket outcomes with the factors a file review must resolve; no new program minima are asserted. |

The FAQ changes cover 21 of its 52 answer pairs, updated in both visible text and JSON-LD. Fifteen glossary definitions were revised, including two follow-up corrections to Investor Loan and Second Home / Vacation Home. The Investor Loan entry no longer asserts a fixed rate premium or down-payment range. The second-home definition now accounts for Fannie Mae’s conditional treatment of identified rental income instead of asserting that any rental use is disallowed. The DSCR article retains its original April 18, 2026 publication date and marks the preview content update October 18, 2026. Its three existing structured-data FAQs now also appear visibly. The article’s rental CTAs use `./contact?scenario=rental#intake`, as coordinated with the intake implementation.

## Primary evidence

Sources were reviewed on **October 18, 2026**. Dates below are source dates, where published; retrieval today does not imply the underlying facts changed today. The evidence is paraphrased rather than reproduced as source copy.

1. **Forward Loans company disclosures** — <https://forward.loans/disclosures/>. Page updated April 29, 2026; identifies Forward Holdings LLC, the Forward Loans DBA, company NMLS 2006640, and the AZ/CA license names and numbers used here. The company describes broker and non-delegated correspondent roles. These are company-published statements; verify current individual/company records and required advertising wording before release.
2. **Forward Loans’ Logan Sullivan biography** — <https://forward.loans/loan-officer/logan-sullivan/>. Company biography supports Logan’s association and NMLS 2466872. Its generic contact area differs from Logan’s existing direct contact details; those direct details were not replaced. Independent NMLS record verification was not completed, and a direct-record fetch could not be completed in the audit research.
3. **CFPB, prequalification vs. preapproval** — <https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-prequalification-letter-and-a-preapproval-letter-en-127/>. Last reviewed December 5, 2023. Lender terminology and verification processes vary; neither letter guarantees a loan. Supports the conditional-language corrections, not a promise about Logan’s actual process.
4. **FHFA, 2026 county loan-limit table** — <https://www.fhfa.gov/document/d/cll/fullcountyloanlimitlist2026_hera-based_final_flat.pdf>. Printed page 7 of 102, FIPS 06/037, lists Los Angeles County’s one-unit limit as $1,249,125. Baseline one-unit counties show $832,750. The table distinguishes one-, two-, three-, and four-unit limits.
5. **Fannie Mae Servicing Guide D1-4.1-02, allowable transfer exemptions** — <https://servicing-guide.fanniemae.com/svc/d1-4.1-02/allowable-exemptions-due-type-transfer>. Topic dated August 13, 2025. Its LLC exception depends on acquisition/securitization timing, original-borrower control or majority ownership, and occupancy/security-instrument conditions. It also addresses later refinancing requirements. This supports replacing broad reassurance with a servicer-specific check.
6. **Fannie Mae Servicing Guide D1-4.1-05, due-on-sale/due-on-transfer enforcement** — <https://servicing-guide.fanniemae.com/svc/d1-4.1-05/enforcing-due-sale-or-due-transfer-provision>. Explains enforcement of nonexempt transfers within its scope. No inference was made about a different investor’s policy or a particular borrower’s loan.
7. **CFPB, Regulation Z §1026.3 and official commentary** — <https://www.consumerfinance.gov/rules-policy/regulations/1026/3/>. Current regulation view. Business-purpose and occupancy rules require transaction-specific classification; commentary differentiates non-owner-occupied rental property from owner-occupied situations. The revised copy does not decide the classification of an actual loan.
8. **CFPB, Qualified Mortgage explanation** — <https://www.consumerfinance.gov/ask-cfpb/what-is-a-qualified-mortgage-en-1789/>. Last reviewed January 2, 2025. Supports the revised QM definition and separation from a guarantee of approval or affordability.
9. **VA, funding fee and closing costs** — <https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/>. Updated October 5, 2026. The seller-credit section differentiates ordinary closing costs from concessions and states the 4% reasonable-value limit for concessions.
10. **Deephaven, official DSCR program and resources** — <https://deephavenmortgage.com/dscr-wholesale-lender/> and <https://deephavenmortgage.com/thehavenwholesaleresources/>. Used internally only to check that DSCR programs can still have borrower, credit, reserve, entity, and program requirements. This is professional-facing material, not a Forward/Logan product commitment. Its matrix and marketing language were not republished as consumer offers. No new lender affiliation is asserted.
11. **Fannie Mae Selling Guide B2-1.1-01, occupancy types** — <https://selling-guide.fanniemae.com/sel/b2-1.1-01/occupancy-types>. Topic dated October 5, 2022, in the current guide view linking the October 7, 2026 publication. Identified rental income does not automatically prevent second-home treatment if it is not used for qualification and all second-home requirements are met. This supports the limited correction to the glossary; it does not promise second-home eligibility for a particular mixed-use property or another lender’s program.

## Client / compliance decisions still required

- Verify current legal/DBA presentation, company and individual state records, license labels, and required disclosure wording. The public company page’s April 29 date is not independent confirmation of October status. Confirm any advertising differences between broker and correspondent transactions.
- Confirm actual product availability, states, property types, occupancy, business purpose, entity/guarantor rules, personal documentation, credit, leverage, ratio calculation, reserves, fees, prepayment terms, and any timing claim against approved current lender guidance. The preview deliberately makes no replacement rate quote or numerical product matrix.
- Approve the pre-approval and scenario-review wording against the real workflow. An intake request, tentative calculation, financing letter, underwriting approval, and funding are different stages.
- Approve the revised regulated copy and example treatment before production. If release occurs in a later calendar year, refresh the limit table and date references.

This targeted work is **not** a full legal or program review of every pre-existing FAQ or glossary entry. Unchanged material, including general FHA/VA/USDA eligibility, mortgage-insurance rules, down-payment assistance, tax treatment, credit inquiry effects, and document/timing statements, remains subject to the existing compliance hold. No approval is implied by leaving a paragraph unchanged. No Instagram speech or unverified client success was used as evidence.

## Validation performed for these edits

- Parsed all JSON-LD in the four pages.
- Compared all 52 visible FAQ questions/answers with their FAQPage structured data: exact text parity.
- Checked the article’s meta, Open Graph, Twitter, Article, and WebPage descriptions for parity; checked its three structured FAQs against visible content.
- Verified the illustrative ratio and subtraction above.
- Compared NMLS values and occurrence counts with the branch baseline; both preserved.
- Reviewed owned-file diffs for targeted phrases, placeholder removal, and whitespace errors.

The coordinating agent is responsible for the combined source/build audit and browser checks after all contributors finish. Build/audit results do not lift the compliance hold or establish a live release.
