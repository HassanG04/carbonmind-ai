# Kickstart backlog — priorities and dependencies

These are actionable proposals, not completed assignments or GitHub issues. Existing IDs in task_board.md remain valid. Dates/capacity are unconfirmed. User scope: electricity-first university vertical slice; software-only success; no training/deployment during kickstart.

| Priority / ticket | Proposed accountable owner | Dependencies | Deliverable and acceptance |
|---|---|---|---|
| P0 GOV-001 | Hassan (owner) | Kickstart local checks | Review baseline, commit explicitly listed files, initialize private remote only after account/plan inspection; verify actual seven branches and visibility. Exact owner procedure in repo.md. |
| P0 GOV-002 | Hassan; Ziad Kishk reviews | GOV-001, plan, all handles | Enforce PR/check/review/merge and branch restrictions where supported; test as non-owner; record actual limitations, never claim instructions enforce ACLs. |
| P0 SCI-000 | Science lead TBD; Ahmed/Zeiny assist | Audit errata | Approve equation/unit/GWP/factor policy with independent methodology reviewer; no national defaults invented. Preserve reference. |
| P0 CONTRACT-001 | Hassan | SCI-000, ZK-001 | Versioned activity/factor/result schemas, provenance states, synthetic flag, units/time/boundary/idempotency and examples; reject invalid/unknown inputs; schema compatibility tests. |
| P1 ZZ-000 | Ziad Zeiny, paired | Team availability | Verify skills with the charter mini-task; name science reviewer and record ownership. |
| P1 ZK-001 | Ziad Kishk | Proposed contracts | Threat model and test matrix for API/database/jobs/storage/RAG/export tenants; define authoritative identity and role policy. |
| P1 PROTO-001A | Hassan; Antigravity implementation | Reviewed baseline commit | TASK.md Stage A: three-org inventory/activity/Scope 2 demo; local fixtures, build/typecheck/lint/unit/browser checks; review before expansion. |
| P1 PROTO-001B/C/D | Hassan; Antigravity implementation | Prior stage reviewed | Complete scan, forecasts, scenarios, assistant, reports, settings and accessibility; each stage separately reviewed; no real APIs/keys. |
| P1 SCI-001 | Lead TBD; Zeiny QA + Ahmed factors | SCI-000, CONTRACT-001 | Pure Python Scope 2/unit/GWP implementation and fixtures; finite/nonnegative checks, missing-factor errors, trace, units, dates and dedup; deterministic tests in CI before ML. |
| P1 H-001 | Hassan | CONTRACT-001, ZK-001 | Tenant-safe ERD and reviewed migration with forward/rollback tests; source/activity/factor/result lineage. No unreviewed migration execution. |
| P1 A-002 | Ahmed | CONTRACT-001, H-001 | Synthetic CSV/bill ingestion, unit validation and replay/idempotency; repeated ingestion creates no duplicated source. |
| P1 H-002 | Hassan | H-001, SCI-001, ZK-001 | Authenticated inventory/activity/calculate/query API, typed client, 403/404 cross-tenant rejection, immutable calculation versions. |
| P1 REAL-001 / H-003 | Hassan | H-002, A-002, frontend adapter | University building -> equipment -> user activity -> energy estimate -> deterministic Scope 2 -> PostgreSQL -> dashboard -> forecast interface -> recommendations. No-key/manual path works; all provenance survives export. |
| P2 D-001 | Adham | CONTRACT-001, lawful meter labels | Physical baseline and reproducible evaluation harness, grouped/time splits, unit/error/coverage tests; training is a later ticket. |
| P2 A-003-plan | Ahmed | History contract/data access | Seasonal-naive forecast protocol and rolling-origin benchmark; future weather excluded from backtests; no claimed trained performance. |
| P2 K-001/K-002-plan | Karim | Consent/ontology, contracts | Detection/state/OCR dataset protocol, label quality and holdout design, unknown/confirmation interface; no training in kickstart. |
| P2 OPT-001 | Hassan; Adham supports | Validated baseline, REAL-001 | Rule/scenario baseline, interacting-action recomputation, comfort constraints and cost/tonne guards; measured savings only after M&V. |
| P2 K-003/ZK-003 | Karim; Kishk security | Authorized API + curated corpus | Gemini/RAG tool schemas, retrieval tenant filters, citations, injection/leakage tests and outage fallback; external API requires authorization. |
| P2 A-001 | Ahmed | Hosting choices/traffic evidence | Minimal deployment design and budget guardrails; no resource provisioning or paid usage. |
| P3 EXT-001 | Owner selects lead | Electricity slice accepted, new methods/data | Scope 1/process/Scope 3 extensions with their own equations, datasets and tests; optional disaggregation/hardware off critical path. |

Critical path: methodology -> contracts -> science and schema/security -> ingestion/API -> persisted vertical slice -> evaluated forecasts/recommendations. Prototype can proceed on synthetic demo contracts after baseline review. CV, Gemini and hardware must not block the deterministic manual path.

Model specifications and reproducibility gates are in kickstart-audit.md. Convert these rows to GitHub issues only after remote setup; record actual assignees, dependencies and acceptance evidence there. Do not move a proposed task to completed based on agent summaries.
