# Security, Privacy and Enterprise Governance

## Threat boundaries
- **Multi-tenant isolation:** token identity is never supplied by frontend as authoritative tenant. Check `org_id/site_id` ownership on every read/write, including background jobs, object storage, inference outputs, vector retrieval, and exports.
- **Camera access:** explicit permission, visible state and upload confirmation; collect equipment not identifiable people. No covert surveillance, biometric identification or auto-upload. Prefer snapshots and redact incidental persons.
- **LLM prompt injection:** uploaded PDFs, receipts, camera OCR, web pages and RAG passages are *untrusted input*, not instructions. Tools allowed by server-side schema + authorization; no arbitrary SQL, shell, HTTP requests or secret echoing from Gemini.
- **Secret custody:** use platform secret manager/env in server context; NEVER put Gemini/Vercel/GitHub keys in frontend or repo. Provide `.env.example` names only; rotate exposed credentials; scan commits.
- **Least privilege:** GitHub contributors non-admin; environment deployment permission separate from code write; no PR auto-approval or agent secrets with admin privileges.
- **Auditability:** factor/version and input provenance, changes to emission records, model version and recommendation outcomes recorded.
- **Data retention:** policy for uploaded images, bills, receipts, meter telemetry and LLM prompts; automatic deletion, consent and enterprise contract requirements.

## Security tests
Tenant A tries to read/alter Tenant B's site, uploaded bills, image, cached inference, vector documents and exports -> 403/404 and audit log. Test forged tenant IDs, insecure object keys, path traversal, SSRF via file URLs, prompt injection in uploaded PDFs, cross-site WebSocket subscription, rate limits and large file uploads. Verify no secret appears in build JS bundle, CI logs or demo exports.

## External integrations
No real ERP, utility, industrial protocol, mail or cloud account accessed without documented permission and least-privilege credentials. Hardware control commands are DISABLED by default. Never connect exploratory AI directly to industrial actuators, safety controls, fire protection or medical/critical ventilation.

## Governance
Enterprise reporting should be framed as an estimated inventory, not independently audited or regulatory-certified. Review GHG Protocol/ISO/country requirements before using marketing terms like 'compliant'. Ask organization approval before hosting real factory or university datasets in public-facing SaaS.
