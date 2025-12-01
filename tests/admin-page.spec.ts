import { test, expect } from '@playwright/test';

test.use({ storageState: 'admin-auth.json' });

test('Admin pages render successfully', async ({ page }) => {
  const response = await page.goto('http://localhost:3000');
  expect(response?.status()).toBeLessThan(400);

  // check navbar links
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Saved' })).toBeVisible();

  // check search page
  await page.getByRole('link', { name: 'Search' }).click();
  await expect(page).toHaveURL('http://localhost:3000/search');
  await expect(page.getByRole('heading', { name: 'Search for Clubs' })).toBeVisible();

  // check admin search page
  // await page.getByRole('link', { name: 'Admin Search' }).click();
  // await expect(page).toHaveURL('http://localhost:3000/adminsearch');

  // check add RIO page
  await page.getByRole('link', { name: 'Add RIO' }).click();
  await expect(page).toHaveURL('http://localhost:3000/addRio');
  await expect(page.getByRole('heading', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByLabel('RIO Name')).toBeVisible();
  await expect(page.getByLabel('Club Email')).toBeVisible();
  await expect(page.getByLabel('Description')).toBeVisible();
  await expect(page.getByLabel('Category')).toBeVisible();
  await expect(page.getByLabel('Image URL')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

  // check about us page
  await page.getByRole('link', { name: 'About Us' }).click();
  await expect(page).toHaveURL('http://localhost:3000/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();

  // check bookmarks page
  await page.getByRole('link', { name: 'Saved' }).click();
  await expect(page).toHaveURL('http://localhost:3000/bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarks Page' })).toBeVisible();

  // check edit profile page
  await page.goto('http://localhost:3000/editProfile');
  await expect(page).toHaveURL('http://localhost:3000/editProfile');
  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  /*
  await expect(page.getByLabel('First Name')).toBeVisible();
  await expect(page.getByLabel('Club Interests')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  */
});
