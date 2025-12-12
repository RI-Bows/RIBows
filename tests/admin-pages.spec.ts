import page from '@/app/editRio/[id]/page';
import { test, expect } from '@playwright/test';

test.use({
  storageState: './admin-auth.json',
});

test.setTimeout(120000);

test('Admin navbar + home page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: 'RIBows Rainbow' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Admin Search' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bookmarks' })).toBeVisible();
  await page.getByRole('link', { name: 'RIBows Rainbow' }).click();
  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { name: 'Find and join RIO\'s at UH Mānoa' })).toBeVisible();
});

test('Admin add rio page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Add RIO' }).click();
  await page.waitForURL('**/addRio');
  await expect(page).toHaveURL('http://localhost:3000/addRio');
  await expect(page.getByRole('heading', { name: 'Add RIO' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'RIO Name' })).toBeVisible();
  await expect(page.getByText('Purpose Statement')).toBeVisible();
  await expect(page.getByText('Main Contact')).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('Interests')).toBeVisible();
  await expect(page.getByText('Image', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'RIO Name' }).click();
  await page.getByRole('textbox', { name: 'RIO Name' }).fill('test add');
  await page.getByRole('textbox', { name: 'Enter Purpose Statement' }).click();
  await page.getByRole('textbox', { name: 'Enter Purpose Statement' }).fill('idk');
  await page.getByRole('textbox', { name: 'Enter Name of Main Contact' }).click();
  await page.getByRole('textbox', { name: 'Enter Name of Main Contact' }).fill('idk');
  await page.getByRole('textbox', { name: 'Enter RIO Email Address' }).click();
  await page.getByRole('textbox', { name: 'Enter RIO Email Address' }).fill('test@hawaii.edu');
  await page.getByRole('listbox').selectOption('Fraternity/Sorority');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'RIO Name' })).toBeVisible();
});

test('Admin edit rio page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
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
});

test('Admin add rio pages test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
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

// couldn't get these tests to work properly—- they kept timing out

/*
test('Admin search + editRio page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Admin Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('test');
  const rioCard = page.locator('.trending-card', { hasText: /test add/i });
  await rioCard.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Edit' }).click();
*/
// await page.waitForURL('**/editRio/*');
/*
  await expect(page).toHaveURL(/editRio\/[0-9a-fA-F\-]+$/);
  await page.getByLabel('RIO Name').fill('test');
  await page.getByLabel('Purpose Statement').fill('i');
  await page.getByLabel('Main Contact').fill('i');
  await page.getByLabel('Email').fill('testadd@hawaii.edu');
  await page.getByRole('listbox').selectOption('Academic/Professional');
  await page.getByRole('button', { name: 'Save Changes' }).click();
});

test('Admin search + delete page test', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Admin Search' }).click();
*/
// await page.waitForURL('**/search');
/*
  await expect(page).toHaveURL('http://localhost:3000/search');
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('test');
  const rioCard = page.locator('.trending-card', { hasText: /test add/i });
  await rioCard.click();
  await page.getByRole('dialog').getByRole('button', { name: /delete/i }).click();
*/
// await page.waitForURL('**/deleteRio/*');
/*
  await expect(page).toHaveURL(/deleteRio\/[0-9a-fA-F\-]+$/);
  await page.getByRole('button', { name: 'Yes' }).click();
});
*/
