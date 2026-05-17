# Snake Game

A small browser Snake game built with Vite, React, and TypeScript. The player
starts the game, guides the snake around a 20 by 20 board, eats food to grow and
score points, pauses when needed, and restarts after winning or colliding with a
wall or the snake body.

## Stack

- Vite for local development and production builds.
- React function components for the UI.
- TypeScript for application and game-state types.
- Vitest, Testing Library, and jsdom for unit and integration tests.
- Playwright for Chromium E2E and visual regression checks.
- pnpm for dependency management with exact package versions.

## Requirements

- Node.js `^22.13.0` or `>=24.0.0`.
- pnpm `10.33.4`.

## Quick Start

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) to play locally.

## Gameplay Controls

- Start, pause, resume, or restart with `Space`.
- Move with arrow keys or `W`, `A`, `S`, and `D`.
- Use the on-screen direction buttons and primary action button on pointer or
  touch devices.

## Project Structure

```text
src/
  App.tsx                 App composition
  index.tsx               React bootstrap
  components/             GameBoard, Controls, and ScoreBoard UI
  game/                   Pure game rules, movement, food placement, constants
  hooks/useSnakeGame.ts   React state, keyboard controls, and game loop
  types.ts                Shared public type re-exports
e2e/                      Playwright functional and visual tests
docs/                     Architecture and testing documentation
.github/                  CI, policy workflows, issue forms, and PR template
public/                   Static assets copied by Vite
```

Generated directories such as `build/`, `coverage/`, `dist/`, and
`node_modules/` are not source files.

## Common Commands

| Command                        | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `pnpm run dev` or `pnpm start` | Run Vite at `http://localhost:5173`.                 |
| `pnpm run build`               | Type-check with `tsc --noEmit` and build to `dist/`. |
| `pnpm test`                    | Run the Vitest suite once.                           |
| `pnpm run test:watch`          | Run Vitest in watch mode.                            |
| `pnpm run test:type`           | Run type-check-only Vitest tests.                    |
| `pnpm run coverage`            | Run Vitest with V8 coverage thresholds.              |
| `pnpm run test:e2e`            | Run functional Playwright tests in Chromium.         |
| `pnpm run test:e2e:ui`         | Open the Playwright UI runner for E2E debugging.     |
| `pnpm run test:visual`         | Run the explicit visual regression test.             |
| `pnpm run lint`                | Check ESLint rules.                                  |
| `pnpm run lint:fix`            | Apply safe ESLint fixes.                             |
| `pnpm run format:check`        | Check Prettier formatting.                           |
| `pnpm run format`              | Rewrite files with Prettier.                         |
| `pnpm run branch:check`        | Validate the current branch name.                    |
| `pnpm run commitlint:message`  | Validate a Conventional Commit message from stdin.   |

## Testing And Quality

The fastest useful checks for documentation-only changes are:

```sh
pnpm run format:check
```

For code or CI changes, run the closest relevant checks and broaden before
opening a pull request:

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

See [docs/testing.md](./docs/testing.md) for the testing strategy, deterministic
gameplay testing guidance, fake timer usage, coverage policy, and Playwright
conventions.

## CI And Security

Pull requests to `main` and pushes to `main` run GitHub Actions checks for
formatting, linting, type tests, coverage, production builds, functional
Playwright tests, dependency review, pnpm audit, CodeQL analysis, secret
scanning, PR titles, commit subjects, and branch naming.

Dependencies are pinned to exact versions. GitHub Actions are pinned to full
commit SHAs and kept current by Dependabot along with pnpm-managed npm packages.

Report suspected vulnerabilities privately through the repository security
advisory flow. See [SECURITY.md](./SECURITY.md) for scope, reporting guidance,
and maintenance expectations.

## Contributing

Start with [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, branch names, commit
messages, pull request expectations, and required checks. Open bugs and feature
requests through the configured GitHub issue forms, and use
[GitHub Issues](https://github.com/adriantech17/snake-game/issues) to find
focused work.

Architecture notes live in [docs/architecture.md](./docs/architecture.md). AI
agents should also follow [AGENTS.md](./AGENTS.md).

This project is maintained by Adrián through the repository issue and pull
request workflow.
