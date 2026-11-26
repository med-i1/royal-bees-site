import { arDigits } from '../lib/format';

function init() {
  const grid = document.querySelector<HTMLElement>('[data-catalog]');
  const chips = [...document.querySelectorAll<HTMLButtonElement>('.catalog-tools .chip')];
  const sortSel = document.querySelector<HTMLSelectElement>('[data-sort]');
  if (!grid || !chips.length || !sortSel) return;
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-product-card]')];
  const label = document.querySelector<HTMLElement>('[data-count-label]');

  const apply = (family: string, sort: string, push = true) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String((c.dataset.family ?? '') === family)));
    sortSel.value = sort;
    let n = 0;
    for (const c of cards) { const show = !family || c.dataset.family === family; c.hidden = !show; if (show) n++; }
    const ordered = sort
      ? [...cards].sort((a, b) => (Number(a.dataset.price) - Number(b.dataset.price)) * (sort === 'price-desc' ? -1 : 1))
      : cards;
    grid.append(...ordered);
    if (label) label.textContent = `${arDigits(n)} منتج`;
    if (push) {
      const u = new URL(location.href);
      family ? u.searchParams.set('family', family) : u.searchParams.delete('family');
      sort ? u.searchParams.set('sort', sort) : u.searchParams.delete('sort');
      history.replaceState(history.state, '', u);
    }
  };

  chips.forEach((c) => c.addEventListener('click', () => apply(c.dataset.family ?? '', sortSel.value)));
  sortSel.addEventListener('change', () => apply(chips.find((c) => c.getAttribute('aria-pressed') === 'true')?.dataset.family ?? '', sortSel.value));
  const q = new URLSearchParams(location.search);
  const fam = q.get('family') ?? '';
  const valid = chips.some((c) => (c.dataset.family ?? '') === fam);
  apply(valid ? fam : '', ['price-asc', 'price-desc'].includes(q.get('sort') ?? '') ? q.get('sort')! : '', false);
}

document.addEventListener('astro:page-load', init);
