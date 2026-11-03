import { test } from '@playwright/test';
import path from 'path';

test.describe('CarbonMind Visual Captures', () => {
  test('Capture key states', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });

    // 1. Executive Overview (Dark & Light)
    await page.goto('/');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/executive-overview.png'), fullPage: true });

    await page.goto('/sites');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/sites-dark.png'), fullPage: true });

    await page.getByRole('switch', { name: 'Dark mode' }).click();
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/sites-light.png'), fullPage: true });
    await page.goto('/');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/overview-light.png'), fullPage: true });
    await page.getByRole('switch', { name: 'Dark mode' }).click();

    // 2. Site Detail
    await page.goto('/sites/site-atlas-main');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/site-detail.png'), fullPage: true });

    // 3. Carbon Inventory Ledger
    await page.goto('/inventory');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/carbon-inventory.png'), fullPage: true });

    // 4. Camera Scan Module
    await page.goto('/scan');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/camera-scan.png'), fullPage: true });

    // 5. Predictive Forecasts
    await page.goto('/forecasts');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/predictive-forecasts.png'), fullPage: true });

    // 6. Decarbonization Scenario Optimizer
    await page.goto('/optimize');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/scenario-optimizer.png'), fullPage: true });

    // 7. AI Copilot
    await page.goto('/assistant');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/ai-assistant.png'), fullPage: true });

    // 8. GHG Protocol Reports
    await page.goto('/reports');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/ghg-reports.png'), fullPage: true });

    // 9. Administration & Settings
    await page.goto('/settings');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/settings-roles.png'), fullPage: true });

    // 10. Provenance Modal
    await page.goto('/');
    await page.click('button[aria-label="View calculation trace and provenance"]');
    await page.waitForSelector('div[role="dialog"]');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/provenance-modal.png') });

    // 11. Mobile 375px Viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.screenshot({ animations: 'disabled', path: path.join(__dirname, '../screenshots/mobile-overview-375px.png') });
  });
});
