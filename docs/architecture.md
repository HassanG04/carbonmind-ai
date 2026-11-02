# Architecture & Service Boundaries

## Deployment units (graduation-grade; do NOT over-microservice)
- **`apps/web`**: Next.js/TypeScript/Tailwind enterprise dashboard, organization/site selector, scan and manual onboarding, history, forecasting, optimization, audit views, Gemini chat frontend.
- **`services/api`**: FastAPI app providing OIDC/JWT validation, tenant/site RBAC, source/asset CRUD, bill upload metadata, readings, emissions queries, forecast/recommendation endpoints, LLM tools gateway.
- **`packages/science`**: pure Python greenhouse calculation library: no network, no DB dependency, test fixtures. Bounded module for factors, conversion, scopes, deduplication, uncertainty.
- **`services/ml`**: separate inference workers for CV/OCR, energy-estimation, carbon/activity forecasting, anomaly detection; returns model version/confidence and feature metadata. Optional accelerator.
- **`services/ingest`**: asynchronous CSV/bill/utility adapters, queues and processing; ability to replay and validate ingested records.
- **`services/assistant`** (can start inside API): Gemini tool orchestration, RBAC-aware retrieval, constrained deterministic tool execution, grounding and citations.
- **`infra`**: PostgreSQL + TimescaleDB or suitable hypertable/storage, Redis for queues/cache, object storage with strict tenant controls, worker hosting separately from Vercel serverless if needed.

## High-level flow
camera/file/manual/sensors -> consent + validation -> normalized activity + provenance -> science engine -> gas ledger -> aggregation/forecast/recommendation -> tenant-scoped API -> SaaS UX; Gemini uses tool calls to the same tenant-scoped services. Do not route accounting through unconstrained LLM text.

## Operating boundaries
- Enterprise org -> facilities -> departments/areas -> assets and emission sources; RBAC enforced on server for all resources.
- Recorded meter reading is the parent energy total. Device inference is a **disaggregation/attribution**; never summation on top of meter total.
- Store input data and versioned factor mapping separately from calculated emission records; support recalculation while preserving historical originally reported version.
- For demos, `demo=true` and synthetic provenance are required end-to-end; avoid a mock API disguised as a real calculation.
- Time intervals are UTC internally with original facility IANA timezone; monthly boundary uses facility timezone and local daylight logic.
- Retain minimal images; default inference on uploads or on-device snapshots with consent, avoid video surveillance and biometric identification.

## API categories
`/v1/orgs`, `/v1/sites`, `/v1/assets`, `/v1/activities`, `/v1/factors`, `/v1/emissions`, `/v1/forecasts`, `/v1/recommendations`, `/v1/simulations`, `/v1/assistant/chat`, `/v1/audit`. Defined JSON in `docs/contracts.md`.

## Service level objectives (pilot proposals, not achieved)
Make 95th-percentile API latency targets only after profiling, and prioritize correctness. Batch vision jobs may take longer than dashboards. Every endpoint has structured errors, correlation IDs, quotas and privacy controls. No unsupported realtime claims: UI refresh represents latest ingested observations, not necessarily physical sensor readings.

## Dependency policy
Use stable, currently compatible versions pinned by lock files in implementation; update versions in ADR. Vercel serves frontend; long-running ML training, queues, video processing and database should use an appropriate external worker environment. Separate prototype from real application.
