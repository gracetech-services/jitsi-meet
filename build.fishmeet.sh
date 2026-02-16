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

# Copy SVG overrides
if [ -d "$FISHMEET_DIR/react/features/base/icons/svg" ]; then
    echo "Copying SVG overrides..."
    cp -v "$FISHMEET_DIR/react/features/base/icons/svg/"*.svg "$PROJECT_DIR/react/features/base/icons/svg/"
fi

# Run make
echo "Running make..."
cd "$PROJECT_DIR"
make "$@"

echo "=== Fishmeet Build Complete ==="
