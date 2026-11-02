# Antigravity Brief — Temporary Enterprise Frontend Prototype
**Deliverable:** working, deployable Next.js frontend; no trained models or real enterprise features. The aim is to demonstrate product vision to supervisors/industry judges. This is TEMPORARY and may be replaced. **Do not build production APIs, databases, sensors, or real Gemini integration yet.**

## Inputs to the agent
Read `INDEX.md`, `docs/decisions.md`, `docs/architecture.md`, `docs/contracts.md`, `docs/security.md` and this file; use `prompts/antigravity_prototype_start.md`. Respect current repository status; do not overwrite existing code without a diff/approval.

## Stack
Next.js App Router + TypeScript + Tailwind CSS; accessible component primitives; lightweight charts (one library max); coherent responsive layout; clean lint/build. Use local typed mock fixtures and predictable deterministic demo interactions. Vercel target. Do not waste time making a permanent frontend theme: use a credible professional B2B interface with simple styling. No proprietary logos without rights.

## Required screens and interactions
1. **Executive Overview**: organization selector (demo: Atlas University, Meridian Manufacturing, Northstar Offices), selected facility, reporting period, Scope 1/2/3 badges, total CO₂e, measured/estimated labels, scope breakdown and change vs prior. All KPI values MUST display `DEMO — SYNTHETIC DATA` banner.
2. **Sites & Assets**: university -> campus -> building -> room -> asset; factory -> site -> line -> machine. Select row to inspect asset tags, rated power, operating schedule, owner, and evidence provenance. Demo CRUD can store locally in component state; never imply server persistence.
3. **Camera Scan**: browser permission only after user action. Provide file-upload alternative and a visibly labeled `SIMULATED DETECTION` overlay/boxes for preconfigured demo image. Camera must never auto-upload or run unconsented inference. Show an edit/confirm form for every detected device and allow 'unknown'.
4. **Carbon Inventory**: drilldown by site, source, scope, gas, factor source, period. Support multi-gas display; where unavailable show `Not estimated`, not artificial methane breakdown. Add mock CSV import preview with schema validation and upload disabled or local-only processing.
5. **Predictive Analytics**: mock past/forecast chart with confidence ribbon or explicit illustrative range; selected prediction horizon, baseline and projected budget. Selecting controls must visibly update chart and narrative.
6. **Optimization Studio**: sliders/switches for lighting schedule, AC utilization, operating hours and production throughput. Recalculate illustrative kWh, CO₂e, trade-offs and cost with transparent mock assumptions. Show `not actual savings`.
7. **AI Sustainability Assistant**: simulated example conversations with suggested questions, source/evidence panel, and `DEMO RESPONSE — NO GEMINI API CALL` status. Do NOT store an API key or pretend to have live RAG.
8. **Reports & Audit Trail**: mock report preview with factor version, organizational boundary, calculated/estimated flags, and export-to-CSV of fictional data (optional printable page).
9. **Admin & Security**: illustrative roles (Org Admin, Sustainability Analyst, Facility Manager, Read-only Auditor), pretend permissions visibly labeled demo-only; never claim actual tenant isolation.

## Design states (mandatory)
Loading, empty, error, no permission, unknown factor, non-numeric input, responsive mobile, keyboard focus, accessible names. Include `Demo Data` banner everywhere, user-facing methodology drawer and provenance tooltips.

## Suggested route skeleton
`/`, `/sites`, `/sites/[id]`, `/scan`, `/inventory`, `/forecasts`, `/optimize`, `/assistant`, `/reports`, `/settings`. Use layout navigation and route-safe bookmarks. Create fixtures in `src/demo/fixtures.ts`, types in `src/lib/contracts.ts`, simulation functions in `src/demo/math.ts` (NOT called audit-grade formulas).

## UI data contract (minimum)
Site `{id,orgId,name,type,timezone}`; Asset `{id,siteId,kind,label,powerW?:number,origin:'manual'|'camera_mock',confidence?:number}`; EmissionRecord `{id,siteId,scope,gas,kgGas?:number,kgCO2e:number,method:'demo',periodStart,periodEnd,factorVersion}`; Recommendation `{id,action,estimatedKwhSaved,estimatedKgCO2eSaved,assumptions:string[],status:'illustrative'}`.

## Deployment protocol
- Use separate `carbonmind-prototype` Vercel project if possible. No authentic company/user records, images of employees, API keys or actual meter logs.
- Install dependencies, `npm run lint`, `npm run build`, run basic browser smoke checks (route navigation, mobile width, forms, zero/null states).
- Follow Vercel private-repository constraints in `docs/decisions.md`. On Hobby private organizations commits may not deploy; check team plan and author access. Configure deployment protection where required. Do not claim deployment until URL and status verified.
- If credentials unavailable, provide ready-to-deploy source and explicit owner steps; stop short of pretending the deployment happened.

## Acceptance criteria
- Every page renders without backend or keys.
- At least 3 organization presets; selected organization changes *all* linked metrics consistently.
- Camera scan demo includes confirmation and fake detection labels; no live model claims.
- Forecast/optimization interactions update values; impossible negative usage rejected.
- All numbers are synthetic and visibly labeled, including exports.
- `npm run build`, `npm run lint`, minimum Playwright route smoke test pass.
- README includes run/deploy commands, screen map, and limitations.

## Explicitly out of scope
Real ML inference, production RLS, real user authentication, billing, industrial sensors, greenhouse gas audit sign-off, actual Gemini chatbot, emission factor auto-fetch. Do not make these hidden fake integrations.
