# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React + TypeScript snake game. Application code lives in `src/`:

- `src/App.tsx` and `src/index.tsx` for app composition and bootstrapping.
- `src/hooks/useSnakeGame.ts` for game state and movement logic.
- `src/components/` for UI pieces such as `GameBoard`, `Controls`, and `ScoreBoard`.
- `src/types.ts` for shared TypeScript types.
- `src/*.test.tsx` and `src/*.test-d.ts` for runtime and type tests.
- `public/` for static assets copied as-is; generated output goes to `dist/`.

Do not edit generated directories: `build/`, `coverage/`, `dist/`, or `node_modules/`.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` or `npm start` runs Vite locally at `http://localhost:5173`.
- `npm run build` type-checks with `tsc --noEmit` and bundles to `dist/`.
- `npm test` runs the Vitest suite once.
- `npm run test:watch` runs Vitest in watch mode while developing.
- `npm run test:type` runs type-check-only Vitest tests.
- `npm run coverage` runs tests with V8 coverage output in `coverage/`.
- `npm run lint` checks ESLint rules; `npm run lint:fix` applies safe fixes.
- `npm run format:check` checks Prettier; `npm run format` rewrites files.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Name component files in PascalCase
(`GameBoard.tsx`) and hooks in camelCase beginning with `use` (`useSnakeGame.ts`).
Put shared cross-module types in `src/types.ts`.

Prettier handles formatting. ESLint enforces TypeScript, React, and React Hooks rules.
Run `npm run lint` and `npm run format:check` before submitting changes.

## Testing Guidelines

Vitest is the test runner with Testing Library and jsdom for React tests. Keep tests
near the code they cover using `*.test.ts`, `*.test.tsx`, or `*.test-d.ts`. Cover
gameplay changes in `useSnakeGame` with behavior-focused cases, and cover UI changes
through rendered output and accessible queries. Add user-event tooling when interaction
tests are introduced. Run `npm test` routinely and `npm run coverage` when changing
core game logic.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit style, such as `chore: add Vitest coverage`
and `style: format project with Prettier`. Use `feat:`, `fix:`, `chore:`, `style:`,
or `test:` followed by a short imperative summary.

Pull requests should include a description, linked issue when applicable, test
commands run, and screenshots or recordings for visible gameplay or layout changes.
Keep PRs focused; separate formatting-only changes from functional work.

## Agent-Specific Instructions

Before editing, inspect existing patterns and keep changes scoped. Avoid touching
generated directories. If dependencies or commands change, update both `package.json`
and this guide when relevant.
