# Controlled Agent Delivery Workflow — Codex Supervises Antigravity

## Lifecycle for each ticket
1. **Member requests task** in own authorized repo branch. Confirm clean working tree and latest `main` sync. Write `TASK.md` or issue with measurable acceptance and precise change boundary.
2. **Codex analyzes** technical/science/security requirements, reads targeted sources, resolves contracts, drafts detailed Antigravity handoff from `prompts/codex_to_antigravity.md`. Include negative cases, fixture examples, dependencies, in/out-of-scope, allowable file paths and full command list.
3. **Antigravity executes** small bounded change, writes tests and provides evidence. No remote push; no secrets. It must stop when file allowlist or dependencies need changes and send a request rather than guessing.
4. **Codex independently reviews** actual modified files and tests; may request revisions. Security and scientific reviewers are human gatekeepers for high-risk changes.
5. **Authorized contributor stages/pushes** approved changes to their own branch only after diff verified. For Hassan tasks that is `team/Hassan_Gebril` (not a universal integration branch).
6. **PR -> CI -> owner merge** after independent approvals, no missing required checks, and branch permission verification. Author cannot self-approve to bypass policy.
7. Update ADR, docs and issue status; sync member branch with main.

## Handoff artifact (`HANDOFF.md`)
```
Ticket / branch / base commit / working commit (if created)
Goal and non-goals
Files touched + diff summary
Commands run and full results (pass/fail/not run)
Contracts/schema/migration changes
Source citations for science calculations
Security/privacy concerns
Assumptions and risks
Remaining blockers
Next command/task, with exact repo path
```
A reviewer must validate any claimed test by running it or inspecting CI evidence. Agent-generated explanations alone aren't proof.

## Token exhaustion handling
Work in 1-3 commits or <~5 independently checkable files per task (adjust for nature). Before context limit, write/update `HANDOFF.md`, `TASK.md` and `docs/decision-log.md`; do not paste giant raw logs. New session prompt: `prompts/resume_from_handoff.md`. If any required file missing, request it. No claim of automatic context retention.

## Branch and review safeguards
Do not let Antigravity push first and Codex review after as default for untrusted changes. Local change -> review -> push is stronger. If tool constraints require a remote task branch, use temporary nonprotected sandbox only with explicit authorization, never `main`. Codex cannot guarantee owner-only merge through instruction text: GitHub enforces or it does not.
