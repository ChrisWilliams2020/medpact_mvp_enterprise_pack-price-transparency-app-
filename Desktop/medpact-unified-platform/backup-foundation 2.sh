#!/bin/bash
# MedPact SaaS v1.3 Foundation Backup Script

BACKUP_DIR="$HOME/Desktop/medpact-saas-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="medpact-saas-v1.3-foundation-${TIMESTAMP}"

echo "🔒 Creating MedPact SaaS v1.3 Foundational Backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create compressed backup
tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  .

echo "✅ Backup created: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
echo "📦 Size: $(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)"
