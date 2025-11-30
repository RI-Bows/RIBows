import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/addclub',
  '/about',
  '/bookmarks',
  '/editProfile',
  '/auth/signout',
];

test.use({ storageState: 'admin-auth.json' });

test.describe('All pages render successfully', () => {
  for (const route of ROUTES) {
    test(`Page loads: ${route}`, async ({ page }) => {
      const response = await page.goto(`http://localhost:3000${route}`);
      expect(response?.status(), `Failed route: ${route}`).toBeLessThan(400);
    });
  }
});

test('Admin pages', async ({ page }) => {
  // Test that admin can access the admin dashboard
  const response = await page.goto('http://localhost:3000');
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByRole('link', { name: 'Search' })).toBeVisible();
});
