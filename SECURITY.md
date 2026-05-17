# Security Policy

## Supported Versions

`main` is the only supported branch for security fixes unless future release
branches are created.

## Reporting A Vulnerability

Report suspected security vulnerabilities privately through
[GitHub Private vulnerability reporting](https://github.com/adriantech17/snake-game/security/advisories/new).

Do not disclose suspected vulnerabilities publicly until they have been reviewed.
Use normal GitHub Issues for bugs, gameplay problems, documentation requests, CI
failures, or feature requests that do not expose a vulnerability.

The maintainer will acknowledge and triage reports on a best-effort basis. This
project does not currently offer bug bounty rewards, guaranteed response times,
or guaranteed resolution timelines.

## Scope

In scope:

- Browser game source code in this repository.
- npm dependencies managed by `pnpm-lock.yaml`.
- GitHub Actions workflows and repository automation.
- Repository configuration that affects build, test, dependency, or security
  behavior.

Out of scope:

- Social engineering.
- Denial of service or spam.
- Reports against unrelated services or accounts.
- Findings that require public disclosure before private review.

## Current Security Controls

- CI is required for pull requests to `main`.
- Dependency review runs on pull requests.
- Dependabot alerts, security updates, and version updates are used for npm
  packages and GitHub Actions.
- CodeQL code scanning runs for JavaScript and TypeScript.
- Secret scanning and push protection are expected repository controls.
- GitHub Actions are pinned to full commit SHAs and maintained through
  Dependabot.
