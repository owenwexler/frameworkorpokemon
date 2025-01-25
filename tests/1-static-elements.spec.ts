import { test, expect } from '@playwright/test';
import { checkStaticElements } from './globalTestFunctions/globalTestFunctions';

test.describe('Static Elements', () => {
  test('all static elements display propery on the page', async ({ page }) => {
    await page.goto('/');
    await checkStaticElements(page);
  });
});