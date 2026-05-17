# Contributing

Thanks for helping improve this Snake game. Keep contributions focused,
documented, and easy to review.

## Local Setup

Install dependencies from the lockfile:

```sh
pnpm install --frozen-lockfile
```

Run the game locally:

```sh
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Choosing Work

Use GitHub Issues for bugs, feature requests, and documentation work. Pick a
focused issue, read its acceptance criteria, and keep the pull request scoped to
that issue. Open a new issue when the change is larger than the existing
discussion or touches a different behavior.

Use the configured issue forms for new bug reports and feature requests. Blank
issues are disabled so the repository gets the details needed for triage.

## Branches

Name human-authored branches with a type prefix and kebab-case summary:

```text
<type>/<optional-issue-number>-<short-kebab-summary>
```

Examples:

```text
docs/15-project-documentation
feat/pause-button
fix/mobile-controls
ci/30-repository-conventions
```

Agent-created branches may use:

```text
codex/<type>-<optional-issue-number>-<summary>
```

Dependabot and other automation branches are allowed exceptions.

## Commits And Pull Request Titles

Use Conventional Commits for commit messages and pull request titles:

```text
<type>(<scope>): <description>
```

Allowed types are `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, and `revert`.

Useful scopes include `game`, `ui`, `hooks`, `deps`, `actions`, `docs`,
`config`, and `tests`. Other clear scopes are fine.

Validate an intended PR title or commit subject locally when useful:

```sh
printf '%s\n' 'docs: improve contributor guide' | pnpm run commitlint:message
```

## Pull Requests

Pull requests should include:

- A concise summary of what changed.
- A linked issue when applicable, such as `Closes #15`.
- The test or check commands you ran.
- Screenshots or recordings for visible gameplay or layout changes.

Keep PRs focused. Separate formatting-only changes from functional changes when
possible. If a change updates commands, CI, security posture, dependencies, or
project structure, update the relevant documentation in the same PR.

AI-assisted or AI-generated contributions follow the same standards as
human-authored work. Run all relevant checks, review generated code and tests
before opening the PR, and ensure no generated content bypasses coverage
thresholds or introduces semver ranges.

## Checks Before Opening A PR

Run the closest checks for the change. For documentation-only changes, this is
usually enough:

```sh
pnpm run format:check
```

For code, CI, or dependency changes, broaden the checks:

```sh
pnpm run format:check
pnpm run lint
pnpm run branch:check
printf '%s\n' 'fix(game): prevent wall collision regression' | pnpm run commitlint:message
pnpm run test:type
pnpm test
pnpm run coverage
pnpm run build
pnpm run test:e2e
pnpm run test:visual
```

Run Playwright checks when browser behavior, E2E flows, or visual snapshots
change.

## Required CI And Security Gates

Pull requests to `main` run CI and repository policy checks. The workflows check
formatting, ESLint, type tests, coverage thresholds, production builds,
functional Playwright tests, dependency review, pnpm audit, CodeQL analysis,
secret scanning, PR title format, commit subject format, and branch naming.

Dependencies are pinned to exact versions. If you add or update npm packages,
update `package.json` and commit the matching `pnpm-lock.yaml` changes. Do not
use semver ranges such as `^` or `~`.

GitHub Actions are pinned to full commit SHAs. When updating Actions, keep the
version comment in sync and rely on Dependabot for routine update PRs.
