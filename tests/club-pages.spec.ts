import { test, expect } from '@playwright/test';

test.use({
  storageState: './club-auth.json',
});

test.setTimeout(120000);

test('Club User pages test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // check navbar links
  await expect(page.getByRole('link', { name: 'RIBows Rainbow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit RIO' })).toBeVisible();
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

  // check edit RIO page
  await page.getByRole('link', { name: 'Edit RIO' }).click();
  await page.waitForURL('**/editRio');
  await expect(page).toHaveURL('http://localhost:3000/editRio');
  await expect(page.getByRole('heading', { name: 'Edit RIO' })).toBeVisible();
  await expect(page.getByText('RIO Name')).toBeVisible();
  await expect(page.getByText('Purpose Statement')).toBeVisible();
  await expect(page.getByText('Main Contact')).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('Interests')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Selected interests' })).toBeVisible();
  await expect(page.getByText('Image', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Current image' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');

  // check about us page
  await page.getByRole('link', { name: 'About Us' }).click();
  await page.waitForURL('**/about');
  await expect(page).toHaveURL('http://localhost:3000/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  await page.getByRole('button', { name: 'Feedback Page' }).click();
  await page.waitForURL('**/feedback');
  await expect(page).toHaveURL('http://localhost:3000/feedback');
  await expect(page.locator('iframe[title="Feedback Form"]').contentFrame().locator('div').first()).toBeVisible();

  // check bookmarks page
  await page.getByRole('link', { name: 'Bookmarks' }).click();
  await page.waitForURL('**/bookmarks');
  await expect(page).toHaveURL('http://localhost:3000/bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarked RIOs' })).toBeVisible();

  // check edit profile page
  /*
  await page.getByRole('button', { name: 'phambrit@hawaii.edu' }).click();
  await page.getByRole('link', { name: 'Edit Profile' }).click();
  await expect(page).toHaveURL('http://localhost:3000/editProfile');
  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  await expect(page.getByText('First Name')).toBeVisible();
  await expect(page.getByText('Club Interests')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  */
});
