import { test, expect } from '@playwright/test';

test.describe('CarbonMind Stage A Prototype Suite (PROTO-001A-R1)', () => {
  // Block any runtime third-party requests across all tests
  test.beforeEach(async ({ page }) => {
    await page.route('**', (route) => {
      const url = route.request().url();
      if (!url.startsWith('http://localhost:3000') && !url.startsWith('http://127.0.0.1:3000')) {
        route.abort('blockedbyclient');
      } else {
        route.continue();
      }
    });
  });

  test('All 10 prototype routes load directly without errors or external requests', async ({ page }) => {
    const routes = [
      '/',
      '/sites',
      '/sites/site-atlas-main',
      '/inventory',
      '/scan',
      '/forecasts',
      '/optimize',
      '/assistant',
      '/reports',
      '/settings',
    ];

    for (const theme of ['dark', 'light']) {
      await page.goto('/');
      if (theme === 'light') await page.getByRole('switch', { name: 'Dark mode' }).click();
      for (const route of routes) {
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.getByText('All data & factors are synthetic.', { exact: true })).toBeVisible();
      }
    }
  });

  test('Organization switcher updates all linked metrics, facilities, and provenance dynamically', async ({ page }) => {
    await page.goto('/');

    // AASTMT is a demo name, not a source of real university data.
    await expect(page.locator('h1')).toContainText('AASTMT');
    await expect(page.getByText('AASTMT is used as a demo name; these are not its actual records.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Main Campus' }).first()).toBeVisible();

    // Switch to Meridian Manufacturing
    await page.selectOption('#org-select', 'org-meridian');
    await expect(page.locator('h1')).toContainText('Meridian Manufacturing');
    await expect(page.getByRole('link', { name: 'Assembly Plant 1' }).first()).toBeVisible();

    // Switch to Northstar Offices
    await page.selectOption('#org-select', 'org-northstar');
    await expect(page.locator('h1')).toContainText('Northstar Offices');
    await expect(page.getByRole('link', { name: 'Northstar Tower HQ' }).first()).toBeVisible();

    // Verify Northstar displays user-reported provenance
    await expect(page.locator('text=USER REPORTED').first()).toBeVisible();
  });

  test('Gracefully displays unavailable state for invalid site IDs', async ({ page }) => {
    await page.goto('/sites/non-existent-site-xyz');
    await expect(page.locator('text=Facility Unavailable or Not Found')).toBeVisible();
    await expect(page.locator('text=non-existent-site-xyz')).toBeVisible();

    // Return button works
    await page.click('text=Return to Facilities Directory');
    await expect(page).toHaveURL('/sites');
  });

  test('Asset creation modal validates inputs, calculates daily kWh, and updates table', async ({ page }) => {
    await page.goto('/sites/site-atlas-main');

    // Click register new asset
    await page.click('text=+ Register New Asset');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Fill form using accessible labels
    await page.getByLabel('Asset Name / Label *').fill('Physics Laser Cooler');
    await page.getByLabel('Equipment Kind / Category').fill('Lab Chiller');
    await page.getByLabel('Hierarchy Area / Room').fill('Physics Hall - Lab 102');
    await page.getByLabel('Electrical Input (Watts)').fill('2000');
    await page.getByLabel('Daily Operating Hours (0 - 24)').fill('10');

    // Submit
    await page.click('button:has-text("Confirm Asset")');
    await expect(dialog).not.toBeVisible();

    // Verify new asset appears in table
    await expect(page.locator('text=Physics Laser Cooler')).toBeVisible();
    // 2000 W * 10 h / 1000 = 20 kWh, 20 * 0.45 = 9 kgCO2e
    await expect(page.locator('text=20 kWh')).toBeVisible();
    await expect(page.locator('text=9 kgCO2e')).toBeVisible();
  });

  test('Activity duration check rejects operating hours exceeding interval, accepts valid duration', async ({ page }) => {
    await page.goto('/inventory');

    // Click Record Activity Entry
    await page.click('text=+ Record Activity Entry');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Switch to Watts * Hours mode
    await page.getByLabel('Rated Watts × Operating Hours').check();

    // Default interval is 08:00 to 16:00 (8 hours). Enter 10 operating hours.
    await page.getByLabel('Operating Hours (h) *').fill('10');
    await page.click('button:has-text("Save Activity Entry")');

    // Must be rejected with duration error inside dialog
    await expect(dialog.locator('[role="alert"]')).toContainText('exceed selected interval duration (8 h)');

    // Correct operating hours to 8
    await page.getByLabel('Operating Hours (h) *').fill('8');
    await page.click('button:has-text("Save Activity Entry")');

    // Should succeed and close modal
    await expect(dialog).not.toBeVisible();
  });

  test('Reset Fixtures restores initial state immediately without page reload (10 -> 11 -> 10 rows)', async ({ page }) => {
    await page.goto('/inventory');

    // Count initial activity rows in tbody
    const initialRows = await page.locator('tbody tr').count();

    // Add an activity
    await page.click('text=+ Record Activity Entry');
    await page.getByLabel('Consumption Quantity (kWh) *').fill('75');
    await page.click('button:has-text("Save Activity Entry")');

    // Assert row count incremented
    await expect(page.locator('tbody tr')).toHaveCount(initialRows + 1);

    // Click Reset Fixtures button in header banner
    await page.click('button:has-text("Reset Fixtures")');

    // Assert row count immediately restored to initial count
    await expect(page.locator('tbody tr')).toHaveCount(initialRows);
  });

  test('Provenance modal opens with accessible dialog, traps focus, and closes on Escape', async ({ page }) => {
    await page.goto('/');

    // Click provenance link
    await page.click('button[aria-label="View calculation trace and provenance"]');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Applied Emission Factor:');
    await expect(dialog).toContainText('demo-electricity-v1');

    // Tab stays within the dialog and cycles back to the first control.
    await expect(page.getByRole('button', { name: 'Close provenance dialog' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Close provenance dialog' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();

    // Dismiss with Escape key
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'View calculation trace and provenance' })).toBeFocused();
  });

  test('Responsive layout at 375px mobile viewport works without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check header hamburger toggle is visible
    const menuBtn = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(menuBtn).toBeVisible();

    // Open mobile menu
    await menuBtn.click();
    await expect(page.locator('#mobile-navigation').getByRole('link', { name: 'Sites & Assets' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await menuBtn.click();
    for (const route of ['/sites', '/sites/site-atlas-main', '/inventory']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });

  test('Dark mode preference persists across reloads and navigation', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('switch', { name: 'Dark mode' });
    await expect(toggle).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(toggle).not.toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.goto('/inventory');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await toggle.click();
    await page.reload();
    await expect(toggle).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
