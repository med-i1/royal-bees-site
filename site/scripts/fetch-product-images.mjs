// Downloads the client's product photos (permission given 2026-11-26) and converts them to WebP.
// Usage: node scripts/fetch-product-images.mjs <empty-download-dir>
import { readFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const dl = process.argv[2];
if (!dl) { console.error('usage: node scripts/fetch-product-images.mjs <download-dir>'); process.exit(2); }
mkdirSync(dl, { recursive: true });
const { base, images } = JSON.parse(readFileSync('scripts/image-map.json', 'utf8'));
const out = 'public/images/products';
mkdirSync(out, { recursive: true });

// placeholder: the client's roundel on the same light tile the packshots sit on
const placeholder = join(out, '_placeholder.webp');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xF4EEE3:s=800x800', '-i', '../assets/logo-source.png',
  '-filter_complex', '[0][1]overlay=(W-w)/2:(H-h)/2', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', placeholder]);

const { PRODUCTS } = await import('../src/data/products.ts').catch(() => ({ PRODUCTS: null }));
const slugs = PRODUCTS ? PRODUCTS.map((p) => p.slug) : Object.keys(images);
const missing = [];
for (const slug of slugs) {
  const file = images[slug];
  const dest = join(out, `${slug}.webp`);
  if (!file) { copyFileSync(placeholder, dest); missing.push(slug); continue; }
  const raw = join(dl, file);
  if (!existsSync(raw)) {
    const res = await fetch(base + file);
    if (!res.ok) { copyFileSync(placeholder, dest); missing.push(slug); continue; }
    const { writeFileSync } = await import('node:fs');
    writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  }
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-vf', 'scale=800:-2:flags=lanczos', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '78', dest]);
}
console.log(`done: ${slugs.length - missing.length} photos, ${missing.length} placeholders`);
if (missing.length) console.warn('placeholder for: ' + missing.join(', '));
