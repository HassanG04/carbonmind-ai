"""Reproduce eight educational arithmetic checks; NOT an engine validation suite."""
from decimal import Decimal
from pathlib import Path
import hashlib
import math

ROOT = Path(__file__).resolve().parents[1]
REFERENCE = ROOT / 'reference/carbon_footprint_advanced_documentation.md'
EXPECTED_SHA256 = '627d1405b5a6c8370b28585d0f4bab5079c39f8762f2fe09fb2f7083691704e0'


def main() -> None:
    raw = REFERENCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() != EXPECTED_SHA256:
        raise SystemExit('Reference changed; review its code before executing examples.')
    # Only execute the exact, inspected original code block; never a downloaded file.
    code = raw.decode('utf-8').split('```python\n', 1)[1].split('```', 1)[0]
    reference = {'__name__': 'reference_audit'}
    exec(compile(code, 'original reference section 12', 'exec'), reference)
    precise_n2o = Decimal(100) * Decimal('44.01') / Decimal('28.01') * Decimal(273)
    cases = [
        ('illustrative electricity', 100 * .45, 45),
        ('constant electrical input', 120 * 10 / 1000, 1.2),
        ('illustrative equipment emissions', 120 * 10 / 1000 * .45, .54),
        ('illustrative diesel CO2 only', 5000 * 2.68, 13400),
        ('reference biogenic methane', reference['co2e']({'CH4_nonfossil': 2}), 54),
        ('reference coal conversion', reference['fuel_co2_kg'](1, 25.8, 94600), 2440.68),
        ('precise N2O-N conversion', 100 * 44.01 / 28.01 * 273, float(precise_n2o)),
        ('educational GWP-star', reference['gwp_star'](90, 100, 29.8), -447),
    ]
    failures = []
    for label, actual, expected in cases:
        passed = math.isclose(actual, expected, rel_tol=1e-10, abs_tol=1e-8)
        print(f'{"PASS" if passed else "FAIL"}: {label}: {actual:.12g}')
        if not passed:
            failures.append(label)
    print('Known limitation: negative fuel is accepted:',
          reference['fuel_co2_kg'](-1, 25.8, 94600))
    print('Known limitation: recovery >1 produces negative landfill emissions:',
          reference['landfill_ch4_by_year'](1000, .15, .185, years=1, recovered=2)[0])
    print('Arithmetic checks do not verify factors, reporting eligibility or production validation.')
    if failures:
        raise SystemExit(f'Failed examples: {failures}')


if __name__ == '__main__':
    main()
