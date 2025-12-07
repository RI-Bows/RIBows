import { test, expect } from '@playwright/test';

test.use({
  storageState: './admin-auth.json',
});

test('Admin pages test', async ({ page }) => {
  const response = await page.goto('http://localhost:3000');
  expect(response?.status()).toBeLessThan(400);

  // check navbar links
  await expect(page.getByRole('link', { name: 'RIBows Rainbow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bookmarks' })).toBeVisible();

  // check home page
  await page.getByRole('link', { name: 'RIBows Rainbow' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: 'Find and join RIO\'s at UH Mānoa' })).toBeVisible();

  // check admin search page (not done yet)
  await page.getByRole('link', { name: 'Admin Search' }).click();
  await expect(page).toHaveURL('http://localhost:3000/search');

  // check add RIO page
  await page.getByRole('link', { name: 'Add RIO' }).click();
  await expect(page).toHaveURL('http://localhost:3000/addRio');
  await expect(page.getByRole('heading', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'RIO Name' })).toBeVisible();
  await expect(page.getByText('Purpose Statement')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter Purpose Statement' })).toBeVisible();
  await expect(page.getByText('Main Contact')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter Name of Main Contact' })).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter RIO Email Address' })).toBeVisible();
  await expect(page.getByText('Interests')).toBeVisible();
  await page.getByRole('listbox').selectOption('Religious/Spiritual');
  await expect(page.getByText('Image', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

  // check about us page / feedback page
  await page.getByRole('link', { name: 'About Us' }).click();
  await expect(page).toHaveURL('http://localhost:3000/about');
  await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  await page.getByRole('button', { name: 'Feedback Page' }).click();
  await expect(page).toHaveURL('http://localhost:3000/feedback');
  await expect(page.locator('iframe[title="Feedback Form"]').contentFrame().locator('div').first()).toBeVisible();

  // check bookmarks page
  await page.getByRole('link', { name: 'Bookmarks' }).click();
  await expect(page).toHaveURL('http://localhost:3000/bookmarks');
  await expect(page.getByRole('heading', { name: 'Bookmarked RIOs' })).toBeVisible();

  // check edit profile page
  /*
  await page.getByRole('button', { name: 'ribows@admin.com' }).click();
  await page.getByRole('link', { name: 'Edit Profile' }).click();
  await expect(page).toHaveURL('http://localhost:3000/editProfile');
  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  await expect(page.getByText('First Name')).toBeVisible();
  await expect(page.getByText('Club Interests')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  */
});
