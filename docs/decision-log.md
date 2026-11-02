# Architecture Decision Records (ADR) — Living Log
Every significant change uses:
`ADR-ID`, `date`, `owner`, `status` (`proposed|accepted|superseded`), `context`, `options`, `decision`, `scientific/security implications`, `migration actions`.

## Proposed ADR-001: Pilot sector
University/campus first for full workflow; factory as secondary scenario because production normalization and process emissions add complexity. **Await owner approval.**

## Proposed ADR-002: Git governance
Private GitHub organization on eligible plan with enforced owner-only main and six restricted member staging branches. If paid controls unavailable, label as unenforced collaboration policy, not a security guarantee. **Await owner/plan confirmation.**

## Proposed ADR-003: reporting baseline
Use CO2e GWP-100 with explicit version, defined org boundary, Scope 1/2 plus limited Scope 3 category demo, country/year factors with provenance. **Await geography/factor availability confirmation.**

## Proposed ADR-004: hardware
Optional adapter only; do not require it for project acceptance. **Await owner confirmation (default recommended).**

## Proposed ADR-005: prototype separation
Keep Vercel frontend prototype as throwaway experience; do not use mock values as actual enterprise inventory. **Await approval.**

## ADR-006: Kickstart source and scope resolution
- Date: 2026-11-02. Owner: Hassan (user-designated). Status: accepted for kickstart.
- Context/options: equations.md is absent; either require a separate file or use existing scientific guidance. User explicitly chose docs/scientific_engine.md plus the original reference.
- Decision: use those existing sources; preserve reference bytes and document errata in kickstart-audit.md. No duplicate equation document or silent factor changes.
- Scope clarification: user's explicit university-first electricity milestone, optional hardware and temporary synthetic prototype resolve ADR-001/004/005 for this kickstart; production deployment remains unauthorized.
- Implications: audit findings must gate production science; no regulatory validity or trained accuracy is implied. No data migration exists.

## ADR-007: Owner and branch naming resolution
- Date: 2026-11-02. Owner: Hassan. Status: accepted for local preparation; remote governance remains proposed.
- Context/options: legacy mixed-case underscore names conflict with the user's explicit lowercase hyphenated names. User identified Hassan as owner; authenticated connector profile is HassanG04. Treat that as intended personal account unless owner selects an organization.
- Decision: latest seven requested names govern, with canonical mapping in repo.md. Initialize locally on team/hassan-gebril without committing to main. Owner creates main and other member refs from a reviewed initial commit.
- Implications: no remote creation/protection claim. Account plan, collaborator handles and non-owner permission tests still block completion of ADR-002. No force push or remote overwrite.

## ADR-008: Preserve module locations and stage the prototype
- Date: 2026-11-02. Owner: Hassan as integrator; prepared by Codex. Status: proposed implementation clarification.
- Context/options: proposed new folder names duplicate existing services/api and packages/science. Existing architecture already allows modular deployment and an in-API assistant.
- Decision proposal: preserve existing paths, defer infrastructure until needed, use apps/web for temporary local-fixture prototype. TASK.md defines demo-local adapters; production contracts remain unchanged pending CONTRACT-001 review.
- Implications: no migration/backfill because no implementation/data exists. Production provenance states, factor methods and reviewer assignments remain open. Independent science/security review is still required for shared contracts.
