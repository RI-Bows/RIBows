import { test, expect } from '@playwright/test';

test.use({
  storageState: './user-auth.json',
});

test.setTimeout(120000);

test('User pages test', async ({ page }) => {
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

  // check search page
  await page.getByRole('link', { name: 'Search' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');
  await expect(page.getByRole('heading', { name: 'Search for RIOs' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Filters' })).toBeVisible();
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Filters' }).click();

  // check about us page / feedback page
  await page.getByRole('link', { name: 'About Us' }).click();
  await expect(page).toHaveURL('http://localhost:3000/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  await page.getByRole('button', { name: 'Feedback Page' }).click();
  await expect(page).toHaveURL('http://localhost:3000/feedback');
  const iframe = page.frameLocator('iframe[title="Feedback Form"]');
  await expect(iframe.locator('div').first()).toBeVisible();

  // check bookmarks page
  await page.getByRole('link', { name: 'Bookmarks' }).click();
  await page.waitForURL('**/bookmarks');
  await expect(page).toHaveURL('http://localhost:3000/bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarked RIOs' })).toBeVisible();

  // check edit profile page
  /*
  await page.getByRole('button', { name: 'foo@hawaii.edu' }).click();
  await page.getByRole('link', { name: 'Edit Profile' }).click();
  await expect(page).toHaveURL('http://localhost:3000/editProfile');
  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  await expect(page.getByText('First Name')).toBeVisible();
  await expect(page.getByText('Club Interests')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  */
});
