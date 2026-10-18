#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"
PUBLISH_DIR="$REPO_ROOT/dist"

if [[ "$PUBLISH_DIR" != "$REPO_ROOT/dist" ]]; then
  echo "Refusing to clean unexpected publish directory: $PUBLISH_DIR" >&2
  exit 1
fi

mkdir -p "$PUBLISH_DIR"
find "$PUBLISH_DIR" -mindepth 1 -delete

shopt -s nullglob
ROOT_FILES=(
  "$REPO_ROOT"/*.html
  "$REPO_ROOT"/*.css
  "$REPO_ROOT"/*.js
  "$REPO_ROOT"/*.png
  "$REPO_ROOT"/*.ico
  "$REPO_ROOT"/*.txt
  "$REPO_ROOT"/*.xml
  "$REPO_ROOT"/*.webmanifest
  "$REPO_ROOT/_redirects"
)
for source_file in "${ROOT_FILES[@]}"; do
  cp "$source_file" "$PUBLISH_DIR/"
done

mkdir -p "$PUBLISH_DIR/assets"
for asset_path in "$REPO_ROOT/assets"/*; do
  # Video files enter the publish artifact only through the approved manifest.
  if [[ "$(basename "$asset_path")" != "video" ]]; then
    cp -R "$asset_path" "$PUBLISH_DIR/assets/"
  fi
done
cp -R "$REPO_ROOT/data" "$PUBLISH_DIR/data"

node "$REPO_ROOT/scripts/render-narratives.mjs" "$PUBLISH_DIR"
node "$REPO_ROOT/scripts/render-videos.mjs" "$PUBLISH_DIR"
node "$REPO_ROOT/scripts/stamp-assets.mjs" "$PUBLISH_DIR"
node "$REPO_ROOT/scripts/test-video-publishing.mjs"
node "$REPO_ROOT/scripts/test-lifi-care-bar.mjs"
node --input-type=module -e "import { injectLifiCareBar } from '$REPO_ROOT/scripts/inject-lifi-care-bar.mjs'; const result = await injectLifiCareBar('$PUBLISH_DIR'); console.log(\`Installed Little Fight care bar on \${result.pages} pages.\`);"
node "$REPO_ROOT/scripts/audit-site.mjs" "$PUBLISH_DIR"
node "$REPO_ROOT/scripts/test-calculator.mjs" "$PUBLISH_DIR"
node "$REPO_ROOT/scripts/test-analytics.mjs"
node "$REPO_ROOT/scripts/test-investor-inquiry.mjs"
node "$REPO_ROOT/scripts/test-specialist-journeys.mjs" "$PUBLISH_DIR"

echo "Prepared safe publish directory: $PUBLISH_DIR"
