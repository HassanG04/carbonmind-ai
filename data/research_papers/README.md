# Research-paper dataset availability

The supplied literature review distinguishes public references from private or restricted data. The table below prevents paper results from being mistaken for downloadable training data.

| Source | Data described | CarbonMind use | Status |
|---|---|---|---|
| O'Sullivan et al. 2025, Swiss food purchases | 347 households, 713,645 purchases, 73,662 baskets; Migros loyalty-card records and LCA mapping | Recommendation and counterfactual-swap design only | Row-level data private; citation link only |
| Fu et al. 2024, Chinese household consumption | 1,099 valid household responses from a 2022 questionnaire | Category-accounting ideas and validation questions | Row-level data not public; citation link only |
| Guan et al. 2025, global lifestyles | GTAP 11, WBGCD and restricted parameters; 116 countries and 65 sectors | Scenario overlap/rebound design | Core inputs restricted; citation/code lead only |
| Olson et al. 2024, Nordic lifestyles | 7,359 cleaned responses in a public Zenodo workbook | Exploratory behavioral context | Public record exists, but license is currently blank; link-only |
| Haynes 2024, UK questionnaire | 42 community responses and free-text answers | Low-friction questionnaire design | Row-level data private; citation link only |
| Schodl et al. 2025, recommender carbon | Amazon Books, MovieLens 1M and MIND benchmarks | Recommender energy-evaluation protocol | Public benchmark sources are large or separately licensed; link-only |
| Li et al. 2025, CarbonDialog1K | 1,028 predominantly synthetic dialogues | Assistant extraction/evaluation design | No verified download URL in supplied notes; link-only |
| Balaji et al. 2025, Parakeet | Six evaluation datasets, some licensed/restricted | Factor-candidate retrieval design | Mixed public/restricted sources; do not mirror blindly |
| Castle et al. 2025, BOM entity linking | 21 labeled components from private manufacturing BOMs | Human-reviewed entity-linking design | Private BOMs and licensed ecoinvent; link-only |
| SpiderGen 2025/2026 | 65 PCR/LCA reference documents | LCA procedure suggestion design | Paper/reference documents, not a facility dataset |
| Donaldson et al. 2025 | 22 LCA tasks, 168 expert reviews and model responses | LLM reliability evaluation | Benchmark materials are a paper/code lead; no downloaded copy |

Paper links and large/restricted-source notes are kept in `../large_data/download.txt`.
