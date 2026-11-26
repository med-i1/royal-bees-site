import { describe, it, expect } from 'vitest';
import { statSync } from 'node:fs';
import { PRODUCTS } from '../../src/data/products';

describe('product images', () => {
  it('has an image file for every product', () => {
    for (const p of PRODUCTS) {
      let size = 0;
      try { size = statSync(`public${p.image}`).size; } catch { /* missing */ }
      expect(size, p.image).toBeGreaterThan(2000);
    }
  });
});
