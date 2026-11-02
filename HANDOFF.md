# HANDOFF — kickstart foundations

Date: 2026-11-02. Task: KICKSTART-001 documentation audit/local setup and PROTO-001 prompt preparation. Owner: Hassan, connected GitHub account HassanG04; plan unverified. Branch: team/hassan-gebril (unborn). Base/working commit: none. Remote: none. No push/PR/merge/deployment.

## User decisions
Use docs/scientific_engine.md and reference/carbon_footprint_advanced_documentation.md in place of missing equations.md. Hassan is designated owner. Latest lowercase/hyphenated branch names govern. University electricity first, hardware optional, temporary synthetic frontend; no training or production build in this execution.

## Work prepared
Discovery/scientific/architecture/ownership/research audit in docs/kickstart-audit.md; prioritized dependencies in docs/kickstart-backlog.md; full staged Antigravity packet in TASK.md, linked from prompts/codex_to_antigravity.md. Local Git initialized without writing main. Reusable docs/reference-integrity CI command added, with read-only workflow permissions. Owner bootstrap procedure and ADR updates record current choices and remaining gaps. No product/science implementation or production schema was created.

## Files and preservation
New: TASK.md, HANDOFF.md, docs/kickstart-audit.md, docs/kickstart-backlog.md, scripts/check_docs.py, scripts/audit_reference.py. Modified: README.md, repo.md, docs/decision-log.md, docs/task_board.md, prompts/codex_to_antigravity.md, .github/workflows/docs-check.yml. Archival MANIFEST.md and original reference are unchanged. Original charters/contracts/architecture remain intact; repo.md supplies the authoritative branch mapping.

## Validation
Initial 42 manifest entries matched; original CI check passed. `python scripts/check_docs.py` passed after edits. Four checker probes passed: valid tree, missing TASK.md, broken local link and modified reference (negative cases injected through in-memory mocks; no source mutation). Manifest comparison found exactly the six intended existing-file changes and 36 unchanged originals. `git check-ignore -- .env .env.local .env.example members/Hassan_Gebril.AI.local.md node_modules/example data/raw/example.csv` confirmed sample local secrets/data/build artifacts ignored and .env.example retained. `git diff --check` returned no output, but there is no tracked baseline, so this is not evidence of reviewing untracked file contents. Files were inspected directly.

Eight arithmetic checks were rerun successfully; the reusable reproduction command is `python scripts/audit_reference.py`. It executes only the hash-verified, inspected reference code and reports its known invalid-input behavior explicitly. It is not a production scientific suite. No app/build/ML/tenant/hosted CI/protection tests have run.

## Security and unresolved decisions
No secrets/customer datasets introduced. .env.example remains placeholders. No actual GitHub protections, auth, tenant isolation or secret-scanner evidence. Connected repository search found no accessible match, not proof of absence. Connector cannot create a repo or inspect billing/protection; gh CLI absent. Plan, team handles, independent science reviewer, geography/year/factors and production provenance schema remain unresolved.

## Next safe action
Owner reviews this foundation diff/file set, runs `python scripts/check_docs.py`, then follows repo.md owner bootstrap steps to establish a baseline commit. Antigravity reads TASK.md and starts Stage A only from the reviewed clean baseline on team/hassan-gebril. Codex must inspect actual diff and rerun tests after each stage; independent human approval is required before owner merges.

## Recovery
Read AGENTS.md, AI.md, docs/decision-log.md, this file and TASK.md. Check `git status --short --branch`, `git diff`, `git diff --cached`, and untracked file contents; until a first commit exists, `git log` has no history and `git diff` alone does not show untracked work. Never claim a SHA, remote, CI run or deployment from this handoff without verification.
