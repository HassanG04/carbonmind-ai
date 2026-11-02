# Challenge to the Proposed Workflow — Decisions Before Coding

## 1. Six personal branches is NOT the same as six safe isolated sandboxes
Requested topology: `main` + exactly six named long-lived member branches. Keep them as staging/integration branches. For substantial tasks, contributors MAY use short-lived local topic branches and squash/cherry-pick onto their own branch, provided the owner's policy allows it. This is an efficiency improvement, not an extra required persistent branch. Do not leave months of unrelated, unreviewed commits in one personal branch. Sync frequently from `main`.

## 2. 'Only owner can merge' requires server-side controls
An `AI.md` rule, PR template or CODEOWNERS file is not a permission boundary. On GitHub, required PRs/reviews alone do not necessarily limit which write-collaborator can press Merge. Configure protected `main` **with push restrictions to the owner/authorized maintainer** and mandatory PR/checks under an eligible plan/organization. A personal Free private repository cannot be assumed to support protection; branch-specific push restrictions are plan/org dependent. If strong controls cannot be configured, **DO NOT claim owner-only merge is enforced**. Upgrade/move to suitable GitHub organization plan, or accept that this is only a social policy. Owner must test with a non-owner account.

## 3. All code should not go through Hassan by default
Hassan's branch is for Hassan's assigned work. Karim's CV goes to Karim's branch, Ahmed's cloud work to Ahmed's branch, etc. Codex review happens BEFORE authorized push of agent-generated commits to the author's branch; owner reviews that branch's PR to `main`. Codex is not a replacement for human review.

## 4. Antigravity output is untrusted until tested
Preferred: Codex writes a bounded task spec with acceptance criteria -> Antigravity edits only allowed files on a clean checkout -> Antigravity runs local checks -> Codex independently reviews/diffs and runs tests -> human checks -> authorized actor commits/pushes to named member branch -> PR -> CI -> owner merges. Never allow agents to hold unrestricted admin PATs or auto-approve their own changes.

## 5. Token exhaustion requires durable written checkpoints
Require `TASK.md`, `HANDOFF.md`, a diff summary, validation results, open risks, and the exact next safe step. A model's claim to 'remember' prior context is not continuity. Resume by rereading disk files, current Git status, tests and user decisions. Small vertical slices beat giant one-shot prompts. See `docs/agent_delivery_workflow.md`.

## 6. Science BEFORE ML
The supplied equations produce emissions from activity and factors. Train models to estimate unknown activity, usage, occupancy state, production demand or forecasts; implement deterministic, auditable formulas separately. Do not present synthetic data/model performance as field results; do not claim images measure methane. Audit-grade claims need real data, boundary definitions and appropriately sourced factors.

## 7. AC nominal 'horsepower' is not an electricity meter
Ask for HP category or cooling capacity, actual input watts/energy label/efficiency, inverter type, hours and utilization/temperature. If only nominal HP is available, give a broad provisional estimate and prominently label the assumption. Never assume marketing HP = measured kW of input electricity.

## 8. Different sectors have different boundaries
University demonstration and a factory demonstration share the platform but not their emissions assumptions. Core product: Scope 1 and 2 plus limited Scope 3 screening; advanced process, leak and agricultural modules are extensions. Explicit attribution/deduplication prevents summing submeter device estimates on top of the parent utility bill.

## 9. Vercel Hobby/private-org incompatibility
Vercel documentation says private GitHub organization repos cannot deploy through a Hobby team, and private commit authorship may require project/team membership. Select an eligible Vercel team plan, use a personal owner prototype project, or arrange authorized owner deployment. Vercel deployments/URLs can be visible without adequate protection; never place corporate data or secrets in the demo.

## 10. Hardware is OPTIONAL and cannot be a critical-path dependency
Default product runs on camera-assisted inventory, manual entry, bills/CSV and public-context APIs. Smart plugs, BMS, OPC-UA, meters, and edge sensors are opt-in adapters. A failed hardware prototype must not block the graduation MVP.

## Required owner decisions
- Repo owner GitHub handle/organization (not assumed to be Hassan), plan, paid protections, and team handles.
- Is owner identical to integration lead? If not, identify merge authority separately.
- Which university/factory can supply **consented, non-sensitive** pilot readings? Are they simulated otherwise?
- Prototype public/nonpublic access, and Vercel plan/commit authorship workflow.
- Reporting geography, interval, factor year, GWP version and included scopes.
- Pilot deadline, team hours, and whether actual energy meters are available.
Decision owner writes outcomes in `docs/decision-log.md`.
