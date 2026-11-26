let ac: AbortController | null = null;

function init() {
  ac?.abort();
  ac = new AbortController();
  const { signal } = ac;
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.querySelector<HTMLElement>('[data-menu-open]');
  const onScroll = () => header?.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true, signal });
  onScroll();
  const path = location.pathname;
  const home = document.querySelector<HTMLAnchorElement>('a.brand')?.pathname ?? '/';
  document.querySelectorAll<HTMLAnchorElement>('.nav a').forEach((a) => {
    if (path.startsWith(a.pathname) && a.pathname !== home) a.setAttribute('aria-current', 'page');
  });
  const setMenu = (open: boolean) => {
    if (!menu) return;
    menu.hidden = !open;
    openBtn?.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    (open ? menu.querySelector<HTMLElement>('[data-menu-close]') : openBtn)?.focus();
  };
  openBtn?.addEventListener('click', () => setMenu(true), { signal });
  menu?.querySelector('[data-menu-close]')?.addEventListener('click', () => setMenu(false), { signal });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false), { signal }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); }, { signal });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => { document.documentElement.style.overflow = ''; });
