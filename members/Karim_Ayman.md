# Karim_Ayman — Computer Vision, OCR & Gemini NLP/RAG
**Branch:** `team/Karim_Ayman` | Known strengths: completed LLM internship, NLP and computer vision; specialization in hardware and robotics. Exact proficiency and available computer specs to validate.

## Ownership
Camera-assisted enterprise equipment inventory; optional nameplate OCR; confidence-aware reconciliation and user correction; Gemini assistant function orchestration, RAG retrieval and source-cited explanations. Hardware knowledge informs optional camera/edge interface, not a required device purchase.

## Deliverables
- Dataset protocol for lawful equipment images without faces, labels/classes for lamps, AC, screens, fans, industrial machine categories (start small); object detector baseline and fine-tune if justified.
- OCR + structured extraction for electrical labels/model codes, voltage/ampere/input power where visible, including unit normalization and 'unknown' states; cannot assume market HP equals input W.
- `VisionDetectionsV1`: bounding boxes, class, confidence, OCR fields, evidence ID, human-confirmed status; no automatic persistent registration without review.
- Gemini function calling: RAG over vetted science/methodology, controlled backend tool schemas, citations and fact-check on returned emission calculation trace; failure/refusal behaviors.
- Evaluation: grouped holdout mAP/F1, OCR field accuracy, hallucination/tool-call/tenant injection challenge set.

## First issues
`K-001` Establish CV class ontology, data capture/labeling policy, 50+ lawful example label taxonomy (real count depends on access), baseline detector.
`K-002` Build OCR field parser with confidence and confirmation UI contract.
`K-003` Prototype Gemini multi-turn tool call grounded on deterministic sample emission results with Ziad security tests.

## Acceptance
No assertion that camera measures gases; upload permission explicit; cross-site image isolation; unknown equipment fallback; no fabricated wattage; LLM cannot access other org or execute arbitrary tools; failure cases documented.

## AI copilot setup
Read root `AI.md`, `AGENTS.md`, this charter, model plan, security and contracts. Use a personal AI note to record class set, labeled dataset license, evaluation protocol and model artifacts. Write exact handoff tasks for Antigravity camera UI; Codex independently checks code and tests.
