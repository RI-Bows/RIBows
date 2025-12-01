/* eslint-disable */
/* Save storage state for a club user so Playwright tests can use it */
const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000/auth/signin');
    await page.fill('input[name="email"]', 'phambrit@hawaii.edu'); // change when we have a club user
    await page.fill('input[name="password"]', 'clubtest123'); // change when we have a club user
    await page.click('button[type="submit"]');

    // wait for navigation after successful login
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });

    const current = page.url();
    if (current.includes('error=')) {
      await page.screenshot({ path: 'login-failed-club.png', fullPage: true });
      fs.writeFileSync('login-failed-club.html', await page.content());
      throw new Error('Login failed for club user; see login-failed-club.png/html');
    }

    // save storage state at project root
    await context.storageState({ path: 'club-auth.json' });
    console.log('Saved club-auth.json');
  } catch (err) {
    console.error('Login script error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
