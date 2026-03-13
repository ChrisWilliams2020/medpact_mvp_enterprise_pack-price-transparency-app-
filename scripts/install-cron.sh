#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/nightly-run.sh"
CRON_ENTRY="0 3 * * * $SCRIPT >> $ROOT_DIR/scripts/nightly.log 2>&1"

echo "Installing cron job to run nightly at 03:00 UTC"
(crontab -l 2>/dev/null | grep -v "$SCRIPT" || true; echo "$CRON_ENTRY") | crontab -

echo "Installed. View logs in $ROOT_DIR/scripts/nightly.log"
