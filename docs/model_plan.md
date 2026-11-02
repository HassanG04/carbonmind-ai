# Research Models, Datasets and Experiment Matrix

## Research objective
Can multimodal, privacy-conscious acquisition (CV + manual + operational context) improve completeness of enterprise equipment inventory and forecasts over simple surveys and ratings, while making emissions reduction decisions more useful? Avoid asserting an outcome without experiments.

| Model | Owner | Train/inputs | Baseline | Metrics | Leakage checks |
|---|---|---|---|---|---|
| Asset detection | Karim | consented equipment images, labels, room/site split | pretrained detector/manual survey | mAP@0.5:0.95, recall, false positives, inventory time | disjoint facility/camera split |
| OCR/spec extract | Karim | nameplate images/annotated fields | OCR alone + regex | field F1, power-unit accuracy | hold out manufacturers |
| Energy estimation | Adham | calibrated kWh, appliance attributes, weather, schedule | rated input W × hours | MAE, RMSE, WAPE, bias | time/facility split; no future values |
| Site forecasting | Ahmed | metered history, academic calendar, weather/production | seasonal naive | rolling-origin MAE, RMSE, MASE, interval coverage | no future weather in backtests unless real forecasts |
| Anomaly detection | Ahmed+Adham | meter residuals, confirmed incidents | robust seasonal threshold | precision/recall, alert burden | human incident labels |
| Recommendation ranker | Hassan+Karim | accepted suggestions and verified outcomes | transparent expert rules | accepted actions, measured kWh change | confounders; no causal claim from clicks |
| Text/tool assistant | Karim+Ziad Kishk | synthetic org-scoped queries, source doc | template FAQ | groundedness, tool accuracy, forbidden cross-tenant responses | prompt-injection and hallucination cases |

## Dataset requirements
Records must contain time zone, consent/licensing, source, unit, org/site provenance, train/val/test partition identifier, missingness mask and synthetic flag. No unauthorized camera images of employees and no client secrets in Git. Record dataset hashes, licenses and preprocessing code. Use synthetic records for demo UX and unit tests, not to claim real-world model accuracy.

## Energy labels
Measured kWh over fixed intervals or calibrated meter load (not a guessed number) is the ground truth. For aggregate buildings, distinguish total metered kWh vs estimated per-device allocation. Provide a fallback baseline when ML model is outside training distribution.

## Experiments
Ablations: (a) manual survey alone, (b) CV+manual, (c) CV+manual+weather/time, (d) (c)+meter history. Test transfer from university to factory (possibly poor; report). Stratify scores by equipment class/site type. Publish error distributions and failure modes, not just a headline accuracy.

## Acceptance prerequisites
No model to production if schema mismatch, inference cannot explain units, confidence absent, fails held-out baseline, unsupported generalization or tenant security gates. Human override always available.
