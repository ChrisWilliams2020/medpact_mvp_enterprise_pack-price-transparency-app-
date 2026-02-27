#!/usr/bin/env bash
set -euo pipefail

echo "Installing dev tools..."
if command -v pip >/dev/null 2>&1; then
  pip install --user pre-commit || true
fi
if command -v npm >/dev/null 2>&1; then
  npm i -g npm@latest || true
fi
echo "Installing pre-commit hooks..."
if command -v pre-commit >/dev/null 2>&1; then
  pre-commit install || true
fi

echo "Done. Run: pre-commit run --all-files"
