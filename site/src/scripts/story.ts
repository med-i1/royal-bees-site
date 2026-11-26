import gsap from 'gsap';
import { motionAllowed, onCleanup } from './motion';
import { frameForProgress, frameLoadOrder } from '../lib/story-math';
import { u } from '../lib/url';

const FRAMES = 64;
const STOPS = [0, 0.3, 0.66];

function initStory() {
  const story = document.getElementById('story');
  if (!story || !motionAllowed()) return;

  // ---------- frame sequence on canvas ----------
  const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const mobileMQ = matchMedia('(max-width: 900px)');
  const pad = (i: number) => String(i + 1).padStart(3, '0');
  let imgs: (HTMLImageElement & { ok?: boolean })[] = [];
  let cur = 0, target = 0, raf = 0;
  let drawn: HTMLImageElement | null = null;
  let alive = true;

  const nearest = (i: number) => {
    for (let d = 0; d < FRAMES; d++) {
      const a = imgs[i - d], b = imgs[i + d];
      if (a?.ok) return a;
      if (b?.ok) return b;
    }
    return null;
  };
  const draw = () => {
    const im = nearest(Math.round(cur));
    if (!im || im === drawn) return;
    drawn = im;
    const cw = canvas.width, ch = canvas.height, iw = im.naturalWidth, ih = im.naturalHeight;
    const s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
    const fx = mobileMQ.matches ? 0.5 : 0, fy = mobileMQ.matches ? 0.3 : 0.5; // same focal point as the poster
    ctx.drawImage(im, (cw - dw) * fx, (ch - dh) * fy, dw, dh);
    canvas.classList.add('ready');
  };
  const loadSet = () => {
    const dir = u('/') + (mobileMQ.matches ? 'media/story/m/' : 'media/story/d/');
    imgs = new Array(FRAMES);
    drawn = null;
    for (const i of frameLoadOrder(FRAMES)) {
      const im = new Image() as HTMLImageElement & { ok?: boolean };
      im.decoding = 'async';
      im.onload = () => { if (!alive) return; im.ok = true; if (Math.abs(i - cur) < 4) { drawn = null; draw(); } };
      im.src = dir + pad(i) + '.webp';
      imgs[i] = im;
    }
  };
  const sizeCanvas = () => {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    drawn = null;
    draw();
  };
  const tick = () => {
    cur += (target - cur) * 0.22;
    if (Math.abs(target - cur) < 0.02) cur = target;
    draw();
    raf = cur !== target ? requestAnimationFrame(tick) : 0;
  };
  const setProgress = (p: number) => {
    target = frameForProgress(p, FRAMES);
    if (!raf) raf = requestAnimationFrame(tick);
  };

  loadSet();
  sizeCanvas();
  let rT = 0;
  const onResize = () => { clearTimeout(rT); rT = window.setTimeout(sizeCanvas, 120); };
  const onBreakpoint = () => { loadSet(); sizeCanvas(); };
  addEventListener('resize', onResize);
  mobileMQ.addEventListener('change', onBreakpoint);

  // ---------- pollen ----------
  const pollen = document.getElementById('pollen')!;
  for (let i = 0, n = innerWidth < 700 ? 7 : 12; i < n; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;top:${(35 + Math.random() * 60).toFixed(1)}%;--s:${(1.5 + Math.random() * 2.2).toFixed(1)}px;--d:${(9 + Math.random() * 9).toFixed(1)}s;--dl:-${(Math.random() * 12).toFixed(1)}s;--x:${(Math.random() * 60 - 30).toFixed(0)}px`;
    pollen.appendChild(p);
  }

  // ---------- intro ----------
  const intro = gsap.timeline({ delay: 0.1 })
    .fromTo('#heroZoom', { scale: 1.06 }, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0)
    .to('.h1-line>span', { y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.13 }, 0.45)
    .to('.story [data-intro]', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09 }, 0.7);

  // ---------- three beats over 1.3 screens of scroll ----------
  const dots = [...story.querySelectorAll('.rail i')];
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: story, start: 'top top', end: () => '+=' + innerHeight * 1.3,
      scrub: true, invalidateOnRefresh: true,
      onUpdate: (self) => {
        setProgress(self.progress);
        dots.forEach((d, i) => d.classList.toggle('on', self.progress >= STOPS[i] - 0.001));
      },
    },
  });
  tl.to('#railFill', { scaleY: 1, duration: 1 }, 0)
    .to('#scrollCue', { autoAlpha: 0, duration: 0.06 }, 0)
    .to('.beat-1', { autoAlpha: 0, y: -40, duration: 0.1, ease: 'power1.in' }, 0.18)
    .fromTo('.beat-2', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power1.out' }, 0.3)
    .to('.beat-2', { autoAlpha: 0, y: -40, duration: 0.08, ease: 'power1.in' }, 0.56)
    .fromTo('.beat-3', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power1.out' }, 0.63);

  // ---------- curtain: the next section rises over the stage ----------
  const next = story.nextElementSibling;
  const curtain = next
    ? gsap.to('#stageFx', { scale: 0.93, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } })
    : null;

  onCleanup(() => {
    alive = false;
    cancelAnimationFrame(raf);
    removeEventListener('resize', onResize);
    mobileMQ.removeEventListener('change', onBreakpoint);
    intro.kill(); tl.kill(); curtain?.kill();
  });
}

document.addEventListener('astro:page-load', initStory);
