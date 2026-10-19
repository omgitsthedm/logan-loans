# Logan Loans PR #8 — technical verification

Reviewed October 19, 2026 against PR source `3d296f4` and canonical base `73aa3e7` (`origin/master`). This is local implementation evidence, not a GitHub CI receipt, client/compliance approval, hosted visual pass, or production release.

## Result

The technical implementation passes the existing build and offline regression suite. No runtime, form, or CSS defect requiring a speculative change was found in this review. Existing inquiry identities and delivery routes are preserved. Production release remains blocked by the regulated-content decisions recorded separately and the missing hosted/responsive verification.

### Checks performed

| Check | Result and limit |
| --- | --- |
| `bash scripts/build-site.sh` | Passed: 68 content HTML pages, 58 indexable URLs, 67 shared-shell pages; Google verification file additionally retained. |
| `node scripts/audit-site.mjs .` | Passed source audit, including forms, metadata, JSON-LD parsing, local asset targets and exact sitemap/indexable-route agreement. |
| Calculator, analytics, investor inquiry, specialist journey, video publishing and footer regression scripts | Passed as part of build. These are local automated checks; they do not prove provider delivery, visual quality, regulatory accuracy, or approval. |
| Independent HTML parser comparison with `origin/master` | All five form names, hidden identities, POST methods, native actions, and honeypot names preserved. No legacy input field removed. |
| Independent internal-fragment inspection | 230 internal fragment links resolve to an existing target ID in the built pages. |
| Built artifact inspection | Only `assets` and `data` are published as subdirectories. No review documents, source manifests, scripts, Markdown, or environment files found in the artifact. Zero MP4/VTT files published. |
| `git diff --check` | Passed at the time of baseline review. Re-run with the final assembled changes. |

The build also checks responsive image candidates and stamps the shared script/styles and all three new CSS files with content hashes. The nine specialist routes plus `/loan-scenarios` have extensionless canonical URLs, sitemap entries, matching analytics allowlist entries, and `.html` redirects in `netlify.toml`. The build does not copy `netlify.toml` into `dist`; deploy configuration must be applied from the repository's Netlify configuration during any preview or production release.

## Customer inquiry preservation

| Form identity / hidden `form-name` | Page | Required fields in this candidate | Change relative to base |
| --- | --- | --- | --- |
| `apply` | `/apply` | name, email | Existing field contract and `./thanks` native action unchanged; scenario shortcuts added outside the form. |
| `preapproval` | `/contact` | name, email | All ten legacy fields retained; 18 optional fields added. Phone, city, and timeline are now optional. No native action existed before or after; enhanced handler still POSTs to `/` and redirects to `./thanks-contact`. |
| `general-contact` | `/contact` | name, email | Existing five fields retained; message is now optional. Native current-page action and enhanced `./thanks-contact` destination preserved. |
| `partner-referral` | `/partners` | name, phone, email, brokerage | Field contract and `./thanks-contact` native action unchanged. |
| `newsletter` | `/blog` | email | Field contract and `./thanks-contact` native action unchanged. |

The new scenario enhancer uses a closed set of routing labels. Query values cannot populate name, email, or financial answers. A visitor's restored goal takes priority over the incoming scenario. Changing goals hides and disables unrelated optional inputs without clearing their values; inactive inputs stay out of the POST body. Without JavaScript, all optional groups remain available through native `<details>` controls.

The offline harness verifies a successful simulated POST, server/network failure, a 15-second timeout, duplicate-submit prevention, preservation of typed entries, button recovery, the direct-phone fallback, and the original confirmation destination. It makes no network requests. No real or test lead was submitted to Netlify in this review. Receiving an inquiry in the business inbox and responding to it remain operating/provider checks, not conclusions from these tests.

The session's separate read-only Netlify check confirmed the five current provider form identities. It does not prove that newly added fields have been registered by a hosted candidate, or that recipient delivery works.

## Privacy and video publication

- Analytics continues to require affirmative consent on the exact production hostname and a known indexable route. Preview hosts, QA sessions, webdriver runs, noindex/unknown pages and unavailable session storage remain analytics-off. The PR only adds the new public routes to the allowlist.
- Scenario labels, user answers, query strings and arbitrary caller data are not sent in custom analytics events. Offline regression explicitly verifies the newly added financial fields do not leak to the data layer.
- `content/videos.json` has no entries, `data/instagram.json` has no posts, and the generated site contains no video library. Removed profile cards are not represented as verified clips.
- The build excludes `assets/video` from the general copy step. The renderer only copies manifest-listed MP4, VTT and poster assets after checking explicit approval/permission flags, reviewer identity, valid dates, a canonical individual Instagram post URL, allowed local paths, supported destination page and at least one timed caption cue.
- Those mechanical checks cannot establish that captions match the recording, a reviewer is authorized, content remains accurate, or permissions exist. Actual source files, transcript/caption verification and documented publication permission must precede any approved manifest entry. An empty video inventory is safe for a text-only release once its other gates pass; it is not a completed video deliverable.

## Responsive review and remaining technical gates

Static CSS inspection found deliberate small-screen rules, not a confirmed rendered result: specialist hero collapses at 850px; service grids collapse at 620px; contact sidebar collapses at 900px and fields at 600px; discovery/video grids collapse at 600px; scenario definition lists become one column at 600px. New CTAs wrap, and form/grid children use `min-width: 0` or `minmax(0, 1fr)` where needed. New form summaries and service CTAs have touch-size minimums and explicit keyboard focus styles. No source-level responsive blocker was identified.

Hosted and visual checks remain **not completed**. The release review's access attempts found no configured Netlify CLI credentials, no create-deploy operation in the connected tool, and a Netlify sign-in wall in the available browser. The remote browser could not reach the workspace's local HTTP server. No screenshot, desktop/mobile rendering, overflow, keyboard walkthrough, or hosted redirect/header pass is claimed.

Little Fight NYC owns these remaining implementation checks after preview access is available:

1. Rebuild the final reviewed source and deploy an immutable **draft only** using `dist` and the repository's Netlify configuration. Confirm production deploy is unchanged.
2. Verify preview `X-Robots-Tag: noindex`, HTTPS, asset loads, CSP/security headers, extensionless routes and ten `.html` redirects. Keep preview out of search and confirm analytics stays off.
3. Inspect home, programs, investor overview, all nine specialist pages, three hypothetical examples, contact/apply, disclosures and privacy at desktop and phone widths, including 320px and 390px. Check horizontal overflow, text clipping, focus, drawer, sticky call bar, footer and touch targets; inspect actual rendering rather than infer it from CSS.
4. Walk rental, rehab, bridge, self-employed, construction and home-equity inquiry links; switch goals and check restoration, optional details and labels. Inspect no-JavaScript access. Do not submit live forms as an incidental QA step.
5. Read-only verify Netlify recognizes the same five form identities and additional candidate fields. Any end-to-end delivery test requires a deliberately authorized provider test with its own evidence; never claim receipt from static code.
6. Re-run build/audit and `git diff --check` on the final candidate, record the candidate commit and immutable preview, and obtain the named client/compliance decisions before production publication.

At review time the parent release check reported current production deploy `6acd603263303f94f5730b94` (October 12, source `73aa3e7`). No merge, deployment, production configuration change, or customer inquiry was performed by this technical review.
