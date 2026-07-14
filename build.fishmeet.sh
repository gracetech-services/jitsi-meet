#!/bin/bash
#
# Fishmeet build script
# Copies fishmeet overrides to their destinations, then runs make
#

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FISHMEET_DIR="$PROJECT_DIR/fishmeet"

echo "=== Fishmeet Build ==="
echo "Project directory: $PROJECT_DIR"

# Copy CSS overrides
if [ -d "$FISHMEET_DIR/css" ]; then
    echo "Copying CSS overrides from fishmeet/css/ to css/..."
    cp -v "$FISHMEET_DIR/css/"_*.scss "$PROJECT_DIR/css/"
fi

# Copy react/ overrides (SVGs, styles, components, etc.)
if [ -d "$FISHMEET_DIR/react" ]; then
    echo "Copying react/ overrides..."
    rsync -r "$FISHMEET_DIR/react/" "$PROJECT_DIR/react/"
fi

# Stamp build date into fishmeet/index.html in place.
# Replaces the entire "<!-- fishmeet build: ... -->" comment so repeated
# builds work without needing to restore a placeholder.
BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S %Z')
ASSET_VERSION=$(date '+%Y%m%d%H%M%S')
echo "Stamping build date: $BUILD_DATE"
echo "Stamping asset version: $ASSET_VERSION"
BUILD_STAMP="<!-- fishmeet build: $BUILD_DATE -->"
perl -0pi -e "s|<!-- fishmeet build: .* -->|$BUILD_STAMP|g" "$FISHMEET_DIR/index.html"
perl -0pi -e "s#(libs/(lib-jitsi-meet|app\\.bundle)\\.min\\.js\\?v=)[^\"]+#\${1}$ASSET_VERSION#g" "$FISHMEET_DIR/index.html"

for asset in lib-jitsi-meet app.bundle; do
    if ! grep -Fq "<script src=\"libs/$asset.min.js?v=$ASSET_VERSION\"></script>" "$FISHMEET_DIR/index.html"; then
        echo "Failed to stamp asset version for $asset.min.js" >&2
        exit 1
    fi
done

# Run make
echo "Running make..."
cd "$PROJECT_DIR"
make "$@"

echo "=== Fishmeet Build Complete ==="
