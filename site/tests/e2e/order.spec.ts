import { test, expect } from '@playwright/test';

const FIXTURE = '/product/sidr-doani/';

test.beforeEach(async ({ page }) => {
  await page.goto(FIXTURE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('adding the same item twice counts two', async ({ page }) => {
  const add = page.locator('[data-add-order]').first();
  await add.click();
  await add.click();
  await expect(page.locator('[data-order-count]')).toHaveText('٢');
});

test('drawer lists the line and builds the WhatsApp link', async ({ page }) => {
  const add = page.locator('[data-add-order]').first();
  await add.click();
  await add.click();
  await page.locator('[data-order-open]').click();
  const drawer = page.locator('#order-drawer');
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('[data-order-line]')).toHaveCount(1);
  await expect(drawer.locator('[data-order-line]')).toContainText('× ٢');
  const href = await drawer.getByRole('link', { name: 'ابعت الطلب على واتساب' }).getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\//);
  expect(href).toContain('%D8%A7%D9%84%D8%A5%D8%AC%D9%85%D8%A7%D9%84%D9%8A');
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('order survives reload and navigation back', async ({ page }) => {
  const add = page.locator('[data-add-order]').first();
  await add.click();
  await add.click();
  await page.reload();
  await expect(page.locator('[data-order-count]')).toHaveText('٢');
  await page.locator('.crumbs').getByRole('link', { name: 'الرئيسية' }).click();
  await expect(page).toHaveURL(/:4321\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/sidr-doani/);
  await page.locator('[data-add-order]').first().click();
  await expect(page.locator('[data-order-count]')).toHaveText('٣');
});
