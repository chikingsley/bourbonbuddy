# Testing Guide

## Test Runner: Bun

This project uses **Bun's built-in test runner** instead of Jest. Bun is significantly faster and has zero configuration.

## Running Tests

```bash
# Run all tests
bun test

# Watch mode
bun test --watch

# With coverage
bun test --coverage

# CI mode
npm run test:ci
```

## Test Structure

### Unit Tests (Bun)
- **Location**: `**/__tests__/*.test.{ts,tsx}`
- **Framework**: Bun test
- **Syntax**: Similar to Jest/Vitest

```typescript
import { describe, it, expect } from 'bun:test';

describe('MyFunction', () => {
  it('should work correctly', () => {
    expect(myFunction()).toBe(true);
  });
});
```

### E2E Tests (Maestro)
- **Location**: `.maestro/*.yaml`
- **Framework**: Maestro
- **Platform**: iOS/Android/Web

```yaml
appId: com.bourbonbuddy.app
---
- launchApp
- assertVisible: "Collection"
```

## Test Coverage

Coverage is automatically generated with Bun:

```bash
bun test --coverage
```

Coverage reports:
- `coverage/lcov.info` - For Codecov
- `coverage/index.html` - HTML report

## CI/CD Integration

Tests run automatically on GitHub Actions:
- **Lint & Type Check** - ESLint + TypeScript
- **Unit Tests** - Bun test with coverage
- **E2E Tests** - Maestro on iOS simulator

## Current Test Status

✅ **Unit Tests**: 6 passing
- Utils (className merging): 5 tests
- Database client (mocked): 2 tests
- Component tests: Placeholder (use Maestro)

✅ **E2E Tests**: 3 flows
- App launch & database init
- Navigation between tabs
- Search functionality

## Test Performance

Bun is **extremely fast**:
- Full test suite: ~83ms
- 10-20x faster than Jest
- Built-in watch mode
- Native TypeScript support

## Known Limitations

### React Native Components
Testing React Native components with Bun requires additional setup. For now:
- **Use Maestro** for UI component testing
- Unit tests focus on utilities and business logic
- Component tests are placeholders

Future: Consider @testing-library/react-native with custom Bun config

## Mocking

Bun has built-in mocking:

```typescript
import { mock } from 'bun:test';

// Mock a module
mock.module('module-name', () => ({
  export1: () => 'mocked',
}));

// Mock a function
const mockFn = mock(() => 'return value');
```

## Best Practices

1. **Keep tests fast** - Bun is blazing fast, keep it that way
2. **Use Maestro for UI** - Better than trying to mock RN components
3. **Mock external dependencies** - Database, network, etc.
4. **Test behavior, not implementation** - Focus on what, not how
5. **Write descriptive test names** - Clear expectations

## Debugging

```bash
# Run specific test file
bun test lib/__tests__/utils.test.ts

# Verbose output
bun test --verbose

# Show all output
bun test --bail
```

## Performance Tracking

Unlike Jest, Bun doesn't need special performance tracking - it's always fast!

## Flaky Tests

Bun tests are deterministic and fast, reducing flakiness. If you encounter flaky tests:
1. Check for race conditions
2. Verify mocks are properly reset
3. Ensure no shared state between tests

## Resources

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Project Test Files](../__tests__)
