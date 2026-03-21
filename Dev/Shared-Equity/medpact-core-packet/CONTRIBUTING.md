Thanks for helping build this project — the goal is to make onboarding simple.

Basic workflow

1. Fork the repo and create a short-lived feature branch.
2. Make small, testable commits. Run `make test` and `make lint` locally.
3. Open a pull request and fill the PR template.

Local development

- Use `make setup` to prepare git hooks (if you use pre-commit).\
- Use `make lint` and `make test` as the canonical local commands.

If you add a new language, update `scripts/detect_and_run.sh` so CI can detect it.
