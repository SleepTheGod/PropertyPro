#!/bin/bash

echo "🔧 Fixing bcrypt compilation error..."

# Remove node_modules and lock files
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# Install dependencies with bcryptjs instead of bcrypt
echo "📦 Installing dependencies..."
npm install

# Rebuild bcryptjs
echo "🔨 Rebuilding bcryptjs..."
npm rebuild bcryptjs

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "npm start"
echo ""
echo "🌐 Your application will be available at:"
echo "http://localhost:3000"
