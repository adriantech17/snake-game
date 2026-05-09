# Snake Game

React and TypeScript application built with Vite.

## Requirements

- Node.js `^20.19.0`, `^22.13.0`, or `>=24.0.0`.
- npm with `package-lock.json` for reproducible installs.

## Getting Started

```sh
npm ci
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

### `npm start`

Runs the same Vite development server as `npm run dev`.

### `npm test`

Runs the test suite once with Vitest.

### `npm run test:watch`

Launches the Vitest test runner in watch mode.

### `npm run test:type`

Runs type-level Vitest checks.

### `npm run coverage`

Runs the test suite with V8 coverage reporting.

### `npm run lint`

Checks the project with ESLint.

### `npm run lint:fix`

Applies safe ESLint fixes.

### `npm run format:check`

Checks formatting with Prettier.

### `npm run format`

Formats files with Prettier.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Continuous Integration

Pull requests to `main` and pushes to `main` run the GitHub Actions workflow in
`.github/workflows/ci.yml`. CI checks formatting, ESLint, type tests, coverage,
production build, dependency review, npm audit, CodeQL analysis, and secret
scanning.

Before opening a pull request, run the main local checks:

```sh
npm run format:check
npm run lint
npm run test:type
npm test
npm run build
```

Dependency updates are managed by Dependabot in `.github/dependabot.yml` for both
npm packages and GitHub Actions. GitHub Actions are pinned to full commit SHAs for
supply-chain safety, and Dependabot keeps those pinned references current.
