import { describe, it, expect } from 'vitest';
import {
  calculateDemoEnergy,
  calculateDemoEmissions,
  aggregateActivities,
  validateIsoTimestampWithOffset,
  checkIntervalsOverlap,
  deriveAggregateProvenance,
  calculateDemoForecast,
  runDemoScenarioSimulation,
  sanitizeCsvCell,
  generateSafeCsv,
} from './math';
import { Activity, DEMO_FACTOR, DemoFactor } from '@/lib/contracts';

describe('Demo Scientific Calculations & Validation (PROTO-001A-R1)', () => {
  describe('Timestamp Validation with Explicit Timezone Offset', () => {
    it('accepts ISO timestamp with explicit positive offset (+02:00)', () => {
      const res = validateIsoTimestampWithOffset('2026-10-27T08:00:00+02:00');
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });

    it('accepts ISO timestamp with UTC Z offset (Z)', () => {
      const res = validateIsoTimestampWithOffset('2026-10-27T08:00:00Z');
      expect(res.valid).toBe(true);
    });

    it('accepts ISO timestamp with negative offset (-04:00)', () => {
      const res = validateIsoTimestampWithOffset('2026-10-27T08:00:00-04:00');
      expect(res.valid).toBe(true);
    });

    it('rejects offsetless ISO timestamps', () => {
      const res = validateIsoTimestampWithOffset('2026-10-27T08:00:00');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('missing an explicit timezone offset');
    });

    it('rejects invalid or non-date strings', () => {
      expect(validateIsoTimestampWithOffset('invalid-date').valid).toBe(false);
      expect(validateIsoTimestampWithOffset('2026-99-99T99:99:99Z').valid).toBe(false);
      expect(validateIsoTimestampWithOffset('2026-02-30T00:00:00Z').valid).toBe(false);
    });
  });

  describe('Interval Overlap Logic', () => {
    it('detects overlapping intervals', () => {
      // Overlapping: 08:00-16:00 and 10:00-18:00
      expect(
        checkIntervalsOverlap(
          '2026-10-27T08:00:00+02:00',
          '2026-10-27T16:00:00+02:00',
          '2026-10-27T10:00:00+02:00',
          '2026-10-27T18:00:00+02:00'
        )
      ).toBe(true);
    });

    it('accepts adjacent non-overlapping intervals (endA === startB)', () => {
      // Adjacent: 08:00-12:00 and 12:00-16:00
      expect(
        checkIntervalsOverlap(
          '2026-10-27T08:00:00+02:00',
          '2026-10-27T12:00:00+02:00',
          '2026-10-27T12:00:00+02:00',
          '2026-10-27T16:00:00+02:00'
        )
      ).toBe(false);
    });

    it('accepts disjoint intervals', () => {
      // Disjoint: 08:00-10:00 and 14:00-16:00
      expect(
        checkIntervalsOverlap(
          '2026-10-27T08:00:00+02:00',
          '2026-10-27T10:00:00+02:00',
          '2026-10-27T14:00:00+02:00',
          '2026-10-27T16:00:00+02:00'
        )
      ).toBe(false);
    });
  });

  describe('calculateDemoEnergy (P * t / 1000)', () => {
    it('calculates 120 W for 10 h = 1.2 kWh (golden fixture)', () => {
      const res = calculateDemoEnergy(120, 10);
      expect(res.status).toBe('calculated');
      expect(res.energyKwh).toBe(1.2);
    });

    it('accepts operating hours <= interval duration (8h inside 8h interval)', () => {
      const res = calculateDemoEnergy(100, 8, 8);
      expect(res.status).toBe('calculated');
      expect(res.energyKwh).toBe(0.8);
    });

    it('rejects operating hours exceeding interval duration (10h inside 8h interval)', () => {
      const res = calculateDemoEnergy(100, 10, 8);
      expect(res.status).toBe('not_calculated');
      expect(res.energyKwh).toBeNull();
      expect(res.reason).toContain('exceed selected interval duration');
    });

    it('guards against finite overflow (never returns calculated: Infinity)', () => {
      const res = calculateDemoEnergy(1e308, 24);
      expect(res.status).toBe('not_calculated');
      expect(res.energyKwh).toBeNull();
      expect(res.reason).toContain('overflow');
    });

    it('returns zero kWh when electrical watts or operating hours are zero', () => {
      const res1 = calculateDemoEnergy(0, 10);
      expect(res1.status).toBe('calculated');
      expect(res1.energyKwh).toBe(0);

      const res2 = calculateDemoEnergy(500, 0);
      expect(res2.status).toBe('calculated');
      expect(res2.energyKwh).toBe(0);
    });

    it('returns not_calculated with null when input is missing or null/undefined', () => {
      expect(calculateDemoEnergy(null, 10).status).toBe('not_calculated');
      expect(calculateDemoEnergy(120, null).status).toBe('not_calculated');
      expect(calculateDemoEnergy(undefined, undefined).status).toBe('not_calculated');
    });

    it('rejects negative numbers, NaN, and Infinity', () => {
      expect(calculateDemoEnergy(-120, 10).status).toBe('not_calculated');
      expect(calculateDemoEnergy(120, -10).status).toBe('not_calculated');
      expect(calculateDemoEnergy(NaN, 10).status).toBe('not_calculated');
      expect(calculateDemoEnergy(120, Infinity).status).toBe('not_calculated');
    });
  });

  describe('calculateDemoEmissions (kWh * 0.45 kgCO2e/kWh)', () => {
    it('calculates 100 kWh -> 45 kgCO2e', () => {
      const res = calculateDemoEmissions(100, DEMO_FACTOR);
      expect(res.status).toBe('calculated');
      expect(res.kgCO2e).toBe(45);
      expect(res.energyKwh).toBe(100);
      expect(res.isSynthetic).toBe(true);
    });

    it('calculates 1.2 kWh -> 0.54 kgCO2e (golden fixture)', () => {
      const res = calculateDemoEmissions(1.2, DEMO_FACTOR);
      expect(res.status).toBe('calculated');
      expect(res.kgCO2e).toBe(0.54);
    });

    it('guards against finite overflow during emissions calculation', () => {
      const highFactor = { ...DEMO_FACTOR, value: 10 } as unknown as DemoFactor;
      const res = calculateDemoEmissions(1e308, highFactor);
      expect(res.status).toBe('not_calculated');
      expect(res.kgCO2e).toBeNull();
      expect(res.reason).toContain('overflow');
    });

    it('guards against overflow during emissions rounding', () => {
      const res = calculateDemoEmissions(1e308, DEMO_FACTOR);
      expect(res.status).toBe('not_calculated');
      expect(res.kgCO2e).toBeNull();
      expect(res.reason).toContain('Rounded emissions');
    });

    it('returns zero emissions for zero kWh', () => {
      const res = calculateDemoEmissions(0, DEMO_FACTOR);
      expect(res.status).toBe('calculated');
      expect(res.kgCO2e).toBe(0);
    });

    it('returns not_calculated when kWh is missing or null', () => {
      expect(calculateDemoEmissions(null, DEMO_FACTOR).status).toBe('not_calculated');
      expect(calculateDemoEmissions(100, null as unknown as DemoFactor).status).toBe('not_calculated');
    });

    it('rejects negative kWh and non-finite numbers', () => {
      expect(calculateDemoEmissions(-10, DEMO_FACTOR).status).toBe('not_calculated');
      expect(calculateDemoEmissions(NaN, DEMO_FACTOR).status).toBe('not_calculated');
    });
  });

  describe('aggregateActivities (Anti-double-counting, Overlap Rejection, and Attribution Hierarchy)', () => {
    it('preserves the 100 kWh parent plus 30 kWh attributed child fixture = 100 kWh, not 130', () => {
      const activities: Activity[] = [
        {
          id: 'parent-1',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main-01',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 100,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'USER_REPORTED',
          assumptions: [],
        },
        {
          id: 'child-1',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'submeter-01',
          start: '2026-10-01T09:00:00+02:00',
          end: '2026-10-01T15:00:00+02:00',
          quantityKwh: 30,
          representation: 'attribution',
          parentActivityId: 'parent-1',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MODEL_ESTIMATED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('valid');
      expect(res.primaryKwh).toBe(100);
      expect(res.attributionKwh).toBe(30);
      expect(res.primaryEmissionsKgCO2e).toBe(45);
      expect(res.primaryCount).toBe(1);
      expect(res.attributionCount).toBe(1);
    });

    it('rejects conflicting overlapping primary records for the same source/site even with different activity IDs', () => {
      const activities: Activity[] = [
        {
          id: 'id-alpha',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main-intake',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 100,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MEASURED',
          assumptions: [],
        },
        {
          id: 'id-beta',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main-intake', // Same source, overlapping interval
          start: '2026-10-01T10:00:00+02:00',
          end: '2026-10-01T14:00:00+02:00',
          quantityKwh: 50,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MEASURED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('invalid');
      expect(res.error).toContain('Conflicting overlapping primary interval detected');
    });

    it('accepts adjacent non-overlapping primary intervals for the same source (endA === startB)', () => {
      const activities: Activity[] = [
        {
          id: 'interval-morning',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main-intake',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T12:00:00+02:00',
          quantityKwh: 50,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MEASURED',
          assumptions: [],
        },
        {
          id: 'interval-afternoon',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main-intake',
          start: '2026-10-01T12:00:00+02:00', // Adjacent
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 60,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MEASURED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('valid');
      expect(res.primaryKwh).toBe(110);
    });

    it('rejects orphan attribution activities (missing parentActivityId or parent does not exist)', () => {
      const activities: Activity[] = [
        {
          id: 'child-orphan',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'submeter-orphan',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 20,
          representation: 'attribution',
          parentActivityId: 'non-existent-parent',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MODEL_ESTIMATED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('invalid');
      expect(res.error).toContain('references non-existent parent');
    });

    it('rejects self-referencing attribution activities', () => {
      const activities: Activity[] = [
        {
          id: 'child-self',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'submeter-self',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 20,
          representation: 'attribution',
          parentActivityId: 'child-self',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MODEL_ESTIMATED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('invalid');
      expect(res.error).toContain('cannot reference itself as parent');
    });

    it('rejects cross-site attribution activities', () => {
      const activities: Activity[] = [
        {
          id: 'parent-main',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 100,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MEASURED',
          assumptions: [],
        },
        {
          id: 'child-eng',
          orgId: 'org-atlas',
          siteId: 'site-atlas-eng', // Different site
          sourceId: 'submeter-eng',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 30,
          representation: 'attribution',
          parentActivityId: 'parent-main',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MODEL_ESTIMATED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('invalid');
      expect(res.error).toContain('Cross-site attribution is forbidden');
    });

    it('rejects attribution whose interval is not contained within parent interval', () => {
      const activities: Activity[] = [
        {
          id: 'parent-int',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-main',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T12:00:00+02:00', // 4h parent
          quantityKwh: 100,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MEASURED',
          assumptions: [],
        },
        {
          id: 'child-exceeds',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'submeter-1',
          start: '2026-10-01T08:00:00+02:00',
          end: '2026-10-01T16:00:00+02:00', // 8h child exceeds parent!
          quantityKwh: 30,
          representation: 'attribution',
          parentActivityId: 'parent-int',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'MODEL_ESTIMATED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('invalid');
      expect(res.error).toContain('not fully contained within parent interval');
    });

    it('rejects offsetless timestamps during aggregation', () => {
      const activities: Activity[] = [
        {
          id: 'act-no-offset',
          orgId: 'org-atlas',
          siteId: 'site-atlas-main',
          sourceId: 'meter-1',
          start: '2026-10-01T08:00:00', // Missing offset!
          end: '2026-10-01T16:00:00+02:00',
          quantityKwh: 50,
          representation: 'primary',
          isSynthetic: true,
          schemaVersion: 'demo-v1',
          evidenceState: 'USER_REPORTED',
          assumptions: [],
        },
      ];

      const res = aggregateActivities(activities);
      expect(res.status).toBe('invalid');
      expect(res.error).toContain('missing an explicit timezone offset');
    });
  });

  describe('deriveAggregateProvenance', () => {
    it('derives MEASURED when all contributing primary activities are MEASURED', () => {
      const acts: Activity[] = [
        {
          id: 'm1',
          orgId: 'o',
          siteId: 's',
          sourceId: 'm',
          start: '2026-10-01T08:00:00Z',
          end: '2026-10-01T12:00:00Z',
          quantityKwh: 10,
          representation: 'primary',
          evidenceState: 'MEASURED',
          assumptions: [],
          isSynthetic: true,
          schemaVersion: 'demo-v1',
        },
      ];
      const prov = deriveAggregateProvenance(acts);
      expect(prov.evidenceState).toBe('MEASURED');
      expect(prov.label).toContain('METER FIXTURE');
    });

    it('derives USER_REPORTED when all contributing primary activities are USER_REPORTED', () => {
      const acts: Activity[] = [
        {
          id: 'u1',
          orgId: 'o',
          siteId: 's',
          sourceId: 'm',
          start: '2026-10-01T08:00:00Z',
          end: '2026-10-01T12:00:00Z',
          quantityKwh: 10,
          representation: 'primary',
          evidenceState: 'USER_REPORTED',
          assumptions: [],
          isSynthetic: true,
          schemaVersion: 'demo-v1',
        },
      ];
      const prov = deriveAggregateProvenance(acts);
      expect(prov.evidenceState).toBe('USER_REPORTED');
      expect(prov.label).toContain('USER REPORTED');
    });

    it('derives MIXED when activities contain both MEASURED and USER_REPORTED/MODEL_ESTIMATED', () => {
      const acts: Activity[] = [
        {
          id: 'm1',
          orgId: 'o',
          siteId: 's',
          sourceId: 'm1',
          start: '2026-10-01T08:00:00Z',
          end: '2026-10-01T12:00:00Z',
          quantityKwh: 10,
          representation: 'primary',
          evidenceState: 'MEASURED',
          assumptions: [],
          isSynthetic: true,
          schemaVersion: 'demo-v1',
        },
        {
          id: 'u1',
          orgId: 'o',
          siteId: 's',
          sourceId: 'm2',
          start: '2026-10-01T12:00:00Z',
          end: '2026-10-01T16:00:00Z',
          quantityKwh: 15,
          representation: 'primary',
          evidenceState: 'USER_REPORTED',
          assumptions: [],
          isSynthetic: true,
          schemaVersion: 'demo-v1',
        },
      ];
      const prov = deriveAggregateProvenance(acts);
      expect(prov.evidenceState).toBe('MIXED');
      expect(prov.label).toContain('MIXED INPUT PROVENANCE');
    });
  });

  describe('Predictive Forecasting (Seasonal-Naive Projection)', () => {
    const mockDailyActivities: Activity[] = [
      {
        id: 'd1', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-20T00:00:00+02:00', end: '2026-10-20T23:59:59+02:00',
        quantityKwh: 1000, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
      {
        id: 'd2', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-21T00:00:00+02:00', end: '2026-10-21T23:59:59+02:00',
        quantityKwh: 1100, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
      {
        id: 'd3', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-22T00:00:00+02:00', end: '2026-10-22T23:59:59+02:00',
        quantityKwh: 1200, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
      {
        id: 'd4', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-23T00:00:00+02:00', end: '2026-10-23T23:59:59+02:00',
        quantityKwh: 1050, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
      {
        id: 'd5', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-24T00:00:00+02:00', end: '2026-10-24T23:59:59+02:00',
        quantityKwh: 700, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
      {
        id: 'd6', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-25T00:00:00+02:00', end: '2026-10-25T23:59:59+02:00',
        quantityKwh: 650, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
      {
        id: 'd7', orgId: 'o', siteId: 's', sourceId: 'meter-daily',
        start: '2026-10-26T00:00:00+02:00', end: '2026-10-26T23:59:59+02:00',
        quantityKwh: 1000, representation: 'primary', evidenceState: 'MEASURED',
        assumptions: [], isSynthetic: true, schemaVersion: 'demo-v1',
      },
    ];

    it('generates non-overlapping forward forecast for selected horizon (7 days)', () => {
      const forecast = calculateDemoForecast(mockDailyActivities, 7);
      expect(forecast.horizonDays).toBe(7);
      expect(forecast.historicalDays).toBe(7);

      // Total data points = 7 historical + 7 projected = 14
      expect(forecast.dataPoints.length).toBe(14);
      const projectedPoints = forecast.dataPoints.filter((p) => p.isProjected);
      expect(projectedPoints.length).toBe(7);

      // First projected day repeats d1 (1000 kWh)
      expect(projectedPoints[0].kwh).toBe(1000);
      expect(projectedPoints[0].kwhLower).toBe(800);  // -20%
      expect(projectedPoints[0].kwhUpper).toBe(1200); // +20%
      expect(projectedPoints[0].kgCO2e).toBe(450);   // 1000 * 0.45
    });

    it('calculates budget surplus and deficit correctly against projected emissions', () => {
      // 7-day sum = 1000 + 1100 + 1200 + 1050 + 700 + 650 + 1000 = 6700 kWh -> 3015 kgCO2e
      const surplusForecast = calculateDemoForecast(mockDailyActivities, 7, 3500);
      expect(surplusForecast.budgetStatus).toBe('surplus');
      expect(surplusForecast.budgetVarianceKgCO2e).toBe(485); // 3500 - 3015

      const deficitForecast = calculateDemoForecast(mockDailyActivities, 7, 2500);
      expect(deficitForecast.budgetStatus).toBe('deficit');
      expect(deficitForecast.budgetVarianceKgCO2e).toBe(-515); // 2500 - 3015
    });
  });

  describe('Decarbonization Scenario Simulation', () => {
    it('calculates counterfactual savings and rejects negative values', () => {
      const baseline = 2000;
      const res = runDemoScenarioSimulation(
        {
          lightingReductionPct: 20, // 20% off 25% lighting = 5% of baseline = 100 kWh
          hvacSetpointDeltaC: 2,    // 2 * 5% off 45% HVAC = 10% of 45% = 4.5% = 90 kWh
          operatingHoursDelta: 2,   // standby reduction
          solarPvKw: 10,            // 10 * 4.2 = 42 kWh
        },
        baseline
      );

      expect(res.dailySavingsKwh).toBeGreaterThan(0);
      expect(res.alternativeDailyKwh).toBeLessThan(baseline);
      expect(res.dailySavingsKgCO2e).toBe(Math.round(res.dailySavingsKwh * 0.45 * 10) / 10);
      expect(res.estimatedAnnualCostSavingsUsd).toBeGreaterThan(0);
      expect(res.tradeoffs.length).toBeGreaterThan(0);
    });

    it('guards against extreme or negative lever inputs safely', () => {
      const res = runDemoScenarioSimulation(
        {
          lightingReductionPct: -50,
          hvacSetpointDeltaC: -2,
          operatingHoursDelta: -10,
          solarPvKw: -20,
        },
        1000
      );

      // Should clamp to 0 and produce baseline with 0 savings
      expect(res.dailySavingsKwh).toBe(0);
      expect(res.alternativeDailyKwh).toBe(1000);
    });
  });

  describe('Formula Injection Protection (CSV Sanitization)', () => {
    it('prepends single quote to dangerous spreadsheet formula characters', () => {
      expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
      expect(sanitizeCsvCell('+12345')).toBe('"\'+12345"');
      expect(sanitizeCsvCell('-cmd|calc')).toBe('"\'-cmd|calc"');
      expect(sanitizeCsvCell('@IMPORT')).toBe('"\'@IMPORT"');
      expect(sanitizeCsvCell('\tTabStart')).toBe('"\'\tTabStart"');
    });

    it('preserves benign text and numbers safely', () => {
      expect(sanitizeCsvCell('Normal Text')).toBe('"Normal Text"');
      expect(sanitizeCsvCell(1250)).toBe('"1250"');
      expect(sanitizeCsvCell(true)).toBe('"true"');
      expect(sanitizeCsvCell(null)).toBe('""');
    });

    it('escapes internal double quotes properly', () => {
      expect(sanitizeCsvCell('Chiller "Alpha" 100')).toBe('"Chiller ""Alpha"" 100"');
    });

    it('assembles multi-row CSV safely with CRLF line endings', () => {
      const csv = generateSafeCsv(
        ['ID', 'Label', 'FormulaTest'],
        [
          ['act-01', 'Main Meter', '=cmd|calc!A0'],
          ['act-02', 'Sub Meter', 'Clean string'],
        ]
      );

      expect(csv).toContain('"ID","Label","FormulaTest"');
      expect(csv).toContain('"act-01","Main Meter","\'=cmd|calc!A0"');
      expect(csv).toContain('"act-02","Sub Meter","Clean string"');
    });
  });
});
