# Contributing to BourbonBuddy

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Expo CLI
- Maestro (for E2E tests)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bourbonbuddy.git
cd bourbonbuddy

# Install dependencies
npm install

# Start the development server
npm start
```

## Code Style

We use ESLint for code linting. Run the linter before committing:

```bash
npm run lint
```

## Testing

### Unit Tests

We use Jest for unit testing with coverage tracking:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### E2E Tests

We use Maestro for end-to-end testing:

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run E2E tests
maestro test .maestro/
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```bash
git commit -m "feat: add bourbon detail screen"
git commit -m "fix: resolve search input focus issue"
git commit -m "docs: update API documentation"
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

### PR Checklist

- [ ] Tests pass locally (`npm test`)
- [ ] Code follows style guidelines (`npm run lint`)
- [ ] Commit messages follow convention
- [ ] Documentation updated (if applicable)
- [ ] No merge conflicts

## Test Performance

Our CI tracks test performance. Keep tests fast:
- Unit tests should run in < 1s each
- Integration tests should run in < 5s each
- E2E tests should run in < 30s each

Slow tests will be flagged in CI.

## Flaky Tests

We automatically retry failing tests up to 2 times. If you notice a flaky test:
1. Report it in an issue
2. Add `jest.retryTimes(3)` if needed
3. Investigate and fix the root cause

## Code Coverage

We maintain a minimum coverage of 70% for:
- Branches
- Functions
- Lines
- Statements

Coverage reports are uploaded to Codecov automatically.

## Release Process

Releases are automated using semantic-release:
1. Merge PRs to `main`
2. Semantic-release analyzes commits
3. Version bumped automatically
4. CHANGELOG generated
5. GitHub release created

## Questions?

Open an issue or reach out to the maintainers!
