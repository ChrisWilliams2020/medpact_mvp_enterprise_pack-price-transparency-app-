#!/usr/bin/env bash
set -euo pipefail

# Simple container entrypoint that waits for Postgres, runs EF migrations, then starts the app
echo "Entrypoint: waiting for DB connection string"

ConnectionStrings__DefaultConnection=${ConnectionStrings__DefaultConnection:-}

if [ -z "$ConnectionStrings__DefaultConnection" ]; then
  echo "WARNING: ConnectionStrings__DefaultConnection not set; proceeding without migrations"
else
  echo "Waiting for database to be available"
  # extract host and port (very permissive) from connection string
  # This assumes the connection string contains Host=...;Port=...
  HOST=$(echo "$ConnectionStrings__DefaultConnection" | sed -n 's/.*Host=\([^;]*\).*/\1/p' || true)
  PORT=$(echo "$ConnectionStrings__DefaultConnection" | sed -n 's/.*Port=\([^;]*\).*/\1/p' || true)
  HOST=${HOST:-localhost}
  PORT=${PORT:-5432}

  for i in {1..30}; do
    if nc -z "$HOST" "$PORT" >/dev/null 2>&1; then
      echo "DB reachable at $HOST:$PORT"
      break
    fi
    echo "Waiting for DB $HOST:$PORT... ($i)"
    sleep 2
  done

  echo "Database should be available; proceeding to start the app."
  # NOTE: do not run `dotnet ef` here since the runtime image doesn't include the SDK.
  # Migrations are applied at application startup via DbInitializer.Initialize which calls Database.Migrate().
fi

echo "Starting application"
exec dotnet MedPact.Api.dll
