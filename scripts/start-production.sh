#!/bin/bash
# Production startup script for Replit deployment

echo "🚀 Starting Revela in production mode..."

# Ensure we have required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is required"
    exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
    echo "❌ ERROR: SESSION_SECRET is required"
    exit 1
fi

# Set production environment
export NODE_ENV=production
export PORT=${PORT:-5000}

# Disable development features
export BYPASS_AUTH=false
export DANGEROUSLY_DISABLE_HOST_CHECK=false

# Build if dist doesn't exist or is empty
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "📦 Building application..."
    npm run build
fi

# Start the production server
echo "🌟 Starting production server on port $PORT..."

# Check if dist exists and has content
if [ ! -f "dist/index.js" ]; then
    echo "❌ ERROR: Production build not found. Running build..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

# Install production dependencies in dist and start
cd dist
echo "📦 Installing production dependencies..."
npm install --production --silent --no-audit --no-fund

echo "🚀 Starting server..."
exec node index.js