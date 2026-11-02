# Acceptance, CI, Research Validation and Definition of Done

## Checks before every PR
- Frontend: TypeScript typecheck, lint, build, route smoke tests and a11y keyboard/focus checks.
- Backend: unit tests, integration tests (if DB available), API schema/OpenAPI validation, migrations check.
- Science: fixture regression, units/dimensions, boundary and double-count tests, exact factor provenance. Uncertain estimates have trace.
- Models: pinned artifact, train/validation/test manifest, data leak checks, selected baseline comparisons, inference contract tests and fallback when model unavailable.
- Security: tenant isolation, secret scanner, prompt injection tool-policy tests, dependency vulnerabilities triaged.
- Deployment: test application build and protected demo URL; run post-deploy smoke tests.

## Suggested workflow job names
`frontend-lint-build`, `backend-tests`, `science-fixtures`, `schema-contracts`, `security-static`, `secrets-scan`. Adapt to actual repository framework. Do not configure 'required' checks before job names exist; avoid flaky blocking checks.

## Required trace for each emissions value
source/activity record -> unit-normalized number -> factor/version/source -> gas mass (if available) -> GWP (if applied) -> CO2e -> aggregate -> UI -> export. Capture unknown factors instead of silently filling national defaults.

## Science fixtures and invariants
See `docs/scientific_engine.md`. Validate negatives, zero, large values, leap years, local daylight saving, time boundaries, scope attribution, duplicate data, kW thermal vs electric, AR5/AR6 changes, CO₂ vs CO₂e and unmeasured CH4. Properties: with positive fixed factor, additional nonduplicate activity increases estimate; no cross-tenant sum; range intervals ordered.

## Research evaluation
Use grouped holdout by equipment/site for CV and energy modeling; rolling-origin forecasting; report MAE/RMSE/bias, completeness, uncertainty coverage, cost and latency. For intervention impact, use adjusted baseline and real meter outcomes; user click acceptance alone is not proof of emissions saved.

## Owner-only merge gate
PR description has linked issue, exact scope, tests with commands, screenshots where UI, science methodology where formula, security assessment and demo/production labels. Codex independent review; human reviewer approval; green CI; **owner checks actual GitHub enforcement and merges**. If rules not enforceable on plan, announce limitation instead of 'protected'.

## Definition of Done
Code merged by authorized owner, builds in CI, has tests and documentation, no undocumented assumptions, data isolation reviewed, audit fields persisted, deployment checks executed if relevant, future backlog updated. A UI screenshot or LLM claim is insufficient.
