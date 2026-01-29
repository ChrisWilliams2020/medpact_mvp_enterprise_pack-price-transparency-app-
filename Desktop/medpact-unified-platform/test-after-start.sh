#!/bin/bash

echo "🧪 Testing MedPact APIs..."
echo ""
echo "⏳ Waiting for server to start (15 seconds)..."
sleep 15

# Check if server is running
echo ""
echo "1️⃣ Testing server connection..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running!"
else
    echo "❌ Server is NOT running!"
    echo "   Make sure you ran: ./start-server.sh"
    exit 1
fi

# Test APIs
echo ""
echo "2️⃣ Testing Web Scraping API..."
SCRAPE=$(curl -s -X POST http://localhost:3000/api/scrape/website \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.mayoclinic.org","practice_id":"test-1"}')

if echo "$SCRAPE" | grep -q "services"; then
    echo "✅ Web Scraping API works!"
else
    echo "❌ Web Scraping API failed"
fi

echo ""
echo "3️⃣ Testing Demographics API..."
DEMO=$(curl -s -X POST http://localhost:3000/api/demographics/search \
  -H "Content-Type: application/json" \
  -d '{"center_zip":"94102","radius_miles":25,"diseases":["diabetes"]}')

if echo "$DEMO" | grep -q "estimated_population"; then
    echo "✅ Demographics API works!"
else
    echo "❌ Demographics API failed"
fi

echo ""
echo "4️⃣ Testing Competitive Analysis API..."
ANALYSIS=$(curl -s -X POST http://localhost:3000/api/analysis/competitive \
  -H "Content-Type: application/json" \
  -d '{"my_practice_id":"my-1","competitor_data":{"services":["Cardiology"],"physicians":[]}}')

if echo "$ANALYSIS" | grep -q "comparison"; then
    echo "✅ Competitive Analysis API works!"
else
    echo "❌ Competitive Analysis API failed"
fi

echo ""
echo "🎉 Testing complete!"
echo ""
echo "📱 Open these URLs in your browser:"
echo "   • http://localhost:3000"
echo "   • http://localhost:3000/analysis/competitive"
echo "   • http://localhost:3000/patients/search"

