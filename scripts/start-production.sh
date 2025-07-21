#!/bin/bash
# Production startup script

# Set production environment
export NODE_ENV=production

# Stay in root directory - DO NOT change to dist
# This ensures all path resolution works correctly

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "ERROR: dist directory not found. Please run 'npm run build' first."
  exit 1
fi

# Check if the built server exists
if [ ! -f "dist/index.js" ]; then
  echo "ERROR: dist/index.js not found. Build may have failed."
  exit 1
fi

# Start the server from root directory
echo "Starting server in production mode..."
echo "NODE_ENV=$NODE_ENV"
echo "Working directory: $(pwd)"
echo "Starting server: dist/index.js"

# Use node with the dist/index.js path
exec node dist/index.js