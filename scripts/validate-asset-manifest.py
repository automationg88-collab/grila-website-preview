#!/usr/bin/env python3
"""Validate the Grila 3D asset manifest and prevent missing approved assets."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets" / "3d" / "manifest.json"
errors = []

try:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
except Exception as exc:
    print(f"FAIL: cannot read valid JSON at {MANIFEST.relative_to(ROOT)}: {exc}")
    sys.exit(1)

if data.get("schemaVersion") != 1:
    errors.append("schemaVersion must be 1")
if data.get("units") != "meters":
    errors.append("units must be 'meters'")

tube = data.get("confirmedDimensions", {}).get("rollerTubeDiameter", {})
if tube.get("value") != 0.03 or tube.get("unit") != "m":
    errors.append("confirmed roller tube diameter must remain 0.03 m (30 mm)")

components = data.get("components")
if not isinstance(components, list) or not components:
    errors.append("components must be a non-empty list")
else:
    seen = set()
    for component in components:
        component_id = component.get("id")
        if not component_id:
            errors.append("every component needs an id")
            continue
        if component_id in seen:
            errors.append(f"duplicate component id: {component_id}")
        seen.add(component_id)
        if component.get("status") == "approved":
            asset = component.get("asset")
            if not asset:
                errors.append(f"{component_id}: approved component has no asset path")
                continue
            relative = Path(asset)
            if relative.is_absolute() or ".." in relative.parts:
                errors.append(f"{component_id}: asset path must stay inside repository")
                continue
            asset_path = (ROOT / relative).resolve()
            if ROOT.resolve() not in asset_path.parents:
                errors.append(f"{component_id}: asset path escapes repository")
            elif not asset_path.is_file():
                errors.append(f"{component_id}: approved asset file missing: {asset}")
            elif asset_path.suffix.lower() != ".glb":
                errors.append(f"{component_id}: production web asset must be .glb")

if errors:
    print("3D asset manifest QA FAILED:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"3D asset manifest QA passed: {len(components)} components tracked; tube diameter fixed at 30 mm.")
print("Note: this validates metadata and file presence, not visual realism or mechanical accuracy.")
