#!/usr/bin/env bash
# Copies a ready-to-use assistant prompt to the macOS clipboard (pbcopy)
# Usage: ./scripts/copilot_prompt.sh

PROMPT='Repo: . Task: [short description]. Run: build + tests. Respond with changed files, verification results, and next steps. If blocked, ask one question.'

echo "Copying Copilot prompt to clipboard..."
printf "%s" "$PROMPT" | pbcopy
echo "Copied to clipboard. Paste into your chat with the assistant."
