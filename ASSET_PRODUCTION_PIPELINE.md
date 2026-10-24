# Grila photorealistic asset-production pipeline

## Goal
One reusable source of truth for both website imagery/footage and the interactive Three.js configurator. Existing GitHub Pages deployment remains canonical. No Vercel, no paid services, and no speculative replacement of the current website.

## Current verified repository facts
- Canonical branch: `main`; site uses GitHub Pages.
- Current configurator is `configurator.html` and uses custom Three.js geometry.
- Repository already contains local product photos and simulator texture/scene images under `assets/`.
- Existing browser QA workflows use Playwright.
- Confirmed product measurement: roller tube diameter = **30 mm (0.03 m)**.
- Mounting plate palm-size is an estimate, not a measured specification.
- The user reports an AI-generated bead-chain drive/clutch that looks acceptable; the model file is not currently listed in this repository, so it has **not** been inspected or validated here.

## Pipeline stages

### 1. Reference intake
Keep original photos unchanged in `assets/references/` when available. Record each image's subject, view angle, known dimensions and confidence. Do not infer hidden geometry from a single view. Keep source photos separate from generated renders.

### 2. Component generation
Generate components separately rather than one fused blind:
- bead-chain drive/clutch (existing user candidate)
- 30 mm roller tube
- fabric roll and hanging fabric
- bottom rail
- mounting plate
- motor interface
- opposite-side bracket

Free-first workflow: use AI generation only to produce candidate geometry; use Blender (free) for inspection, cleanup, materials, camera setup and repeatable rendering. Do not treat image-to-3D output as dimensionally accurate by default. Avoid paid subscriptions unless a tested candidate proves a material quality improvement and the export terms allow website use.

### 3. Review gate (must pass before production)
For every component, review front, rear, side, top and assembled views where applicable. Check:
- silhouette and connection geometry against real references;
- dimensions and proportions; tube diameter must be 30 mm;
- clean normals/topology and no visible holes or broken surfaces;
- plausible manufactured edges, seams and material response;
- no unsupported invented details;
- model loads and performs on mobile.
If any critical check fails, mark the component rejected/needs revision. AI-generated scores alone cannot approve a mechanical part.

### 4. Master assembly and materials
Assemble validated components with meaningful names and separate meshes. Use physically plausible materials: woven screen fabric, matte/injection-molded plastic, anodized/extruded metal, rubber only where present. Avoid excessive gloss, procedural noise that looks like dirt, or lighting used to disguise geometry errors. Make test stills first; animation comes only after the stills are approved.

### 5. Shared outputs
From the same approved master asset produce:
- optimized GLB for the browser configurator;
- high-resolution stills for product/website sections;
- repeatable close-up views for fabric, chain drive, brackets and bottom rail;
- opening/closing animation only if the real mechanism and motion are confirmed.
Do not use a render as a product photograph without labeling it as a visualization when appropriate.

### 6. Web integration and automated checks
Keep Three.js and GitHub Pages. Add the approved GLB only after its file is present and its manifest status is `approved`. Keep a fallback using the existing real photos/static preview. Test desktop and narrow mobile, controls, asset loading, console/network errors and performance. Deployment success is not visual approval.

## Asset manifest
`assets/3d/manifest.json` records each component's status. The asset QA workflow checks JSON validity, required metadata, the fixed tube dimension, and that any component marked `approved` points to an existing file. It does not claim to prove photorealism or mechanical accuracy; those require reference-based review.

## Definition of done
- All required components are present and separately named.
- Tube diameter is 30 mm in the model and metadata.
- Bottom rail is visibly present and independently adjustable.
- Real references match the model in all critical views.
- Materials and lighting pass close-up still review before animation.
- GLB loads in the configurator, is optimized for mobile, and has a working fallback.
- Browser QA passes and the live Pages site is inspected after deployment.
