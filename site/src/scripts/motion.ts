import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function motionAllowed(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection ?? {};
  const low = !!c.saveData || /(^|-)2g$/.test(c.effectiveType ?? '');
  return !matchMedia('(prefers-reduced-motion: reduce)').matches && !low;
}

const cleanups: (() => void)[] = [];
export function onCleanup(fn: () => void) { cleanups.push(fn); }

export let lenis: Lenis | null = null;
const raf = (t: number) => lenis?.raf(t * 1000);

export function initMotion(): void {
  if (!motionAllowed()) return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  onCleanup(() => { gsap.ticker.remove(raf); lenis?.destroy(); lenis = null; });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const t = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
    if (t && lenis) { e.preventDefault(); lenis.scrollTo(t); }
  }));

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 86%', once: true,
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }),
  });
}

function applyRootClasses() {
  document.documentElement.classList.toggle('js', motionAllowed());
  document.documentElement.classList.toggle('js-story', motionAllowed());
}

document.addEventListener('astro:after-swap', applyRootClasses);
document.addEventListener('astro:before-swap', () => {
  while (cleanups.length) cleanups.pop()!();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
document.addEventListener('astro:page-load', () => { ScrollTrigger.refresh(); });
