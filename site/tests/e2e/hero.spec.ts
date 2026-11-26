import { test, expect } from '@playwright/test';

test('reduced motion shows a calm static hero without frames', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const frameRequests: string[] = [];
  page.on('request', (r) => { if (r.url().includes('/media/story/')) frameRequests.push(r.url()); });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/js-story/);
  await expect(page.locator('.beat-1 h1')).toBeVisible();
  await page.waitForTimeout(500);
  expect(frameRequests).toHaveLength(0);
  await ctx.close();
});

test('scrolling moves the story to the second beat', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/js-story/);
  await page.evaluate(() => window.scrollTo(0, innerHeight * 0.6));
  await expect.poll(async () => Number(await page.locator('.beat-2').evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
});

test('poster stays when frames fail to load', async ({ page }) => {
  await page.route('**/media/story/**', (r) => r.abort());
  await page.goto('/');
  await page.waitForTimeout(800);
  await expect(page.locator('#heroCanvas')).not.toHaveClass(/ready/);
  const bg = await page.locator('.story .media').evaluate((e) => getComputedStyle(e).backgroundImage);
  expect(bg).toContain('story-poster');
});

test('story still works after navigating away and back', async ({ page }) => {
  await page.goto('/');
  await page.goto('/dev/order-fixture/');
  await page.getByRole('link', { name: 'إلى الرئيسية' }).click();
  await expect(page).toHaveURL(/:4321\/$/);
  await page.evaluate(() => window.scrollTo(0, innerHeight * 0.6));
  await expect.poll(async () => Number(await page.locator('.beat-2').evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
});
