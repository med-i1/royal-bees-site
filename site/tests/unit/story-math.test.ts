import { describe, it, expect } from 'vitest';
import { frameForProgress, frameLoadOrder } from '../../src/lib/story-math';

describe('story math', () => {
  it('holds the first frame during the hold zone', () => {
    expect(frameForProgress(0.05, 64)).toBe(0);
  });
  it('maps progress linearly across the pour', () => {
    expect(frameForProgress(0.5, 64)).toBeCloseTo(31.5, 5);
    expect(frameForProgress(1, 64)).toBe(63);
  });
  it('clamps out-of-range progress', () => {
    expect(frameForProgress(-1, 64)).toBe(0);
    expect(frameForProgress(2, 64)).toBe(63);
  });
  it('loads frames coarse-to-fine, each once, starting at 0', () => {
    const order = frameLoadOrder(64);
    expect(order).toHaveLength(64);
    expect(order[0]).toBe(0);
    expect(new Set(order).size).toBe(64);
    expect(order.slice(0, 4)).toEqual([0, 16, 32, 48]);
  });
});
