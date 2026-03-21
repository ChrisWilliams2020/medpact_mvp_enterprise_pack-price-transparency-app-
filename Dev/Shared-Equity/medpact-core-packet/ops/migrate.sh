#!/usr/bin/env bash
set -euo pipefail

echo "Migrator: starting"
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export HOME=${HOME:-/root}
export PATH="$HOME/.dotnet/tools:$PATH"

echo "Installing dotnet-ef tool (if missing)"
dotnet tool install --global dotnet-ef --version 8.* || true
export PATH="$HOME/.dotnet/tools:$PATH"

echo "Running migrations"
cd /src
dotnet ef database update --project apps/api/MedPact.Infrastructure --startup-project apps/api/MedPact.Api

echo "Migrator: finished"
