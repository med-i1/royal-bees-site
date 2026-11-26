import { arDigits, priceLabel } from '../lib/format';
import { buildMessage, whatsappUrl, MAX_QTY } from '../lib/order';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function flip(el: Element, text: string) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (!reduce()) el.animate([{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' });
}

function init() {
  const root = document.querySelector<HTMLElement>('[data-product]');
  if (!root) return;
  const radios = [...root.querySelectorAll<HTMLButtonElement>('[data-size-picker] [role="radio"]')];
  const { slug = '', name = '' } = root.dataset;
  let idx = Math.max(0, radios.findIndex((r) => r.getAttribute('aria-checked') === 'true'));
  let qty = 1;

  const render = () => {
    const r = radios[idx];
    const variant = r.dataset.variant!, price = Number(r.dataset.price);
    radios.forEach((x, i) => { x.setAttribute('aria-checked', String(i === idx)); x.tabIndex = i === idx ? 0 : -1; });
    document.querySelectorAll('[data-unit-price],[data-bar-price]').forEach((el) => flip(el, priceLabel(price)));
    document.querySelectorAll('[data-line-total]').forEach((el) => flip(el, priceLabel(price * qty)));
    document.querySelectorAll('[data-qty]').forEach((el) => { el.textContent = arDigits(qty); });
    root.querySelectorAll<HTMLElement>('[data-add-order]').forEach((b) => { b.dataset.variant = variant; b.dataset.price = String(price); b.dataset.qty = String(qty); });
    document.querySelectorAll<HTMLElement>('[data-buy-bar] [data-add-order]').forEach((b) => { b.dataset.variant = variant; b.dataset.price = String(price); b.dataset.qty = String(qty); });
    const quick = root.querySelector<HTMLAnchorElement>('[data-quick-wa]');
    if (quick) quick.href = whatsappUrl(buildMessage([{ slug, name, variant, unitPrice: price, qty }]));
  };

  radios.forEach((r, i) => {
    r.addEventListener('click', () => { idx = i; render(); });
    r.addEventListener('keydown', (e) => {
      const next = ['ArrowDown', 'ArrowLeft'].includes(e.key) ? 1 : ['ArrowUp', 'ArrowRight'].includes(e.key) ? -1 : 0;
      if (!next) return;
      e.preventDefault();
      idx = (idx + next + radios.length) % radios.length;
      render();
      radios[idx].focus();
    });
  });
  root.querySelector('[data-qty-inc]')?.addEventListener('click', () => { qty = Math.min(MAX_QTY, qty + 1); render(); });
  root.querySelector('[data-qty-dec]')?.addEventListener('click', () => { qty = Math.max(1, qty - 1); render(); });
  render();
}

document.addEventListener('astro:page-load', init);
