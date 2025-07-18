#!/bin/bash

# Render startup script for TaskManager
echo "🚀 Starting TaskManager deployment..."

# Check if we're in the correct directory
if [ ! -f "server/index.js" ]; then
    echo "❌ Error: server/index.js not found. Make sure you're in the project root."
    exit 1
fi

# Install server dependencies if not present
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install server dependencies"
        exit 1
    fi
    cd ..
fi

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ] && [ "$NODE_ENV" = "production" ]; then
    echo "⚠️  Warning: DATABASE_URL not set. App will run without database connection."
fi

# Start the server
echo "🌟 Starting TaskManager server..."
exec node server/index.js