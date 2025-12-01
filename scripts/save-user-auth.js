/* eslint-disable */
/* Standalone script to save a regular user session for Playwright tests */
const { chromium } = require('@playwright/test');
const fs = require('fs');


(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();


  try {
    // Open your app signin page (adjust path if different)
    await page.goto('http://localhost:3000/auth/signin');


    // Replace these with the regular user's real credentials
    await page.fill('input[name="email"]', 'foo@hawaii.edu');
    await page.fill('input[name="password"]', 'yessahboi');
    await page.click('button[type="submit"]');


    // wait for navigation (or adjust to a post-login selector)
    await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 });


    const current = page.url();
    console.log('After submit URL:', current);


    if (current.includes('error=')) {
      await page.screenshot({ path: 'login-failed-user.png', fullPage: true });
      const html = await page.content();
      fs.writeFileSync('login-failed-user.html', html);
      throw new Error(`Login failed for regular user; see login-failed-user.png/html`);
    }


    // save storage state for tests
    await context.storageState({ path: 'user-auth.json' });
    console.log('Saved user-auth.json');
  } catch (err) {
    console.error('Login script error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
