# Source material and approval needed before release

This implementation is a review branch. Production was last verified at Netlify deploy `6acd603263303f94f5730b94`, corresponding to repository source `73aa3e7`. Do not describe the preview changes as live.

## Video clips

No video files or verified dialogue were supplied. The four-month Instagram archive has not been represented as watched, transcribed, or complete. The public profile supports the specialist positioning, but it is not a transcript source.

For each clip selected by Logan, provide:

- The actual MP4 file and its specific original Instagram reel/post URL.
- Original publication date, title, and a short summary checked against the clip.
- Accurate English captions in WebVTT format and a suitable poster image.
- Permission to publish the clip, its audio, and the chosen poster on this website.
- A reviewer and review date for the statements in the clip, including time-sensitive rates, limits, and eligibility language.
- The relevant service page and any necessary context that prevents the example being read as a universal offer.

Add only approved items to `content/videos.json`. Put captioned, permissioned assets in `assets/video/`. Use unique descriptive file names when replacing media because assets have immutable caching. `scripts/render-videos.mjs` validates local assets and metadata and builds click-to-play, captioned videos on the homepage and matching service route. Empty sections are omitted. No Instagram tracking embed loads on page view.

Entry format (illustration only; do not publish this record):

```json
{
  "id": "unique-clip-slug",
  "title": "Title checked against the actual video",
  "summary": "A reviewed summary of what Logan explains.",
  "publishedAt": "YYYY-MM-DD",
  "reviewedAt": "YYYY-MM-DD",
  "reviewedBy": "Authorized reviewer",
  "approved": true,
  "permissionConfirmed": true,
  "sourceUrl": "https://www.instagram.com/reel/ACTUAL_POST_ID/",
  "src": "assets/video/unique-clip-slug.mp4",
  "poster": "assets/video/unique-clip-slug.webp",
  "captions": "assets/video/unique-clip-slug.vtt",
  "relatedRoute": "/dscr-loans"
}
```

## Three documented client examples

The new `/loan-scenarios` page contains explicitly hypothetical educational examples. They do not replace verified case studies. Obtain one rental-property file, one self-employed borrower file, and one renovation/bridge file, if those examples accurately represent Logan’s work.

For each, record the original problem, relevant information reviewed, financing approach, major constraint, timeline, actual outcome, and the source document supporting each factual claim. Obtain publication permission, remove unnecessary identifying information, and have Logan/compliance approve the final wording. Do not turn estimates into funded amounts or advertise a historical outcome as a promised result.

## Reviews and personal biography

The Google links are standardized to the business identifier already present in the repository. Direct visibility of the current Google Business Profile and individual reviews remains a manual verification item. Do not add star counts, testimonials, or review schema from an unverified search result. Logan should select and approve any quoted feedback and confirm the destination points to the intended business.

The biography uses Logan’s established role and current company description. Logan should supply any personal background, tenure, specific specialization history, or performance evidence he wants included. No personal history was invented.

## Regulated copy and offering confirmation

- Review `regulated-content-review.md` and `service-content-review.md` in this directory.
- Confirm the company legal identity, displayed AZ/CA numbers, and Logan’s current individual authority in each advertised state. Company disclosure text is attributed; an active individual license was not independently certified.
- Confirm the actual availability of the nine specialist routes and any product-specific restrictions before publishing. Land-only lending is not added because the offering was not confirmed.
- Confirm Logan’s direct phone/email, the lender-network/correspondent explanation, and the Google review destination. Existing direct contact details and Netlify form names are preserved.
- Approve the updated disclosure, glossary, FAQ, and program descriptions before an explicit production release, as required by the existing `SOURCE_OF_TRUTH.md` compliance hold.

## Review ownership

Logan/authorized compliance reviewer owns regulated and product copy; Little Fight NYC owns implementation, link checks, and publishing. Record actual approval in the review register rather than replacing pending status with an assumed approval. Review annual limits before the next year, and review changing eligibility statements whenever a lender changes its guidelines.
