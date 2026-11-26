import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/product/sidr-doani/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('size and quantity drive the price and total', async ({ page }) => {
  await expect(page.locator('[data-unit-price]')).toHaveText('٨٥٠ جنيه');
  await page.getByRole('radio', { name: 'نص كيلو' }).click();
  await expect(page.locator('[data-unit-price]')).toHaveText('١٥٠٠ جنيه');
  await page.getByRole('button', { name: 'زوّد الكمية' }).first().click();
  await expect(page.locator('[data-line-total]')).toHaveText('٣٠٠٠ جنيه');
});

test('add to order uses the chosen size and quantity', async ({ page }) => {
  await page.getByRole('radio', { name: 'نص كيلو' }).click();
  await page.getByRole('button', { name: 'زوّد الكمية' }).first().click();
  await page.locator('.buy [data-add-order]').click();
  await page.locator('[data-order-open]').click();
  await expect(page.locator('#order-drawer [data-order-line]')).toContainText('نص كيلو × ٢');
});

test('quick WhatsApp link carries only this line', async ({ page }) => {
  await page.getByRole('radio', { name: 'نص كيلو' }).click();
  await page.getByRole('button', { name: 'زوّد الكمية' }).first().click();
  const href = await page.getByRole('link', { name: 'اطلب ده بس على واتساب' }).getAttribute('href');
  const text = decodeURIComponent(href!.split('text=')[1]);
  expect(text).toContain('عسل السدر الجبلي دوعني (نص كيلو) × ٢ = ٣٠٠٠ جنيه');
  expect(text.match(/•/g)).toHaveLength(1);
});

test('related products come from the same family', async ({ page }) => {
  const related = page.locator('[data-related] [data-product-card]');
  await expect(related).toHaveCount(3);
  for (const fam of await related.evaluateAll((els) => els.map((e) => e.getAttribute('data-family')))) expect(fam).toBe('sidr');
});

test('arrow keys move between sizes', async ({ page }) => {
  await page.getByRole('radio', { name: 'ربع كيلو' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'نص كيلو' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('[data-unit-price]')).toHaveText('١٥٠٠ جنيه');
});

test('phones get a sticky buy bar with the price', async ({ page }, info) => {
  test.skip(info.project.name === 'desktop');
  const bar = page.locator('[data-buy-bar]');
  await expect(bar).toBeVisible();
  await expect(bar).toContainText('٨٥٠ جنيه');
});
