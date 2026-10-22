# Grila Rollers & Accessories — Website

## Source of truth

**`main` is the single canonical working and GitHub Pages deployment branch.** The released implementation lives in `index.html` with its required local assets under `assets/`.

- Make future website changes against `main` as the source of truth.
- For substantial changes, use a short-lived branch from `main`, run the release checklist, merge after validation, then retire the temporary branch. Never maintain competing website versions.
- Do not use old standalone HTML/ZIP snapshots as alternate implementations. Reuse a design idea only by deliberately incorporating and testing it in the canonical site.

## Hosting and tool constraints

- **Use GitHub and GitHub Pages for this website project. Do not use Vercel.** The user disconnected from Vercel and has explicitly instructed that it must not be used for website work, deployments, previews, troubleshooting, or recommendations.
- Do not reconnect Vercel or create Vercel deployments/projects. Continue from the existing GitHub repository and its current `main` branch.
- Keep one canonical website version; do not create competing branches or copies just to preview a change.

## Execution lessons and failure prevention

These are mandatory operating rules learned from recent failures; follow them before making further changes.

1. **Respect tool exclusions as hard constraints.** Never use Vercel for this project. Before any tool call, check that the tool and proposed action are within the user's current hosting and access constraints.
2. **Inspect before changing.** Recover the latest repository state and current handoff/instructions first. Identify the exact failing layer and collect evidence (workflow run status, job status, steps/logs, workflow YAML, Pages configuration/deployment status, and public response) before editing configuration.
3. **Do not confuse a queued job with a code failure.** A `queued` run with no steps executed is not evidence that the website code or deployment steps failed. Check runner availability/scheduling, concurrency, environment protection, and recent runs before selecting a fix.
4. **Do not change workflow protections speculatively.** Removing an environment gate, changing permissions, or altering deployment configuration requires evidence that it is the actual blocker and that the change is necessary. Prefer a targeted, reversible fix; preserve security and recovery paths.
5. **A commit is not a deployment.** Verify the intended commit was published by GitHub Pages, then inspect the public HTML/assets and interact with the actual page. Do not claim success based only on a commit, a queued run, or a deployment request.
6. **Finish the inspection-to-fix loop.** After each change, check the result, test the actual user-facing behavior and relevant regressions, record what passed/failed, and continue to the next blocker. Avoid repetitive progress-only updates; report a blocker only after the relevant diagnostic checks and state the next concrete action.
7. **Maintain evidence labels.** Mark facts as VERIFIED only when directly confirmed by an identifiable tool result or test. Keep hypotheses labelled as hypotheses; never present plausible causes as established root causes.

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
