import { execFileSync } from 'node:child_process';

const branchName =
  process.argv[2] ?? process.env.BRANCH_NAME ?? getCurrentBranchName();

const typePattern =
  '(feat|fix|docs|test|refactor|chore|ci|build|style|perf|revert)';
const summaryPattern = '([0-9]+-)?[a-z0-9]+(-[a-z0-9]+)*';

const allowedPatterns = [
  new RegExp(`^${typePattern}/${summaryPattern}$`),
  new RegExp(`^codex/${typePattern}-${summaryPattern}$`),
  /^(dependabot[-/].*|copilot\/.*)$/,
];

if (!branchName) {
  console.error('Could not determine the current branch name.');
  process.exit(1);
}

if (allowedPatterns.some((pattern) => pattern.test(branchName))) {
  process.exit(0);
}

console.error(`Invalid branch name: ${branchName}`);
console.error(
  'Use <type>/<optional-issue-number>-<short-kebab-summary>, for example ci/30-repository-conventions.',
);
console.error(
  'Codex branches may use codex/<type>-<optional-issue-number>-<short-kebab-summary>.',
);
process.exit(1);

function getCurrentBranchName() {
  try {
    return execFileSync('git', ['branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}
