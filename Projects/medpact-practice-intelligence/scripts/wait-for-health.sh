#!/usr/bin/env bash
# Wait-for-health: ensure API /ready, Postgres TCP, and Redis TCP are reachable before tests run.
set -euo pipefail

API_URL=${API_URL:-http://127.0.0.1:8000/ready}
DATABASE_URL=${DATABASE_URL:-}
REDIS_URL=${REDIS_URL:-}
# timeouts (seconds)
API_TIMEOUT=${API_TIMEOUT:-120}
DB_TIMEOUT=${DB_TIMEOUT:-60}
REDIS_TIMEOUT=${REDIS_TIMEOUT:-60}

parse_host_port() {
  # arg: url like protocol://host:port/... ; returns host port
  local url="$1"
  # strip protocol
  url=${url#*://}
  # strip path
  url=${url%%/*}
  # remove credentials if present
  url=${url#*\@}
  # default port handling
  if [[ "$url" == *:* ]]; then
    echo "$url"
  else
    # no port present, caller must set default externally
    echo "$url"
  fi
}

wait_tcp() {
  local host=$1
  local port=$2
  local timeout=${3:-60}
  local start=$(date +%s)
  echo "Waiting for TCP $host:$port (timeout=${timeout}s)"
  while :; do
    if bash -c "</dev/tcp/$host/$port" >/dev/null 2>&1; then
      echo "TCP $host:$port reachable"
      return 0
    fi
    now=$(date +%s)
    if [ $((now - start)) -ge $timeout ]; then
      echo "Timeout waiting for $host:$port"
      return 1
    fi
    sleep 1
  done
}

echo "wait-for-health: checking API, Postgres, Redis"

# 1) Wait for API /ready (portable loop)
echo "Checking API at $API_URL"
start_ts=$(date +%s)
api_timeout=${API_TIMEOUT:-120}
while :; do
  if curl -sfS "$API_URL" >/dev/null 2>&1; then
    echo "API ready"
    break
  fi
  now=$(date +%s)
  if [ $((now - start_ts)) -ge $api_timeout ]; then
    echo "API did not become ready within ${api_timeout}s"
    exit 2
  fi
  sleep 1
done

# 2) Postgres TCP check (if DATABASE_URL set)
if [ -n "$DATABASE_URL" ]; then
  # parse host and port
  dbhp=$(parse_host_port "$DATABASE_URL")
  dbhost=${dbhp%%:*}
  dbport=${dbhp#*:}
  if [ "$dbhost" = "$dbport" ]; then
    # no port parsed; default to 5432
    dbport=5432
  fi
  if ! wait_tcp "$dbhost" "$dbport" "$DB_TIMEOUT"; then
    echo "Postgres $dbhost:$dbport not reachable"
    exit 3
  fi
fi

# 3) Redis TCP check (if REDIS_URL set)
if [ -n "$REDIS_URL" ]; then
  redishp=$(parse_host_port "$REDIS_URL")
  redishost=${redishp%%:*}
  redisport=${redishp#*:}
  if [ "$redishost" = "$redisport" ]; then
    redisport=6379
  fi
  if ! wait_tcp "$redishost" "$redisport" "$REDIS_TIMEOUT"; then
    echo "Redis $redishost:$redisport not reachable"
    exit 4
  fi
fi

echo "All checks passed"
exit 0
