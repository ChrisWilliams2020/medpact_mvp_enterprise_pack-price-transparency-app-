#!/usr/bin/env bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:5100}

echo "Running simple contract checks against $BASE_URL"

# Fetch the OpenAPI/Swagger JSON and perform lightweight assertions.
SWAGGER_URL="$BASE_URL/swagger/v1/swagger.json"

echo "Fetching swagger: $SWAGGER_URL"
SWAGGER_JSON=$(curl -sSf "$SWAGGER_URL" || true)
if [ -z "$SWAGGER_JSON" ]; then
	echo "Failed to fetch swagger JSON from $SWAGGER_URL"
	exit 2
fi

missing=0

require_path() {
	path="$1"
	echo "$SWAGGER_JSON" | grep -q "\"$path\"" || {
		echo "MISSING path in swagger: $path"
		missing=$((missing+1))
	}
}

# Basic expected paths for the public contract
require_path "/api/health"
require_path "/api/tenants"
require_path "/api/auth/login"
require_path "/api/metrics/definitions"

if [ "$missing" -ne 0 ]; then
	echo "Contract checks failed ($missing missing items)"
	exit 3
fi

echo "Contract checks passed (basic smoke)"
