#!/usr/bin/env bash
set -euo pipefail

# automate_demo.sh
# Run the three prioritized tasks for demo readiness:
# 1) Top: E2E smoke (health + tenant + login)
# 2) Secondary: Trigger CI by pushing a branch (optional, enabled with GIT_PUSH=true)
# 3) Tertiary: Run provider/unit tests (dotnet test)

TIMESTAMP=$(date +%s)
BASE_DIR=$(cd "$(dirname "$0")/.." && pwd)
E2E_LOG="/tmp/e2e_demo_${TIMESTAMP}.log"
TEST_LOG="/tmp/provider_tests_${TIMESTAMP}.log"
PUSH_LOG="/tmp/git_push_${TIMESTAMP}.log"

# Configuration toggles (export to environment to change behavior)
# GIT_PUSH=true  => actually push branch to origin (disabled by default for safety)
# GH_CREATE_PR=true => if gh CLI available, create a PR (disabled by default)
# DOCKER_CLEANUP=true => if true, run docker compose down -v at the end (default false)

GIT_PUSH=${GIT_PUSH:-false}
GH_CREATE_PR=${GH_CREATE_PR:-false}
DOCKER_CLEANUP=${DOCKER_CLEANUP:-false}
BASE_URL=${BASE_URL:-http://localhost:5100}
API_PORT=${API_PORT:-5100}

echo "Automate Demo Script starting at $(date)" | tee "$E2E_LOG"

cat <<'EOF' | tee -a "$E2E_LOG"
Top priority (fastest win):
- Run the E2E smoke and fix any failing flows (tenant creation + login).

Secondary (stability + reproducibility):
- Ensure CI runs the same E2E (push/PR to trigger workflows).

Tertiary (confidence & polish):
- Add focused unit/integration tests for auth, tenant, and metrics seed.
EOF

echo "" | tee -a "$E2E_LOG"
echo "Step 1/3: Running E2E smoke against $BASE_URL (logs -> $E2E_LOG)" | tee -a "$E2E_LOG"
env API_PORT="$API_PORT" BASE_URL="$BASE_URL" DOCKER_CLEANUP=false bash "$BASE_DIR/scripts/e2e_smoke.sh" 2>&1 | tee -a "$E2E_LOG" || echo "E2E script exited non-zero" | tee -a "$E2E_LOG"

echo "" | tee -a "$PUSH_LOG"
echo "Step 2/3: Trigger CI (creating branch and optionally pushing). Logs -> $PUSH_LOG" | tee -a "$PUSH_LOG"
pushd "$BASE_DIR" >/dev/null
BRANCH="ci/auto-${TIMESTAMP}"
git checkout -b "$BRANCH" 2>/dev/null || git switch -c "$BRANCH" || true
git commit --allow-empty -m "chore(ci): automated trigger ${TIMESTAMP}" 2>&1 | tee -a "$PUSH_LOG" || true
if [ "$GIT_PUSH" = true ]; then
  echo "Pushing branch $BRANCH to origin..." | tee -a "$PUSH_LOG"
  git push -u origin "$BRANCH" 2>&1 | tee -a "$PUSH_LOG" || echo "git push returned non-zero" | tee -a "$PUSH_LOG"
  if [ "$GH_CREATE_PR" = true ] && command -v gh >/dev/null 2>&1; then
    echo "Attempting to create PR via gh..." | tee -a "$PUSH_LOG"
    gh pr create --title "Automated CI trigger ${TIMESTAMP}" --body "Automated trigger for demo CI" --base main --head "$BRANCH" 2>&1 | tee -a "$PUSH_LOG" || echo "gh pr create failed" | tee -a "$PUSH_LOG"
  fi
else
  echo "GIT_PUSH is false; skipping git push. To enable set GIT_PUSH=true in environment." | tee -a "$PUSH_LOG"
  git log -n3 --pretty=format:'%h %s (%an, %ar)' | tee -a "$PUSH_LOG"
fi
popd >/dev/null

echo "" | tee -a "$TEST_LOG"
echo "Step 3/3: Running provider tests (dotnet test). Logs -> $TEST_LOG" | tee -a "$TEST_LOG"
dotnet test "$BASE_DIR/apps/api/MedPact.ProviderTests" -v minimal 2>&1 | tee -a "$TEST_LOG" || echo "dotnet test finished with non-zero status" | tee -a "$TEST_LOG"

echo "" | tee -a "$E2E_LOG"
echo "Automation finished at $(date)" | tee -a "$E2E_LOG"
echo "Summary of logs:" | tee -a "$E2E_LOG"
echo "  E2E log: $E2E_LOG" | tee -a "$E2E_LOG"
echo "  Provider tests log: $TEST_LOG" | tee -a "$E2E_LOG"
echo "  Git/PR log: $PUSH_LOG" | tee -a "$E2E_LOG"

if [ "$DOCKER_CLEANUP" = true ]; then
  echo "DOCKER_CLEANUP=true: bringing down compose and removing volumes" | tee -a "$E2E_LOG"
  docker compose down -v 2>&1 | tee -a "$E2E_LOG" || true
fi

echo "All done. Review logs in /tmp." | tee -a "$E2E_LOG"

exit 0
