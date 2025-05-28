#!/bin/bash

# Fix bcrypt issues by replacing with bcryptjs
echo "Fixing bcrypt dependencies..."

# Remove bcrypt if it exists
npm uninstall bcrypt

# Install bcryptjs
npm install bcryptjs
npm install --save-dev @types/bcryptjs

# Update package.json to include rebuild script
npm pkg set scripts.postinstall="npm rebuild bcryptjs --build-from-source"

# Clean cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install

echo "Fixed! bcrypt has been replaced with bcryptjs"
