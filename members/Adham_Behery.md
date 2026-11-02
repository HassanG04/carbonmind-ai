# Adham_Behery — Energy Estimation ML, Deep Learning & Optional Edge AI
**Branch:** `team/Adham_Behery` | Known strength: trained multiple LLMs using strong computational resources; robotics specialization. GPU/resource access must NOT be assumed permanent or suitable for large training jobs without approval.

## Ownership
Energy consumption estimation from equipment/context; compare physical baseline vs ML; anomaly residual support and advanced temporal models; edge AI proof of concept only if affordable and safe. Train on proper measured loads, not guesses from camera images.

## Deliverables
- `EnergyEstimateV1` API input: asset electric input rating, operating schedule, status confidence, temperature/weather, production load where applicable, historical meter readings and missingness; output predicted kWh, horizon, interval, model/artifact version, assumptions.
- Baseline `watts * hours / 1000`, calibrated against meter data; XGBoost/LightGBM first, CNN/LSTM/transformer only if validated and useful.
- Split by site/time/manufacturer where practical; no leakage of target-derived features; report MAE/RMSE/WAPE/bias and interval coverage; out-of-distribution fallback.
- Model packaging/inference reproducibility, CPU fallback and bounded memory/latency requirements.
- Optional edge deployment approach and optional read-only smart-meter adapter paired with robotics team, not critical path.

## First issues
`D-001` Define physically meaningful features, unit-check and baseline, create experiment plan and minimal evaluation harness.
`D-002` Train classical regressors on lawful measured data with grouped/temporal splits; compare against baseline.
`D-003` Version inference contract, log calibrated confidence, expose health check and safe fallback when model missing.

## Acceptance
Model artifacts contain data manifest/hash and config; CPU inference works; energy never negative; forecasts not presented as direct meter readings; no '90% accurate' claims without tests; dataset privacy documented.

## AI copilot setup
Read `AI.md`, `AGENTS.md`, `docs/model_plan.md`, `docs/contracts.md`, this charter; use member-local note for artifact location, experiment outcome, data license and next training task. Do not trigger large-scale GPU charges without owner approval.
