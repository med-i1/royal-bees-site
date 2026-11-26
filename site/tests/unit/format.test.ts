import { describe, it, expect } from 'vitest';
import { arDigits, priceLabel } from '../../src/lib/format';

describe('format', () => {
  it('writes numbers in Arabic-Indic digits without separators', () => {
    expect(arDigits(1500)).toBe('١٥٠٠');
    expect(arDigits('UMF 15')).toBe('UMF ١٥');
  });

  it('labels prices in pounds', () => {
    expect(priceLabel(65)).toBe('٦٥ جنيه');
  });
});
