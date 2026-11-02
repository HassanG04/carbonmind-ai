"""Check project documentation and preserve the supplied reference. No dependencies."""
from pathlib import Path
import hashlib
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {'.git', 'node_modules', '.next', '.venv', '__pycache__', 'dist', 'out'}
REQUIRED = [
    'INDEX.md', 'README.md', 'AI.md', 'AGENTS.md', 'prototype.md', 'repo.md',
    'docs/architecture.md', 'docs/scientific_engine.md', 'docs/contracts.md',
    'docs/security.md', 'docs/kickstart-audit.md', 'docs/kickstart-backlog.md',
    'TASK.md', 'HANDOFF.md',
] + [f'members/{name}.md' for name in (
    'Hassan_Gebril', 'Karim_Ayman', 'Ahmed_Shazly', 'Adham_Behery',
    'Ziad_Kishk', 'Ziad_Zeiny')]


def check(root: Path) -> list[str]:
    errors = [f'Missing: {p}' for p in REQUIRED if not (root / p).is_file()]
    for path in root.rglob('*.md'):
        if EXCLUDED.intersection(path.relative_to(root).parts):
            continue
        for target in re.findall(r'\]\(([^)]+)\)', path.read_text(encoding='utf-8')):
            target = target.strip()
            if target.startswith(('https://', 'http://', '#', 'mailto:')):
                continue
            target = unquote(target.split('#', 1)[0].strip('<>'))
            if target and not (path.parent / target).exists():
                errors.append(f'Broken link: {path.relative_to(root)} -> {target}')
    reference = root / 'reference/carbon_footprint_advanced_documentation.md'
    expected = '627d1405b5a6c8370b28585d0f4bab5079c39f8762f2fe09fb2f7083691704e0'
    if not reference.is_file() or hashlib.sha256(reference.read_bytes()).hexdigest() != expected:
        errors.append('Original scientific reference missing or changed; preserve it and record errata separately.')
    return errors


if __name__ == '__main__':
    findings = check(ROOT)
    print('\n'.join(findings) if findings else 'PASS: required documents, local links, original reference integrity')
    sys.exit(bool(findings))
