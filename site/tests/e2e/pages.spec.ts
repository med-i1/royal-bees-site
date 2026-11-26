import { test, expect } from '@playwright/test';

for (const path of ['/guarantee/', '/about/', '/contact/', '/encyclopedia/']) {
  test(`${path} loads with a single h1`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('guarantee page quotes the client guarantee', async ({ page }) => {
  await page.goto('/guarantee/');
  await expect(page.locator('main')).toContainText('إذا ثبت بالتحليل المخبري أن العسل غير طبيعي');
});

test('contact page links phone and email', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('main a[href="tel:0238090519"]')).toHaveCount(1);
  await expect(page.locator('main a[href^="mailto:"]')).toHaveCount(1);
});

test('encyclopedia lists articles that open', async ({ page }) => {
  await page.goto('/encyclopedia/');
  const first = page.locator('[data-article-card] a').first();
  await expect(first).toBeVisible();
  await first.click();
  await expect(page.locator('article h1')).toBeVisible();
});

test('unknown pages show a branded 404 with a catalog link', async ({ page }) => {
  const res = await page.goto('/no-such-page/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('main a[href="/honey/"]')).toBeVisible();
});
