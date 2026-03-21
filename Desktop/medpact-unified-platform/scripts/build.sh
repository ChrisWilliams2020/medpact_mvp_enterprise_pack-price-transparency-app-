#!/bin/bash
# Build automation for MedPact Platinum

echo "Starting MedPact Platinum build..."
npm install
npm run build
echo "Build complete."
