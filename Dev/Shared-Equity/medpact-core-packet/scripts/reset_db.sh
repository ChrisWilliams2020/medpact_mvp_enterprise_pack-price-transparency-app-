#!/usr/bin/env bash
set -euo pipefail

# Basic script to drop and recreate the Postgres DB used by the app (dev only)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
  DROP DATABASE IF EXISTS medpact;
  CREATE DATABASE medpact;
EOSQL

echo "Database reset complete"
