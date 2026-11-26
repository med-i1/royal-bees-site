import { test, expect } from '@playwright/test';

const visibleCards = (page: import('@playwright/test').Page) => page.locator('[data-catalog] [data-product-card]:visible');

test('family filter from the URL shows the four manuka grades', async ({ page }) => {
  await page.goto('/honey/?family=manuka');
  await expect(visibleCards(page)).toHaveCount(4);
});

test('clicking a family chip updates the URL', async ({ page }) => {
  await page.goto('/honey/');
  await page.getByRole('button', { name: 'عسل التصدير' }).click();
  await expect(page).toHaveURL(/\?family=export/);
  for (const fam of await visibleCards(page).evaluateAll((els) => els.map((e) => e.getAttribute('data-family')))) {
    expect(fam).toBe('export');
  }
});

test('price sort orders cards ascending', async ({ page }) => {
  await page.goto('/honey/?sort=price-asc');
  const prices = await visibleCards(page).evaluateAll((els) => els.map((e) => Number(e.getAttribute('data-price'))));
  expect(prices.length).toBeGreaterThan(2);
  expect(prices[0]).toBeLessThanOrEqual(prices[1]);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('hive family page lists eight products', async ({ page }) => {
  await page.goto('/honey/hive/');
  await expect(page.locator('h1')).toHaveText('منتجات الخلية');
  await expect(page.locator("[data-family-grid] [data-product-card]")).toHaveCount(8);
});

test('grid is two columns on phones', async ({ page }, info) => {
  test.skip(info.project.name !== 'pixel7');
  await page.goto('/honey/');
  const cols = await page.locator('[data-catalog]').evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length);
  expect(cols).toBe(2);
});
