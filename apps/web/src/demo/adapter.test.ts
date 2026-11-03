import { describe, it, expect, beforeEach } from 'vitest';
import { adapter } from './adapter';

describe('Demo Data Adapter & Session State (PROTO-001A-R1)', () => {
  beforeEach(() => {
    adapter.resetSession();
    adapter.setOrganization('org-atlas');
  });

  it('resetSession restores initial activity counts and notifies subscribers', () => {
    let notified = false;
    const unsubscribe = adapter.subscribe(() => {
      notified = true;
    });

    const initialCount = adapter.getActivities().length;

    // Add a valid activity
    const addRes = adapter.addActivity({
      siteId: 'site-atlas-main',
      sourceId: 'temporary-test-meter',
      start: '2026-10-28T08:00:00+02:00',
      end: '2026-10-28T16:00:00+02:00',
      quantityKwh: 50,
      representation: 'primary',
      evidenceState: 'USER_REPORTED',
      assumptions: [],
    });
    expect(addRes.error).toBeUndefined();
    expect(adapter.getActivities().length).toBe(initialCount + 1);

    // Reset session
    notified = false;
    adapter.resetSession();
    expect(notified).toBe(true);
    expect(adapter.getActivities().length).toBe(initialCount);

    unsubscribe();
  });

  it('rejects adding an activity for a site belonging to a different organization', () => {
    // Current org is org-atlas. site-northstar-hq belongs to org-northstar.
    const res = adapter.addActivity({
      siteId: 'site-northstar-hq',
      sourceId: 'cross-org-meter',
      start: '2026-10-28T08:00:00-04:00',
      end: '2026-10-28T16:00:00-04:00',
      quantityKwh: 50,
      representation: 'primary',
      evidenceState: 'USER_REPORTED',
      assumptions: [],
    });
    expect(res.error).toBeDefined();
    expect(res.error).toContain('does not belong to active organization');
  });

  it('rejects adding an asset for a site belonging to a different organization', () => {
    const res = adapter.addAsset({
      siteId: 'site-meridian-plant1',
      kind: 'Stamping Press',
      label: 'Foreign Press',
      area: 'Line 1',
      powerW: 10000,
      origin: 'manual',
      status: 'active',
    });
    expect(res.error).toBeDefined();
    expect(res.error).toContain('does not belong to active organization');
  });

  it('rejects offsetless timestamp dates in addActivity', () => {
    const res = adapter.addActivity({
      siteId: 'site-atlas-main',
      sourceId: 'meter-test',
      start: '2026-10-28T08:00:00', // Offsetless!
      end: '2026-10-28T16:00:00+02:00',
      quantityKwh: 50,
      representation: 'primary',
      evidenceState: 'USER_REPORTED',
      assumptions: [],
    });
    expect(res.error).toBeDefined();
    expect(res.error).toContain('missing an explicit timezone offset');
  });

  it('rejects duplicate/overlapping primary interval for the same meter source', () => {
    // First activity: 08:00 to 16:00
    const res1 = adapter.addActivity({
      siteId: 'site-atlas-main',
      sourceId: 'test-source-dedup',
      start: '2026-10-28T08:00:00+02:00',
      end: '2026-10-28T16:00:00+02:00',
      quantityKwh: 40,
      representation: 'primary',
      evidenceState: 'USER_REPORTED',
      assumptions: [],
    });
    expect(res1.error).toBeUndefined();

    // Overlapping activity for same source: 10:00 to 14:00
    const res2 = adapter.addActivity({
      siteId: 'site-atlas-main',
      sourceId: 'test-source-dedup',
      start: '2026-10-28T10:00:00+02:00',
      end: '2026-10-28T14:00:00+02:00',
      quantityKwh: 20,
      representation: 'primary',
      evidenceState: 'USER_REPORTED',
      assumptions: [],
    });
    expect(res2.error).toBeDefined();
    expect(res2.error).toContain('Conflicting overlapping primary interval');
  });

  it('provides distinct per-site totals and zero totals for empty site', () => {
    const mainTotals = adapter.getSiteTotals('site-atlas-main');
    const engTotals = adapter.getSiteTotals('site-atlas-eng');

    expect(mainTotals.primaryKwh).toBeGreaterThan(0);
    expect(mainTotals.primaryEmissionsKgCO2e).toBeGreaterThan(0);

    // Engineering complex has zero primary activities in initial fixture
    expect(engTotals.primaryKwh).toBe(0);
    expect(engTotals.primaryEmissionsKgCO2e).toBe(0);
    expect(engTotals.primaryCount).toBe(0);
    expect(engTotals.status).toBe('valid');
  });
});
