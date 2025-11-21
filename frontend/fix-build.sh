#!/bin/bash

echo "🧹 Cleaning Next.js cache..."

# Remove .next directory
rm -rf .next

# Remove node_modules/.cache
rm -rf node_modules/.cache

# Remove turbopack cache
rm -rf .turbo

echo "✅ Cache cleaned!"
echo ""
echo "🔨 Rebuilding..."
echo ""

# Restart dev server
npm run dev
