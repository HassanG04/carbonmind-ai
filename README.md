# CarbonMind AI
Enterprise Carbon Intelligence & Decarbonization Decision Support — graduation research / startup foundation.

**Current state:** this repository package is a project planning handbook. It is not a live platform, trained ML system, deployed app, or regulatory-certified carbon accounting product.

## Kickstart checkpoint — 2026-11-03
See [discovery and scientific audit](docs/kickstart-audit.md), [prioritized backlog](docs/kickstart-backlog.md), [Antigravity implementation packet](TASK.md), and [verified handoff](HANDOFF.md). Run `python scripts/check_docs.py` for the document/link/original-reference check. Production services and application commands outside the temporary frontend remain future work. `MANIFEST.md` remains the original archive checksum baseline; it is not a current working-tree manifest. See `repo.md` for the current branch naming override and owner setup steps.

Stage A of the temporary synthetic frontend now exists under `apps/web/` and is stopped for Codex and human review. It has no backend, database, external API calls or production tenant isolation. Its independent verification is recorded in `HANDOFF.md`; it does not change the planning pack's production status.

## Main workflow
See [INDEX.md](INDEX.md) -> [docs/decisions.md](docs/decisions.md) -> [repo.md](repo.md) for owner setup or [prototype.md](prototype.md) for temporary frontend. Six members have dedicated charters under `members/`. Codex reads `AGENTS.md`, shared `AI.md` and current member charter; Antigravity receives precise bounded task prompts from `prompts/`.

## Scientific approach
Source-specific activity and factors produce gas-specific mass when available; CO2e is converted with stated GWP version and inventory boundary. Missing energy consumption is estimated with baselines or ML and labeled accordingly. Scope 1/2 and limited Scope 3 screening in initial pilots; optional hardware. Reference file bundled unchanged under `reference/`.

## Safety and evidence
Synthetic data are identified; enterprise data requires authorization; camera never implies direct CO2/CH4 measurement; full tenant isolation, provenance and uncertainty are planned, not implemented. Only repository owner merges after verifiable GitHub protections and checks.
