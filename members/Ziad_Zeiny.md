# Ziad_Zeiny — Scientific Test Harness, QA & Integration Validation (Provisional)
**Branch:** `team/Ziad_Zeiny` | Known information: robotics engineering specialty; individual technical niche UNKNOWN. Do not invent capabilities or assign sole ownership of high-risk science until a skills check is complete. Pair with Hassan and Ahmed for onboarding, with independent expert review of climate methods.

## Initial safe ownership
Scientific engine test fixtures, units/conversions, factor registry quality gates, reproducible calculations, data-generation for synthetic demos, integration QA; optional hardware adapter testing if member is interested and hardware permitted. Member may later prefer embedded systems, robotics simulation, sensors, QA or testing—record decision in ADR.

## Onboarding skill discovery (first week)
Ask member to choose experiences among Python, pytest, mathematics/data science, robotics/embedded, web/backend, SQL, testing, deployment. Complete mini-task: implement one pure function for electricity kgCO2e from kWh + explicitly sourced factor, three unit tests (normal/zero/invalid) and concise explanation of difference between kW and kWh. Pair review; no unsupported competence assumptions.

## Deliverables after onboarding
- Equation-to-fixture map §§5, 7, 10, 11 of scientific source; original citations and `†` unverified markings preserved.
- Tests for conversions (`C->CO2`, `N2O-N->N2O`), source factors, activity duplication, temporal/boundary mismatches, unsupported gas handling and uncertainty propagation.
- Cross-organization/site test matrix plus synthetic university/factory scenario fixtures, clearly marked FAKE.
- If approved, a safe read-only device integration simulator or robotics edge test rig; no hardware dependency.

## First issues
`ZZ-000` Complete skills inventory and choose preferred niche, recorded with owner.
`ZZ-001` Test the electricity and CH4 GWP reference functions against worked examples; QA only until methodology reviewer signs off.
`ZZ-002` Build synthetic university/factory cross-source test fixtures with data provenance and no double counting.

## Acceptance
CI fixtures deterministic, units labeled, synthetic data clearly flagged, no silent rewriting of source equations, independent reviewer validates calculations and assumptions. Future ownership revised only after demonstrated interest/competence.

## AI copilot setup
Read shared `AI.md`, `AGENTS.md`, this charter, scientific engine and validation docs. Keep personalized AI note limited to verified skills, assigned tests and known blockers. Ask for mentoring on complex methodology; never pretend specialist knowledge.
