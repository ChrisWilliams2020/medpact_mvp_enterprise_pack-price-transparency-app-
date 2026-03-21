#!/usr/bin/env bash
set -euo pipefail
if ! command -v pre-commit >/dev/null 2>&1; then
  echo "Installing pre-commit via pip"
  if command -v pip3 >/dev/null 2>&1; then
    pip3 install --user pre-commit
  else
    echo "pip3 not found; please install pre-commit manually"
    exit 1
  fi
fi
pre-commit install || true
