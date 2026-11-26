import { describe, it, expect } from 'vitest';
import { FAMILIES, PRODUCTS, byFamily, bySlug, fromPrice } from '../../src/data/products';

describe('catalog', () => {
  it('has the six families', () => {
    expect(FAMILIES.length).toBe(6);
  });

  it('uses unique slugs', () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('gives every product at least one priced variant', () => {
    for (const p of PRODUCTS) {
      expect(p.variants.length, p.slug).toBeGreaterThan(0);
      for (const v of p.variants) expect(v.price, p.slug).toBeGreaterThan(0);
    }
  });

  it('keeps the client prices for Doani sidr', () => {
    expect(bySlug('sidr-doani')!.variants).toEqual([
      { label: 'ربع كيلو', grams: 250, price: 850 },
      { label: 'نص كيلو', grams: 500, price: 1500 },
    ]);
  });

  it('reports the lowest price as the from-price', () => {
    expect(fromPrice(bySlug('clover-export')!)).toBe(65);
  });

  it('groups four manuka grades and eight hive products', () => {
    expect(byFamily('manuka').length).toBe(4);
    expect(byFamily('hive').length).toBe(8);
  });

  it('tags every zero-sucrose product for the chooser', () => {
    for (const p of byFamily('zero-sucrose')) expect(p.tags, p.slug).toContain('no-sucrose');
  });
});
