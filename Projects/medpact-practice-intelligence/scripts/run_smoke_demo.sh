#!/usr/bin/env bash
set -euo pipefail

# run_smoke_demo.sh
# Purpose: run quick smoke demo locally (requires docker compose running)
# Usage: ./scripts/run_smoke_demo.sh

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT"

echo "Initializing DB..."
docker compose exec -T api python -c "from apps.api.app.db import init_db; init_db(); print('db init done')"

echo "Ensuring MinIO bucket 'uploads'..."
docker compose exec -T api python -c "from apps.api.app.storage import get_minio_client, ensure_bucket; c=get_minio_client(); ensure_bucket(c,'uploads'); print('uploads ensured')"

SMOKE=/tmp/medpact_smoke.csv
cat > "$SMOKE" <<'CSV'
claim_id,line,amount
9001,1,10.00
9002,1,20.00
CSV

echo "Uploading smoke CSV to API..."
RESP=$(curl -s -F "file=@${SMOKE}" http://localhost:8000/imports/claims)
echo "$RESP" | jq .
JOB_ID=$(echo "$RESP" | jq -r .job_id)
FNAME=$(echo "$RESP" | jq -r .filename)

echo "Processing job synchronously inside api container..."
docker compose exec -T api python -c "from apps.api.worker import process_import_job; process_import_job('$JOB_ID','$FNAME'); print('processed')"

echo "Querying DB for job status and claim_lines count..."
docker compose exec -T postgres psql -U medpact -d medpact -c "SELECT job_id, status, processed_rows FROM import_jobs WHERE job_id='$JOB_ID';"
docker compose exec -T postgres psql -U medpact -d medpact -c "SELECT count(*) FROM claim_lines WHERE claim_id IN ('9001','9002');"

echo "Smoke demo finished."
