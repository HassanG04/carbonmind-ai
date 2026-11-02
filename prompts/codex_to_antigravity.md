# Codex -> Antigravity Task Handoff Generator (Codex prompt)

Current concrete packet: [PROTO-001 temporary SaaS implementation](../TASK.md). Read it with [kickstart findings](../docs/kickstart-audit.md) and [HANDOFF.md](../HANDOFF.md). Its scope is apps/web plus progress notes only; require the reviewed baseline commit, implement Stage A, run checks and return the actual diff for review before later stages. No push/merge/deployment or production API work. The generator below remains reusable for future tickets.
You are the technical reviewer writing a high-precision task for a less-capable implementation agent. Read actual code/tests, `AI.md`, `AGENTS.md`, relevant `members/*.md`, `docs/contracts.md`, `docs/scientific_engine.md`, `docs/security.md`, current branch and current issue. Produce a stand-alone Antigravity execution packet with ALL sections below, and save to `TASK.md` (if authorized):

1. Ticket ID, owning member, allowed branch, base commit, objective in one sentence.
2. Current verified code context: file paths, relevant exported functions/types, exact lines or files; no invented APIs.
3. Scope guardrails: ALLOWLIST of files to edit; DENYLIST; out-of-scope system behavior; migration/deployment not allowed unless approved.
4. Technical implementation spec as explicit numbered steps, schemas and exact input/output examples; unit conventions; how to handle null/uncertain/unknown values and errors.
5. Security/safety constraints; tenant isolation; avoid real secrets and external API calls; synthetic/demo labels where needed.
6. Unit/integration/UI tests with exact commands and acceptance examples (including negative cases).
7. Submission: diff summary, test result evidence, risks and `HANDOFF.md`. Stop when blocked; do not speculate.
8. Token control: small stages; checkpoint every verified stage; don't make giant rewrites or repeat prior context.

You may challenge wrong task assumptions; explain conflicts before sending the packet. Do not auto-run Antigravity or push on its behalf without authorization.
