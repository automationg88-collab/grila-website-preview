# Grila Rollers & Accessories — Website

## Current working version

Use the `feature/daylight-simulation-fix` branch as the **single working baseline**. It contains the current static website, bundled real installation photos, and interactive daylight/blind-position simulator.

- Main page: `index.html`
- Required local assets: only files under `assets/` referenced by `index.html`
- Keep changes on this feature branch while developing and testing.
- `main` is the current GitHub Pages deployment branch. Do not merge or deploy to `main` until desktop/mobile browser QA and contact-path checks pass and the release is explicitly approved.

## Release checklist

1. Confirm every local image loads and all page links work.
2. Test the simulator at fully open, middle, and fully closed positions on desktop and mobile.
3. Check narrow mobile layout, keyboard/focus access, reduced-motion behavior, and browser-console errors.
4. Confirm the enquiry/contact action reaches the intended business channel and does not imply that a form submits when it only prepares a message.
5. Verify the public URL after the approved release.

This repository is the working website source. Do not use old standalone HTML/ZIP snapshots as alternate implementations; useful ideas should be deliberately incorporated into `index.html` before those snapshots are retired.