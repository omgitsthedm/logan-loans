# Changelog

## 2026-10-28 — production `6ae19c65` (source `227d4aa`)
- Restored security headers and all 77 redirects; rules now ship in `_headers` / `_redirects` so every deploy method applies them.
- Applied Logan's Oct 27 directives: all apply/pre-qualify/contact CTAs go to Forward Loans; licensing line on every page; speed promises removed; Instagram is the only social profile; no public office address.
- Layout and accessibility: footer moved out of `<main>`, 320px fixes on `/contact` and `/partners`, one-row glossary letter bar on phones, contrast fixes, 16px text and 44px tap-target floors.

## 2026-10-27 — production `6ae13448`
- Removed the Forward Loans HQ address (hotfix). This upload dropped the `netlify.toml` headers and redirects; fixed by the 2026-10-28 release.
