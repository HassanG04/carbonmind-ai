# CarbonMind AI — Project Operations Pack
**Status:** planning instructions, not an implemented product or created repository. **Audience:** owner, six contributors, Codex reviewer/technical supervisor, Google Antigravity implementation agent. **Version:** v1.0 · 2026-10-30.

## Purpose
Build a research-grade, multi-tenant enterprise carbon-intelligence SaaS for universities, factories, corporate buildings and multi-site organizations. Camera-assisted asset inventory is ONE input; user-entered specifications, utility bills, meter readings, operating records, weather/time, and optionally sensors supply the rest. The deterministic emissions engine computes source- and gas-specific estimates; ML estimates missing activity and forecasts; the Gemini agent explains, retrieves and invokes allowed functions without inventing figures. The app must clearly distinguish **measured, estimated, forecast, and illustrative/mock** values.

## Use in this order
1. Read [docs/decisions.md](docs/decisions.md) for deliberate challenges to the proposed pipeline and unresolved choices.
2. Owner executes [repo.md](repo.md) and gives explicitly authorized credentials to the relevant tools; no AI instructions grant repository authority.
3. For the **throwaway UI prototype**: [prototype.md](prototype.md), then [prompts/antigravity_prototype_start.md](prompts/antigravity_prototype_start.md). Prototype can be a separate Vercel project; do not treat it as real functionality.
4. For the **real repository**: [prompts/codex_repo_bootstrap.md](prompts/codex_repo_bootstrap.md), then [docs/architecture.md](docs/architecture.md), [docs/contracts.md](docs/contracts.md), and [docs/scientific_engine.md](docs/scientific_engine.md).
5. Every contributor reads [AI.md](AI.md), [AGENTS.md](AGENTS.md) (Codex), relevant `members/<name>.md`, and fills their personal session [docs/AI-member-template.md](docs/AI-member-template.md). Do not mistake shared policies for GitHub permission controls.
6. Every change follows [docs/agent_delivery_workflow.md](docs/agent_delivery_workflow.md), with task handoffs in `prompts/` and acceptance criteria in [docs/validation.md](docs/validation.md).
7. Maintain `docs/decision-log.md`, not secret knowledge buried inside LLM chat history.

## Files
- `prototype.md`: exact scope, mock contracts, UX flows, deployment and acceptance tests for temporary Antigravity UI.
- `repo.md`: owner-approved private GitHub bootstrap, seven branches including `main`, permissions caveats and CI/PR process.
- `members/`: six member-specific role charters with deliverables, dependencies, first tasks, and onboarding agent prompt.
- `AI.md` and `AGENTS.md`: reusable shared agent policies; personal context is stored in per-member `AI.md` notes created during work (do not overwrite the shared root).
- `prompts/`: executable human-readable startup, task, review, handoff and resume prompts.
- `docs/`: architecture, domain science, data model, research validation, compliance, security, cost/scope constraints and optional hardware.
- `reference/carbon_footprint_advanced_documentation.md`: original supplied reference, bundled unchanged. This is a scientific *starting point*, not an automatically validated source for audit-grade regulatory claims.

## Reality checks
This archive DOES NOT create the private GitHub repo, authenticate GitHub/Vercel, deploy a website, train models, or verify GHG factors for a specific reporting jurisdiction. Those are future authorized actions requiring credentials, organizational choices, and real test data.
