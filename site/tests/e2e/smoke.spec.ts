import { test, expect } from '@playwright/test';

test('home is Arabic RTL with brand title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page).toHaveTitle(/مملكة النحل/);
  await expect(page.locator('header img, header svg').first()).toBeVisible();
});
