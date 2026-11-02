# Data Contracts & Ownership — Stable Interfaces Before Model Work

## Canonical typed entities (language-neutral sketch)
```
Organization {org_id, name, reporting_boundary, default_gwp_version, owner_id}
Site {site_id, org_id, name, sector, timezone, country, factor_region}
Area {area_id, site_id, parent_area_id?, kind, label}
Asset {asset_id, org_id, site_id, area_id?, kind, manufacturer?, model?,
       rated_input_w?, cooling_capacity_kwth?, marketed_hp?, state?,
       source:'manual'|'ocr'|'camera'|'meter', confidence?, confirmed_by?}
Activity {activity_id, org_id, site_id, source_id, interval_start_utc,
          interval_end_utc, type, quantity, unit, provenance, is_synthetic,
          parent_activity_id?, measurement_status, schema_version}
EmissionFactor {id, source_category, gas_or_co2e, value, unit, region,
                valid_from, valid_to, source_ref, gwp_version?, factor_version}
EmissionResult {id, activity_ids[], org_id, site_id, scope, gas_masses_kg,
                kgco2e?, period, factor_ids[], method_id, calculation_trace,
                uncertainty?, is_synthetic, status:'measured_activity'|
                'estimated_activity'|'forecast'|'illustrative'}
Prediction {id, target, horizon, model_version, prediction, interval,
            input_snapshot_ref, evaluation_version, status:'forecast'}
Recommendation {id, action, site_id, baseline_ref, alternative_ref,
                estimated_kwh_delta, estimated_kgco2e_delta, cost_delta?,
                assumptions[], constraints[], uncertainty, decision_status}
AuditEvent {id, org_id, actor, action, object_ref, timestamp_utc,
            before_hash?, after_hash?, request_id}
```

## Ownership contracts
- Hassan: API DTO/OpenAPI, relational schema, migration review and multi-tenant row ownership; consumer-facing frontend API design.
- Ahmed: ingestion contract, cloud deployment interfaces, forecasting service endpoint and observability.
- Karim: `VisionDetectionsV1`, OCR structured extraction, Gemini tool call schema and refusal behavior.
- Adham: `EnergyEstimateV1` + model artifact/evaluation manifest, optional edge hardware adapter API.
- Ziad_Kishk: authz middleware and policies, prompt-injection and secrets tests, threat model.
- Ziad_Zeiny: physics formula fixtures, factor validation manifests and independent calculation QA (paired reviewer; skill-depth to be assessed).

## External API minimal examples
`POST /v1/assets/discover` accepts uploaded image/object reference with consent and tenant ID from auth, returns candidate assets (never auto-creates permanent inventory); confirm via `/v1/assets/confirm`.
`POST /v1/emissions/calculate` accepts validated activity IDs, reporting scope and method version, returns full trace and ledger; `GET /v1/emissions/summary?site=&period=` aggregates deduped ledger.
`POST /v1/simulations` requires baseline period and explicit actions, returns assumptions and counterfactual; `GET /v1/forecasts` returns intervals and horizon.
`POST /v1/assistant/chat` accepts user prompt and optional context; server scopes tools to authenticated org/site only; returns narrative plus references and tool invocation provenance.

## Breaking changes
Any changes to field units, semantics, status enums, factor conventions, version naming or paths REQUIRE written ADR, migration/backfill plan, API contract tests and two-person science/security review when relevant.
