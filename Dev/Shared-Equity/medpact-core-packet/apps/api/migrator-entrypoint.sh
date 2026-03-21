#!/usr/bin/env bash
set -euo pipefail

timestamp() { date -u +%Y%m%dT%H%M%SZ; }

# Helper: parse semicolon DSN into parts
parse_semicolon_dsn() {
  local dsn="$1"
  echo "${dsn}" | sed -nE 's/.*[Hh]ost=([^;]*).*/host=\1/p; s/.*[Pp]ort=([^;]*).*/port=\1/p; s/.*[Dd]atabase=([^;]*).*/db=\1/p; s/.*[Uu]sername=([^;]*).*/user=\1/p; s/.*[Pp]assword=([^;]*).*/pass=\1/p'
}

## Prefer explicit MIGRATOR_* environment variables for runtime wiring
M_HOST=${MIGRATOR_HOST:-}
M_PORT=${MIGRATOR_PORT:-}
M_DB=${MIGRATOR_DB:-}
M_USER=${MIGRATOR_USER:-}
M_PASS=${MIGRATOR_PASS:-}

# Pre-migration backup
if [ -n "${BACKUP_DSN:-}" ] || [ -n "$M_HOST" ]; then
  BACKUP_PATH=${BACKUP_PATH:-/tmp/medpact-backup-$(timestamp).dump}
  echo "Running pre-migration backup to $BACKUP_PATH"

  if [ -n "$M_HOST" ]; then
    host="$M_HOST"
    port="$M_PORT"
    db="$M_DB"
    user="$M_USER"
    pass="$M_PASS"
  elif echo "$BACKUP_DSN" | grep -q ';'; then
    eval $(parse_semicolon_dsn "$BACKUP_DSN" | tr '\n' ' ')
  else
    host=""
    port=""
    db=""
    user=""
    pass=""
  fi

  export PGPASSWORD="${pass:-${POSTGRES_PASSWORD:-}}"
  echo "Resolved backup target: host=${host:-localhost} port=${port:-5432} db=${db:-postgres} user=${user:-postgres} pass=***"
  pg_dump -h "${host:-localhost}" ${port:+-p $port} -U "${user:-postgres}" -d "${db:-postgres}" -F c -f "$BACKUP_PATH"

  # Upload to S3 when configured
  if [ -n "${S3_BUCKET:-}" ]; then
    if [ -z "${AWS_ACCESS_KEY_ID:-}" ] || [ -z "${AWS_SECRET_ACCESS_KEY:-}" ]; then
      echo "AWS credentials not set; skipping S3 upload"
    else
      KEY="backups/medpact-backup-$(timestamp).dump"
      echo "Uploading backup to s3://${S3_BUCKET}/${KEY}"
      aws s3 cp "$BACKUP_PATH" "s3://${S3_BUCKET}/${KEY}" --only-show-errors
    fi
  fi
fi

echo "Running EF Core migrations"
dotnet ef database update --no-build --project ./apps/api/MedPact.Api/MedPact.Api.csproj

echo "Migrations complete"

