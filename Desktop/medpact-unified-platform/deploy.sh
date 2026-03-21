#!/bin/bash

# MedPact Complete Deployment Script
# Handles git commit, push, and Vercel deployment

echo "🚀 MedPact Platinum v2.0 - Complete Deployment"
echo "=============================================="

# Navigate to project
cd /Users/christopherwilliams/Desktop/medpact-unified-platform

# Create backup first
echo ""
echo "📦 Step 1: Creating backup..."
./backup-system.sh

# Check for changes
echo ""
echo "📝 Step 2: Checking for changes..."
if git diff --quiet && git diff --cached --quiet; then
  echo "ℹ️  No changes to commit"
else
  # Commit changes
  echo "💾 Step 3: Committing changes..."
  git add .
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
  
  # Push to GitHub
  echo "🔄 Step 4: Pushing to GitHub..."
  git push origin main
  
  echo "✅ Code pushed to GitHub"
fi

# Deploy to Vercel (if vercel CLI is installed)
echo ""
echo "🌐 Step 5: Deploying to Vercel..."
if command -v vercel &> /dev/null; then
  vercel --prod --yes
  echo "✅ Deployed to Vercel"
else
  echo "ℹ️  Vercel CLI not installed. Install with: npm i -g vercel"
  echo "   Then run: vercel --prod"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Check Vercel dashboard: https://vercel.com/dashboard"
echo "2. Set environment variables if not already set"
echo "3. Run database migrations on production"
echo ""
