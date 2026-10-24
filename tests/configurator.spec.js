const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'https://automationg88-collab.github.io/grila-website-preview';

test('configurator loads and renders its 3D scene', async ({ page }) => {
  test.setTimeout(120000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const response = await page.goto(`${baseURL}/configurator.html`, { waitUntil: 'networkidle', timeout: 60000 });
  expect(response, 'The configurator URL should return a response').not.toBeNull();
  expect(response.status(), 'The configurator should return HTTP 200').toBe(200);

  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('canvas').first(), 'A rendered canvas should exist for the 3D scene').toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(1500);

  await expect.poll(() => page.evaluate(() => typeof window.__configuratorState === 'function')).toBe(true);
  const initialScene = await page.evaluate(() => window.__configuratorState());
  expect(initialScene.fabricVisible).toBe(true);
  expect(initialScene.fabricHeight).toBeGreaterThan(0);

  const desktopPosition = page.locator('#position');
  for (const value of ['0', '25', '50', '75', '100']) {
    await desktopPosition.fill(value);
    await page.waitForTimeout(180);
    await page.screenshot({ path: `test-results/configurator-desktop-${value}.png`, fullPage: false, animations: 'allow', timeout: 45000 });
  }

  const loweredScene = await page.evaluate(() => window.__configuratorState());
  expect(loweredScene.fabricHeight).toBeLessThan(initialScene.fabricHeight);
  expect(loweredScene.position).toBe(100);
  await desktopPosition.fill('0');
  const raisedScene = await page.evaluate(() => window.__configuratorState());
  expect(raisedScene.fabricVisible).toBe(false);
  await desktopPosition.fill('65');
  const restoredScene = await page.evaluate(() => window.__configuratorState());
  expect(restoredScene.fabricVisible).toBe(true);

  await page.getByRole('button', { name: 'Stone' }).click();
  const recoloredScene = await page.evaluate(() => window.__configuratorState());
  expect(recoloredScene.fabricColor).toBe('b8b5ab');
  expect(recoloredScene.fabricColor).not.toBe(initialScene.fabricColor);
  expect(recoloredScene.beadRadius).toBeLessThan(0.015);
  const chainCenter = (recoloredScene.chainMinX + recoloredScene.chainMaxX) / 2;
  expect(Math.abs(chainCenter - recoloredScene.clutchX)).toBeLessThan(0.02);

  expect(pageErrors, 'The page should not throw uncaught JavaScript exceptions').toEqual([]);
});

test('configurator controls remain usable and the page fits a mobile viewport', async ({ page }) => {
  test.setTimeout(120000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(`${baseURL}/configurator.html`, { waitUntil: 'networkidle', timeout: 60000 });
  expect(response).not.toBeNull();
  expect(response.status()).toBe(200);
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30000 });

  const position = page.locator('#position');
  for (const value of ['0', '50', '100']) {
    await position.fill(value);
    await expect(page.locator('#position-value')).toHaveText(`${value}% down`);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `test-results/configurator-mobile-${value}.png`, fullPage: false, animations: 'allow', timeout: 45000 });
  }
  await position.fill('65');
  await expect(page.locator('#position-value-small')).toHaveText('65%');

  await page.getByRole('button', { name: 'Blackout' }).click();
  await expect(page.locator('#opacity-label')).toHaveText('Blackout');
  await page.getByRole('button', { name: 'Linen' }).click();
  await expect(page.getByRole('button', { name: 'Linen' })).toHaveAttribute('aria-pressed', 'true');

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

  await page.screenshot({ path: 'test-results/configurator-mobile.png', fullPage: false, animations: 'allow', timeout: 45000 });
  expect(pageErrors, 'The page should not throw uncaught JavaScript exceptions on mobile').toEqual([]);
});
