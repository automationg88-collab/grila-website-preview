const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

test('homepage presents the core offer and keeps the 3D configurator off the homepage', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });
  expect(response, 'Homepage should return a response').not.toBeNull();
  expect(response.status(), 'Homepage should return HTTP 200').toBe(200);
  await expect(page).toHaveTitle('Grila — Light, controlled.');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Light,\s*controlled\./);
  await expect(page.locator('#collection .product-card').count()).resolves.toBeGreaterThanOrEqual(2);
  await expect(page.locator('a[href*="configurator"]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/interactive 3D preview|Your configuration|Configure blind type/i);

  const missingTargets = await page.locator('a[href^="#"]').evaluateAll(anchors =>
    anchors
      .map(anchor => anchor.getAttribute('href'))
      .filter(href => href && href !== '#' && !document.getElementById(href.slice(1)))
  );
  expect(missingTargets, 'Every in-page link should resolve to an element').toEqual([]);

  await expect(page.locator('a[href="tel:+355692467968"]')).toHaveCount(1);
  await expect(page.locator('a[href="mailto:grila.rollers.accessories@gmail.com"]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);

  const imageResults = await page.locator('img').evaluateAll(async images => {
    images.forEach(image => { image.loading = 'eager'; });
    return Promise.all(images.map(async image => {
      try {
        await image.decode();
        return { src: image.getAttribute('src'), width: image.naturalWidth, alt: image.getAttribute('alt') || '' };
      } catch {
        return { src: image.getAttribute('src'), width: 0, alt: image.getAttribute('alt') || '' };
      }
    }));
  });
  expect(imageResults.filter(image => image.width <= 0), 'Every homepage image should load').toEqual([]);
  expect(imageResults.filter(image => !image.alt.trim()), 'Every meaningful image should have alt text').toEqual([]);
  expect(pageErrors, 'Homepage should not throw uncaught JavaScript errors').toEqual([]);
});

test('homepage remains usable at narrow mobile, tablet and desktop widths', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      pageWidth: document.documentElement.scrollWidth
    }));
    expect(
      dimensions.pageWidth,
      `Page should not overflow horizontally at ${width}px`
    ).toBeLessThanOrEqual(dimensions.viewportWidth + 1);

    if (width <= 720) {
      const menu = page.locator('#menu');
      await expect(menu).toBeVisible();
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#navlinks')).toHaveClass(/open/);
      await page.locator('#navlinks a[href="#collection"]').click();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#navlinks')).not.toHaveClass(/open/);
    } else {
      await expect(page.locator('#navlinks')).toBeVisible();
      await expect(page.locator('#menu')).toBeHidden();
    }
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior, 'Reduced-motion preference should disable smooth scrolling').toBe('auto');
  expect(pageErrors, 'Responsive homepage should not throw uncaught JavaScript errors').toEqual([]);
});
