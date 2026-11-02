# AI.md — Shared Intelligence and Collaboration Charter
**Audience:** every human contributor and coding agent. This is a **project policy**, not a GitHub ACL, repository secret or evidence of executed work. Read alongside `AGENTS.md`, specific member role and current task artifact.

## North star
Build enterprise carbon intelligence with trustworthy provenance, rather than an unvalidated CO₂ counter. Primary pilots: a university campus and a factory. Core: camera-assisted equipment onboarding, manual/bill/meter data, Scope 1/2 estimation, basic Scope 3 screening, gas-specific accounting, forecasting, scenario optimization, Gemini explanation, multi-tenant SaaS. Optional: BMS/IoT hardware, industrial methane, advanced process/LCA modules.

## On every session
1. State current Git branch, clean/dirty status, current ticket, in-scope files and expected acceptance criteria. Never assume any instruction overrides explicit user approvals or actual repo protection.
2. Read `docs/decision-log.md`, `docs/architecture.md`, `docs/contracts.md`, `docs/scientific_engine.md`, `docs/security.md`, own `members/<name>.md`.
3. Work only in the assigned area; raise API changes as proposals first. Do not silently change schema, reporting boundary, gas units, GWP version or sample factor.
4. Inspect source docs and code before editing. Build bounded incremental changes and add tests. Never use demo data to support scientific performance claims.
5. At finish produce reproducible handoff: intent, files changed, commands/tests/results, security implications, assumptions, unresolved questions, next step and branch/commit IDs if actually created.

## Domain invariants
- Activity data × source-appropriate factors. Gases recorded in kg CO₂, kg CH₄, kg N₂O etc FIRST; CO₂e calculated using explicit horizon and version. Distinguish fossil/biogenic CH₄ as appropriate.
- Clearly label measured, modeled, user-provided, predicted, inferred, **synthetic**, and not calculated; do not mix them silently.
- Organization/site/source boundaries must be explicit; parent bills and child device disaggregations are alternative representations, not additive sources.
- Times are timezone-aware; site timezone and effective factor interval required.
- Nominal AC HP is not measured electrical watts. Cameras do not detect methane. Natural daylight does not guarantee safe/effective lighting or ventilation. Direct CH₄ emission requires proper source inputs or specialized measurement.
- GHG calculations are not accounting certification; uncertainty and audit trail mandatory.

## Agent permissions
- No pushing, deployment, PR merge, account creation, paid API calls, repo settings changes, secret access, external uploads or destructive operations without explicit owner/user authorization.
- Codex is **review supervisor** and prompt writer; Antigravity is implementation agent for bounded tasks; neither may bypass required human review.
- When out of context: write durable HANDOFF.md, stop, restart with exact files and diff. Do not hallucinate completed work.

## Documentation updates
Changes to system assumptions require ADR in `docs/decision-log.md`; shared contract changes require coordination with Hassan as proposed technical integrator and relevant scientist/security reviewer; sector calculation changes require equation/source/test fixtures.
