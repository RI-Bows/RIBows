import { test, expect } from '@playwright/test';

test.use({ storageState: 'user-auth.json' });

test('User pages render successfully', async ({ page }) => {
  const response = await page.goto('http://localhost:3000');
  expect(response?.status()).toBeLessThan(400);

  // check navbar links
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Saved' })).toBeVisible();

  // comment out when done with page
  // check search page
  // await page.getByRole('link', { name: 'Search' }).click();
  // await expect(page).toHaveURL('http://localhost:3000/search');

  // check admin search page
  // await page.getByRole('link', { name: 'Admin Search' }).click();
  // await expect(page).toHaveURL('http://localhost:3000/adminsearch');

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
