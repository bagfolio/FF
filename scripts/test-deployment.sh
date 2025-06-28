#!/bin/bash
echo "🧪 Testing deployment readiness..."

# Clean any rogue files
rm -f public/manifest.json

# Kill any existing processes
node scripts/manage-processes.js

# Clean build
echo "🧹 Cleaning old build..."
rm -rf dist

# Run full build
echo "🔨 Building..."
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

# Validate
echo "✅ Build complete, validating..."
npm run validate

echo "🎉 Deployment test complete!"