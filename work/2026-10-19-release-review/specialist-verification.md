# Specialist page and scenario verification — October 19, 2026

Internal release evidence for PR #8. Reviewed draft source `3d296f4a423cf060d7bc0153418345965f81b412`, the nine specialist HTML pages, `loan-scenarios.html`, `content/service-pages.json`, and the October 18 service review. This is a factual/editorial implementation review, not regulated-content approval.

## Decision

The nine pages are ready for Logan's factual review and authorized compliance review. None is independently cleared for production. General educational explanations are supported, but the branded titles, Arizona/California positioning, product-specific inquiry CTAs, homepage/program cards, and `hasOfferCatalog` / `Offer` structured data collectively communicate available services. Conditional wording in paragraphs does not establish actual availability or clear that publication boundary.

The three scenarios are clearly labeled hypothetical, contain no customer identity, funded result, rate, loan amount, profitability result, or guaranteed outcome, and do not need invented case-study permissions. They still need the same regulated-content/publication review as the products to which they route.

No lending terms or financial claims were changed in this review. One source-verifiable technical defect was corrected: `loan-scenarios.html` closed its main landmark after the global footer. The closing tag now precedes the footer, consistent with all nine specialist pages. Customer copy, actions, form identities, contact details, NMLS identifiers, and media inventory were preserved.

## Minimum approval required across every page

Logan or an authorized compliance reviewer must provide a dated approval covering:

1. Correct public business/legal name, individual and company NMLS identifiers, current license status, permitted state coverage, and Logan/Forward's actual transaction role. Copying an identifier or company biography is not a current registry certification.
2. Which of the nine product categories Logan can actually discuss/originate/arrange now, with applicable state, occupancy, property, and purpose limitations. Approval must cover page metadata, navigation/card descriptions, inquiry labels, and homepage/program structured offers as well as body text.
3. The supplied body copy, FAQs, disclosures and identity line as a complete publication package. General source verification is evidence for that review, not a substitute for its sign-off.
4. Who owns each inquiry and how the customer receives secure document/application instructions. No sensitive financial documents should be solicited through the public marketing form.

For the draft as written, no rate sheet or fabricated universal eligibility threshold is needed. If a category is unavailable, the release package must omit or revise its page, related cards/links, metadata, and structured offer consistently. A missing answer must not be treated as approval. More specific product claims require the additional evidence described below before they are added.

## Page-by-page disposition

All rows remain **hold for client/compliance publication approval** after the technical review passes.

| Page | Educational content verified | Required product decision for this draft | Evidence required before adding specifics |
| --- | --- | --- | --- |
| `/hard-money` | Real-estate collateral and a short investment horizon are consistent with a primary lender's description. Borrower, cash, ownership, repayment and draw questions are appropriately conditional. | Confirm active business-purpose hard-money channel, states, eligible collateral/projects, and transaction role. | Actual lender requirements for experience, entity/guarantee, disbursements, maturity, extension, fees and prepayment. No fast-close guarantee is present. [S8–S9] |
| `/non-qm` | Outside-QM classification does not itself remove applicable repayment review. The page distinguishes business-purpose rental financing and does not promise no documentation or easier approval. | Confirm current Non-QM channels, consumer/business purposes and occupancy scope. Approve the classification/ATR wording in context. | The actual documentation pathways and program terms; no assertion that all investor loans are covered consumer Non-QM transactions. [S1–S2, S10] |
| `/bank-statement-loans` | Personal/business statements are used by some lenders; eligible deposits and expenses differ from gross deposits. The draft correctly defers period, ownership and calculation details. | Confirm this documentation channel is actually available for the relevant loan purposes/states. Confirm secure document handoff. | Accepted account types, statement period, eligible deposits, expense method, ownership, supporting documents and complete eligibility rules. Another lender's thresholds are not Logan's terms. [S7] |
| `/dscr-loans` | Residential rental lenders can compare rent with a program-defined property payment while separately reviewing credit, reserves and entity documents. A qualifying ratio is not an investment return or complete cash-flow budget. | Confirm available rental DSCR channels, occupancy and property coverage; approve how rent/payment are described. | Actual rent evidence, qualifying payment components, credit/reserves/guarantees, short-term rentals, cash-out and prepayment terms. No universal ratio or approval threshold is asserted. [S6] |
| `/fix-and-flip` | Rehab funding can be staged, subject to inspection/review, and reimbursed after work. The draft asks the right cash-flow/scope/exit questions and does not guarantee value, full funding, a sale, or refinancing. | Confirm acquisition/refinance/rehab channels and eligible property/project types. | Actual draw and inspection process, contractor/experience rules, eligible costs, funding timing, maturity/extensions and exits. [S8–S9] |
| `/bridge-loans` | Temporary financing can connect a purchase to a sale/refinance; investor and consumer structures differ. Future refinancing is not established by a bridge approval. | Confirm investor bridge availability. Separately confirm whether homeowner buy-before-sell is actually a channel Logan can review; the current page treats it as a question, not an assured offer. | Collateral/lien structure, occupancy, cash needed during overlap, maturity/extensions and acceptable exits. Do not import the regulatory example's duration as Logan's term. [S8, S10] |
| `/construction-loans` | Staged construction financing differs from buying a completed builder home. Separate payoff/application versus conversion depends on the structure and conditions. | Confirm which construction category is available: ground-up and/or renovation, consumer and/or investment. Confirm whether the page's intended inquiry can be serviced. | Site acquisition, owner-builder/builder policy, draws, contingencies, deadlines and permanent conversion. No standalone land loan or automatic conversion has been established. [S3] |
| `/home-equity` | HELOC, closed-end home equity loan and cash-out refinance are distinct structures. Line payments/access can change; home collateral is at risk; refinancing replaces the old mortgage. | Approve HELOC and closed-end home equity availability separately by state/use, plus the refinance comparison. The company biography is corroboration, not a product matrix or approval. | Draw/repayment periods, rate/payment structure, lien requirements, fees and account-freeze terms. The draft appropriately avoids fixed universal periods or rates. [S4–S5, S11–S12] |
| `/jumbo-loans` | The relevant conforming loan limit depends on year, location and units; the loan balance, not purchase price alone, determines whether it exceeds that limit. No stale numeric limit is introduced here. | Confirm jumbo availability, state/property/use coverage, and approval of the general income/assets review. Company biography corroborates the category only. | Lender-specific documentation, reserves, loan sizes, adjustable/fixed structures, and any bank-statement jumbo channel. Assign an owner for future limit updates. [S13, S12] |

## Scenarios

| Scenario | Disposition and preserved guardrails |
| --- | --- |
| Rental property | Hypothetical label and introductory disclaimer are prominent in source. Rent/payment methodology is deferred to the lender, other expenses and vacancy remain separate, and no profitable result is claimed. Product availability and CTA follow the DSCR approval above. |
| Self-employed buyer | Does not equate gross business revenue with qualifying income. Bank-statement option is conditional and the inquiry discourages sending statements. Follows bank-statement approval above. |
| Renovation and planned sale | Contains planning assumptions and delay/repayment risks, not a success story. No sale price, return, loan cost or funding date is invented. Follows fix-and-flip approval above. |

The scenario page still carries the shared footer's conditional same-day-preapproval wording. This review does not certify that operational claim; it remains part of the overall shared-copy approval. No video has been added, and no hypothetical scenario should be relabeled as a real client example without separately verified facts and permissions.

## Primary sources checked

Primary regulator sources support general explanations. Primary lender sources are examples of real product mechanics only; there is no evidence here of a Logan relationship with Kiavi, Visio, or Angel Oak, and none is implied. Their published prices, thresholds, durations, testimonials and marketing promises were not imported into Logan's copy.

- **S1 — CFPB, Qualified Mortgage:** https://www.consumerfinance.gov/ask-cfpb/what-is-a-qualified-mortgage-en-1789/ — QM category and verification/repayment explanation.
- **S2 — CFPB, ability-to-repay:** https://www.consumerfinance.gov/ask-cfpb/what-is-the-ability-to-repay-rule-en-1787/ — good-faith repayment determination; QM is one route to compliance.
- **S3 — CFPB, construction loan:** https://www.consumerfinance.gov/ask-cfpb/what-is-a-construction-loan-en-108/ — temporary/staged funding; conversion or separate financing depends on structure.
- **S4 — CFPB, HELOC:** https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-107/ — draw/repayment, variable payments, access restrictions and home-collateral risk. Current page reviewed August 28, 2026.
- **S5 — CFPB, equity loan versus line:** https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-home-equity-loan-and-a-home-equity-line-of-credit-heloc-en-247/ — lump sum versus revolving credit; existing first mortgage may remain. It does not say every closed-end home equity loan must have a fixed rate.
- **S6 — Visio, residential DSCR guide:** https://visiolending.com/dscr-loans/ — rent/PITIA example, separate investment expenses, credit/ID/entity/reserve review. This supports the draft's limited explanation, not Visio's thresholds as a universal rule.
- **S7 — Angel Oak, bank-statement program:** https://angeloakms.com/programs/bank-statement-mortgage-program/ — eligible deposits, ownership, business expenses and account documentation vary under an actual program.
- **S8 — Kiavi, hard-money financing:** https://www.kiavi.com/lp/hard-money-loans — property-secured investment financing, acquisition/refinance and temporary bridge use.
- **S9 — Kiavi, draws:** https://www.kiavi.com/platform/draws — indexed primary-page text describes request, inspection, approval, reimbursement and scope changes. Search retrieval provided full text; direct open later returned an access error. No assumption was made that every lender uses Kiavi's process.
- **S10 — CFPB, current Regulation Z 1026.43:** https://www.consumerfinance.gov/rules-policy/regulations/1026/43/ — current page identifies consumer/business-purpose scope and temporary bridge/construction examples. The initially surfaced January 1, 2026 version was explicitly superseded; the current version was checked instead. No exemption was applied to a Logan transaction.
- **S11 — CFPB, alternatives to HELOC:** https://www.consumerfinance.gov/ask-cfpb/what-other-types-of-loans-are-similar-to-a-heloc-en-253/ — cash-out refinance replaces the existing mortgage and changes the economics of the balance.
- **S12 — Forward Loans, Logan biography:** https://forward.loans/loan-officer/logan-sullivan/ — explicitly lists jumbo, home-equity loans and HELOCs as categories Logan works on. It directs readers to NMLS for individual-state verification, so company state coverage cannot certify Logan's individual coverage. It supplies no reviewed product matrix or publication authorization.
- **S13 — FHFA, conforming limits:** https://www.fhfa.gov/data/conforming-loan-limit — the 2026 county/unit datasets and definition support the jumbo page. The specialist page contains no numeric limit requiring substitution.
- **S14 — Existing Logan programs:** https://logan.loans/programs — current public marketing mentions construction, home equity, fix-and-flip and bridge. This is provenance for review, not independent verification of approved/current availability.

## Verification performed

Source checks passed for all nine pages: inventory/body parity for title, description, heading, lead, introduction, closing copy, constraints, discussion questions, documents and hero points; exact FAQ/inventory/FAQ-schema parity; main landmark ending before footer; protected NMLS identifier presence; no newly introduced form elements. All three scenario labels are present. `git diff --check` passed for the scenario landmark correction.

Full-site form-identity regression, hosted preview, responsive screenshots, and production status are owned by the integration/release review. No lead was submitted, no form configuration was changed, and this review did not commit, push or deploy.
