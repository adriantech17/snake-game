# Snake Game

React and TypeScript application built with Vite.

## Requirements

- Node.js `^20.19.0`, `^22.13.0`, or `>=24.0.0`.
- pnpm `10.33.4` with `pnpm-lock.yaml` for reproducible installs.
- Project dependencies are pinned to exact versions for supply-chain safety.

## Getting Started

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Available Scripts

In the project directory, you can run:

### `pnpm run dev`

Runs the app in development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

### `pnpm start`

Runs the same Vite development server as `pnpm run dev`.

### `pnpm test`

Runs the test suite once with Vitest.

### `pnpm run test:watch`

Launches the Vitest test runner in watch mode.

### `pnpm run test:type`

Runs type-level Vitest checks.

### `pnpm run test:e2e`

Runs the functional Playwright E2E suite in Chromium.

### `pnpm run test:e2e:ui`

Launches the Playwright UI runner for local functional E2E debugging.

### `pnpm run test:visual`

Runs the separate Playwright visual regression test.

### `pnpm run coverage`

Runs the test suite with V8 coverage reporting.

### `pnpm run lint`

Checks the project with ESLint.

### `pnpm run lint:fix`

Applies safe ESLint fixes.

### `pnpm run branch:check`

Validates the current branch name against the repository convention.

### `pnpm run commitlint:message`

Validates a Conventional Commit-style message from standard input.

### `pnpm run format:check`

Checks formatting with Prettier.

### `pnpm run format`

Formats files with Prettier.

### `pnpm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Continuous Integration

Pull requests to `main` and pushes to `main` run the GitHub Actions workflow in
`.github/workflows/ci.yml`. CI checks formatting, ESLint, type tests, coverage,
production build, Playwright E2E tests, dependency review, pnpm audit, CodeQL
analysis, and secret scanning. Pull requests also run repository policy checks
for PR title, commit message, and branch naming conventions. Issues are
standardized with issue forms, default labels, and required fields.

## Testing Strategy

See [TESTING.md](./TESTING.md) for the project testing pyramid, coverage policy,
Playwright conventions, visual snapshot workflow, and LLM testing checklist.

## Contribution Conventions

Use Conventional Commits for commit messages and pull request titles:

```text
<type>(<scope>): <description>
```

The scope is optional when the type already gives enough context. Prefer these
types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, and `revert`. Useful scopes for this project include `game`, `ui`,
`hooks`, `deps`, `actions`, `docs`, `config`, and `tests`, but CI does not reject
other clear scopes.

CI validates the pull request title and the first line of each pull request commit
with Commitlint. The repository may use merge commits, squash merge, or rebase
merge. For squash merges, the pull request title becomes the important final
commit message. For rebase merges, every commit subject should already be
conventional. GitHub-generated merge commit subjects are allowed as automation
exceptions.

Commit messages are also checked locally through Husky and Commitlint. Branch names
are checked locally before push and in CI with the same validation script.
Git does not provide a local hook for creating GitHub pull requests, so validate
the intended PR title manually when useful:

```sh
printf '%s\n' 'fix(game): prevent wall collision regression' | pnpm run commitlint:message
```

Issues must be opened through the configured GitHub issue forms. Blank issues are
disabled, and the bug/feature forms apply labels and require the context needed to
triage the request.

Name human-authored branches with a type prefix and kebab-case summary. Include
the issue number when the work is tied to an issue:

```text
<type>/<optional-issue-number>-<short-kebab-summary>
```

Examples:

```text
feat/pause-button
fix/mobile-controls
ci/30-repository-conventions
```

Agent-created branches may use `codex/<type>-<optional-issue-number>-<summary>`.
Dependabot and other automation branches are allowed as exceptions.

Before opening a pull request, run the main local checks:

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

Dependency updates are managed by Dependabot in `.github/dependabot.yml` for both
pnpm-managed npm packages and GitHub Actions. GitHub Actions are pinned to full
commit SHAs for supply-chain safety, npm package dependencies are pinned to exact
versions, and Dependabot keeps those pinned references current.

The repository policy workflow uses the `pull_request` event for PR checks. Avoid
`pull_request_target` for workflows that install dependencies or run repository
scripts.
