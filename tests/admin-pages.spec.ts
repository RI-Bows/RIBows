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

  // check add RIO page
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
  await expect(page.locator('div').filter({ hasText: /^Success$/ })).toBeVisible();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.getByRole('textbox', { name: 'RIO Name' })).toBeVisible();

  // check home page + editRio page from button
  await page.getByRole('link', { name: 'RIBows Rainbow' }).click();
  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { name: 'Find and join RIO\'s at UH Mānoa' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByRole('button', { name: 'Addiction Medicine and Harm' }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.waitForURL('**/editRio/*');
  await expect(page).toHaveURL('http://localhost:3000/editRio/10');
  await expect(page.getByRole('heading', { name: 'Edit RIO' })).toBeVisible();
  await expect(page.getByText('RIO Name')).toBeVisible();
  await expect(page.getByText('Purpose Statement')).toBeVisible();
  await expect(page.getByText('Main Contact')).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('Interests')).toBeVisible();
  await expect(page.getByRole('group', { name: 'Selected interests' })).toBeVisible();
  await expect(page.getByText('Image', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Current image' })).toBeVisible();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.locator('div').filter({ hasText: /^Success$/ }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('American Marketing Association test');
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(
    'Test The mission of the American Marketting Association centers on creating '
    + 'an inclusive and dynamic community where members can deepen their understanding of the '
    + 'ever-evolving marketing landscape and confidently transition into the professional world. '
    + 'We welcome students from all academic disciplines who share a passion for marketing or seek to '
    + 'expand their knowledge and skills. Through thoughtfully curated programs and events, we strive '
    + 'to provide unparalleled networking opportunities, enhance professional development, and promote '
    + 'a strong commitment to ethical practices within our growing membership.',
  );
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('Michelle Tanabe test');
  await page.getByRole('textbox').nth(3).click();
  await page.getByRole('textbox').nth(3).fill('rmtanabe@hawaii.edu test');
  await page.getByRole('listbox').selectOption('Fraternity/Sorority');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');

  // check admin search page + delete
  await page.getByRole('link', { name: 'Admin Search' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('test');
  await page.getByRole('button', { name: 'test Fraternity/Sorority idk' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.locator('div').filter({ hasText: /^Deleted$/ })).toBeVisible();
});
