# HANDOFF — PROTO-001 Temporary Frontend Prototype (Full Scope Complete)

Date: 2026-11-03. Task: PROTO-001 Temporary CarbonMind SaaS prototype (Full Authorized Frontend Prototype Scope Completed). Owner: Hassan Gebril, connected GitHub account HassanG04. Branch: team/hassan-gebril. Base commit: ef7e1145f3f7b94ad650907a97fe959f2629aa70 ("chore: establish CarbonMind reviewed planning foundation"). Remote: `https://github.com/HassanG04/carbonmind-ai.git`. Working branch checkpoint push authorized by Hassan Gebril (Codex temporarily unavailable due to token limits; independent review pending). No push to main, PR, merge, or production deployment.

## Current Stage Status: Complete Authorized Prototype Implementation (Interim Working Checkpoint)
All authorized frontend prototype tasks specified in `prototype.md` and user directives have been implemented, verified, and regression-tested. Every user-facing occurrence of `(Waiting for anti-gravity/codex to finish this section)`, `STAGE B PREVIEW`, `STAGE C PREVIEW`, `Planned for Stage B`, `Planned for Stage C`, `Awaiting Codex`, and all unfinished UI placeholders has been eliminated and replaced with working, interactive features, deterministic demo data, and defensible scientific disclosures. Note: This commit serves as a temporary collaboration checkpoint pushed to `team/hassan-gebril`. Codex review remains pending.

---

### Implemented Frontend Scope (Items 1–16)

1. **Enterprise Overview Dashboard (`/`)**:
   - Organization boundary and GWP standard details.
   - Active facility and organizational KPI cards for Scope 2 emissions, primary electricity kWh, attributed sub-loads, and registered assets.
   - GHG Scope breakdown: Scope 1 (`Not estimated`), Scope 2 (`Calculated via fictional factor 0.45 kgCO2e/kWh`), Scope 3 (`Not estimated`).
   - Facility overview table with direct navigation to `/sites/[id]`.
   - Prioritized decarbonization initiatives summary cards linking directly to `/optimize`.
   - Provenance and execution trace modal with keyboard focus trap and Escape dismissal.

2. **University, Factory & Office Environments**:
   - `DEMO_ORGANIZATIONS` presets:
     - **AASTMT** (`org-atlas`): University campuses, academic halls, research labs, central utility chiller plants, server rooms.
     - **Meridian Manufacturing** (`org-meridian`): Industrial assembly, stamping lines, rotary air compressors, foundry yards.
     - **Northstar Offices** (`org-northstar`): Commercial corporate towers, VAV rooftop air handlers, technology hubs.
   - Selecting an organization updates all linked metrics, facilities, activities, and recommendations dynamically.

3. **Organization, Building & Equipment Management (`/sites` & `/sites/[id]`)**:
   - Facility directory with facility codes, IANA timezones, and asset counts.
   - Site detail hierarchy (Site → Area → Asset).
   - Asset registration and edit modal with electrical wattage (W), operating hours, and area hierarchy.
   - Marketed HP disclaimer (explicitly disclaimed as non-electrical input power).
   - Graceful unavailable state handling for invalid site IDs (`/sites/non-existent-site-xyz`).

4. **Equipment Inventory & Editable Specifications (`/inventory`)**:
   - Activity ledger with facility and representation filters (`primary` vs `attribution`).
   - Anti-double-counting verification: primary meter (100 kWh) + attribution child (30 kWh) maintains a 100 kWh primary total.
   - Activity entry form supporting direct measured kWh (`USER_REPORTED`) and rated Watts × operating hours (`MODEL_ESTIMATED`).
   - Strict timestamp interval validation: explicit timezone offset required (`+02:00` or `Z`), duration check rejecting operating hours exceeding interval elapsed hours.

5. **Camera Scan & OCR Verification (`/scan`)**:
   - Camera access triggered **only upon deliberate user action** (`Start Camera Stream`).
   - Video track teardown on component unmount, navigation, or stop button click.
   - Manual image file upload alternative (`<input type="file" accept="image/*">`).
   - Bundled demo presets with localized bounding box overlays and confidence scores:
     - Carrier AquaForce Chiller Nameplate (45 kW, 94% confidence)
     - Philips High-Bay LED Luminaire (3.2 kW, 96% confidence)
     - Atlas Copco Rotary Screw Compressor (75 kW, 91% confidence)
     - Unlabeled Auxiliary Motor (Unknown Equipment, 45% confidence)
   - Arbitrary image safeguard: user-uploaded images **never** receive fabricated wattages; they default to Unknown Equipment requiring human input.
   - Confirmation form allowing review of target facility, label, category, electrical input watts, and daily hours before registering asset into `adapter`.

6. **Scope 1, Scope 2 & Scope 3 Reporting Interfaces (`/reports` & `/`)**:
   - Formal GHG Protocol corporate summary table.
   - Scope 1: Stationary & mobile combustion marked `Not estimated (Outside demo boundary)`.
   - Scope 2: Purchased electricity location-based calculation (`Calculated`).
   - Scope 3: Value chain categories 1 & 6 marked `Not estimated (Incomplete footprint disclaimer)`.
   - Applied emission factor registry detailing factor ID `demo-electricity-v1`, fictional status, and formula.

7. **Energy Monitoring & Analytics (`/forecasts` & `/`)**:
   - Daily consumption profile analysis based on synthetic 7-day complete historical series.
   - Demonstrates observable weekend load reductions (~30% reduction on Saturday/Sunday).

8. **Carbon Footprint Forecasting Interface (`/forecasts`)**:
   - Horizon selection controls: 7-day, 14-day, 30-day horizons.
   - Seasonal-naive projection repeating observed 7-day cyclical baseline.
   - Non-overlapping historical vs projected periods (historical ends Oct 26; forecast starts Oct 27).
   - Interactive SVG time-series chart with solid historical line, dashed projected trajectory, and shaded ±20% illustrative display band.
   - Explicit disclaimer: `Illustrative seasonal-naive projection — untrained model. Display bounds represent illustrative ±20% ranges, NOT calibrated statistical confidence intervals.`
   - Interactive period budget allowance input with dynamic surplus/deficit indicator.

9. **Intelligent Recommendation Center (`/optimize` & `/`)**:
   - Curated engineering and operational decarbonization measures tailored to each organization (e.g., Chilled Water Temperature Reset, Lecture Hall LED Retrofit, Compressed Air Leak Repair, VAV Pressure Reset).
   - Category filtering, estimated kWh saved, estimated kgCO2e saved, implementation effort, payback period, and transparent assumptions.

10. **Decarbonization Scenario Simulator (`/optimize`)**:
    - Interactive sliders for:
      - Lighting schedule reduction (0% to 50%)
      - AC cooling setpoint delta (0°C to +4°C)
      - Auxiliary equipment standby reduction (0 to 8 h/day)
      - On-site solar PV capacity (0 to 100 kWp)
    - Dynamic recalculation of alternative daily kWh, potential daily savings, annualized energy abatement, and benchmark financial savings ($0.12/kWh).
    - Prominently labeled: `POTENTIAL SAVINGS — NOT ACTUAL SAVINGS`.
    - Real-time operational constraints & trade-offs list (e.g., thermal comfort drift, daylight harvesting requirements).

11. **Gemini Sustainability Assistant Frontend Interface (`/assistant`)**:
    - Enterprise chat interface with suggested prompt chips and interactive input.
    - Scripted, deterministic conversational explanations citing specific synthetic activities, facility codes, and emission factor `demo-electricity-v1`.
    - Grounding evidence & provenance inspector panel detailing cited ledger IDs.
    - Prominent status: `DEMO RESPONSE — NO GEMINI API CALL`.
    - Zero external API calls, zero telemetry, and zero exposed keys.

12. **Reporting & Export Interactions (`/reports`)**:
    - Injection-safe CSV export generator: prepends a single quote `'` to any cell value starting with dangerous formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`) to neutralize spreadsheet formula execution (CWE-1236 protection).
    - Downloads `carbonmind_<orgId>_emissions_report_synthetic.csv`.
    - Print-ready CSS formatting (`window.print()`).

13. **Settings & Governance Simulation (`/settings`)**:
    - Organization configuration editor (legal name, operational control boundary, default GWP standard, currency).
    - Role simulation switcher: `Org Admin`, `Sustainability Analyst`, `Facility Manager`, `Read-only Auditor`.
    - Dynamic capability matrix displaying permitted vs restricted actions.
    - Prominent banner: `DEMO ONLY — NO AUTHORIZATION ENFORCEMENT. This role switcher illustrates multi-role UX only; no authentication or security boundary is enforced in this frontend prototype.`
    - Session reset and local preference clearing controls.

14. **Responsive Layout, Accessibility & Theme Support**:
    - Typographic "CarbonMind" wordmark preserved.
    - Dark mode by default with semantic CSS variables and accessible contrasts.
    - Theme switcher button in header persisting preference to `localStorage.getItem('carbonmind-theme')`.
    - Mobile navigation drawer tested down to 375px viewport with zero horizontal overflow.
    - Accessible dialogs with `role="dialog"`, `aria-modal="true"`, focus trap, and Escape dismissal.

15. **Loading, Empty, Success & Error States**:
    - Empty states for facilities without activities.
    - Validation error alerts on all forms and sliders.
    - Success banners for asset registration, CSV export, and session resets.

16. **Navigation, Filters, Buttons & Meaningful Interactions**:
    - Sidebar and header navigation with active route highlights.
    - Filters by facility, representation, and recommendation category.
    - "Reset Fixtures" button in header and sidebar immediately restoring initial state.

---

### Verification & Test Results

| Verification Gate | Command | Result |
|---|---|---|
| **Documentation Check** | `python scripts/check_docs.py` | **PASS** (`PASS: required documents, local links, original reference integrity`) |
| **TypeScript Compilation** | `npm run typecheck` | **PASS** (`tsc --noEmit` exited with code 0) |
| **ESLint Code Quality** | `npm run lint` | **PASS** (`✔ No ESLint warnings or errors`) |
| **Unit Tests (Vitest)** | `npm run test` | **PASS** (`47 passed (47 tests)` across `math.test.ts` and `adapter.test.ts`) |
| **Production Build** | `npm run build` | **PASS** (`Next.js 15.1.12` compiled all 12 static/dynamic routes successfully) |
| **Browser Tests (Playwright)** | `npm run test:e2e` | **PASS** (`18 passed (19.6s)` covering all 10 routes and all interactive modules) |

---

### Visual Screenshot Artifacts (`apps/web/screenshots/`)

1. `executive-overview.png`: Executive dashboard with KPI cards, facilities table, and decarbonization recommendations.
2. `overview-light.png`: Executive overview rendered in light theme.
3. `sites-dark.png` & `sites-light.png`: Campus directory in dark and light modes.
4. `site-detail.png`: Facility equipment hierarchy and registration modal.
5. `carbon-inventory.png`: Primary vs attribution activity ledger with anti-double-counting.
6. `camera-scan.png`: Camera scan and OCR nameplate verification with localized bounding boxes.
7. `predictive-forecasts.png`: Seasonal-naive time-series chart with ±20% uncertainty bands and budget analyzer.
8. `scenario-optimizer.png`: Decarbonization studio with operational sliders and recommendation center.
9. `ai-assistant.png`: AI Copilot conversational UI with provenance citation inspector.
10. `ghg-reports.png`: GHG Protocol Scope 1/2/3 compliance summary table and safe CSV export.
11. `settings-roles.png`: Administration settings and role-based capability matrix.
12. `provenance-modal.png`: Accessible calculation trace dialog with keyboard focus trap.
13. `mobile-overview-375px.png`: 375px mobile viewport showing responsive layout without horizontal overflow.

---

### File Allowlist Compliance
- **Application implementation**: Strictly confined to `apps/web/**` (source, tests, screenshots, configs, lockfile), with progress recorded in `HANDOFF.md`.
- **Preserved unchanged**: Original scientific reference, `MANIFEST.md` archive baseline, member charters, architecture documents, and security policies.

### Next Action
Submit complete prototype vertical slice for independent Codex review and human inspection.

---

## Data registry checkpoint — 2026-11-06

The public-data organization task was completed on `team/hassan-gebril` and pushed in commit `5b74fc0` (`data: organize public CarbonMind sources`).

- Added `data/manifest.csv` with source URLs, retrieval date, license/terms, purpose, byte size and SHA-256 for every mirrored file.
- Added categorized documentation under `data/computer_vision/`, `data/electricity/`, `data/lca/`, `data/llm/`, `data/behavioral_surveys/` and `data/research_papers/`.
- Mirrored only small public files: Boavizta US device data, Carbon Catalogue XLSX, and Egypt-filtered Ember yearly electricity rows.
- Kept large, API-only, restricted, private, or license-unclear sources in `data/large_data/download.txt`. The Nordic Zenodo workbook is link-only because its public record currently has no license.
- Data checks passed: Ember rows are Egypt/EGY only (605 rows, 1985–2025), Carbon Catalogue XLSX archive integrity passed, manifest hashes and sizes passed, `python scripts/check_docs.py` passed, and `git diff --check` passed.
- These files are research inputs and context. They are not approved national factors, measured AASTMT data, trained-model labels, or evidence of validated emissions performance.
