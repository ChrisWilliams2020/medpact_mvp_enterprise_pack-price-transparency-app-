#!/bin/bash

# =============================================
# MEDPACT OVERNIGHT BUILD - Setup Script
# =============================================
# Run this script to install the automated overnight build
# Usage: ./scripts/setup-overnight-build.sh
# =============================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PLIST_SRC="$SCRIPT_DIR/com.medpact.overnight-build.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.medpact.overnight-build.plist"
LOG_DIR="$PROJECT_ROOT/logs"

echo ""
echo "=============================================="
echo "  MEDPACT OVERNIGHT BUILD - Setup"
echo "=============================================="
echo ""

# Create logs directory
echo "→ Creating logs directory..."
mkdir -p "$LOG_DIR"
echo "✓ Logs directory created: $LOG_DIR"

# Make build script executable
echo "→ Making build script executable..."
chmod +x "$SCRIPT_DIR/overnight-build.sh"
echo "✓ Build script is executable"

# Create LaunchAgents directory if it doesn't exist
echo "→ Checking LaunchAgents directory..."
mkdir -p "$HOME/Library/LaunchAgents"

# Unload existing job if present
echo "→ Checking for existing scheduled job..."
if launchctl list | grep -q "com.medpact.overnight-build"; then
    echo "→ Unloading existing job..."
    launchctl unload "$PLIST_DEST" 2>/dev/null || true
fi

# Copy plist file
echo "→ Installing launch agent..."
cp "$PLIST_SRC" "$PLIST_DEST"
echo "✓ Launch agent installed"

# Load the launch agent
echo "→ Loading launch agent..."
launchctl load "$PLIST_DEST"
echo "✓ Launch agent loaded"

# Verify
echo ""
echo "→ Verifying installation..."
if launchctl list | grep -q "com.medpact.overnight-build"; then
    echo "✓ Overnight build scheduled successfully!"
else
    echo "⚠ Warning: Launch agent may not be loaded properly"
fi

echo ""
echo "=============================================="
echo "  SETUP COMPLETE"
echo "=============================================="
echo ""
echo "The overnight build is now scheduled to run at 2:00 AM daily."
echo ""
echo "Commands:"
echo "  Test build now:     $SCRIPT_DIR/overnight-build.sh"
echo "  View logs:          ls -la $LOG_DIR"
echo "  Unload schedule:    launchctl unload $PLIST_DEST"
echo "  Reload schedule:    launchctl load $PLIST_DEST"
echo "  Check status:       launchctl list | grep medpact"
echo ""
echo "=============================================="
echo ""
