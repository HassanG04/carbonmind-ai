# Codex Brief — Create Private GitHub Repository & Enforce Ownership Workflow

**Current override (2026-11-03):** Hassan is the user-designated owner; the connected account is `HassanG04`, with plan unverified. The private remote `https://github.com/HassanG04/carbonmind-ai.git` now exists and contains the reviewed baseline branches. The latest user-requested lowercase/hyphenated branches below supersede older mixed-case examples throughout this pack. No branch protection or collaborator restriction is configured yet.
**Scope:** owner-authorized setup only. **IMPORTANT:** this Markdown is an instruction for future execution, NOT proof the repository was created. Require explicit GitHub authentication and confirm owner/organization and plan before mutations. Never print auth secrets.

## Name and tree
Suggested repository `carbonmind-ai` (owner may rename). Private by default; default branch `main`; exactly six persistent member branches, created from same initialized `main` commit:
- `team/Ahmed_Shazly`
- `team/Karim_Ayman`
- `team/Hassan_Gebril`
- `team/Adham_Behery`
- `team/Ziad_Kishk`
- `team/Ziad_Zeiny`
Create `README.md`, `.gitignore`, `.env.example` (placeholders ONLY), `AI.md`, `AGENTS.md`, `members/`, `docs/`, `prompts/`, PR template, CI starter and a task board; preserve original reference document under `reference/` (its claims are not automatically verified).

## Owner setup (GitHub CLI example, not auto-execute blindly)
```bash
# OWNER: after `gh auth login`, `gh auth status` and owner/plan confirmation
mkdir carbonmind-ai && cd carbonmind-ai
git init -b main
# copy approved pack files, create README.md/.gitignore/.env.example
git add . && git commit -m 'chore: initialize CarbonMind AI project charter'
gh repo create OWNER_OR_ORG/carbonmind-ai --private --source=. --remote=origin --push
for name in Ahmed_Shazly Karim_Ayman Hassan_Gebril Adham_Behery Ziad_Kishk Ziad_Zeiny; do
  git switch main
  git switch -c "team/$name"
  git push --set-upstream origin "team/$name"
done
git switch main
```
Before running, check whether repository or branches exist and use idempotent inspection rather than overwriting. Owner explicitly confirms every external action. `.env.example` must not contain keys, credentials, personal emails, tokens, or real client data.

## Security controls & realism
**Preferred enforceable configuration:** GitHub organization with appropriate paid plan (e.g., GitHub Team), owner-designated maintainers, and branch restrictions for private repositories. For `main`: require PR, unique named CI status checks, 1+ independent approving review(s), conversation resolution, block force push/deletion, restrict pushes/updates to owner/authorized integration maintainer. Verify merges are possible only for owner; don't provide a general bypass to other writers. Optional CODEOWNERS enhances review requirements but DOES NOT itself restrict merge actors. Ensure branch restrictions are compatible with PR merges in that plan.

For each `team/<member>` branch, restrict pushes to the named contributor (plus org owner/admin), where supported. GitHub branch controls are NOT identical on personal vs org repos or Free vs paid. The GitHub Free plan for **private** repos must not be advertised as enforcing protected-main/branch controls; use social review policy or move to supported paid/org setup. If any stated ACL is not enforceable, record in decision log and stop before inviting collaborators who require hard guarantees.

## Permissions verification (non-negotiable)
1. Owner authenticates, sets private visibility, registers exactly six GitHub usernames (names in documents are not accounts).
2. Owner provisions least privilege: contributors `write` only as necessary, no admin; avoid broad secret scopes.
3. From a non-owner test identity verify cannot push to `main`, cannot merge any open PR to `main`, cannot push another member's branch, cannot delete/force-push protected branches; verify can push only own branch, open PR, view CI. If any fails, strict permission requirement is **unmet**. Screenshots/config export + timestamp belong in private admin notes.
4. Owner tests eligible merge after required checks and reviews. All status checks must be installed BEFORE marking them required.
5. Never allow an AI token to hold branch-admin permissions.

## Branch mechanics
- No code goes directly to main except initial owner-approved bootstrap and exceptional hotfixes through documented review.
- Each member works in their named staging branch. Prefer small task-focused commits and PRs. Feature branches can be local, but all remote feature integration follows owner policy.
- Codex inspects diff, runs tests and assesses security/science. Codex sends feedback; only after approval does contributor push commits to THEIR branch (for Hassan tasks, `team/Hassan_Gebril`).
- Member opens PR from their branch to `main`; owner merges after CI, independent review, risk sign-off and conflicts resolved. Rebase/sync team branch afterward; do not merge another member's unapproved work implicitly.
- For shared files, discuss API/contracts via ADR/PR before implementation. CODEOWNERS.sample must be adapted to actual GitHub handles if used.

## Repo README contents
Project goals and non-goals, scientific provenance, product personas, system boundaries, demo-vs-real banner, architecture diagram, local dev commands, env placeholder names, team/branches, testing, security disclosures, methodology limitations, contribution workflow and issue/PR convention. Never claim the application is audit certified.

## Required CI checks (suggested unique names)
`frontend-lint-build`, `backend-tests`, `science-fixtures`, `schema-contracts`, `security-static`, `secrets-scan`. Only require checks that exist and reliably run. See `docs/validation.md`.

## References to verify at setup date
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- https://vercel.com/docs/git

## Current branch mapping
| Member / legacy spelling | Canonical requested branch |
|---|---|
| Ahmed_Shazly | team/ahmed-shazly |
| Karim_Ayman | team/karim-ayman |
| Hassan_Gebril | team/hassan-gebril |
| Adham_Behery | team/adham-behery |
| Ziad_Kishk | team/ziad-kishk |
| Ziad_Zeiny | team/ziad-zeiny |

Main remains `main`. Local Git is initialized on `team/hassan-gebril` with reviewed baseline commit `ef7e1145f3f7b94ad650907a97fe959f2629aa70`; local refs for `main` and all six canonical member branches point to that baseline. Remote `origin` points to the private `HassanG04/carbonmind-ai` repository. Legacy charter branch strings are superseded by this table. All members must use this table until a coordinated charter refresh.

## Concrete owner completion procedure (PowerShell, NOT executed)
Prerequisites: Hassan reviews the file changes and scientific limitations; confirms intended account/repository name, GitHub plan and five other verified handles. Install GitHub CLI from its official distribution if needed, authenticate interactively using `gh auth login`, then `gh auth status` without printing tokens. Check GitHub account billing/settings for actual plan; the connected profile does not expose it. Do not infer an organization plan from personal Pro eligibility. Existing remote/repository means inspect and stop this bootstrap procedure rather than overwrite it.

Owner reviews from this project directory:
```powershell
git status --short --branch
git remote -v
python scripts/check_docs.py
```
Expected: current branch team/hassan-gebril, reviewed baseline plus explicitly reviewed working-tree changes, remote `origin` pointing to the intended private repository; documentation check passes. Do not commit secrets or unreviewed files. After human review, owner stages explicitly:
```powershell
git add -- .gitignore .env.example AGENTS.md AI.md INDEX.md README.md MANIFEST.md prototype.md repo.md TASK.md HANDOFF.md .github docs members prompts reference scripts
git diff --cached --check
git diff --cached --stat
git diff --cached
```
Inspect all staged files and run an approved secret scanner before publishing; the docs check is not a secret scanner. Stop on unexpected content. Owner then creates the baseline:
```powershell
git commit -m "chore: establish CarbonMind reviewed planning foundation"
git branch main
git branch team/ahmed-shazly
git branch team/karim-ayman
git branch team/adham-behery
git branch team/ziad-kishk
git branch team/ziad-zeiny
git branch -v
```
These commands intentionally fail rather than overwrite existing refs. All seven refs should point to the reviewed initial commit; team/hassan-gebril already exists after commit. Record the actual SHA in the next handoff; do not fabricate it here.

After confirming no existing project remote/repository and deciding the account/plan limitations, owner creates the private repository. This personal-account example does not promise strict branch restrictions. If an eligible organization is chosen, revise the target explicitly first.
```powershell
gh repo create HassanG04/carbonmind-ai --private
gh repo view HassanG04/carbonmind-ai --json nameWithOwner,visibility,url
```
Verify visibility is PRIVATE and the URL is the intended project. If creation fails, stop; do not continue or reuse an unrelated repository. With origin still absent:
```powershell
git remote add origin https://github.com/HassanG04/carbonmind-ai.git
git push -u origin main
gh repo edit HassanG04/carbonmind-ai --default-branch main
git push -u origin team/ahmed-shazly team/karim-ayman team/hassan-gebril team/adham-behery team/ziad-kishk team/ziad-zeiny
git ls-remote --heads origin
```
No force push, deletion, collaborator invitation or automatic merge. Verify the Actions run first. Only the existing job `docs-contract-check` can become a required status after its actual emitted context is observed; the other suggested checks do not yet exist. Add actual GitHub handles to a real CODEOWNERS file only after confirmation; its sample is not active enforcement.

Owner settings procedure: require PRs, independent approval, stale-review dismissal, conversation resolution and the observed CI check; block force pushes/deletions. Configure owner-only main updates and per-member branch pushes only where the actual account/plan supports them, with no broad bypass. Verify non-owner push, merge, other-member update and deletion attempts fail while own-branch push/PR works. A rules screenshot alone is not the negative test. If strict controls are unavailable, record the limitation and choose an eligible organization/plan before offering hard isolation guarantees. Account administrators retain governance authority; no AI token should hold it.

GitHub creation, billing/protection inspection and permission testing were not possible through the available connector; CLI was absent during kickstart. These are remaining owner steps, not reported completed work.
