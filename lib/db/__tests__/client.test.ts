import { describe, it, expect, beforeAll, mock } from 'bun:test';
import { initDatabase, getAllBourbons } from '../client';

// Mock expo-sqlite
mock.module('expo-sqlite', () => ({
  openDatabaseAsync: () =>
    Promise.resolve({
      execAsync: () => Promise.resolve(),
      getFirstAsync: () => Promise.resolve({ count: 0 }),
      getAllAsync: () => Promise.resolve([]),
      runAsync: () => Promise.resolve(),
    }),
}));

describe('Database Client', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  describe('initDatabase', () => {
    it('should initialize database without errors', async () => {
      const db = await initDatabase();
      expect(db).toBeDefined();
    });
  });

  describe('getAllBourbons', () => {
    it('should return an array of bourbons', async () => {
      const result = await getAllBourbons();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
