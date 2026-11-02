# Scientific Engine — Equation Registry, Units and Test Strategy
Primary basis: `reference/carbon_footprint_advanced_documentation.md`, especially §§1, 4, 5, 7, 8, 10, 11, 12. A primary-source or official-inventory check is needed before regulatory reporting. The supplied document marks some numbers † (recalled, not re-verified); retain these tags in factor metadata.

## Standard function contract
`calculate(source_type, period, activity, emission_factor_id, method_version, boundary_id) -> {gas_masses_kg, kgCO2e, calculation_trace, uncertainty, provenance, status}`. Never return an unlabeled naked number.

## Equations for version 1
1. Electricity Scope 2: `E_gas = kWh * kg_gas_per_kWh` if the factor is gas-specific; for an **aggregate CO2e grid factor** output CO2e only (gas components unavailable). Keep location-based and market-based Scope 2 as separate views, not additive.
2. Fuel Scope 1 combustion: `E_CO2 = fuel_t * NCV_GJ_per_t / 1000 * EF_kg_per_TJ * oxidation`, including fuel-specific CH4/N2O where factors available. Alternative per-liter conversion with documented density. No blending mass and volume without conversion.
3. Vehicle from distance when no fuel amount: `E = vehicle_km * liters_per_km * kgCO2_per_liter`; if direct fuel usage available prefer it for combustion CO2. Report upstream fuel separately if included.
4. Refrigerant loss: `kg_gas = charge_kg * annual_loss_fraction * time_years + service_loss_kg` for an appropriate leak/charge model; multiplication by refrigerant-specific GWP, and explicit confidence. Nominal equipment count is not proof of leak.
5. Process emission plug-in: `E_process_CO2 = clinker_t * factor_tCO2_per_t * CKD_correction` for a cement pilot, or selected verified source; do not extrapolate to all industry.
6. Methane waste plug-in: landfill FOD by waste cohort with decay rate, degradable organic content, oxidation/capture terms; no direct CH4 unless process input available. **Postponed from MVP** unless real source data.
7. GWP conversion: `kgCO2e = sum(kg_gas * GWP100[gas])`, factor version/horizon explicit. Example AR6: fossil methane ~29.8, non-fossil methane 27.0, nitrous oxide 273 (as stated in source). Avoid accidental double counting of fossil CH4 oxidation CO2 and GWP indirect components.
8. Target and forecast: `remaining_allowance = user_defined_budget - recorded_kgCO2e`; `month_end_forecast = recorded_to_date + predicted_future`. Forecast is not a measurement.
9. Abatement: `delta_kgCO2e = E_baseline - E_alternative`; `MAC = (C_alt - C_base)/(E_base - E_alt)` with denominator guard, comparable time bases, unit $/tonne; `actual avoided` requires M&V not only predicted counterfactual.

## Factor registry schema
`factor_id, source_category, gas_or_co2e, unit_numerator, unit_denominator, value, country, region, generation_type, temporal_valid_from/to, method, source_title, source_url, source_publication_year, retrieved_at, status_verified, gwp_assessment, uncertainty_low/high, factor_lineage_id, license`. `gas_or_co2e` cannot be silently cast. Archive versions immutably.

## Anti-double-count rules
- Parent utility bill total + device predictions = one top-level consumption amount plus attribution; never both added.
- Location and market Scope 2 are alternative reporting views.
- A supplier Scope 1 can appear in buyer Scope 3; do not aggregate different organizations as one global footprint.
- Combustion and industrial process emissions can both exist if chemically distinct; never count same fuel twice.
- Biogenic CO2 convention and land-use accounting need explicit method/boundary.

## Unit and uncertainty gates
- `P_W * hours / 1000 = kWh` for constant device loads, otherwise integrate `P(t) dt`; kW cooling capacity, 'HP' marketing label, and kW electric input are distinct.
- kg/g/t conversions explicit; N2O-N conversion uses 44/28 before GWP, carbon-to-CO2 44/12; mass denominators typed.
- Report input uncertainty, factor uncertainty, model error separately. For independent quantities use root-sum-square relative errors; if non-normal/correlated use Monte Carlo and describe assumptions.

## Required golden fixtures (examples, NOT local standards)
- 100 kWh at *illustrative* 0.45 kgCO2e/kWh -> 45 kgCO2e.
- 10 hours, constant 120 W -> 1.2 kWh; at 0.45 -> 0.54 kgCO2e.
- 5,000 L diesel *illustrative* 2.68 kgCO2/L -> 13,400 kgCO2. Do not silently represent it as complete GHG basket.
- 2 kg measured biogenic CH4 with AR6 GWP100 27 -> 54 kgCO2e.
- 100 kg N2O-N -> 100*(44.01/28.01) kg N2O *273 kgCO2e/kg N2O; check with numeric tolerance.
- Missing factor, zero denominator, negative usage, duplicate meter source, out-of-range timezones, unit mismatch, unsupported gas all tested as safe errors.

## Prohibited
Do not use atmospheric concentration radiative-forcing equations (§2) as if they were a facility emissions calculator. They are explanatory climate physics, not a way to infer kilograms emitted from camera images.
