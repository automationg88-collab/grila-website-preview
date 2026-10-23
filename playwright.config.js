const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results',
  retries: 1,
  workers: 1,
  use: { headless: true, viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' }
});
