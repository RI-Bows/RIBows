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
  await page.getByRole('textbox', { name: 'Search for RIOs by name,' }).click();
  await page.getByRole('textbox', { name: 'Search for RIOs by name,' }).fill('acc');
  await page.getByRole('button', { name: 'Advocates for Public Interest' }).click();
  await expect(page.getByText('Advocates for Public Interest')).toBeVisible();

  // check search page
  await page.getByRole('link', { name: 'Search' }).click();
  await page.waitForURL('**/search');
  await expect(page).toHaveURL('http://localhost:3000/search');
  await expect(page.getByRole('heading', { name: 'Search for RIOs' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('ballroom');
  await page.getByRole('button', { name: 'Ballroom Dance Club @UH' }).click();
  await expect(page.getByRole('dialog').getByText('Ballroom Dance Club @UH')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Add bookmark' }).click();
  await page.getByText('Bookmark', { exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove bookmark' }).click();
  await page.getByText('Bookmark', { exact: true }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search' }).fill('');
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('radio', { name: 'Academic/Professional' }).check();
  await expect(page.getByRole('button', { name: 'American Marketing' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

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
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill(
    'Test The purpose of this organization shall be: '
    + 'A. To provide members with opportunities for academic, personal, and professional development so they may '
    + 'contribute effectively and ethically to society and their organizations '
    + 'B. To serve the community and develop conscientious members of the community through participation in civic '
    + 'activities C. To build unity within the club while establishing friendships and networks that extend beyond '
    + 'the college career D. To educate members about the opportunity provided by all sectors of the '
    + 'accounting industry. E. To aspire continuous improvement in all activities to ensure that members perform '
    + 'effectively in today&apos;s business environment.',
  );
  await page.locator('div').filter({ hasText: 'RIO NamePurpose StatementMain' }).nth(1).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('Britney Pham test');
  await page.getByRole('textbox').nth(3).click();
  await page.getByRole('textbox').nth(3).fill('phambrit@hawaii.edu test');
  await page.getByRole('listbox').selectOption('Leisure/Recreational');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('link', { name: 'Edit RIO' }).click();
  await page.waitForURL('**/editRio');
  await expect(page).toHaveURL('http://localhost:3000/editRio');
  await page.getByRole('link', { name: 'Edit RIO' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.locator('div').filter({ hasText: /^Success$/ })).toBeVisible();
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
  await page.getByRole('button', { name: 'phambrit@hawaii.edu' }).click();
  await page.getByRole('link', { name: 'Edit Profile' }).click();
  await expect(page).toHaveURL('http://localhost:3000/editProfile');
  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  await expect(page.getByText('Email')).toBeVisible();
  await expect(page.getByText('Interests')).toBeVisible();
  await page.getByText('Academic/ProfessionalFraternity/Sorority').click();
  await expect(page.getByText('Club Interests')).toBeVisible();
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByText('SuccessYour profile has been').click();
});
