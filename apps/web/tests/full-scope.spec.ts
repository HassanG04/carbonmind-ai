import { test, expect } from '@playwright/test';

test.describe('CarbonMind Full Prototype Scope & Interaction Suite', () => {
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

  test('Camera Scan (/scan) supports bundled presets, unknown equipment, and asset confirmation', async ({ page }) => {
    await page.goto('/scan');

    // Verify disclosure badges
    await expect(page.getByText('SIMULATED DETECTION', { exact: true })).toBeVisible();
    await expect(page.getByText('Scientific Integrity Safeguard')).toBeVisible();

    // Verify default preset Carrier Chiller
    await expect(page.getByRole('button', { name: 'HVAC Chiller Nameplate' })).toBeVisible();
    await expect(page.locator('#scan-label')).toHaveValue('Carrier AquaForce 30XA-080');

    // Switch to Unknown Equipment preset
    await page.click('button:has-text("Unlabeled Auxiliary Motor")');
    await expect(page.locator('#scan-is-unknown')).toBeChecked();

    // Switch to LED preset
    await page.click('button:has-text("High-Bay LED Luminaire")');
    await expect(page.locator('#scan-label')).toHaveValue('Philips GentleSpace Gen3 High-Bay');

    // Fill in area and confirm asset
    await page.getByLabel('Hierarchy Area / Room').fill('Main Auditorium Ceiling Grid');
    await page.click('button:has-text("Confirm & Add to Inventory")');

    // Assert confirmation success state
    await expect(page.getByText('Equipment Successfully Registered')).toBeVisible();

    // Navigate to site and verify asset was added
    await page.click('a:has-text("View in Facility")');
    await expect(page).toHaveURL(/\/sites\/site-atlas-main/);
    await expect(page.getByText('Philips GentleSpace Gen3 High-Bay').first()).toBeVisible();
  });

  test('Carbon Inventory (/inventory) mock CSV import preview validates schema and simulates ingestion', async ({ page }) => {
    await page.goto('/inventory');

    // Click Import CSV Batch
    await page.click('button:has-text("Import CSV Batch")');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Batch Activity Ingestion (CSV Schema Preview)')).toBeVisible();
    await expect(dialog.getByText('✓ VALID SCHEMA').first()).toBeVisible();

    // Click Ingest Batch into Session
    await dialog.getByRole('button', { name: 'Ingest Batch into Session' }).click();
    await expect(dialog.getByText('Successfully ingested 2 entries')).toBeVisible();
    await expect(dialog).not.toBeVisible();
  });

  test('Predictive Forecasts (/forecasts) updates horizon, budget surplus/deficit, and SVG chart', async ({ page }) => {
    await page.goto('/forecasts');

    // Check methodology disclosures
    await expect(page.getByText('Illustrative Prototype Methodology')).toBeVisible();
    await expect(page.getByText('Seasonal-naive projection calibrated on 7-day cyclical history.')).toBeVisible();

    // SVG chart rendered
    const svgChart = page.locator('svg[role="img"]');
    await expect(svgChart).toBeVisible();

    // Change horizon to 30 days
    await page.click('button:has-text("30 Days")');
    await expect(page.locator('button:has-text("30 Days")')).toHaveClass(/bg-positive/);
    await expect(page.getByText('Daily Projection Breakdown (30 Days Ahead)')).toBeVisible();

    // Test budget surplus vs deficit calculation
    // Set low budget (1000 kgCO2e) -> Deficit
    await page.getByLabel('Illustrative Period Budget (kgCO2e)').fill('1000');
    await expect(page.getByText('Projected deficit')).toBeVisible();

    // Set high budget (50000 kgCO2e) -> Surplus
    await page.getByLabel('Illustrative Period Budget (kgCO2e)').fill('50000');
    await expect(page.getByText('Projected surplus')).toBeVisible();
  });

  test('Optimization Studio (/optimize) levers update counterfactual metrics and filter recommendations', async ({ page }) => {
    await page.goto('/optimize');

    // Check counterfactual disclaimer
    await expect(page.getByText('Potential Savings — Not Actual Savings')).toBeVisible();

    // Adjust HVAC slider to 3°C via evaluate to trigger React state
    const hvacSlider = page.locator('#hvac-slider');
    await hvacSlider.evaluate((el: HTMLInputElement) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      setter?.call(el, '3');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(page.getByText('+3°C', { exact: true })).toBeVisible();

    // Verify trade-offs list updated
    await expect(page.getByText('Zone cooling setpoint +3°C may result in thermal comfort drift')).toBeVisible();

    // Filter recommendations by category
    const categorySelect = page.locator('#category-select');
    await categorySelect.selectOption('Lighting Retrofit');
    await expect(page.getByText('Smart Motion-Sensor LED Retrofit')).toBeVisible();
  });

  test('AI Copilot (/assistant) provides scripted conversational responses with citation badges', async ({ page }) => {
    await page.goto('/assistant');

    // Check badge
    await expect(page.getByText('DEMO RESPONSE — NO GEMINI API CALL')).toBeVisible();

    // Click suggested prompt chip
    await page.click('button:has-text("Why did electricity consumption drop on October 24 and 25 at Main Campus?")');

    // Wait for response containing weekend drop explanation
    await expect(page.getByText('The synthetic 7-day historical meter series reflects a realistic academic schedule.')).toBeVisible();

    // Click grounding evidence citation button
    await page.click('button:has-text("act-atlas-d5")');
    await expect(page.getByText('Saturday Synthetic Total (920 kWh)')).toBeVisible();
  });

  test('Reports (/reports) displays full GHG scopes and triggers safe CSV export', async ({ page }) => {
    await page.goto('/reports');

    // Check Scope 1, 2, and 3 rows
    await expect(page.getByText('Scope 1 · Stationary Combustion (Boilers, Generators)')).toBeVisible();
    await expect(page.getByText('Scope 2 · Purchased Electricity (Location-based)')).toBeVisible();
    await expect(page.getByText('Scope 3 · Category 1: Purchased Goods & Services')).toBeVisible();

    // Scope 1 and 3 are Not estimated, Scope 2 is Calculated
    await expect(page.getByText('Calculated', { exact: true }).first()).toBeVisible();

    // Click Export Safe CSV button
    await page.click('button:has-text("Export Safe CSV")');
    await expect(page.getByText('CSV exported safely:')).toBeVisible();
  });

  test('Settings (/settings) role switcher simulates personas and shows permission matrix', async ({ page }) => {
    await page.goto('/settings');

    // Mandatory disclaimer
    await expect(page.getByText('DEMO ONLY — NO AUTHORIZATION ENFORCEMENT')).toBeVisible();

    // Switch to Read-only Auditor role
    await page.click('button:has-text("Read-only Auditor")');
    await expect(page.locator('text=Active Persona: AUDITOR')).toBeVisible();

    // Verify capability matrix shows restricted for editing assets
    await expect(page.locator('tr:has-text("Register & Edit Facility Equipment") >> text=RESTRICTED')).toBeVisible();

    // Switch back to Org Admin role
    await page.click('button:has-text("Org Admin")');
    await expect(page.locator('tr:has-text("Register & Edit Facility Equipment") >> text=GRANTED')).toBeVisible();
  });

  test('Final check: zero occurrences of unfinished placeholders across all routes', async ({ page }) => {
    const routes = [
      '/',
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

    const forbiddenPhrases = [
      'waiting for anti-gravity',
      'waiting for codex',
      'stage b preview',
      'stage c preview',
      'awaiting codex',
      'planned for stage b',
      'planned for stage c',
      'under construction',
    ];

    for (const route of routes) {
      await page.goto(route);
      const pageText = (await page.locator('body').innerText()).toLowerCase();
      for (const phrase of forbiddenPhrases) {
        expect(pageText).not.toContain(phrase);
      }
    }
  });
});
