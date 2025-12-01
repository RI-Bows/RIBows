import { test, expect } from '@playwright/test';

test.use({
  storageState: './club-auth.json',
});

test('Club User pages test', async ({ page }) => {
  const response = await page.goto('http://localhost:3000');
  expect(response?.status()).toBeLessThan(400);

  // check navbar links
  await expect(page.getByRole('link', { name: 'RIBowsRainbow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  /*
  await expect(page.getByRole('link', { name: 'Edit RIO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Saved' })).toBeVisible();
  */

  // check home page
  await page.getByRole('link', { name: 'RIBowsRainbow' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: 'Find and join RIO\'s at UH Mānoa' })).toBeVisible();

  // check search page
  await page.getByRole('link', { name: 'Search' }).click();
  await expect(page).toHaveURL('http://localhost:3000/search');
  await expect(page.getByRole('heading', { name: 'Search for Clubs' })).toBeVisible();

  // check edit RIO page
  /*
  await page.getByRole('link', { name: 'Edit RIO' }).click();
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
  */

  // check about us page
  await page.getByRole('link', { name: 'About Us' }).click();
  await expect(page).toHaveURL('http://localhost:3000/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

  // check bookmarks page
  /*
  await page.getByRole('link', { name: 'Saved' }).click();
  await expect(page).toHaveURL('http://localhost:3000/bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarks Page' })).toBeVisible();
  */

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
