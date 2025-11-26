import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/editClub',
  '/about',
  '/bookmarks',
  '/editProfile',
  '/auth/signout',
];

test.use({ storageState: 'club-auth.json' });

test.describe('All pages render successfully', () => {
  for (const route of ROUTES) {
    test(`Page loads: ${route}`, async ({ page }) => {
      const response = await page.goto(`http://localhost:3000${route}`);
      expect(response?.status(), `Failed route: ${route}`).toBeLessThan(400);
    });
  }
});
