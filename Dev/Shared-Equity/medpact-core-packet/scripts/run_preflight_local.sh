#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Repository root: $ROOT_DIR"

echo "1) Generating migrations.sql using .NET SDK container..."
docker run --rm -v "$ROOT_DIR":/src -w /src mcr.microsoft.com/dotnet/sdk:8.0 bash -lc "dotnet tool install --global dotnet-ef --version 8.0.0 || true && export PATH=\"\$PATH:/root/.dotnet/tools\" && dotnet restore apps/api/MedPact.Api/MedPact.Api.csproj --verbosity Minimal && dotnet ef migrations script --idempotent --project apps/api/MedPact.Api/MedPact.Api.csproj -o /src/migrations.sql"

if [ ! -f "$ROOT_DIR/migrations.sql" ]; then
  echo "migrations.sql was not created; aborting"
  exit 2
fi

echo "2) Starting disposable Postgres container..."
docker run -d --name medpact_preflight_pg -e POSTGRES_USER=preflight -e POSTGRES_PASSWORD=preflight -e POSTGRES_DB=preflight postgres:16

echo "Waiting for Postgres to accept connections (10s)..."
sleep 10

echo "Copying migrations.sql into container and executing in single-transaction..."
docker cp "$ROOT_DIR/migrations.sql" medpact_preflight_pg:/tmp/migrations.sql

set +e
docker exec -i medpact_preflight_pg bash -lc "psql -U preflight -d preflight --set ON_ERROR_STOP=1 --single-transaction -f /tmp/migrations.sql"
rc=$?
set -e

echo "Dry-run returned exit code: $rc"

echo "Container logs (last 200 lines):"
docker logs medpact_preflight_pg --tail 200 || true

echo "Cleaning up..."
docker rm -f medpact_preflight_pg >/dev/null 2>&1 || true

if [ $rc -eq 0 ]; then
  echo "Preflight dry-run succeeded (no changes persisted)."
  exit 0
else
  echo "Preflight dry-run failed. See logs above for details."
  exit $rc
fi
