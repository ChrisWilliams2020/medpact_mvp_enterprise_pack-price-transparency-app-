#!/usr/bin/env bash
set -euo pipefail

echo "Running devcontainer postCreate tasks..."
# Install pre-commit
if command -v pip >/dev/null 2>&1; then
  pip install --user pre-commit || true
  pre-commit install || true
fi
# Install newman (for E2E runs)
if command -v npm >/dev/null 2>&1; then
  cd scripts && npm ci || true
fi

# Install lsof for port diagnostics
if command -v apt-get >/dev/null 2>&1; then
  sudo apt-get update -y && sudo apt-get install -y lsof || true
fi

echo "Devcontainer setup complete"
