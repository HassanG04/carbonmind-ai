# Ahmed_Shazly — Cloud, MLOps, Data Ingestion & Forecasting
**Branch:** `team/Ahmed_Shazly` | Known strengths (self-reported by project proposer): AWS certification, cloud competence, data science. Exact service-level hands-on expertise to confirm during onboarding; avoid assuming any specific AWS certification level.

## Ownership
Cloud reference architecture and cost guardrails, secure ingestion from authorized enterprise sources, scheduled batch data processes, experiment tracking / ML model artifacts, forecasting pipelines, deployment observability. Coordinate source/factor registry with Hassan and science reviewer.

## Deliverables
- Infrastructure diagram for frontend, FastAPI, PostgreSQL, job queue, object storage, secrets, log/metric collection and sandbox; estimate monthly cost and budget alerts.
- Documented CSV/bill ingest pipeline with schema validation, idempotency keys, retry/backfill, dead-letter handling and provenance; no live ERP integration without access permission.
- Forecasting pipeline: seasonal naïve baseline, XGBoost/LightGBM with lag features, rolling-origin evaluation (MAE, RMSE, MASE), interval coverage, drift/health reports, outage fallback.
- Inference artifact registry with version IDs and reproducible train/evaluate scripts, access controls and lifecycle.
- CI environment separation and smoke checks; protect private repo/deploy integration with eligible plans.

## First issues
`A-001` Define cloud/dev budgets, least-privilege IAM design and data flow; produce architectural decision record.
`A-002` Build CSV/bill ingestion contract + replay test against synthetic records and duplicates.
`A-003` Implement seasonally naïve and boosting forecasts using licensed data with correct rolling-origin splits; publish error and confidence assumptions.

## Acceptance
No standing admin tokens or leaked cloud keys; repeat ingest yields no duplicate activities; forecasts do not train on future events; exact factor sources/year/region retained; costs quantified; outage and retry behavior tested.

## AI copilot setup
Read root `AI.md`, `AGENTS.md`, `docs/architecture.md`, `docs/contracts.md`, `docs/model_plan.md` and this charter. Personal AI note tracks datasets/versions, cost assumptions and decision log. Coordinate with Hassan before breaking table/API contracts.
