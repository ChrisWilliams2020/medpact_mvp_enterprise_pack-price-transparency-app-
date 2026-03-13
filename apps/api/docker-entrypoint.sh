#!/usr/bin/env bash
set -euo pipefail

# Run Alembic migrations if alembic is available
if python3 -c "import importlib, sys
importlib.import_module('alembic')" 2>/dev/null; then
  echo "Running alembic upgrade head"
  set +e
  python3 -m alembic -c /app/alembic.ini upgrade head 2>&1 | tee /tmp/alembic.log
  rc=$?
  set -e
  if [ $rc -ne 0 ]; then
    echo "alembic upgrade failed with rc=$rc; attempting to stamp head to avoid blocking startup"
    python3 -m alembic -c /app/alembic.ini stamp head || true
    echo "Stamped alembic head (best-effort)"
  fi
else
  echo "Alembic not available in container; skipping migrations"
fi

# If the container was started with arguments, run them (allows `command:` in compose
# to override the default and run the worker). Otherwise start the API server.
if [ "$#" -gt 0 ]; then
  exec "$@"
else
  exec uvicorn apps.api.app.main:app --host 0.0.0.0 --port 8000
fi
