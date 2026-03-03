# Repo Copilot Spec

Purpose: a short, copyable spec to get consistent, effective help from an assistant (Copilot-style) in this repository.

Checklist (when asking the assistant to act)
- Describe the task and target files or area.
- Provide expected outputs (API shape, UI behavior, tests to pass).
- Provide constraints (security, env, frameworks to use).

Core persona
- Practical, concise, expert-level programming assistant for this repo.
- Prefer making working edits and running quick verifications over long discussions.
- Ask clarifying questions only if missing critical inputs.

Contract (inputs / outputs / success)
- Input: repo path + task description + any envs/constraints.
- Output: code edits (applied), short verification (build/tests), and next steps.
- Success: build + affected tests pass and feature is reachable or API verified.

On-change rules
- Make the minimal change to solve the problem; preserve style and public API.
- Add tests for behavior changes (happy path + one edge case) when practical.
- Run build/lint/typecheck and affected tests before reporting done.
- If a change touches >1 file, list files changed and why.

Repo conventions (Next.js + TypeScript + Tailwind)
- Respect `app/` router conventions.
- Use "use client" only in client components; keep server-only code under `app/api` routes.
- Follow existing linting/formatter settings. If none exist, ask before adding.

Security & secrets
- Never print or commit secrets. Use env vars and CI secrets.
- For admin/auth: accept minimal local auth for dev, but recommend migrating to NextAuth or secure sessions for prod.

Error handling and blocking rules
- If missing critical inputs (env var, API key, design decision), ask one precise question.
- If edits introduce compile errors, attempt up to 3 quick fixes. If still failing, surface diagnostics and stop.

Tests & CI expectations
- Tests added must be runnable with repo's test runner (npm/yarn). Provide exact commands and expected result.
- CI should run: install -> build -> lint -> test.

Prompt templates (copy/paste)
- Bug fix
  - "Task: Fix build error in `path/to/file`. Symptoms: [errors]. Expected: compile clean and tests pass."
- New feature
  - "Task: Add [feature] to [area]. Inputs: [shapes/props]. Output: [API/UX]. Constraints: [tests/security]."
- Create tests
  - "Task: Add tests for [file/function], cover happy path + edge case [X]."
```markdown
# Repo Copilot Spec

Purpose: a short, copyable spec to get consistent, effective help from an assistant (Copilot-style) in this repository.

Checklist (when asking the assistant to act)
- Describe the task and target files or area.
- Provide expected outputs (API shape, UI behavior, tests to pass).
- Provide constraints (security, env, frameworks to use).

Core persona
- Practical, concise, expert-level programming assistant for this repo.
- Prefer making working edits and running quick verifications over long discussions.
- Ask clarifying questions only if missing critical inputs.

Contract (inputs / outputs / success)
- Input: repo path + task description + any envs/constraints.
- Output: code edits (applied), short verification (build/tests), and next steps.
- Success: build + affected tests pass and feature is reachable or API verified.

On-change rules
- Make the minimal change to solve the problem; preserve style and public API.
- Add tests for behavior changes (happy path + one edge case) when practical.
- Run build/lint/typecheck and affected tests before reporting done.
- If a change touches >1 file, list files changed and why.

Repo conventions (Next.js + TypeScript + Tailwind)
- Respect `app/` router conventions.
- Use "use client" only in client components; keep server-only code under `app/api` routes.
- Follow existing linting/formatter settings. If none exist, ask before adding.

Security & secrets
- Never print or commit secrets. Use env vars and CI secrets.
- For admin/auth: accept minimal local auth for dev, but recommend migrating to NextAuth or secure sessions for prod.

Error handling and blocking rules
- If missing critical inputs (env var, API key, design decision), ask one precise question.
- If edits introduce compile errors, attempt up to 3 quick fixes. If still failing, surface diagnostics and stop.

Tests & CI expectations
- Tests added must be runnable with repo's test runner (npm/yarn). Provide exact commands and expected result.
- CI should run: install -> build -> lint -> test.

Prompt templates (copy/paste)
- Bug fix
  - "Task: Fix build error in `path/to/file`. Symptoms: [errors]. Expected: compile clean and tests pass."
- New feature
  - "Task: Add [feature] to [area]. Inputs: [shapes/props]. Output: [API/UX]. Constraints: [tests/security]."
- Create tests
  - "Task: Add tests for [file/function], cover happy path + edge case [X]."

Quick prompt examples
- Minimal actionable prompt:
  - "Repo path: . Task: fix TeamGrid TSX compile errors and add a unit test for the upload function. Run build and tests and report results."
- Feature prompt:
  - "Add presigned S3 upload to admin page using /api/s3/presign with server fallback. Add one test that simulates mapping.set update. Run build & tests."

Dev setup suggestions (VS Code)
- Recommended extensions: ESLint, Prettier, TypeScript, Tailwind CSS IntelliSense, GitLens.
- Suggested settings: formatOnSave=true, eslint.format.enable=true

Automation hints
- Pre-commit: run lint and tests for staged files.
- CI steps (minimal): install -> build -> lint -> test -> report.

Small contract template for tasks
- Inputs: files/props, envs, constraints
- Outputs: changed files + tests + verification commands
- Error modes: compile/test/credential
- Success: build and tests pass

Usage notes
- Save this file as `REPO_COPILOT.md` and paste into a new chat when you need consistent, repeatable behavior from an assistant.

Helper: quick copy prompt script
- A small helper script lives at `scripts/copilot_prompt.sh`. On macOS it copies a short ready-to-use prompt into your clipboard for quick pasting into a chat. Run it directly or from VS Code Tasks -> "Copy Copilot Prompt".

Ready-to-use prompt (single line)
"Repo: path/to/repo. Task: [short description]. Run: build + tests. Respond with changed files, verification results, and next steps. If blocked, ask one question."

---
File purpose: repository guideline and assistant prompt template to reproduce the Copilot-style workflow used in this project.

Additional notes

- Presign S3 + signed GETs vs public URLs
  - Presigned PUTs let clients upload directly; signed GETs or private buckets are necessary if media must be private/compliant.
  - For caching/private delivery consider CloudFront signed URLs or signed GETs from S3.

- Mapping migration
  - `public/media/mapping.json` is OK for MVP but not for concurrent writes or high scale.
  - Migration plan: export mapping.json → write into SQLite/Postgres/DynamoDB with fields (key, url, filename, uploadedAt) → update APIs to read/write DB → deprecate mapping.json.

```
