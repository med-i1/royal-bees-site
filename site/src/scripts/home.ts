import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionAllowed, onCleanup } from './motion';
import { arDigits } from '../lib/format';

const VISIBLE = 8;

function initChooser() {
  const root = document.getElementById('chooser');
  if (!root) return;
  const chips = [...root.querySelectorAll<HTMLButtonElement>('.chip')];
  const cards = [...root.querySelectorAll<HTMLElement>('[data-product-card]')];
  const apply = (tag: string) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.tag === tag)));
    let shown = 0;
    for (const card of cards) {
      const match = (card.dataset.tags ?? '').split(' ').includes(tag) && shown < VISIBLE;
      card.hidden = !match;
      if (match) shown++;
    }
  };
  chips.forEach((c) => c.addEventListener('click', () => apply(c.dataset.tag!)));
  apply(chips.find((c) => c.getAttribute('aria-pressed') === 'true')?.dataset.tag ?? chips[0].dataset.tag!);
}

function initGuaranteeVideo() {
  const v = document.querySelector<HTMLVideoElement>('#guarantee video');
  if (!v || !motionAllowed()) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!v.src) { v.src = v.dataset.src!; v.load(); }
      v.play().catch(() => {});
    } else if (v.src) v.pause();
  }, { rootMargin: '300px' });
  io.observe(v);
  onCleanup(() => io.disconnect());
}

function initCounters() {
  if (!motionAllowed()) return;
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { n: 0 };
    el.textContent = arDigits(0);
    const t = gsap.to(o, {
      n: end, duration: 1.6, ease: 'power2.out',
      onUpdate: () => { el.textContent = arDigits(Math.round(o.n)); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
    onCleanup(() => { t.kill(); el.textContent = arDigits(end); });
  });
  ScrollTrigger.refresh();
}

document.addEventListener('astro:page-load', () => {
  initChooser();
  initGuaranteeVideo();
  initCounters();
});
