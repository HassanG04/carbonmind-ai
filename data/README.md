# CarbonMind data registry

This directory organizes public data sources by the CarbonMind capability that may consume them. It is a research-data registry, not a claim that every source is suitable for production accounting or model training.

## Local files

The current branch contains only small public files with a traceable source and a clear reuse position:

- `lca/product_footprints/boavizta-data-us.csv` — device product-footprint records for exploratory Scope 3/product-context work. Boavizta publishes this under ODbL/DBCL and warns that manufacturer PCF methods have large uncertainty; do not use it as an accurate comparative factor without review.
- `lca/product_footprints/boavizta-sources.md` — upstream source list for the Boavizta CSV.
- `lca/product_footprints/carbon-catalogue-866-products.xlsx` — 866 product carbon-footprint records and metadata from Figshare. The record is CC0. It is an LCA/product-footprint reference, not a facility electricity factor.
- `electricity/ember-egypt-yearly.csv` — Egypt rows extracted from Ember's yearly global release. Ember publishes the source under CC BY 4.0. The file is context for electricity trends and intensity; it is not an approved CarbonMind emission-factor registry.

The complete source, checksum, license/terms, purpose and status for each item are in `manifest.csv`.

## Link-only sources

Large image, depth, model-weight, building-material, weather, recommender and restricted research sources are listed in `large_data/download.txt`. They are intentionally not mirrored into Git.

Paper datasets are handled separately in `research_papers/README.md`. A paper describing a dataset does not mean that its row-level data are public or reusable. Private loyalty-card, household-survey, industrial BOM and licensed LCA records remain citation/integration references only.

## Provenance rules

- Do not use a local file as a national emission factor without checking geography, period, unit, boundary, gas basis, GWP version and license.
- Keep source version, retrieval date and checksum in the manifest.
- Do not combine parent electricity totals with device-attribution data.
- Do not train or report model performance from these files until a task defines labels, splits, preprocessing and evaluation.
- Public availability does not remove privacy, license or scientific-validity review requirements.
