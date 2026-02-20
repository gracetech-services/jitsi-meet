#!/bin/bash
#
# Fishmeet React Native SDK build script
#
# Applies fishmeet SVG overrides to react/features/base/icons/svg/, then
# runs `npm pack` inside react-native-sdk/.
#
# Usage:
#   ./build.fishmeet-rnsdk.sh [--pack-destination <path>]
#
#   --pack-destination  Optional. Directory where the .tgz will be placed.
#                       Typically the packages/ folder of your gt-jitsisdk
#                       clone. When omitted, the .tgz lands in react-native-sdk/.
#
# Example:
#   ./build.fishmeet-rnsdk.sh --pack-destination ../gt-jitsisdk/packages/
#

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FISHMEET_DIR="$PROJECT_DIR/fishmeet"

echo "=== Fishmeet React Native SDK Build ==="
echo "Project directory: $PROJECT_DIR"

# Apply fishmeet SVG overrides.
# CSS overrides (fishmeet/css/) are web-only and are not needed here.
if [ -d "$FISHMEET_DIR/react/features/base/icons/svg" ]; then
    echo "Copying fishmeet SVG overrides..."
    cp -v "$FISHMEET_DIR/react/features/base/icons/svg/"*.svg \
          "$PROJECT_DIR/react/features/base/icons/svg/"
else
    echo "Warning: fishmeet SVG override directory not found, skipping."
fi

# Pack the SDK.  Forward all arguments so callers can pass --pack-destination
# or any other npm-pack flags.
echo "Packing React Native SDK..."
cd "$PROJECT_DIR/react-native-sdk"
npm pack "$@"

echo "=== Fishmeet React Native SDK Build Complete ==="
