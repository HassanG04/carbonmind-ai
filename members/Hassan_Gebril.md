# Hassan_Gebril — Technical Integration Lead, Data Platform & Enterprise SaaS
**Branch:** `team/Hassan_Gebril` | **Primary competencies evidenced by shared resume:** React/Next.js/TypeScript/Tailwind; Supabase Auth/Storage/RLS, PostgreSQL/SQLAlchemy/Alembic, FastAPI, Docker, GitHub Actions; XGBoost, LightGBM, CatBoost, forecasting and rolling-origin evaluation, model-serving/versioning, RAG retrieval evaluation, YOLO/U-Net. This is not a mandate to own every subsystem.

## Best-fit ownership
Platform architecture & integration, relational schema and data contracts, enterprise multi-tenancy, site/asset/activity/emission ledger, ETL integration, backend API & frontend integration, evidence lineage and dashboards. Coordinate final technical interfaces and acceptance with owner; **repository owner/merge authority is NOT assumed to be Hassan**.

## Deliverables
1. Relational entities with migrations, `org_id/site_id` partitioning, authenticated access and tenant isolation tests; organization/site/asset tree.
2. Versioned OpenAPI/DTO and typed frontend client; parameter validation and Zod/Pydantic where appropriate.
3. Immutable-ish source provenance, activity and emission result linkage, error states; ingest recorded utility bills/CSV through Ahmed's pipeline.
4. Enterprise frontend integration: summary, asset scan confirmation, carbon inventory, forecasting visualizations, scenario and report views; never conflate demo values and real totals.
5. CI integration, reusable local dev scripts, integration testing, feature flags for AI outage and optional hardware.
6. Lead contract reviews and final product demo instrumentation with role-specific experts.

## Boundaries
Karim owns CV/OCR and Gemini behavior; Ahmed owns cloud/MLOps/forecasting; Adham owns equipment energy modeling; Ziad Kishk owns security review; Ziad Zeiny owns formula fixture QA with mentoring. Hassan may assist but shouldn't duplicate their work. High-risk contract changes require collaborators' input.

## First three issues
`H-001` Write DB ERD + SQL migrations for org/site/asset/activity/factor/ledger with synthetic flags; tests for cross-tenant access.
`H-002` FastAPI endpoints for activity ingestion, emissions query and user correction workflows (science library mocked through typed interface only until validated).
`H-003` Integrate frontend site selector and carbon drilldown with actual tenant-scoped API; fallback to visibly synthetic fixtures.

## Acceptance
API OpenAPI matches `docs/contracts.md`; frontend typecheck and smoke pass; database migration forward/backward tested; tenant A cannot read tenant B; mock/real clear; no secret/PII leakage; integrations use explicit versioned assumptions.

## AI copilot setup
Read root `AI.md` + `AGENTS.md`, `members/Hassan_Gebril.md`, `docs/contracts.md`, `docs/architecture.md`, `docs/security.md`; create a personal `AI.local.md` from template and keep task-limited `HANDOFF.md`. Codex creates bounded Antigravity prompts; Antigravity edits only assigned SaaS files. Never convert your past resume performance numbers into project performance claims.
