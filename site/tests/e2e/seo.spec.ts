import { test, expect } from '@playwright/test';

test('product page carries Product JSON-LD in EGP', async ({ page }) => {
  await page.goto('/product/sidr-doani/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = blocks.map((b) => JSON.parse(b));
  expect(parsed.some((p) => p['@type'] === 'Product' && p.offers.priceCurrency === 'EGP')).toBe(true);
});

for (const path of ['/', '/honey/', '/honey/sidr/', '/product/sidr-doani/', '/guarantee/']) {
  test(`${path} has canonical and og:image`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });
}

test('sitemap and robots are served', async ({ request }) => {
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Sitemap: https://royalbeeseg.com/sitemap-index.xml');
});
