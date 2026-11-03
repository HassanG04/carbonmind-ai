# CarbonMind AI — Complete Frontend Prototype (PROTO-001)

This package contains the complete, fully synthetic Next.js SaaS prototype for CarbonMind AI.

The university display name is **AASTMT**, as requested by the project owner. All facilities, equipment, activity records, and figures remain synthetic demonstration fixtures. Internal `org-atlas` / `site-atlas-*` fixture IDs are retained for compatibility.

The interface opens in dark mode by default. The header's **Dark mode** switch toggles between light and dark themes and persists appearance preferences in browser local storage (`carbonmind-theme`). Equipment and activity edits reset on session reload.

> **CRITICAL DEMO NOTICE:**
> All values, meter entries, emission calculations, and optimization trade-offs in this prototype are **strictly synthetic demo data**.
> - There is **no persistent database** connected (`Session only — resets on reload`).
> - There are **no live backend HTTP APIs**, external Gemini API keys, or paid cloud services invoked.
> - The emission factor (`0.45 kgCO2e/kWh`) is a fictional illustrative fixture from `docs/scientific_engine.md` and does **not** represent an official national standard.

---

## Screen Map & Implemented Routes (Full Prototype Scope)

| Route | Name | Scope Status | Description & Key Interactions |
|---|---|---|---|
| `/` | Executive Overview | Complete | Multi-organization KPI cards, Scope 1/2/3 breakdown, methodology trace modal, facility overview table, and prioritized decarbonization recommendations. |
| `/sites` | Sites & Facilities | Complete | Campus and facility directory with sector classification, facility codes, and equipment counts across AASTMT, Meridian Manufacturing, and Northstar Offices. |
| `/sites/[id]` | Site Detail | Complete | Building/area asset hierarchy, asset registration/edit modal with wattage and operating schedule validation, unknown equipment support, and unavailable state handling. |
| `/inventory` | Carbon Inventory | Complete | Activity ledger demonstrating anti-double-counting (primary meter vs attribution child), direct kWh vs Watts×hours input, and timestamp interval validation. |
| `/scan` | Camera Scan & OCR | Complete | Browser camera permission requested only on deliberate action, track teardown on unmount, file-upload alternative, bundled demo presets with bounding box overlays, candidate confirmation form, and unknown equipment support. |
| `/forecasts` | Predictive Analytics | Complete | 7/14/30-day horizon selector, non-overlapping seasonal-naive projection, interactive SVG chart with illustrative ±20% uncertainty bands, and carbon budget surplus/deficit analyzer. |
| `/optimize` | Scenario Studio & Recommendations | Complete | Interactive sliders for lighting schedule reduction, AC cooling setpoint delta (+°C), equipment standby reduction, and on-site solar PV with real-time counterfactual calculations (`potential savings, not actual savings`) and ranked recommendations. |
| `/assistant` | AI Sustainability Copilot | Complete | Interactive conversational assistant with suggested query chips, scripted deterministic responses citing synthetic activities and factors, and prominent `DEMO RESPONSE — NO GEMINI API CALL` disclosure. |
| `/reports` | GHG Protocol Reports | Complete | Scope 1, Scope 2 (location-based), and Scope 3 summary table, applied factor registry, and formula-injection protected CSV generation (CWE-1236 safe). |
| `/settings` | Settings & Governance | Complete | Corporate boundary editor, illustrative role simulation (`Org Admin`, `Sustainability Analyst`, `Facility Manager`, `Read-only Auditor`) with permission matrix, and explicit `DEMO ONLY — NO AUTHORIZATION ENFORCEMENT` disclaimer. |

---

## Local Development & Verification Commands

All commands are executed from `apps/web`:

```bash
# Install dependencies
npm ci

# Open the local prototype at http://localhost:3000
npm run dev

# Typecheck with TypeScript (0 errors)
npm run typecheck

# Lint with ESLint (0 errors, 0 warnings)
npm run lint

# Run unit & scientific calculation tests (47 passing tests)
npm run test

# Build optimized production bundle
npm run build

# Run Playwright browser interaction and theme tests (17 passing tests)
npm run test:e2e
```

From repository root:
```bash
python scripts/check_docs.py
```

---

## Scientific & Accounting Invariants Implemented

1. **Deterministic Energy Calculation:**
   $$\text{Energy (kWh)} = \frac{\text{Watts (W)} \times \text{Hours (h)}}{1000}$$
   - Rejects non-finite values (NaN, Infinity) and negative quantities.
   - Rejects operating hours exceeding selected interval duration.
   - Does not convert marketed AC HP directly into electrical watts.

2. **Deterministic Emissions Calculation:**
   $$\text{Emissions (kgCO}_2\text{e)} = \text{Energy (kWh)} \times 0.45\text{ kgCO}_2\text{e/kWh}$$
   - Fictional factor; aggregate CO2e output only (no artificial methane or N2O synthesis).

3. **Anti-Double-Counting Ledger:**
   - Primary consumption meters establish the top-level Scope 2 envelope.
   - Sub-metered and equipment attribution children are retained as sub-allocations and **never** added onto the parent total (e.g., 100 kWh parent + 30 kWh child remains 100 kWh, not 130).

4. **Seasonal-Naive Forecasting:**
   - 7/14/30-day projection repeating observed 7-day cyclical baseline.
   - Strictly non-overlapping historical vs projected periods.
   - Display bands explicitly labeled as illustrative ±20% ranges, not calibrated statistical confidence intervals.

5. **Counterfactual Scenario Simulation:**
   - Levers for lighting schedule, AC setpoint delta, equipment standby, and solar PV.
   - Baseline minus alternative explicitly labeled as "potential savings, not actual savings".

6. **Formula Injection Sanitization (CWE-1236):**
   - CSV export prepends a single quote `'` to any cell starting with dangerous characters (`=`, `+`, `-`, `@`, `\t`, `\r`) to neutralize spreadsheet formula execution.
