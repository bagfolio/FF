#!/bin/bash

# Script to fix Python/node-gyp deployment issues
# This script addresses the suggested fixes for deployment

echo "🔧 Configuring deployment environment for Python/node-gyp compatibility..."

# Set Python environment variables
export PYTHON=$(which python3)
export npm_config_python=$(which python3)
export PYTHON_PATH=$(which python3)

echo "✅ Python path configured: $PYTHON"

# Configure npm for native module compilation
npm config set python "$PYTHON"
npm config set target_platform linux
npm config set target_arch x64

echo "✅ NPM configured for native compilation"

# Verify Python installation
if command -v python3 &> /dev/null; then
    echo "✅ Python3 is available: $(python3 --version)"
else
    echo "❌ Python3 not found - this will cause node-gyp failures"
    exit 1
fi

# Verify build tools
if command -v gcc &> /dev/null; then
    echo "✅ GCC compiler is available"
else
    echo "❌ GCC compiler not found - this will cause native compilation failures"
    exit 1
fi

echo "🚀 Environment configured successfully for deployment"