import { test, expect } from '@playwright/test';

test.use({
  storageState: './user-auth.json',
});

test.setTimeout(120000);

test('User navbar + home page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // check navbar links
  await expect(page.getByRole('link', { name: 'RIBows Rainbow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bookmarks' })).toBeVisible();

  // check home page
  await page.getByRole('link', { name: 'RIBows Rainbow' }).click();
  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { name: 'Find and join RIO\'s at UH Mānoa' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search for RIOs by name,' }).click();
  await page.getByRole('textbox', { name: 'Search for RIOs by name,' }).fill('acc');
  await page.getByRole('button', { name: 'Advocates for Public Interest' }).click();
  await expect(page.getByText('Advocates for Public Interest')).toBeVisible();
});

test('User search page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Search' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');
  await expect(page.getByRole('heading', { name: 'Search for RIOs' })).toBeVisible();
  await page.getByRole('link', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('ballroom');
  await page.getByRole('button', { name: 'Ballroom Dance Club @UH' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Add bookmark' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove bookmark' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('radio', { name: 'Ethnic/Cultural' }).check();
  await page.getByRole('button', { name: 'Chinese Club Ethnic/Cultural' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('User about us + feedback page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'About Us' }).click();
  await expect(page).toHaveURL('http://localhost:3000/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  await page.getByRole('button', { name: 'Feedback Page' }).click();
  await expect(page).toHaveURL('http://localhost:3000/feedback');
  const iframe = page.frameLocator('iframe[title="Feedback Form"]');
  await expect(iframe.locator('div').first()).toBeVisible();
});

test('User bookmarks page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Bookmarks' }).click();
  await page.waitForURL('**/bookmarks');
  await expect(page).toHaveURL('http://localhost:3000/bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarked RIOs' })).toBeVisible();
  await expect(page.locator('.trending-card').first()).toBeVisible();
  await page.locator('.trending-card').first().click();
  await expect(page.getByRole('dialog').getByText('Accounting Club')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('User edit profilepage test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'foo@hawaii.edu' }).click();
  await page.getByRole('link', { name: 'Edit Profile' }).click();
  await page.waitForURL('**/editProfile');
  await expect(page).toHaveURL('http://localhost:3000/editProfile');
  await page.getByRole('heading', { name: 'Edit Profile' }).click();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('Interests')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter email' }).click();
  await page.getByRole('textbox', { name: 'Enter email' }).fill('foo@hawaii.edu test');
  await page.getByText('Academic/ProfessionalFraternity/Sorority').click();
  await page.getByText('Leisure/Recreational').waitFor({ state: 'visible' });
  await page.getByText('Leisure/Recreational').click();
  await page.locator('div').filter({ hasText: 'Return' }).nth(1).click();
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.waitForTimeout(300);
  await expect(page.getByText('SuccessYour profile has been')).toBeVisible();
  await page.getByRole('button', { name: 'Return Home' }).click();
});
