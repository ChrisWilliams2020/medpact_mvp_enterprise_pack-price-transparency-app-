#!/bin/bash

###############################################################################
# Encrypted Backup Script for MedPact Platinum
# Owner: Christopher Williams
# Created: January 30, 2026
#
# PURPOSE: Create encrypted backups of source code
# USAGE: ./scripts/create-secure-backup.sh [password]
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}MedPact Platinum - Secure Backup${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Configuration
PROJECT_NAME="medpact-platinum"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="${PROJECT_NAME}-${TIMESTAMP}"
BACKUP_DIR="$HOME/medpact-secure-backups"
TEMP_DIR="/tmp/${BACKUP_NAME}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$TEMP_DIR"

echo -e "${YELLOW}Step 1: Creating tarball...${NC}"

# Create tarball excluding unnecessary files
tar -czf "${TEMP_DIR}/${BACKUP_NAME}.tar.gz" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='out' \
  --exclude='build' \
  --exclude='dist' \
  --exclude='.git/objects' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  -C .. \
  medpact-unified-platform

echo -e "${GREEN}✓ Tarball created${NC}"
echo ""

# Get or use provided password
if [ -z "$1" ]; then
  echo -e "${YELLOW}Step 2: Enter encryption password${NC}"
  read -s -p "Password: " PASSWORD
  echo ""
  read -s -p "Confirm password: " PASSWORD_CONFIRM
  echo ""
  
  if [ "$PASSWORD" != "$PASSWORD_CONFIRM" ]; then
    echo -e "${RED}✗ Passwords do not match${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
  fi
else
  PASSWORD="$1"
fi

echo -e "${YELLOW}Step 3: Encrypting backup...${NC}"

# Encrypt with AES-256
openssl enc -aes-256-cbc -salt -pbkdf2 \
  -in "${TEMP_DIR}/${BACKUP_NAME}.tar.gz" \
  -out "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc" \
  -pass pass:"$PASSWORD"

echo -e "${GREEN}✓ Backup encrypted${NC}"
echo ""

# Remove unencrypted tarball
rm -f "${TEMP_DIR}/${BACKUP_NAME}.tar.gz"
rmdir "$TEMP_DIR"

# Calculate checksum
CHECKSUM=$(sha256sum "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc" | awk '{print $1}')

# Create backup metadata
cat > "${BACKUP_DIR}/${BACKUP_NAME}.meta.json" <<EOF
{
  "project": "${PROJECT_NAME}",
  "timestamp": "${TIMESTAMP}",
  "date": "$(date -Iseconds)",
  "filename": "${BACKUP_NAME}.tar.gz.enc",
  "checksum_sha256": "${CHECKSUM}",
  "encrypted": true,
  "algorithm": "AES-256-CBC",
  "size_bytes": $(stat -f%z "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc" 2>/dev/null || stat -c%s "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc")
}
EOF

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Backup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "Location: ${GREEN}${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc${NC}"
echo -e "Size: $(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc" | cut -f1)"
echo -e "SHA-256: ${CHECKSUM}"
echo ""
echo -e "${YELLOW}To restore this backup:${NC}"
echo -e "openssl enc -aes-256-cbc -d -pbkdf2 \\"
echo -e "  -in ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.enc \\"
echo -e "  -out ${BACKUP_NAME}.tar.gz \\"
echo -e "  -pass pass:YOUR_PASSWORD"
echo ""
echo -e "${RED}IMPORTANT: Store the password securely!${NC}"
echo ""

# List all backups
echo -e "${YELLOW}All backups:${NC}"
ls -lh "${BACKUP_DIR}"/*.enc | tail -5
echo ""

echo -e "${GREEN}✓ Done${NC}"
