// Fails when the home page's initial payload (excluding hero frames, product images and video) breaks the spec budget.
import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const JS_GZ_LIMIT = 90 * 1024;
const TOTAL_LIMIT = 1.2 * 1024 * 1024;
const html = readFileSync('dist/index.html', 'utf8');

const initial = new Set();
for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  const r = m[1];
  if (r.startsWith('/media/story/') || r.startsWith('/images/products/') || r.endsWith('.mp4')) continue;
  if (/\.(js|css|woff2?|jpg|webp|png|svg)$/.test(r)) initial.add(r);
}
const read = (r) => { try { return readFileSync(join('dist', r), 'utf8'); } catch { return ''; } };

// fonts referenced from CSS
for (const css of [...initial].filter((r) => r.endsWith('.css'))) {
  for (const m of read(css).matchAll(/url\((\/_astro\/[^)]+\.woff2)\)/g)) initial.add(m[1]);
}
// static imports between JS chunks
const queue = [...initial].filter((r) => r.endsWith('.js'));
const importRe = /(?:from|import)\s*["'](\.\/[^"']+\.js)["']/g;
while (queue.length) {
  const r = queue.pop();
  for (const m of read(r).matchAll(importRe)) {
    const dep = '/_astro/' + m[1].slice(2);
    if (!initial.has(dep)) { initial.add(dep); queue.push(dep); }
  }
}

let jsGz = 0, total = Buffer.byteLength(html);
for (const r of initial) {
  const f = join('dist', r);
  let size = 0;
  try { size = statSync(f).size; } catch { continue; }
  total += size;
  if (r.endsWith('.js')) jsGz += gzipSync(readFileSync(f)).length;
}
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log(`files counted: ${initial.size}`);
console.log(`home JS (gzip): ${kb(jsGz)} / ${kb(JS_GZ_LIMIT)}`);
console.log(`home initial total: ${kb(total)} / ${kb(TOTAL_LIMIT)}`);
if (jsGz > JS_GZ_LIMIT || total > TOTAL_LIMIT) { console.error('BUDGET FAILED'); process.exit(1); }
console.log('budget ok');
