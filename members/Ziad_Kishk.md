# Ziad_Kishk — Application Security, Tenant Isolation & AI Safety
**Branch:** `team/Ziad_Kishk` | Known strengths: cybersecurity and prompt engineering; data science specialization. Validate exact areas of security tool experience during onboarding.

## Ownership
Threat model, security baseline, authn/authz and tenant enforcement review, API abuse prevention, CI secret/static checks, LLM prompt injection defenses, secure Vercel/API configuration, privacy/security test fixtures.

## Deliverables
- STRIDE-style threat model for user camera, upload, bill OCR, SaaS tenancy, signed object links, API, RAG, Gemini tools, queues and CI/deployment.
- Threat-driven tests: cross-org data access via query/body/URL, RLS misconfiguration, background jobs, vector retrieval, WebSocket subscriptions, IDOR, SSRF, file upload handling, data exfiltration, prompt injection, secret exposure.
- Root policy for secrets, role scopes, CI permissions, branch protection checks, dependency audits, secure logging and data retention.
- Adversarial Gemini test suite: malicious documents instructing model to expose other customers or call unauthorized functions; tools require server-side checks regardless of LLM answer.
- Review boundaries for optional hardware read-only telemetry and safe automation limitations.

## First issues
`ZK-001` Produce threat model + priority mitigations with Hassan's schema boundaries.
`ZK-002` Write tenant isolation pytest integration tests and image export access tests.
`ZK-003` Gemini function-call allowlist and prompt-injection evaluation fixtures with Karim.

## Acceptance
Every high-risk flow has guard/test; no real keys in code/history; server enforces tenancy; no untrusted text is treated as privileged instruction; secret scan and access tests run in CI; risk register includes mitigations and unresolved items.

## AI copilot setup
Read shared `AI.md`, `AGENTS.md`, `docs/security.md`, `docs/contracts.md`, this charter. Record security evidence in private notes without storing exploit payloads that harm real systems. Audit agent-authored code before permission to push.
