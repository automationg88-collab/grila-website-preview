const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'https://automationg88-collab.github.io/grila-website-preview';

test('configurator loads and renders its 3D scene', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const response = await page.goto(`${baseURL}/configurator.html`, { waitUntil: 'networkidle', timeout: 60000 });
  expect(response, 'The configurator URL should return a response').not.toBeNull();
  expect(response.status(), 'The configurator should return HTTP 200').toBe(200);

  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('canvas').first(), 'A rendered canvas should exist for the 3D scene').toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'test-results/configurator-desktop.png', fullPage: true, animations: 'disabled' });

  expect(pageErrors, 'The page should not throw uncaught JavaScript exceptions').toEqual([]);
});

test('configurator controls remain usable and the page fits a mobile viewport', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(`${baseURL}/configurator.html`, { waitUntil: 'networkidle', timeout: 60000 });
  expect(response).not.toBeNull();
  expect(response.status()).toBe(200);
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30000 });

  const rangeInputs = page.locator('input[type="range"]');
  const rangeCount = await rangeInputs.count();
  for (let i = 0; i < rangeCount; i++) {
    const input = rangeInputs.nth(i);
    if (await input.isVisible()) {
      const min = Number(await input.getAttribute('min') || 0);
      const max = Number(await input.getAttribute('max') || 100);
      await input.fill(String(min + (max - min) * 0.65));
    }
  }

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    pageWidth: document.documentElement.scrollWidth
  }));
  expect(dimensions.pageWidth, 'The page should not overflow horizontally on mobile').toBeLessThanOrEqual(dimensions.viewportWidth + 1);

  await page.screenshot({ path: 'test-results/configurator-mobile.png', fullPage: true, animations: 'disabled' });
  expect(pageErrors, 'The page should not throw uncaught JavaScript exceptions on mobile').toEqual([]);
});
