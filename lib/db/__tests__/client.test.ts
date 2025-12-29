import { describe, it, expect, beforeAll } from '@jest/globals';

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(),
      getFirstAsync: jest.fn(() => Promise.resolve({ count: 0 })),
      getAllAsync: jest.fn(() => Promise.resolve([])),
      runAsync: jest.fn(),
    })
  ),
}));

// Import after mocking
import { initDatabase, getAllBourbons } from '../client';

describe('Database Client', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  describe('initDatabase', () => {
    it('should initialize database without errors', async () => {
      await expect(initDatabase()).resolves.toBeDefined();
    });
  });

  describe('getAllBourbons', () => {
    it('should return an array of bourbons', async () => {
      const result = await getAllBourbons();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
