#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[nightly-run] starting at $(date -u)"

# Environment (override as needed)
export DATABASE_URL=${DATABASE_URL:-'postgresql+pg8000://medpact:medpact@127.0.0.1:5432/medpact'}
export REDIS_URL=${REDIS_URL:-'redis://127.0.0.1:6379/0'}

LOG_DIR="/tmp/medpact-nightly"
mkdir -p "$LOG_DIR"

echo "[nightly-run] using DATABASE_URL=$DATABASE_URL REDIS_URL=$REDIS_URL"

# Activate venv if present and set PYTHON_EXEC to the venv python
if [ -f .venv/bin/activate ]; then
  # shellcheck source=/dev/null
  source .venv/bin/activate
fi
PYTHON_EXEC=python
if [ -x .venv/bin/python ]; then
  PYTHON_EXEC=.venv/bin/python
fi

# Ensure Redis DB is clean to avoid leftover jobs from previous runs interfering with tests
echo "[nightly-run] flushing Redis DB at $REDIS_URL using $PYTHON_EXEC"
$PYTHON_EXEC - <<PY
import os
try:
    from redis import Redis
    r = Redis.from_url(os.environ.get('REDIS_URL'))
    r.flushdb()
    print('flushed redis')
except Exception as e:
    print('failed to flush redis:', e)
PY

activate_venv() {
  if [ -f .venv/bin/activate ]; then
    # shellcheck source=/dev/null
    source .venv/bin/activate
  fi
}

echo "[nightly-run] installing backend dev dependencies using $PYTHON_EXEC"
$PYTHON_EXEC -m pip install --upgrade pip >/dev/null
$PYTHON_EXEC -m pip install -r apps/api/requirements-dev.txt >/dev/null || true

echo "[nightly-run] applying alembic migrations (if available)"
if command -v alembic >/dev/null 2>&1 && [ -d apps/api/alembic ]; then
  # retry loop
  for i in 1 2 3; do
    alembic -c apps/api/alembic.ini upgrade head && break || sleep $((i*5))
  done
else
  echo "[nightly-run] alembic not found or migrations dir missing; skipping"
fi

echo "[nightly-run] starting API and worker"
mkdir -p "$LOG_DIR"

# Kill ALL lingering rq worker and uvicorn processes from any previous runs
# This ensures tests' burst workers have exclusive access to the queue
echo "[nightly-run] killing any lingering rq workers and uvicorn processes"
pkill -f 'rq worker' 2>/dev/null || true
pkill -f 'uvicorn apps.api.app.main:app' 2>/dev/null || true
sleep 2

# If previous PIDs exist, try to stop them to avoid bind errors and stale workers
if [ -f "$LOG_DIR/api.pid" ]; then
  oldpid=$(cat "$LOG_DIR/api.pid" 2>/dev/null || true)
  if [ -n "$oldpid" ] && kill -0 "$oldpid" 2>/dev/null; then
    echo "[nightly-run] stopping previous api pid $oldpid"
    kill "$oldpid" || true
    sleep 1
  fi
fi
if [ -f "$LOG_DIR/worker.pid" ]; then
  oldpid=$(cat "$LOG_DIR/worker.pid" 2>/dev/null || true)
  if [ -n "$oldpid" ] && kill -0 "$oldpid" 2>/dev/null; then
    echo "[nightly-run] stopping previous worker pid $oldpid"
    kill "$oldpid" || true
    sleep 1
  fi
fi

PYTHONPATH="$ROOT_DIR" nohup $PYTHON_EXEC -m uvicorn apps.api.app.main:app --host 127.0.0.1 --port 8000 &>"$LOG_DIR/api.log" &
api_pid=$!
echo $api_pid > "$LOG_DIR/api.pid"

# NOTE: Do not start a persistent RQ worker here. Tests run their own burst workers and
# a background worker would consume queue items before the tests can assert on them.
echo "[nightly-run] skipping starting background RQ worker to allow tests to run burst workers"

# Ensure we clean up started processes on script exit
cleanup() {
  echo "[nightly-run] cleaning up"
  if [ -n "${worker_pid:-}" ] && kill -0 "$worker_pid" 2>/dev/null; then
    kill "$worker_pid" || true
  fi
  if [ -n "${api_pid:-}" ] && kill -0 "$api_pid" 2>/dev/null; then
    kill "$api_pid" || true
  fi
}
trap cleanup EXIT

echo "[nightly-run] waiting for health"
if [ -x scripts/wait-for-health.sh ]; then
  ./scripts/wait-for-health.sh --api-timeout 60 --db-timeout 60 --redis-timeout 60 || true
else
  echo "[nightly-run] wait-for-health.sh not executable or missing; sleeping 5s"
  sleep 5
fi

echo "[nightly-run] running E2E smoke tests"
mkdir -p test-results
PYTHONPATH="$ROOT_DIR" python -m pytest tests/test_metrics_worker_smoke.py tests/test_e2e_schedule_sse.py apps/api/tests/test_sse.py -q --junitxml=test-results/e2e-results.xml || true

echo "[nightly-run] compressing logs"
tar -czf "$LOG_DIR/nightly-$(date +%F).tgz" -C "$LOG_DIR" . || true

echo "[nightly-run] completed at $(date -u)"
echo "logs: $LOG_DIR"

exit 0
