import {
  addLine, setQty, removeLine, loadOrder, saveOrder, orderCount, orderTotal,
  buildMessage, whatsappUrl, MAX_LINES, type OrderLine,
} from '../lib/order';
import { arDigits, priceLabel } from '../lib/format';

let lines: OrderLine[] = [];
let ac: AbortController | null = null;
let opener: HTMLElement | null = null;
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element>(s: string) => document.querySelector<T>(s);

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}

function render() {
  const count = orderCount(lines);
  document.querySelectorAll<HTMLElement>('[data-order-count]').forEach((el) => {
    el.textContent = arDigits(count);
    el.hidden = count === 0;
  });
  const list = $<HTMLUListElement>('[data-order-list]');
  if (!list) return;
  list.innerHTML = lines.map((l) => `
    <li class="order-line" data-order-line>
      <div><div class="nm">${esc(l.name)}</div><div class="vr">${esc(l.variant)} × ${arDigits(l.qty)}</div></div>
      <div class="pr">${priceLabel(l.unitPrice * l.qty)}</div>
      <div class="qty">
        <button type="button" data-act="dec" data-slug="${esc(l.slug)}" data-variant="${esc(l.variant)}" aria-label="قلل الكمية">−</button>
        <output>${arDigits(l.qty)}</output>
        <button type="button" data-act="inc" data-slug="${esc(l.slug)}" data-variant="${esc(l.variant)}" aria-label="زوّد الكمية">+</button>
      </div>
      <button type="button" class="del" data-act="del" data-slug="${esc(l.slug)}" data-variant="${esc(l.variant)}">احذف</button>
    </li>`).join('');
  const empty = lines.length === 0;
  $<HTMLElement>('[data-order-empty]')!.hidden = !empty;
  $<HTMLElement>('[data-order-foot]')!.hidden = empty;
  $<HTMLElement>('[data-order-total]')!.textContent = priceLabel(orderTotal(lines));
  updateLink();
}

function updateLink() {
  const send = $<HTMLAnchorElement>('[data-order-send]');
  if (!send) return;
  if (!lines.length) { send.removeAttribute('href'); send.setAttribute('aria-disabled', 'true'); return; }
  const name = $<HTMLInputElement>('[data-order-name]')?.value;
  const area = $<HTMLInputElement>('[data-order-area]')?.value;
  send.href = whatsappUrl(buildMessage(lines, { name, area }));
  send.removeAttribute('aria-disabled');
}

function commit(next: OrderLine[]) {
  lines = next;
  saveOrder(lines);
  render();
  document.dispatchEvent(new CustomEvent('rb:order-changed', { detail: lines }));
}

function note(text: string) {
  const n = $<HTMLElement>('[data-order-note]');
  if (n) n.textContent = text;
}

function bump() {
  if (reduce()) return;
  document.querySelectorAll<HTMLElement>('[data-order-count]').forEach((el) =>
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' }));
}

function open(from?: HTMLElement | null) {
  const d = $<HTMLElement>('#order-drawer');
  if (!d) return;
  opener = from ?? (document.activeElement as HTMLElement);
  $<HTMLElement>('[data-order-scrim]')!.hidden = false;
  d.hidden = false;
  d.classList.add('is-open');
  d.querySelector<HTMLElement>('[data-order-close]')?.focus();
}

function close() {
  const d = $<HTMLElement>('#order-drawer');
  if (!d || d.hidden) return;
  d.hidden = true;
  d.classList.remove('is-open');
  $<HTMLElement>('[data-order-scrim]')!.hidden = true;
  opener?.focus();
}

function init() {
  ac?.abort();
  ac = new AbortController();
  const { signal } = ac;
  const stored = loadOrder();
  if (stored.length) lines = stored; // storage unavailable → keep the in-memory order
  render();

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const add = t.closest<HTMLElement>('[data-add-order]');
    if (add) {
      const { slug = '', name = '', variant = '', price = '0' } = add.dataset;
      const r = addLine(lines, { slug, name, variant, unitPrice: Number(price) });
      if (!r.added) { note(`وصلت لأقصى عدد (${arDigits(MAX_LINES)})، ابعت الطلب ده الأول`); open(add); return; }
      note('');
      commit(r.lines);
      bump();
      return;
    }
    if (t.closest('[data-order-open]')) { open(t.closest<HTMLElement>('[data-order-open]')); return; }
    if (t.closest('[data-order-close]') || t.closest('[data-order-scrim]')) { close(); return; }
    if (t.closest('[data-order-reset]')) {
      if (confirm('تمسح الطلب وتبدأ من الأول؟')) { note(''); commit([]); }
      return;
    }
    const act = t.closest<HTMLElement>('[data-act]');
    if (act) {
      const { slug = '', variant = '' } = act.dataset;
      const cur = lines.find((l) => l.slug === slug && l.variant === variant);
      if (!cur) return;
      if (act.dataset.act === 'inc') commit(setQty(lines, slug, variant, cur.qty + 1));
      if (act.dataset.act === 'dec') commit(setQty(lines, slug, variant, cur.qty - 1));
      if (act.dataset.act === 'del') commit(removeLine(lines, slug, variant));
    }
  }, { signal });

  document.addEventListener('input', (e) => {
    if ((e.target as HTMLElement).matches('[data-order-name],[data-order-area]')) updateLink();
  }, { signal });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { signal });
}

document.addEventListener('astro:page-load', init);
