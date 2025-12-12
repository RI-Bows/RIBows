import { test, expect } from '@playwright/test';

test.use({
  storageState: './admin-auth.json',
});

// edit page takes forever to load
test.setTimeout(300000);

test('Admin pages test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // check navbar links
  await expect(page.getByRole('link', { name: 'RIBows Rainbow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bookmarks' })).toBeVisible();

  // check home page
  await page.getByRole('link', { name: 'RIBows Rainbow' }).click();
  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { name: 'Find and join RIO\'s at UH Mānoa' })).toBeVisible();

  // check admin search page (not done yet)
  await page.getByRole('link', { name: 'Admin Search' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');

  // check editRio page from button
  await page.getByRole('button', { name: 'Addiction Medicine and Harm' }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForURL('**/editRio/*');
  await expect(page).toHaveURL('http://localhost:3000/editRio/10');
  await expect(page.getByRole('heading', { name: 'Edit RIO' })).toBeVisible();
  await expect(page.getByText('RIO Name')).toBeVisible();
  await expect(page.getByRole('textbox').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go back' })).toBeVisible();

  // check add RIO page
  await page.getByRole('link', { name: 'Add RIO' }).click();
  await page.waitForURL('**/addRio');
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
});
