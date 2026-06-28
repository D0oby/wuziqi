# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues in `D0oby/wuziqi`. Use the `gh` CLI or the GitHub connector for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`
- **Read an issue**: `gh issue view <number> --comments`, also fetching labels when needed.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` when available. The `gh` CLI does this automatically when run inside this clone.

## Pull requests as a triage surface

**PRs as a request surface: no.**

Do not pull external PRs into the triage queue. Treat issues as the request surface for this repo.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
