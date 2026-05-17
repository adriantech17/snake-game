# Repository Guidelines

## Project Structure

This is a Vite React + TypeScript Snake game. Application code lives in `src/`:

- `src/App.tsx` and `src/index.tsx` compose and bootstrap the app.
- `src/game/` contains pure game rules: constants, movement, food placement, and
  engine state transitions.
- `src/hooks/useSnakeGame.ts` connects the pure engine to React state, timers,
  keyboard controls, and UI callbacks.
- `src/components/` contains presentational UI such as `GameBoard`, `Controls`,
  and `ScoreBoard`.
- `src/types.ts` re-exports shared public TypeScript types from `src/game/types`.
- `src/*.test.tsx`, `src/**/*.test.ts`, and `src/*.test-d.ts` contain runtime,
  integration, and type tests.
- `e2e/` contains Playwright functional and visual tests.
- `docs/architecture.md` documents the game logic, hook, and UI boundaries.
- `docs/testing.md` is the canonical testing strategy and LLM testing checklist.
- `.github/workflows/` contains CI and repository policy workflows.
- `.github/copilot-instructions.md` is a Copilot-specific pointer to this file.
- `.github/dependabot.yml` manages pnpm npm packages and GitHub Actions updates.
- `CLAUDE.md` imports this file for Claude Code.
- `public/` contains static assets copied as-is.

Do not edit generated directories: `build/`, `coverage/`, `dist/`,
`node_modules/`, `playwright-report/`, or `test-results/`.

One root `AGENTS.md` is enough for now. Add nested `AGENTS.md` files only when a
subdirectory needs different operating rules.

Keep tool-specific instruction files as thin wrappers around this file unless a
tool truly needs unique guidance. Do not duplicate the full command list,
architecture rules, testing policy, or documentation update matrix in those
wrappers.

## Commands

- `pnpm install --frozen-lockfile` installs dependencies exactly from
  `pnpm-lock.yaml`.
- `pnpm install` may update `pnpm-lock.yaml` when intentionally changing
  dependencies.
- `pnpm run dev` or `pnpm start` runs Vite locally at
  `http://localhost:5173`.
- `pnpm run build` type-checks with `tsc --noEmit` and bundles to `dist/`.
- `pnpm test` runs the Vitest suite once.
- `pnpm run test:watch` runs Vitest in watch mode.
- `pnpm run test:type` runs type-check-only Vitest tests.
- `pnpm run test:e2e` runs functional Playwright E2E tests in Chromium.
- `pnpm run test:e2e:ui` opens the functional Playwright UI runner.
- `pnpm run test:visual` runs the separate Playwright visual regression test.
- `pnpm run coverage` runs tests with V8 coverage output in `coverage/`.
- `pnpm run lint` checks ESLint rules.
- `pnpm run lint:fix` applies safe ESLint fixes.
- `pnpm run branch:check` validates the current branch name.
- `pnpm run commitlint:message` validates a Conventional Commit-style message
  from standard input.
- `pnpm run format:check` checks Prettier.
- `pnpm run format` rewrites files with Prettier.

Keep npm package dependency versions pinned exactly. Do not use semver ranges
such as `^` or `~`.

## Coding Style

Use TypeScript and React function components. Name component files in PascalCase
such as `GameBoard.tsx`, and name hooks in camelCase beginning with `use`, such
as `useSnakeGame.ts`.

Prefer existing project boundaries over new abstractions:

- Put pure gameplay rules in `src/game`.
- Keep React timers, keyboard listeners, and state wiring in `useSnakeGame`.
- Keep UI components presentational and accessible.
- Put shared cross-module types in `src/game/types.ts` and re-export them from
  `src/types.ts` when they are used outside the game layer.

Prettier handles formatting. ESLint enforces TypeScript, React, React Hooks, and
Playwright rules. Run `pnpm run lint` and `pnpm run format:check` before
submitting code changes.

## Testing

Read [docs/testing.md](./docs/testing.md) before adding or changing tests.

Vitest is the test runner with Testing Library and jsdom for React tests.
Playwright covers the minimal Chromium E2E layer, with visual regression kept as
an explicit separate command.

Keep tests near the code they cover using `*.test.ts`, `*.test.tsx`, or
`*.test-d.ts`. Cover gameplay changes in `src/game` and `useSnakeGame` with
deterministic, behavior-focused cases. Cover UI changes through rendered output
and accessible queries. Use fake timers for ticks and injected `random`
functions for food placement.

Do not add new test infrastructure unless the need is concrete and documented.
Run `pnpm test` routinely and `pnpm run coverage` when changing core game logic.
Run Playwright checks when E2E behavior, browser flows, or visual snapshots
change.

## Documentation Updates

Keep documentation synchronized with behavior and workflow changes:

- Update `README.md` when setup, commands, controls, project structure, CI,
  security posture, or contributor entry points change.
- Update `docs/architecture.md` when logic, hook, UI, type, or data-flow
  boundaries change.
- Update `docs/testing.md` when test layers, coverage policy, deterministic
  testing patterns, or Playwright conventions change.
- Update `CONTRIBUTING.md` when branch naming, commit rules, PR expectations,
  issue workflow, or required checks change.
- Update `SECURITY.md` when reporting paths, supported branches, security
  controls, or vulnerability scope changes.
- Update this file when agent-specific workflow or repository conventions
  change.

If dependencies or commands change, update both `package.json` and the relevant
documentation. If CI commands, required checks, or dependency update policy
change, update `.github/workflows/ci.yml`, `.github/dependabot.yml`, `README.md`,
and contributor documentation together when relevant.

## Commit And Pull Request Guidelines

Use Conventional Commits for commit messages and pull request titles. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for the full branch naming, commit style,
PR expectations, and required checks. Key points for agents:

```text
<type>(<scope>): <description>
```

Allowed types are `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, and `revert`. Prefer scopes that match the project, such
as `game`, `ui`, `hooks`, `deps`, `actions`, `docs`, `config`, and `tests`, but
do not reject other clear scopes.

Name human-authored branches as
`<type>/<optional-issue-number>-<short-kebab-summary>`, for example
`feat/pause-button`, `fix/mobile-controls`, or
`ci/30-repository-conventions`. Include the issue number when the work is tied
to an issue. Agent-created branches may use
`codex/<type>-<optional-issue-number>-<summary>`. Dependabot and other
automation branches are allowed as exceptions.

Pull requests should include a description, linked issue when applicable, test
commands run, and screenshots or recordings for visible gameplay or layout
changes. Keep PRs focused; separate formatting-only changes from functional
work.

Issues should use the configured GitHub issue forms. Blank issues are disabled.

## CI And Dependency Maintenance

The CI workflow runs on pull requests to `main`, pushes to `main`, and manual
dispatches. It checks formatting, linting, type tests, coverage, production
build, functional Playwright tests, dependency review, pnpm audit, CodeQL SAST,
and secret scanning. Repository policy checks validate pull request titles,
commit messages, and branch names on pull requests.

Use `pull_request` for policy workflows that install dependencies or run
repository scripts. Avoid `pull_request_target` for those jobs.

GitHub Actions are pinned to full commit SHAs for supply-chain safety. When
updating Actions, keep the trailing version comment in sync and keep Dependabot
configured for the `github-actions` ecosystem so pinned references receive
update PRs.

Package dependencies are pinned to exact versions for supply-chain safety. When
adding or updating dependencies, keep `package.json` versions exact and commit
the matching `pnpm-lock.yaml` changes.

CI installs dependencies with
`pnpm install --frozen-lockfile --ignore-scripts`. If a future dependency
legitimately requires install scripts in CI, document the reason in the PR and
keep the exception as narrow as possible.

Before opening a PR that changes code or CI, run the closest local checks:
`pnpm run format:check`, `pnpm run lint`, `pnpm run branch:check`,
`pnpm run commitlint:message` for the intended PR title, `pnpm run test:type`,
`pnpm test`, `pnpm run coverage`, `pnpm run build`, and Playwright checks when
E2E or visual behavior changes.
