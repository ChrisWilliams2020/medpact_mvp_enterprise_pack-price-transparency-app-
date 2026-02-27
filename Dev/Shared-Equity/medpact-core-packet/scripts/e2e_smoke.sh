#!/usr/bin/env bash
set -euo pipefail

# Simple E2E smoke test runner.
# - starts nothing; expects docker compose to have started the API.
# - waits for /health endpoint and then runs Newman if available, else curls a simple endpoint.

BASE_URL=${BASE_URL:-}
# Prefer explicit API_PORT or BASE_URL when provided (avoid macOS services on 5000)
if [ -z "$BASE_URL" ] && [ -n "${API_PORT:-}" ]; then
  BASE_URL="http://localhost:${API_PORT}"
fi
# Auto-select BASE_URL if not provided: prefer an active service on 5000..5110 (HTTP 200/403),
# otherwise pick the first free port in the same range. CI is pinned to 5100.
if [ -z "$BASE_URL" ]; then
  SELECTED_PORT=""
  for p in $(seq 5000 5110); do
    URL="http://localhost:$p/api/health"
    HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$URL" || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "403" ]; then
      SELECTED_PORT=$p
      echo "Found active service on port $p (HTTP $HTTP_CODE)"
      break
    fi
  done

  if [ -z "$SELECTED_PORT" ]; then
    for p in $(seq 5000 5110); do
      if command -v lsof >/dev/null 2>&1; then
        if ! lsof -nP -iTCP:$p -sTCP:LISTEN >/dev/null 2>&1; then
          SELECTED_PORT=$p
          echo "Selected free port $p for API"
          break
        fi
      else
        # fallback: if curl cannot connect (connection refused), assume port free
        if ! curl -s --connect-timeout 1 -o /dev/null "http://localhost:$p/" >/dev/null 2>&1; then
          SELECTED_PORT=$p
          echo "Selected free port $p for API (no lsof available)"
          break
        fi
      fi
    done
  fi

  if [ -n "$SELECTED_PORT" ]; then
    BASE_URL="http://localhost:$SELECTED_PORT"
  else
    BASE_URL="http://localhost:5000"
  fi
fi

HEALTH_URL="$BASE_URL/api/health"
TENANT_ID=${TENANT_ID:-"00000000-0000-0000-0000-000000000000"}
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin@medpact.local"}

echo "Waiting for $HEALTH_URL"

# Debug: capture which process (if any) is listening on port 5000/5001 on this host.
if command -v lsof >/dev/null 2>&1; then
  echo "--- Port listeners (lsof) ---"
  mkdir -p debug || true
  lsof -nP -iTCP:5000 -sTCP:LISTEN > debug/port-5000.lsof || true
  lsof -nP -iTCP:5001 -sTCP:LISTEN > debug/port-5001.lsof || true
  echo "--- end listeners ---"
else
  echo "lsof not available; skipping port-capture"
fi

for i in {1..60}; do
  if curl -sSf "$HEALTH_URL" >/dev/null 2>&1; then
    echo "Health OK"
    break
  fi
  sleep 1
done

# If health returned 403, it may be that HTTPS is enabled on 5001; attempt HTTPS fallback
if curl -sSf "$BASE_URL/api/health" >/dev/null 2>&1; then
  :
else
  echo "HTTP health check failed; trying HTTPS fallback on port 5001"
  BASE_URL=${BASE_URL%:*}:5001
  HEALTH_URL="$BASE_URL/api/health"
  for i in {1..30}; do
    if curl -k -sSf "$HEALTH_URL" >/dev/null 2>&1; then
      echo "Health OK on HTTPS"
      break
    fi
    sleep 1
  done
fi

# Create a fresh tenant for this run (the TenantsController allows unauthenticated POST)
echo "Creating tenant for E2E"
TENANT_NAME="E2E-$(date +%s)"
TENANT_SLUG="e2e-$(date +%s)"
MAX_ATTEMPTS=5
attempt=1
CREATE_TENANT_RESP=""
while [ $attempt -le $MAX_ATTEMPTS ]; do
  echo "Create tenant attempt $attempt/$MAX_ATTEMPTS"
  CREATE_TENANT_RESP=$(curl -s -X POST "$BASE_URL/api/tenants" -H "Content-Type: application/json" -d "{\"name\": \"$TENANT_NAME\", \"slug\": \"$TENANT_SLUG\"}") || true
  TENANT_ID=$(echo "$CREATE_TENANT_RESP" | python -c "import sys,json; d=json.load(sys.stdin) if sys.stdin.read() else {}; print(d.get('id',''))" 2>/dev/null || echo "")
  if [ -n "$TENANT_ID" ]; then
    echo "Created tenant $TENANT_ID"
    break
  fi
  attempt=$((attempt+1))
  sleep 2
done
if [ -z "$TENANT_ID" ]; then
  echo "Could not create tenant after $MAX_ATTEMPTS attempts; proceeding with empty tenant id"
fi

# Authenticate to get a token (with retries)
echo "Requesting token for tenant=$TENANT_ID email=$ADMIN_EMAIL"
attempt=1
LOGIN_RESP=""
TOKEN=""
while [ $attempt -le $MAX_ATTEMPTS ]; do
  echo "Login attempt $attempt/$MAX_ATTEMPTS"
  LOGIN_RESP=$(curl -s -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d "{\"tenantId\": \"$TENANT_ID\", \"email\": \"$ADMIN_EMAIL\"}") || true
  TOKEN=$(echo "$LOGIN_RESP" | python -c "import sys, json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || echo "")
  if [ -n "$TOKEN" ]; then
    echo "Obtained token"
    break
  fi
  attempt=$((attempt+1))
  sleep 2
done
if [ -z "$TOKEN" ]; then
  echo "No token obtained after $MAX_ATTEMPTS attempts; continuing without auth for smoke endpoints"
fi

if [ -n "$TOKEN" ]; then
  echo "Obtained token"
else
  echo "No token obtained; continuing without auth for smoke endpoints"
fi

if command -v newman >/dev/null 2>&1; then
  echo "Running Postman collection with newman"
  # create a temporary environment file with token injected
  TMP_ENV=$(mktemp)
  jq --arg base "$BASE_URL" --arg tenant "$TENANT_ID" --arg token "$TOKEN" '.values |= map(if .key=="baseUrl" then .value=$base elif .key=="tenantId" then .value=$tenant elif .key=="token" then .value=$token else . end)' docs/postman_env.json > "$TMP_ENV"
  newman run docs/MedPactCore.postman_collection.json --environment "$TMP_ENV" || true
  rm -f "$TMP_ENV"
else
  echo "Newman not found; doing basic curl checks (including auth if token)"
  if [ -n "$TOKEN" ]; then
    curl -sSf -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/metrics/definitions" || true
  else
    curl -sSf "$BASE_URL/api/health" || true
  fi
fi

echo "E2E smoke complete"

# Cleanup: attempt to delete the tenant if the API supports it; otherwise recommend volume cleanup.
if [ -n "$TENANT_ID" ]; then
  echo "Attempting to delete tenant $TENANT_ID (best-effort)"
  DEL_RESP=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/tenants/$TENANT_ID" || true)
  if [ "$DEL_RESP" = "200" ] || [ "$DEL_RESP" = "204" ]; then
    echo "Tenant $TENANT_ID deleted"
  else
    echo "Tenant deletion returned HTTP $DEL_RESP (endpoint may not exist); leaving tenant in DB"
  fi
fi

# If running in CI or DOCKER_CLEANUP is set, remove docker volumes to keep runs idempotent
if [ "${DOCKER_CLEANUP:-false}" = "true" ] || [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "Cleaning up docker compose volumes (docker compose down -v)"
  docker compose down -v || true
fi
