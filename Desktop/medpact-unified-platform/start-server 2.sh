#!/bin/bash

echo "🚀 Starting MedPact Development Server..."
echo ""

# Kill any existing process on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Killing existing process on port 3000..."
    lsof -ti:3000 | xargs kill -9
    sleep 1
fi

# Start the server
echo "✨ Starting Next.js server..."
npm run dev
