// Renders the vector logo (with the site's Arabic font) to a transparent raster once, so pages don't pay for SVG text layout.
// Source: src/assets/logo.svg. Needs the preview server on :4321 (for the web fonts). Usage: node scripts/render-logo.mjs
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const markup = readFileSync('src/assets/logo.svg', 'utf8').replace('width="220" height="220"', 'width="96" height="96"');

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 4, viewport: { width: 600, height: 900 } });
await page.goto('http://localhost:4321/about/');
await page.evaluate((m) => { document.body.innerHTML = '<div id="lg" style="display:inline-block;background:transparent">' + m + '</div>'; document.body.style.background = 'transparent'; }, markup);
await page.evaluate(() => document.fonts.ready);
const svg = page.locator('#lg svg');
await svg.screenshot({ path: 'scripts/.logo.png', omitBackground: true });
await browser.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'scripts/.logo.png', '-vf', 'scale=384:384:flags=lanczos', '-c:v', 'libwebp', '-quality', '90', 'public/images/logo-384.webp']);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'scripts/.logo.png', '-vf', 'scale=160:160:flags=lanczos', '-c:v', 'libwebp', '-quality', '90', 'public/images/logo-160.webp']);
console.log('logo rendered');
