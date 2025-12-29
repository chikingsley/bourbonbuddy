import { describe, it, expect } from 'bun:test';
import { cn } from '../utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      const result = cn('foo', false && 'bar', 'baz');
      expect(result).toBe('foo baz');
    });

    it('should merge Tailwind classes without conflicts', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toContain('px-4');
      expect(result).not.toContain('px-2');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['foo', 'bar'], 'baz');
      expect(result).toBe('foo bar baz');
    });

    it('should handle duplicate classes', () => {
      const result = cn('foo', 'bar', 'foo');
      // Note: tailwind-merge may or may not dedupe depending on context
      expect(result).toContain('foo');
      expect(result).toContain('bar');
    });
  });
});
