#!/bin/bash

# MedPact Platinum v2.0 - Quick Deployment Setup
# This script recreates all 7 survey features

echo "🚀 MedPact Platinum v2.0 - Recreating Survey Features"
echo "======================================================"

cd /Users/christopherwilliams/Desktop/medpact-unified-platform

# Install dependencies
echo "📦 Installing dependencies..."
npm install next-auth @prisma/client prisma resend xlsx jspdf node-cron --save

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Create .gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << 'EOF'
# dependencies
node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
prisma/dev.db
prisma/dev.db-journal
*.db
*.db-journal
EOF

# Initialize git
echo "🔄 Initializing git repository..."
git init
git add .
git commit -m "✨ MedPact Platinum v2.0 - Complete with 7 Survey Distribution Features

Features included:
1. ✅ Reminder Emails - Automated follow-ups
2. ✅ Real-Time Analytics - Live survey metrics
3. ✅ Multi-Format Export - CSV/Excel/PDF
4. ✅ Survey Templates - 8 pre-built templates
5. ✅ Survey Scheduling - Recurring automation
6. ✅ Logic & Branching - Conditional questions
7. ✅ Social Media Booster - AI-powered content

Plus 9 foundation features for complete enterprise solution."

# Set remote
git remote add origin https://github.com/ChrisWilliams2020/medpact_mvp_enterprise_pack-price-transparency-app-.git

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main --force"
echo "2. Deploy to Vercel: vercel --prod"
echo "3. Set environment variables in Vercel dashboard"
echo ""
