// After a build with BASE_PATH set, fails if any built page still points at a root path outside the base.
// Usage: BASE_PATH=/royal-bees-site npm run build && BASE_PATH=/royal-bees-site node scripts/check-base.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');
if (!base) { console.error('set BASE_PATH'); process.exit(2); }
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : /\.(html|css|js)$/.test(n) && files.push(p); } };
walk('dist');
const bad = [];
const attr = /(?:href|src|srcset|poster|data-src|content)="(\/[^"]*)"/g;
const css = /url\((["']?)(\/[^)"']+)\1\)/g;
const js = /["'`](\/(?:media|images|honey|product|guarantee|about|contact|encyclopedia)\/[^"'`]*)["'`]/g;
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  const hits = [...s.matchAll(attr)].map((m) => m[1]).concat([...s.matchAll(css)].map((m) => m[2]), f.endsWith('.js') ? [...s.matchAll(js)].map((m) => m[1]) : []);
  for (const h of hits) if (!h.startsWith(base + '/') && h !== base && !h.startsWith('//')) bad.push(`${f.split('\\').join('/')}: ${h}`);
}
const uniq = [...new Set(bad)];
console.log(uniq.slice(0, 25).join('\n'));
console.log(`${uniq.length} path(s) outside ${base}/`);
process.exit(uniq.length ? 1 : 0);
