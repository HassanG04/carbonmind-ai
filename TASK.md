# PROTO-001 — Temporary CarbonMind SaaS prototype

Status: Stage A implementation submitted and stopped for Codex review; Stage B is not authorized. Owner: Hassan Gebril; implementer: Antigravity; reviewer: Codex followed by independent human review. This packet does not authorize pushing, deployment or merging.

## 1. Objective and background
Build the temporary, fully synthetic Next.js SaaS experience specified in `prototype.md`, in four separately reviewable stages. Demonstrate university building -> inventory -> user activity -> illustrative energy/Scope 2 -> dashboard -> forecast interface -> recommendations. Production database persistence belongs to REAL-001, not this temporary frontend.

## 2. Verified context and prerequisites
At task creation, the extracted pack contained documentation only: no app, exported functions, package manifest, model or API implementation. The reviewed local baseline is now commit `ef7e1145f3f7b94ad650907a97fe959f2629aa70` on `team/hassan-gebril`, with canonical local branch refs created from it. Stage A changes remain uncommitted and are recorded in `HANDOFF.md` for review. Do not invent a base SHA or implement on top of unreviewed bootstrap changes.

## 3. Required reading
Read AGENTS.md, AI.md, prototype.md, docs/architecture.md, docs/contracts.md, docs/scientific_engine.md, docs/security.md, docs/kickstart-audit.md, docs/decision-log.md, docs/kickstart-backlog.md and members/Hassan_Gebril.md. The user confirmed the science document plus bundled reference replace the absent equations.md for this kickstart. Preserve the reference unchanged; consult audit errata before using examples.

## 4. File allowlist and denylist
ALLOW: `apps/web/**` excluding secrets, downloaded datasets and generated build output; root `HANDOFF.md` for progress only. Put package.json, package-lock.json, Next/TypeScript/ESLint/Tailwind configuration, Playwright configuration, tests and app README inside apps/web. Do not add a root workspace or package manifest without a revised task.

DENY: everything else, especially reference/, members/, docs/, packages/, services/, infra/, .github/, root policy files, .env files, TASK.md and the archival MANIFEST.md. Do not modify production contracts, migrations, auth, branch rules, deployment settings or scientific factor sources. If dependencies require an extra file, stop and request a revised allowlist.

## 5. Technical implementation and bounded stages
Use Next.js App Router, React, TypeScript and Tailwind; at most one chart library. Select compatible supported versions at implementation time using official documentation, pin the resolved dependency graph with package-lock.json, and document versions. Use local fonts/assets and no runtime external requests. Avoid installing unnecessary packages.

Stage A: implement shared shell, three fictional organizations, persistent in-app selection, `/`, `/sites`, `/sites/[id]`, and `/inventory`. Include asset create/edit/confirm, activity entry, deterministic demo calculations and linked totals. Verify this vertical slice and STOP for Codex diff review before Stage B.

Stage B: implement `/scan`, `/forecasts`, `/optimize`. Scan candidates require explicit confirmation and allow unknown equipment. Camera access only on a deliberate action; file selection/manual alternatives; stop tracks on exit. Simulated boxes are only for a bundled demo image; arbitrary user images must not receive invented identification or wattage. Forecast controls and scenario sliders must update outputs consistently.

Stage C: implement `/assistant`, `/reports`, `/settings`. Assistant uses local scripted answers and displays `DEMO RESPONSE — NO GEMINI API CALL`. Reports export fictional records with provenance. Settings show illustrative roles and `DEMO ONLY — NO AUTHORIZATION ENFORCEMENT`.

Stage D: complete mobile/keyboard QA, all route smoke tests, error/empty/loading states, offline/runtime-network checks, screenshots and README. Each stage requires a handoff and Codex review before proceeding; do not mark the full ticket complete at Stage A.

## 6. Existing contracts and exact demo additions
Retain the minimum UI entity names/fields in prototype.md within `apps/web/src/lib/contracts.ts`; they are a demo adapter, NOT a replacement for production snake_case contracts. Use types for Organization, Site, Asset, EmissionRecord and Recommendation as specified there. Site.type is `university | factory | office`. Scope is `1 | 2 | 3`. For an aggregate factor use `gas: 'CO2e'` and omit kgGas; never synthesize a gas breakdown.

Add demo-local fields/types:
```ts
type EvidenceState = 'MEASURED' | 'USER_REPORTED' | 'MODEL_ESTIMATED'
  | 'FORECASTED' | 'SCENARIO_SIMULATED';
type DemoMeta = { isSynthetic: true; schemaVersion: 'demo-v1';
  evidenceState: EvidenceState; assumptions: string[] };
type Activity = DemoMeta & { id: string; orgId: string; siteId: string;
  assetId?: string; sourceId: string; start: string; end: string;
  quantityKwh: number; representation: 'primary' | 'attribution';
  parentActivityId?: string };
type DemoFactor = { id: 'demo-electricity-v1'; value: 0.45;
  unit: 'kgCO2e/kWh'; region: 'fictional'; version: 'demo-v1';
  source: 'docs/scientific_engine.md illustrative fixture' };
type DemoCalculation = { energyKwh: number | null; kgCO2e: number | null;
  factorId: string | null; status: 'calculated' | 'not_calculated';
  reason?: string; trace: string[]; isSynthetic: true };
```
MEASURED may describe a fictional meter fixture only when visibly qualified as synthetic; it never means real physical measurement. Direct user-entered kWh has USER_REPORTED input provenance. Watts-times-hours outputs have MODEL_ESTIMATED provenance and preserve input provenance in the trace. Forecast/scenario outputs have their own states. This demo adapter does not approve the unresolved production enum migration.

Use immutable fixture IDs, fictional organization-specific IDs, and one central selection store. Derive linked metrics from selected records; do not scatter unrelated hardcoded totals. Reset or namespace edits when switching organization. Keep edits in memory and display `Session only — resets on reload`; no claimed database persistence.

## 7. Scientific assumptions and algorithms
Demo energy = actual electrical input watts * operating hours / 1000; never convert marketed AC HP directly into electrical watts. Use finite nonnegative values; hours must not exceed the selected interval duration. Missing watts/hours/factor means `not_calculated` with null output and a reason, never zero. Reject NaN, Infinity, negative values, invalid dates and end <= start. Use ISO timestamps with offsets and display site IANA timezone.

Demo emissions = kWh * 0.45; factor is fictional and cannot be presented as an Egyptian or other national factor. Output CO2e only. Sum primary activities once; attribution children do not increase the parent total. Explicitly reject duplicate IDs and conflicting overlapping representations. Never add location-based and market-based views.

Forecast: repeat the final complete seven-day synthetic week for 7/14/30-day horizons, labeling it `illustrative seasonal-naive projection — untrained`. Missing seven-day history produces an unavailable state. A +/-20% display band is an illustrative range, NOT a calibrated confidence interval. Historical and future periods cannot overlap. The demo uses a constant fictional factor and states that assumption.

Scenario: recalculate from the baseline using multiplicative schedule/utilization changes; do not sum overlapping savings. Baseline minus alternative is potential savings, labeled `not actual savings`. Budget is a user-set organizational allowance in kgCO2e for the same period/boundary, not a global climate budget. Scope 1/3 and unavailable gas data show `Not estimated`; an incomplete inventory must not be labeled a complete footprint.

## 8. API requirements
No HTTP API, production backend, Gemini connection, RAG retrieval or database for this ticket. Keep fixtures, calculations and an asynchronous local data adapter separate from UI. Adapter may simulate loading/errors deterministically. Document future mapping to existing `/v1/assets`, `/v1/activities`, `/v1/emissions`, `/v1/forecasts` and `/v1/simulations`; do not invent server behavior or claim these endpoints exist.

## 9. Acceptance cases
- All ten routes listed in prototype.md load directly and navigate without keys/backend.
- Atlas University, Meridian Manufacturing and Northstar Offices change all linked values consistently; invalid site IDs show a useful unavailable state.
- Every page, chart, tooltip, report and CSV visibly identifies synthetic values.
- 120 W for 10 h -> 1.2 kWh -> 0.54 kgCO2e; 100 kWh -> 45 kgCO2e; zero input -> zero, missing input -> null/unavailable.
- A 100 kWh parent plus 30 kWh attributed child remains 100 kWh, not 130.
- Missing factor, invalid units/values/dates and unknown equipment never produce fabricated totals.
- Camera denial has manual/file alternatives, no automatic capture/upload, and tracks stop on exit.
- Forecast horizon/scenario changes affect charts, totals and narratives; illustrative bands are never called validated confidence intervals.
- CSV contains isSynthetic, evidenceState, factor version, boundary/period and units. Protect string cells against spreadsheet formula injection; properly escape CSV.
- Keyboard navigation, focus, form labels, errors, responsive 375px layout and desktop layout work. No role selector is advertised as a security boundary.

## 10. Required checks
Implement actual npm scripts inside apps/web for `typecheck`, `lint`, `test`, `build`, `test:e2e`. Unit tests cover math, missingness, validation, deduplication and consistent fixture aggregation. Playwright covers navigation, organization changes, input validation, camera denial/manual fallback, forecast/scenario interaction and synthetic CSV export. Block third-party runtime requests in browser tests and assert no automatic camera request. Use local assets so builds do not require remote font downloads.

From apps/web run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e`. Install a Playwright browser only if missing and report that prerequisite. From repo root run `python scripts/check_docs.py`. These are required checks; the Stage A execution results are recorded in `HANDOFF.md`. Do not substitute successful compilation for browser/security evidence.

## 11. Security and forbidden behavior
No real enterprise records, employee images, credentials, analytics, external service calls, purchases, hardware control, facial recognition or automatic upload. Render imported strings as text; validate local upload size/type and document limits. Mock tenant selection is UX only. No production isolation/auth claims. No deployment, git push, merge, force push or agent self-approval.

## 12. Deliverables and review
Working app source and lockfile; meaningful tests; app README with run commands/screen map/limitations; screenshots of key states; exact command results including failures; Git diff summary; updated HANDOFF.md with stage, branch and SHA. Codex inspects actual diff and reruns checks, then human reviews. Only accepted work may be committed/pushed through the owner's process.

## 13. Stop conditions
Stop for missing baseline, wrong branch, unexpected dirty files, unresolved contract dependency, missing allowlisted capability, scientific ambiguity affecting an output, or failed acceptance checks. Do not quietly broaden scope or fill unknowns. Resolve failures within scope; report blockers with evidence.

## 14. Context recovery
Before losing context, record completed stage, changed paths, exact tests/results, assumptions, open issues and one next action in HANDOFF.md. Resume by reading this packet and governing docs, then `git status --short --branch`, `git log -5`, `git diff`, and `git diff --cached`; inspect untracked files too. Do not rely on an agent's previous summary alone.
