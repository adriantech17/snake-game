# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React + TypeScript snake game. Application code lives in `src/`:

- `src/App.tsx` and `src/index.tsx` for app composition and bootstrapping.
- `src/hooks/useSnakeGame.ts` for game state and movement logic.
- `src/components/` for UI pieces such as `GameBoard`, `Controls`, and `ScoreBoard`.
- `src/types.ts` for shared TypeScript types.
- `src/*.test.tsx` and `src/*.test-d.ts` for runtime and type tests.
- `TESTING.md` for the canonical testing strategy and LLM testing checklist.
- `.github/workflows/ci.yml` for GitHub Actions CI.
- `.github/dependabot.yml` for pnpm-managed npm package and GitHub Actions dependency updates.
- `public/` for static assets copied as-is; generated output goes to `dist/`.

Do not edit generated directories: `build/`, `coverage/`, `dist/`, or `node_modules/`.

## Build, Test, and Development Commands

- `pnpm install --frozen-lockfile` installs dependencies exactly from `pnpm-lock.yaml`.
- `pnpm install` updates `pnpm-lock.yaml` when intentionally changing dependencies.
  Keep npm package dependency versions pinned exactly; do not use semver ranges such as
  `^` or `~`.
- `pnpm run dev` or `pnpm start` runs Vite locally at `http://localhost:5173`.
- `pnpm run build` type-checks with `tsc --noEmit` and bundles to `dist/`.
- `pnpm test` runs the Vitest suite once.
- `pnpm run test:watch` runs Vitest in watch mode while developing.
- `pnpm run test:type` runs type-check-only Vitest tests.
- `pnpm run test:e2e` runs functional Playwright E2E tests in Chromium.
- `pnpm run test:e2e:ui` opens the functional Playwright UI runner.
- `pnpm run test:visual` runs the separate Playwright visual regression test.
- `pnpm run coverage` runs tests with V8 coverage output in `coverage/`.
- `pnpm run lint` checks ESLint rules; `pnpm run lint:fix` applies safe fixes.
- `pnpm run branch:check` validates the current branch name convention.
- `pnpm run commitlint:message` validates a Conventional Commit-style message from
  standard input.
- `pnpm run format:check` checks Prettier; `pnpm run format` rewrites files.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Name component files in PascalCase
(`GameBoard.tsx`) and hooks in camelCase beginning with `use` (`useSnakeGame.ts`).
Put shared cross-module types in `src/types.ts`.

Prettier handles formatting. ESLint enforces TypeScript, React, and React Hooks rules.
Run `pnpm run lint` and `pnpm run format:check` before submitting changes.

## Testing Guidelines

Vitest is the test runner with Testing Library and jsdom for React tests.
Playwright covers the minimal Chromium E2E layer, with visual regression kept as
an explicit separate command. Read `TESTING.md` before adding or changing tests.
Keep tests near the code they cover using `*.test.ts`, `*.test.tsx`, or
`*.test-d.ts`. Cover gameplay changes in
`src/game` and `useSnakeGame` with deterministic, behavior-focused cases, and
cover UI changes through rendered output and accessible queries. Use fake timers
for ticks and injected `random` functions for food placement. Do not add new test
infrastructure unless the need is concrete and documented. Run `pnpm test`
routinely and `pnpm run coverage` when changing core game logic.

## Commit & Pull Request Guidelines

Use Conventional Commits for commit messages and pull request titles:
`<type>(<scope>): <description>`. The scope is optional when the type already gives
enough context. Allowed types are `feat`, `fix`, `docs`, `style`, `refactor`,
`perf`, `test`, `build`, `ci`, `chore`, and `revert`. Prefer scopes that match the
project, such as `game`, `ui`, `hooks`, `deps`, `actions`, `docs`, `config`, and
`tests`, but do not reject other clear scopes. CI validates pull request titles and
the first line of each pull request commit with Commitlint. Husky and Commitlint
validate commit messages locally, and the shared branch validation script runs
locally before push and in CI. GitHub-generated merge commit subjects are allowed
so the repository can use merge commits, squash merge, or rebase merge.
Git has no native local hook for creating GitHub pull requests; when needed,
validate the intended PR title manually with `pnpm run commitlint:message`.

Name human-authored branches as
`<type>/<optional-issue-number>-<short-kebab-summary>`, for example
`feat/pause-button`, `fix/mobile-controls`, or `ci/30-repository-conventions`.
Include the issue number when the work is tied to an issue. Agent-created branches
may use `codex/<type>-<optional-issue-number>-<summary>`. Dependabot and other
automation branches are allowed as exceptions.

Pull requests should include a description, linked issue when applicable, test
commands run, and screenshots or recordings for visible gameplay or layout changes.
Keep PRs focused; separate formatting-only changes from functional work.

Issues should use the configured GitHub issue forms. Blank issues are disabled, and
the forms apply labels and require the context needed to triage bugs and feature
requests.

## CI & Dependency Maintenance

The CI workflow runs on pull requests to `main`, pushes to `main`, and manual
dispatches. It checks formatting, linting, type tests, coverage, production build,
dependency review, pnpm audit, CodeQL SAST, and secret scanning. Repository policy
checks validate pull request titles, commit messages, and branch names on pull
requests.

Use `pull_request` for policy workflows that install dependencies or run repository
scripts. Avoid `pull_request_target` for those jobs.

GitHub Actions are pinned to full commit SHAs for supply-chain safety. When updating
Actions, keep the trailing version comment in sync and keep Dependabot configured for
the `github-actions` ecosystem so pinned references receive update PRs.

Package dependencies are pinned to exact versions for supply-chain safety. When adding
or updating dependencies, keep `package.json` versions exact and commit the matching
`pnpm-lock.yaml` changes.

CI installs dependencies with `pnpm install --frozen-lockfile --ignore-scripts`. If a future dependency
legitimately requires install scripts in CI, document the reason in the PR and keep
the exception as narrow as possible.

Before opening a PR that changes code or CI, run the closest local checks:
`pnpm run format:check`, `pnpm run lint`, `pnpm run branch:check`,
`pnpm run commitlint:message` for the intended PR title, `pnpm run test:type`,
`pnpm test`, `pnpm run coverage`, `pnpm run build`, and Playwright checks when E2E
or visual behavior changes.

## Agent-Specific Instructions

Before editing, inspect existing patterns and keep changes scoped. Avoid touching
generated directories. If dependencies or commands change, update both `package.json`
and this guide when relevant. If CI commands, required checks, or dependency update
policy change, update `.github/workflows/ci.yml`, `.github/dependabot.yml`, and the
README together.
