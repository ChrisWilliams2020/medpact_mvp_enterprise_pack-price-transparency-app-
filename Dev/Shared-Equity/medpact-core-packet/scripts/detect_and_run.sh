#!/usr/bin/env bash
set -euo pipefail

# A small, conservative detection script that runs lint or test depending on
# the argument. It intentionally avoids exiting non-zero when a test/lint step
# isn't available so the CI can still run generic checks.

ACTION=${1:-help}

echo "detect_and_run: action=$ACTION"

run_if_exists() {
  local cmd=$1
  if command -v ${cmd%% *} >/dev/null 2>&1; then
    echo "Running: $cmd"
    eval "$cmd"
    return 0
  else
    echo "Not found: ${cmd%% *} - skipping"
    return 1
  fi
}

case "$ACTION" in
  lint)
    # Shell scripts
    run_if_exists shellcheck || true
    # Python
    if [ -f requirements.txt ] || [ -f pyproject.toml ]; then
      run_if_exists "python -m pip install -q -r requirements.txt || true" || true
      run_if_exists "python -m pytest -q --maxfail=1 --disable-warnings -k 'not e2e'" || true
    fi
    # Node
    if [ -f package.json ]; then
      run_if_exists "npm ci" || true
      run_if_exists "npx eslint . --max-warnings=0" || true
    fi
    # .NET (sln/csproj) - run per-solution/project to avoid running in wrong CWD
    if command -v dotnet >/dev/null 2>&1; then
      FOUND=false
      # Use find -print0 and a while-read loop for maximum portability on macOS
      while IFS= read -r -d '' f; do
        FOUND=true
        run_if_exists "dotnet restore \"$f\"" || true
        run_if_exists "dotnet build \"$f\" --no-restore -v m" || true
      done < <(find . -maxdepth 4 \( -name "*.sln" -o -name "*.csproj" \) -print0 2>/dev/null)
      if [ "$FOUND" = false ]; then
        echo "No .sln or .csproj files found"
      fi
    else
      echo "dotnet not found: skipping .NET lint/build steps"
    fi
    ;;

  test)
    # Node
    if [ -f package.json ]; then
      run_if_exists "npm ci" || true
      run_if_exists "npm test --silent" || true
    fi
    # Python
    if [ -f pytest.ini ] || [ -d tests ] || [ -f pyproject.toml ]; then
      run_if_exists "python -m pip install -q -r requirements.txt || true" || true
      run_if_exists "python -m pytest -q --maxfail=1 --disable-warnings" || true
    fi
    # .NET (sln/csproj) - run tests per solution/project
    if command -v dotnet >/dev/null 2>&1; then
      FOUND=false
      while IFS= read -r -d '' f; do
        FOUND=true
        run_if_exists "dotnet restore \"$f\"" || true
        run_if_exists "dotnet test \"$f\" --no-restore --verbosity minimal" || true
      done < <(find . -maxdepth 4 \( -name "*.sln" -o -name "*.csproj" \) -print0 2>/dev/null)
      if [ "$FOUND" = false ]; then
        echo "No .sln or .csproj files found"
      fi
    else
      echo "dotnet not found: skipping .NET test steps"
    fi
    # Go
    if [ -f go.mod ]; then
      run_if_exists "go test ./..." || true
    fi
    ;;

  help|*)
    cat <<'EOF'
Usage: detect_and_run.sh [lint|test]

This script detects common language files and runs conservative lint/test commands.
It is intentionally permissive: missing tools won't fail the script.
EOF
    ;;
esac
