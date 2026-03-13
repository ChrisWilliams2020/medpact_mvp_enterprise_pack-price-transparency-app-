#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cat > /tmp/smoke.csv <<CSV
claim_id,amount,patient
c1,100,John
c2,200,Jane
CSV

echo "Posting /imports/claims..."
curl -sS -F "file=@/tmp/smoke.csv" http://localhost:8000/imports/claims -o /tmp/post_resp.txt -w "\nHTTPSTATUS:%{http_code}\n"
cat /tmp/post_resp.txt

echo "Tail worker logs (short):"
docker compose logs --no-color --tail 100 worker

echo "Done"
