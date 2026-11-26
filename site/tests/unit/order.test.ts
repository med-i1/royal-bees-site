import { describe, it, expect } from 'vitest';
import {
  addLine, setQty, removeLine, orderTotal, orderCount, loadOrder, saveOrder,
  buildMessage, whatsappUrl, MAX_LINES, STORAGE_KEY, type OrderLine,
} from '../../src/lib/order';
import { SITE } from '../../src/config';

const doani = { slug: 'sidr-doani', name: 'عسل السدر الجبلي دوعني', variant: 'ربع كيلو', unitPrice: 850 };
const almond = { slug: 'nuts-almond', name: 'مكسرات لوز', variant: '٢٠٠ جرام', unitPrice: 185 };

function memStorage(init: Record<string, string> = {}): Storage {
  const m = new Map(Object.entries(init));
  return {
    get length() { return m.size; },
    clear: () => m.clear(),
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => { m.delete(k); },
    setItem: (k, v) => { m.set(k, v); },
  };
}
const throwing: Storage = {
  length: 0, clear() {}, key: () => null, removeItem() {},
  getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); },
};

describe('order list', () => {
  it('merges the same product and size into one line', () => {
    let lines: OrderLine[] = [];
    lines = addLine(lines, doani).lines;
    lines = addLine(lines, doani).lines;
    expect(lines).toHaveLength(1);
    expect(lines[0].qty).toBe(2);
  });

  it('refuses a 31st line', () => {
    let lines: OrderLine[] = [];
    for (let i = 0; i < MAX_LINES; i++) lines = addLine(lines, { ...doani, slug: `p${i}` }).lines;
    const r = addLine(lines, { ...doani, slug: 'one-more' });
    expect(r.added).toBe(false);
    expect(r.lines).toHaveLength(30);
  });

  it('removes a line when its quantity drops to zero', () => {
    const lines = addLine([], doani).lines;
    expect(setQty(lines, 'sidr-doani', 'ربع كيلو', 0)).toEqual([]);
    expect(removeLine(lines, 'sidr-doani', 'ربع كيلو')).toEqual([]);
  });

  it('totals and counts the order', () => {
    const lines = addLine(addLine([], doani, 2).lines, almond).lines;
    expect(orderTotal(lines)).toBe(1885);
    expect(orderCount(lines)).toBe(3);
  });

  it('survives broken or unavailable storage', () => {
    expect(loadOrder(memStorage({ [STORAGE_KEY]: '{bad json' }))).toEqual([]);
    expect(loadOrder(throwing)).toEqual([]);
    expect(() => saveOrder(addLine([], doani).lines, throwing)).not.toThrow();
  });

  it('round-trips through storage', () => {
    const s = memStorage();
    const lines = addLine([], doani).lines;
    saveOrder(lines, s);
    expect(loadOrder(s)).toEqual(lines);
  });

  it('writes the WhatsApp message exactly', () => {
    const lines = addLine(addLine([], doani, 2).lines, almond).lines;
    expect(buildMessage(lines)).toBe([
      'السلام عليكم، عايز أطلب من مملكة النحل:',
      '• عسل السدر الجبلي دوعني (ربع كيلو) × ٢ = ١٧٠٠ جنيه',
      '• مكسرات لوز (٢٠٠ جرام) × ١ = ١٨٥ جنيه',
      'الإجمالي: ١٨٨٥ جنيه (من غير التوصيل)',
      'الاسم: …',
      'المنطقة: …',
    ].join('\n'));
    expect(buildMessage(lines, { name: 'أحمد & سارة' })).toContain('الاسم: أحمد & سارة');
  });

  it('encodes special characters in the WhatsApp link', () => {
    const url = whatsappUrl('a&b #1');
    expect(url).toBe(`https://wa.me/${SITE.whatsapp}?text=a%26b%20%231`);
    expect(whatsappUrl('x', '201000000000')).toBe('https://wa.me/201000000000?text=x');
  });
});
