# Grila Rollers & Accessories — Website

## Source of truth

**`main` is the single canonical working and GitHub Pages deployment branch.** The released implementation lives in `index.html` with its required local assets under `assets/`.

- Make future website changes against `main` as the source of truth.
- For substantial changes, use a short-lived branch from `main`, run the release checklist, merge after validation, then retire the temporary branch. Never maintain competing website versions.
- Do not use old standalone HTML/ZIP snapshots as alternate implementations. Reuse a design idea only by deliberately incorporating and testing it in the canonical site.

## Current implementation

- Static, responsive website with bundled local installation photos.
- Interactive daylight/blind-position simulator. This is an illustrative preview, not a photometric measurement.
- Enquiries go to the publicly listed business phone **+355 69 246 7968** or email **grila.rollers.accessories@gmail.com**. There is no server-backed contact form; do not describe it as one.

## Release checklist

1. Confirm every local image loads and all in-page navigation targets resolve.
2. Test the simulator at fully open, middle, and fully closed positions on desktop and mobile.
3. Check narrow mobile layouts (including 320px), keyboard/focus access, reduced-motion behavior, and browser-console/network errors.
4. Verify the phone and email links against the business's current public contact details. Do not use `hello@grila.al` unless its email service is configured and verified.
5. Confirm the GitHub Actions build/deployment succeeds for the intended `main` commit.
6. Open the public site after deployment and repeat the key browser checks.

This repository is the website source of truth. Keep it simple: one canonical page, only referenced local assets, and no duplicate packaged implementations.