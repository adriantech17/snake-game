# Testing Guide

This project uses a pragmatic testing pyramid. Prefer fast, deterministic tests
close to the behavior they protect, and add slower browser tests only for flows
that need a real browser.

## Pyramid

- Unit tests protect pure game logic in `src/game`. These should be the most
  numerous tests.
- Integration tests use React Testing Library for user-visible UI behavior in
  `src/App.test.tsx` and component tests.
- Functional E2E tests use Playwright for the main browser flow only.
- Visual regression is a separate Playwright command limited to stable states.
  Keep snapshots small and avoid text-heavy captures when a narrower element is
  enough.

## Unit and Integration Tests

- Keep tests co-located with the code they cover using `*.test.ts`,
  `*.test.tsx`, or `*.test-d.ts`.
- Test behavior and state transitions, not implementation details.
- Use injected `random` functions for food placement and game-state creation.
- Use Vitest fake timers for game ticks and interval-driven behavior.
- Do not use real network calls, external services, real randomness, or real
  timers in unit and integration tests.
- Prefer `getByRole`, then `getByLabelText`, then visible text. Use
  `data-testid` only when accessible semantics would be misleading or impossible.
- For board internals, prefer accessible board-level assertions unless the test
  truly needs piece placement.

## Playwright

- Run functional E2E with `pnpm run test:e2e`.
- Run the functional E2E Playwright UI with `pnpm run test:e2e:ui`.
- Run visual snapshots separately with `pnpm run test:visual`.
- Keep Playwright on Chromium only unless a future issue explicitly adds
  cross-browser coverage.
- Use the configured `baseURL` and navigate with relative paths such as `/`.
- Keep functional E2E tests focused on real Snake flows: load, render board and
  controls, start, pause, and resume.
- Do not add Page Object Model, mock servers, auth, checkout, or unrelated flows.

## Visual Regression

Visual snapshots should be stable and narrowly scoped. The initial snapshot
captures only the game board, fixes `Math.random`, and disables CSS animation
before comparison.

Playwright screenshot baselines are environment-sensitive. Generate and review
snapshots in the same operating-system/browser environment where they will be
compared. Functional CI intentionally runs `pnpm run test:e2e`; visual snapshots
stay behind the explicit `pnpm run test:visual` command until the comparison
environment is standardized.

To update snapshots intentionally:

```sh
pnpm run test:visual -- --update-snapshots
```

Review generated image changes before committing them.

## Coverage Policy

Coverage is a confidence signal, not the goal. Do not add tests that only execute
lines without protecting meaningful behavior.

- Product-code global threshold: 95% for statements, branches, functions, and
  lines.
- `src/game/**` threshold: 95% for statements, branches, functions, and lines.
- Bootstrap and test setup files are excluded because they do not contain product
  behavior:
  - `src/index.tsx`
  - `src/reportWebVitals.ts`
  - `src/setupTests.ts`

## LLM Checklist

Before adding or changing tests, assistants should:

- Read this guide and inspect nearby tests first.
- Choose the cheapest layer that protects the behavior.
- Prefer deterministic inputs over mocks that hide the game rules.
- Keep assertions user-facing for UI and state-facing for pure game logic.
- Avoid adding new testing libraries, helpers, or abstractions unless the
  duplication is already concrete.
- Run the closest relevant check before finishing, then broaden to the full local
  verification set when changing shared behavior or CI.
