#!/bin/bash

# MedPact Automated Backup System
# Runs every 6 hours to create timestamped backups

BACKUP_DIR="$HOME/Desktop/medpact-backups"
SOURCE_DIR="$HOME/Desktop/medpact-unified-platform"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="medpact_backup_$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "🔄 Creating backup: $BACKUP_NAME"
rsync -av --exclude 'node_modules' \
          --exclude '.next' \
          --exclude '.git' \
          --exclude '.env' \
          "$SOURCE_DIR/" "$BACKUP_DIR/$BACKUP_NAME/"

# Create compressed archive
echo "📦 Compressing backup..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

# Keep only last 10 backups (delete older ones)
cd "$BACKUP_DIR"
ls -t medpact_backup_*.tar.gz | tail -n +11 | xargs rm -f 2>/dev/null

echo "✅ Backup complete: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "📊 Total backups: $(ls -1 medpact_backup_*.tar.gz 2>/dev/null | wc -l)"
