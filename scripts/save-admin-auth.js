/* eslint-disable */
/* This file is a standalone Node script not included in tsconfig.json,
disable ESLint for this file to avoid parserOptions.project errors. */
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000/auth/signin');

    await page.fill('input[name="email"]', 'ribows@admin.com'); // set correct creds
    await page.fill('input[name="password"]', '3N7T0w03l6&x'); // set correct password
    await page.click('button[type="submit"]');

    // wait for navigation or error query
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });

    const current = page.url();
    console.log('After submit URL:', current);

    if (current.includes('error=')) {
      // collect debug artifacts
      await page.screenshot({ path: 'login-failed.png', fullPage: true });
      const html = await page.content();
      require('fs').writeFileSync('login-failed.html', html);
      throw new Error(`Login failed, saw redirect to: ${current}. See login-failed.png/html`);
    }

    // optional: assert an element that's present when logged in
    // await page.waitForSelector('selector-on-homepage', { timeout: 5000 });

    // save storage state only on success
    await context.storageState({ path: 'admin-auth.json' });
    console.log('Saved admin-auth.json');
  } catch (err) {
    console.error('Login script error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();