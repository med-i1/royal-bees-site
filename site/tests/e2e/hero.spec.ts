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
  await page.goto('/product/sidr-doani/');
  await page.locator('.crumbs').getByRole('link', { name: 'الرئيسية' }).click();
  await expect(page).toHaveURL(/:4321\/$/);
  await page.evaluate(() => window.scrollTo(0, innerHeight * 0.6));
  await expect.poll(async () => Number(await page.locator('.beat-2').evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
});

test('headline marks are not clipped', async ({ browser }, info) => {
  // static hero (reduced motion): the only difference between the two shots can be what overflow hides
  const ctx = await browser.newContext({ ...info.project.use, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/');
  await page.evaluate(() => document.fonts.ready);
  const box = (await page.locator('#heroTitle').boundingBox())!;
  const clip = { x: box.x, y: box.y - 30, width: box.width, height: box.height + 60 };
  const clipped = await page.screenshot({ clip });
  await page.addStyleTag({ content: '.h1-line{overflow:visible !important}' });
  const unclipped = await page.screenshot({ clip });
  expect(clipped.equals(unclipped)).toBe(true);
  await ctx.close();
});
