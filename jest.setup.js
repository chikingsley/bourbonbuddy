// Jest setup file for retries and custom configurations

// Configure retries for flaky tests (check if jest.retryTimes exists)
if (global.jest && typeof global.jest.retryTimes === 'function') {
  global.jest.retryTimes(2, {
    logErrorsBeforeRetry: true,
  });
}

// Mock console methods to reduce noise in tests
if (global.console) {
  global.console = {
    ...console,
    // Uncomment to suppress console.log in tests
    // log: jest.fn ? jest.fn() : console.log,
    debug: jest.fn ? jest.fn() : console.debug,
    // Keep error and warn for debugging
    error: console.error,
    warn: console.warn,
  };
}

// Performance tracking
const testTimings = {};

if (global.it) {
  const originalIt = global.it;

  global.it = function (name, fn, timeout) {
    return originalIt.call(this, name, async function (...args) {
      const startTime = Date.now();
      try {
        if (fn) {
          await fn.apply(this, args);
        }
      } finally {
        const duration = Date.now() - startTime;
        testTimings[name] = duration;

        // Log slow tests (over 5 seconds)
        if (duration > 5000) {
          console.warn(`⚠️  Slow test detected: "${name}" took ${duration}ms`);
        }
      }
    }, timeout);
  };
}

// Export test timings after all tests complete
if (global.afterAll) {
  global.afterAll(() => {
    const slowTests = Object.entries(testTimings)
      .filter(([_, duration]) => duration > 3000)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (slowTests.length > 0) {
      console.log('\n📊 Top 10 Slowest Tests:');
      slowTests.forEach(([name, duration]) => {
        console.log(`   ${duration}ms - ${name}`);
      });
    }
  });
}
