import { SITE } from '../config';
import { arDigits } from './format';

export type OrderLine = { slug: string; name: string; variant: string; unitPrice: number; qty: number };

export const MAX_LINES = 30;
export const MAX_QTY = 99;
export const STORAGE_KEY = 'rb-order-v1';

const same = (l: OrderLine, slug: string, variant: string) => l.slug === slug && l.variant === variant;

export function addLine(lines: OrderLine[], line: Omit<OrderLine, 'qty'>, qty = 1): { lines: OrderLine[]; added: boolean } {
  const existing = lines.find((l) => same(l, line.slug, line.variant));
  if (existing) return { lines: setQty(lines, line.slug, line.variant, existing.qty + qty), added: true };
  if (lines.length >= MAX_LINES) return { lines, added: false };
  return { lines: [...lines, { ...line, qty: Math.min(qty, MAX_QTY) }], added: true };
}

export function setQty(lines: OrderLine[], slug: string, variant: string, qty: number): OrderLine[] {
  if (qty <= 0) return removeLine(lines, slug, variant);
  return lines.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.min(qty, MAX_QTY) } : l));
}

export function removeLine(lines: OrderLine[], slug: string, variant: string): OrderLine[] {
  return lines.filter((l) => !same(l, slug, variant));
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

export function orderCount(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

function isLine(x: unknown): x is OrderLine {
  const l = x as OrderLine;
  return !!l && typeof l.slug === 'string' && typeof l.name === 'string' && typeof l.variant === 'string'
    && Number.isFinite(l.unitPrice) && Number.isInteger(l.qty) && l.qty > 0;
}

/** Reads the saved order; any storage error or malformed data yields an empty order. */
export function loadOrder(storage: Storage | undefined = globalThis.localStorage): OrderLine[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isLine).slice(0, MAX_LINES) : [];
  } catch {
    return [];
  }
}

/** Saves the order; storage failures (private mode, quota) are ignored so the page keeps working. */
export function saveOrder(lines: OrderLine[], storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* in-memory only */
  }
}

export function buildMessage(lines: OrderLine[], who: { name?: string; area?: string } = {}): string {
  const rows = lines.map((l) => `• ${l.name} (${l.variant}) × ${arDigits(l.qty)} = ${arDigits(l.unitPrice * l.qty)} جنيه`);
  return [
    `السلام عليكم، عايز أطلب من ${SITE.name}:`,
    ...rows,
    `الإجمالي: ${arDigits(orderTotal(lines))} جنيه (من غير التوصيل)`,
    `الاسم: ${who.name?.trim() || '…'}`,
    `المنطقة: ${who.area?.trim() || '…'}`,
  ].join('\n');
}

export function whatsappUrl(text: string, number: string = SITE.whatsapp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
