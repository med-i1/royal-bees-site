import { test, expect } from '@playwright/test';

const ar = (n: number) => String(n).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

test('collections show six families with a from-price', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-family-card]');
  await expect(cards).toHaveCount(6);
  await expect(cards.first()).toContainText('يبدأ من');
});

test('featured strip shows four products', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#featured [data-product-card]')).toHaveCount(4);
});

test('chooser filters to zero-sucrose honey', async ({ page }) => {
  await page.goto('/');
  await page.locator('#chooser [data-tag="no-sucrose"]').click();
  const visible = page.locator('#chooser [data-product-card]:visible');
  await expect(visible.first()).toBeVisible();
  const tags = await visible.evaluateAll((els) => els.map((e) => e.getAttribute('data-tags') ?? ''));
  expect(tags.length).toBeGreaterThan(0);
  for (const t of tags) expect(t).toContain('no-sucrose');
});

test('faq answers open', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('#faq details').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(first.locator('p')).toBeVisible();
});

test('years since 1990 are counted in Arabic digits', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('[data-years]');
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveText(ar(new Date().getFullYear() - 1990));
});

test('reduced motion does not load the guarantee video', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.locator('#guarantee').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  expect(await page.locator('#guarantee video').evaluate((v: HTMLVideoElement) => v.currentSrc)).toBe('');
  await ctx.close();
});
