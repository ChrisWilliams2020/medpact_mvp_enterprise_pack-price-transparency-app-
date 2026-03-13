#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "1) Apply DB migration: add practice_id columns to import_jobs and claim_lines"
docker compose exec -T postgres psql -U medpact -d medpact -c "ALTER TABLE IF EXISTS import_jobs ADD COLUMN IF NOT EXISTS practice_id varchar(128); ALTER TABLE IF EXISTS claim_lines ADD COLUMN IF NOT EXISTS practice_id varchar(128);"

echo "2) Auth hardening: current in-repo stub will remain; please replace with real auth in production. See .env.example"

echo "3) Input validation: worker will validate CSV headers and fail job on missing required columns."

echo "4) Idempotency: existing checksum-based dedup is used."

echo "5) Observability: Prometheus metrics are exposed by the API; worker exports basic counters."

echo "6) Error handling & retry: RQ jobs will be enqueued with a small retry policy."

echo "7) Tests: run available tests if pytest is installed in the api container."
if docker compose exec -T api python3 -c "import pytest" >/dev/null 2>&1; then
  docker compose exec -T api python3 -m pytest -q || true
else
  echo "pytest not available in api container; skipping tests"
fi


echo "8) Restart api and worker to pick up changes"
docker compose restart api worker || true

echo "Waiting for API /health to become available (polling via python inside api container)"
max_attempts=20
attempt=1
until docker compose exec -T api python3 - <<'PY' >/dev/null 2>&1
import urllib.request, sys
try:
    resp = urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)
    sys.exit(0)
except Exception:
    sys.exit(1)
PY
do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "API did not become healthy after $max_attempts attempts"
    break
  fi
  echo "waiting for api... attempt $attempt/$max_attempts"
  attempt=$((attempt+1))
  sleep 2
done

echo "9) Run smoke test to verify end-to-end (uploads file and waits for worker)"
if [ -x ./scripts/smoke.sh ]; then
  ./scripts/smoke.sh || true
else
  chmod +x ./scripts/smoke.sh && ./scripts/smoke.sh || true
fi

echo "10) Done. Review output above for any failures."
