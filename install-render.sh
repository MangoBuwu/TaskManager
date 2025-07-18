#!/bin/bash

# Render installation script for TaskManager
echo "🚀 Installing TaskManager for Render deployment..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
if [ -d "server" ]; then
    cd server
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install server dependencies"
        exit 1
    fi
    cd ..
else
    echo "❌ Server directory not found"
    exit 1
fi

# Install client dependencies (optional, for full-stack deployment)
echo "📦 Installing client dependencies..."
if [ -d "client" ]; then
    cd client
    npm install
    if [ $? -ne 0 ]; then
        echo "⚠️  Warning: Failed to install client dependencies"
    fi
    cd ..
else
    echo "ℹ️  Client directory not found, skipping..."
fi

echo "✅ Installation completed successfully!"
echo "🎯 Ready to start with: node server/index.js"